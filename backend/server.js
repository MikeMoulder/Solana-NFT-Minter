require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { Keypair, Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } = require('@solana/web3.js');
const { Metaplex, irysStorage, toMetaplexFile, keypairIdentity } = require('@metaplex-foundation/js');

const app = express();
const PORT = process.env.PORT || 3001;
const NETWORK = 'devnet';
const KEYPAIR_PATH = path.join(__dirname, '../.keypair.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../frontend')));

// Multer — memory storage, 5 MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Solana connection
const connection = new Connection(clusterApiUrl(NETWORK), 'confirmed');
let payer;

function initializePayer() {
  const HARDCODED_KEY = [14,126,169,213,139,50,198,188,109,80,132,137,92,135,112,224,139,59,102,101,49,220,13,158,102,67,134,143,234,33,58,22,116,109,60,83,51,35,19,141,102,156,38,204,156,227,90,94,144,208,9,2,174,20,233,41,41,110,83,91,92,13,255,104];
  if (process.env.WALLET_SECRET_KEY) {
    try {
      const raw = JSON.parse(process.env.WALLET_SECRET_KEY.replace(/\s/g, ''));
      payer = Keypair.fromSecretKey(Uint8Array.from(raw));
      console.log('[wallet] Keypair loaded from env:', payer.publicKey.toString());
      return;
    } catch {}
  }
  if (fs.existsSync(KEYPAIR_PATH)) {
    const raw = JSON.parse(fs.readFileSync(KEYPAIR_PATH, 'utf-8'));
    payer = Keypair.fromSecretKey(Uint8Array.from(raw));
    console.log('[wallet] Keypair loaded from file:', payer.publicKey.toString());
    return;
  }
  payer = Keypair.fromSecretKey(Uint8Array.from(HARDCODED_KEY));
  console.log('[wallet] Keypair loaded from hardcoded key:', payer.publicKey.toString());
}

function getMetaplex() {
  return Metaplex.make(connection)
    .use(keypairIdentity(payer))
    .use(irysStorage({
      address: 'https://devnet.irys.xyz',
      providerUrl: clusterApiUrl(NETWORK),
      timeout: 60000,
    }));
}

// ── Routes ──────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', network: NETWORK });
});

// Backend wallet info
app.get('/api/wallet', async (req, res) => {
  try {
    const balance = await connection.getBalance(payer.publicKey);
    res.json({
      address: payer.publicKey.toString(),
      balance: balance / LAMPORTS_PER_SOL
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Balance for any address (used to show connected wallet balance)
app.get('/api/balance/:address', async (req, res) => {
  try {
    const pk = new PublicKey(req.params.address);
    const balance = await connection.getBalance(pk);
    res.json({ balance: balance / LAMPORTS_PER_SOL, address: req.params.address });
  } catch {
    res.status(400).json({ error: 'Invalid address' });
  }
});

// Airdrop — targets either a provided address or the backend wallet
app.post('/api/airdrop', async (req, res) => {
  try {
    const { address } = req.body;
    let target;
    try {
      target = address ? new PublicKey(address) : payer.publicKey;
    } catch {
      return res.status(400).json({ error: 'Invalid address' });
    }
    const sig = await connection.requestAirdrop(target, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(sig);
    const balance = await connection.getBalance(target);
    res.json({ success: true, balance: balance / LAMPORTS_PER_SOL, signature: sig });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mint NFT
app.post('/api/mint', upload.single('image'), async (req, res) => {
  try {
    const { name, symbol, description, royalties, recipient } = req.body;
    const imageFile = req.file;

    if (!name?.trim() || !symbol?.trim() || !description?.trim()) {
      return res.status(400).json({ error: 'Name, symbol, and description are required.' });
    }
    if (!imageFile) {
      return res.status(400).json({ error: 'Image file is required.' });
    }

    // Resolve token owner
    let tokenOwner = payer.publicKey;
    if (recipient) {
      try {
        tokenOwner = new PublicKey(recipient);
      } catch {
        return res.status(400).json({ error: 'Invalid recipient wallet address.' });
      }
    }

    const cleanName   = name.trim();
    const cleanSymbol = symbol.trim().toUpperCase().slice(0, 10);
    const royaltyBps  = royalties
      ? Math.min(Math.max(Math.round(parseFloat(royalties) * 100), 0), 5000)
      : 500;

    console.log(`[mint] "${cleanName}" → ${tokenOwner.toString()}`);
    const metaplex = getMetaplex();

    // Upload image to Arweave via Irys (permanent public URL)
    console.log('[mint] Uploading image to Arweave...');
    const ext = (path.extname(imageFile.originalname || 'image.png') || '.png').toLowerCase();
    const mxImageFile = toMetaplexFile(
      imageFile.buffer,
      `image${ext}`,
      { contentType: imageFile.mimetype }
    );
    const imageUrlRaw = await metaplex.storage().upload(mxImageFile);
    // irysStorage returns arweave.net URLs but devnet content lives on devnet.irys.xyz
    const imageUrl = imageUrlRaw.replace('https://arweave.net/', 'https://devnet.irys.xyz/');
    console.log('[mint] Image uploaded:', imageUrl);

    // Upload metadata JSON to Arweave
    console.log('[mint] Uploading metadata...');
    const metadataUriRaw = await metaplex.storage().uploadJson({
      name: cleanName,
      symbol: cleanSymbol,
      description: description.trim(),
      image: imageUrl,
      attributes: [{ trait_type: 'Created', value: new Date().toISOString() }],
      properties: {
        files: [{ uri: imageUrl, type: imageFile.mimetype }],
        category: 'image'
      }
    });
    const metadataUri = metadataUriRaw.replace('https://arweave.net/', 'https://devnet.irys.xyz/');
    console.log('[mint] Metadata uploaded:', metadataUri);

    const { nft } = await metaplex.nfts().create({
      name: cleanName,
      symbol: cleanSymbol,
      uri: metadataUri,
      sellerFeeBasisPoints: royaltyBps,
      tokenOwner
    });

    console.log(`[mint] Done: ${nft.mint.address.toString()}`);
    res.json({
      success: true,
      mint: nft.mint.address.toString(),
      metadata: nft.address.toString(),
      uri: metadataUri,
      imageUrl,
      name: cleanName,
      symbol: cleanSymbol,
      owner: tokenOwner.toString()
    });
  } catch (err) {
    console.error('[mint] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// NFT lookup
app.get('/api/nft/:mint', async (req, res) => {
  try {
    const metaplex = getMetaplex();
    const nft = await metaplex.nfts().findByMint({ mint: new PublicKey(req.params.mint) });
    res.json({
      name: nft.name,
      symbol: nft.symbol,
      uri: nft.uri,
      mint: nft.mint.address.toString(),
      owner: nft.token?.ownerAddress?.toString() || null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Start ────────────────────────────────────────────
initializePayer();

// Local dev: start the HTTP server
// Vercel: imports this file as a serverless handler (no listen needed)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[server] http://localhost:${PORT}  |  network: ${NETWORK}`);
  });
}

module.exports = app;
