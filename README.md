# Solana NFT Minter

A simple full-stack application for creating and minting NFTs on Solana devnet. Built with Node.js/Express backend and vanilla JavaScript frontend.

## Features

✨ **Easy NFT Creation**
- Upload image and metadata
- Automatic image hosting on Arweave via Bundlr
- Create complete NFT with metadata

🎨 **NFT Minting**
- Mint NFTs using Metaplex standard
- Support for royalties
- Automatic metadata upload

💰 **Wallet Management**
- Built-in devnet wallet
- Airdrop functionality for testing
- Real-time balance updates

🔍 **Explorer Integration**
- Direct links to Solana Explorer
- View your minted NFTs on devnet

## Tech Stack

**Backend:**
- Node.js + Express
- @metaplex-foundation/js
- @solana/web3.js
- Bundlr for image storage

**Frontend:**
- HTML5 + CSS3
- Vanilla JavaScript
- Responsive design

## Prerequisites

- Node.js 14+ installed
- npm or yarn

## Installation

1. **Clone or navigate to the project:**
```bash
cd "nft minter"
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the backend server:**
```bash
npm start
```

The server will:
- Start on `http://localhost:3001`
- Generate a keypair (saved in `.keypair.json`)
- Serve the frontend on `http://localhost:3001`

4. **Open in browser:**
```
http://localhost:3001
```

## Usage

### Step 1: Get SOL
1. Click **"Request Airdrop"** to get 1 SOL for testing on devnet
2. Wait for confirmation (balance will update automatically)

### Step 2: Create NFT
1. **Upload Image**: Click the upload area or drag-and-drop your image
   - Supported formats: PNG, JPG, GIF
   - Max size: 5MB

2. **Fill Details**:
   - **Name**: Your NFT name (e.g., "My Awesome Art")
   - **Symbol**: Short symbol (e.g., "ART")
   - **Description**: NFT description
   - **Royalties** (optional): % royalties (0-50%, default 5%)

3. **Mint**: Click **"Mint NFT"** button

The process will:
- Upload your image to Arweave
- Create NFT metadata
- Mint the NFT on Solana devnet
- Display the mint address and explorer link

### Step 3: View Your NFT
Click the explorer link to see your NFT on [Solana Explorer](https://explorer.solana.com/?cluster=devnet)

## API Endpoints

### `/api/health` (GET)
Health check and network info
```json
{
  "status": "ok",
  "network": "devnet"
}
```

### `/api/balance` (GET)
Get wallet balance
```json
{
  "balance": 2.5,
  "address": "..."
}
```

### `/api/airdrop` (POST)
Request SOL airdrop (devnet only)
```json
{
  "amount": 1
}
```
Response:
```json
{
  "success": true,
  "balance": 2.5,
  "signature": "..."
}
```

### `/api/mint` (POST)
Create and mint NFT (multipart/form-data)
```
- image: File
- name: string
- symbol: string
- description: string
- royalties: number (0-50)
```
Response:
```json
{
  "success": true,
  "mint": "...",
  "metadata": "...",
  "uri": "...",
  "imageUrl": "..."
}
```

### `/api/nft/:mint` (GET)
Get NFT details
```json
{
  "name": "...",
  "symbol": "...",
  "uri": "...",
  "mint": "...",
  "owner": "..."
}
```

## Configuration

### Environment Variables
Create a `.env` file (optional):
```
PORT=3001
NETWORK=devnet
```

### Keypair Storage
- Keypair is automatically generated and saved to `.keypair.json`
- Keep this file safe!
- The same wallet will be reused for all minting operations

## Troubleshooting

**"Cannot connect to server"**
- Ensure backend is running: `npm start`
- Check if port 3001 is available
- Try accessing http://localhost:3001 in browser

**"Airdrop failed"**
- Only works on devnet (not mainnet)
- May be rate-limited, wait a few seconds and try again
- Check if the faucet is working

**"Minting failed"**
- Ensure you have enough SOL balance
- Check if image size is under 5MB
- Ensure all required fields are filled
- Check browser console for error details

**CORS errors**
- Backend should serve frontend, not accessed separately
- Access via http://localhost:3001, not file://

## Development

### Run with auto-reload
```bash
npm run dev
```
(Requires nodemon, installed in devDependencies)

### Project Structure
```
nft-minter/
├── backend/
│   └── server.js          # Express server & API
├── frontend/
│   └── index.html         # Web UI
├── package.json           # Dependencies
├── .keypair.json          # Generated wallet (git-ignored)
└── README.md             # This file
```

## Minting Process Flow

1. **Image Upload** → Uploaded to Arweave via Bundlr
2. **Metadata Creation** → JSON metadata with image URL
3. **NFT Creation** → Using Metaplex standard
4. **Confirmation** → Transaction confirmed on devnet
5. **Success** → Display mint address and explorer link

## Solana Explorer Links

- View your NFT: `https://explorer.solana.com/address/{MINT_ADDRESS}?cluster=devnet`
- View your wallet: `https://explorer.solana.com/address/{WALLET_ADDRESS}?cluster=devnet`
- View transaction: `https://explorer.solana.com/tx/{SIGNATURE}?cluster=devnet`

## Security Notes

⚠️ **Development Only**
- This is a development tool for devnet testing only
- Never use with mainnet keypairs
- The keypair is stored unencrypted locally
- For production, implement proper key management

## Limits & Notes

- **File Size**: Max 5MB for images
- **Network**: Devnet only (for development)
- **Metadata**: Stored on Arweave permanently
- **Royalties**: 0-50%, in basis points (multiply by 100)

## Common Next Steps

- **Customize UI**: Modify frontend/index.html
- **Add Wallet Connection**: Integrate with Phantom, Solflare
- **Store NFTs Database**: Add database to track minted NFTs
- **Deploy to Production**: Switch to mainnet with proper security

## Links & Resources

- [Solana Documentation](https://docs.solana.com)
- [Metaplex Documentation](https://docs.metaplex.com)
- [Solana Explorer](https://explorer.solana.com/?cluster=devnet)
- [Arweave Storage](https://www.arweave.org)

## License

MIT

## Support

For issues or questions, check the troubleshooting section or review the browser console for error details.

---

Built with ❤️ for Solana developers
