
# Quick Start Guide

Get your NFT minter running in 5 minutes! 🚀

## Prerequisites
- Node.js 14+ (install from https://nodejs.org/)

## Installation (Windows)

1. **Navigate to project:**
   - Open Command Prompt
   - `cd "C:\Users\YOUR_USERNAME\Documents\Dev\nft minter"`

2. **Run setup:**
   ```bash
   setup.bat
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   - Go to `http://localhost:3001`

## Installation (Mac/Linux)

1. **Navigate to project:**
   ```bash
   cd ~/Documents/Dev/nft\ minter
   ```

2. **Run setup:**
   ```bash
   bash setup.sh
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   - Go to `http://localhost:3001`

## First Time Setup

### 1️⃣ Get SOL for testing
```
Browser > "Request Airdrop" button > Confirm
```
You'll get 1 SOL instantly on devnet!

### 2️⃣ Prepare your NFT
- Have an image ready (PNG, JPG, or GIF)
- Think of a name and description

### 3️⃣ Mint your NFT
```
1. Upload image
2. Fill in Name, Symbol, Description
3. Click "Mint NFT"
4. Wait for confirmation ⏳
5. Get your mint address! ✅
```

### 4️⃣ View your NFT
- Click the "View on Solana Explorer" link
- See your NFT on devnet! 🎨

## What You Get

✅ **Automatic wallet creation** - keypair saved locally
✅ **One-click airdrop** - test SOL on devnet
✅ **Image hosting** - uploaded to Arweave automatically
✅ **Complete metadata** - stored on-chain
✅ **Explorer links** - view your NFT instantly

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot connect to server" | Make sure `npm start` is running |
| "Port 3001 in use" | Kill other process or change PORT in `.env` |
| "Airdrop failed" | Wait 10 seconds and try again |
| "Upload failed" | Check image size (max 5MB) |

## Next Steps

- **Create more NFTs** - Repeat the process
- **Customize UI** - Edit `frontend/index.html`
- **Connect wallet** - Integrate Phantom or Solflare
- **Deploy** - Move to mainnet (with caution!)

## Useful Links

- 🔗 [Solana Explorer - Devnet](https://explorer.solana.com/?cluster=devnet)
- 📖 [Metaplex Docs](https://docs.metaplex.com)
- 🎓 [Solana Docs](https://docs.solana.com)

## Pro Tips

💡 **Tip 1:** Keep your `.keypair.json` safe!
💡 **Tip 2:** Images are stored permanently on Arweave
💡 **Tip 3:** Test on devnet before mainnet
💡 **Tip 4:** You can modify UI colors in `frontend/index.html`

---

Need help? Check the full `README.md` for more details!

Happy minting! 🎨✨
