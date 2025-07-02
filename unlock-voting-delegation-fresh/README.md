# Unlock Protocol Voting Rights Delegation App

A React-based application that allows users to delegate their voting rights for the Unlock Protocol token (UP) on the Base network. Built for the Unlock Protocol bounty competition.

![Unlock Protocol Logo](https://unlock-protocol.com/static/images/svg/unlock-word-mark.svg)

## 🚀 Features

- **🔐 Wallet Connection**: Connect via MetaMask to Base network
- **🗳️ Three Delegation Options**: 
  - Delegate to yourself
  - Delegate to verified Unlock Protocol stewards
  - Delegate to any custom Ethereum address
- **🏛️ ENS Integration**: Displays .eth names for verified delegates
- **📊 Real-time Data**: Shows UP token balance and current delegation status
- **📝 Transaction History**: Tracks all delegations with local storage
- **⚡ Live Transactions**: Real blockchain interactions on Base network
- **🎨 Professional UI**: Modern, responsive design with delegate avatars

## 🛠️ Technology Stack

- **Frontend**: React 18
- **Blockchain**: Base Network (Ethereum L2)
- **Token**: UP (Unlock Protocol) - `0xac27fa800955849d6d17cc8952ba9dd6eaa66187`
- **Wallet**: MetaMask integration
- **ENS**: Ethereum Name Service resolution
- **Storage**: Browser localStorage for delegation history

## 📋 Prerequisites

Before running the app, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MetaMask** browser extension installed
- **Base network** added to MetaMask
- **ETH on Base** for gas fees (optional - for actual delegations)

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd unlock-voting-delegation-fresh

# Install dependencies
npm install
```

### 2. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

### 3. Connect Your Wallet

1. **Click "Connect MetaMask"**
2. **Approve the connection** in MetaMask
3. **App will automatically switch** to Base network
4. **If Base network not found**, it will be added automatically

## 🎯 How to Use

### Step 1: Connect Wallet
- Click "Connect MetaMask" button
- Approve connection and network switch to Base

### Step 2: Choose Delegation Type
- **Self**: Delegate voting power to your own address
- **Steward**: Choose from verified Unlock Protocol delegates
- **Custom**: Enter any Ethereum address manually

### Step 3: Select Delegate (if using Steward option)
- Browse the list of top Unlock Protocol delegates
- Delegates with ENS names show with ✓ verification
- Click on your preferred delegate

### Step 4: Confirm Delegation
- Click "Delegate Voting Rights"
- Confirm the transaction in MetaMask
- Pay small gas fee (usually < $0.01 ETH)

### Step 5: View History
- All delegations are tracked in the right panel
- Click BaseScan links to view transactions
- Local storage preserves history between sessions

## 📁 Project Structure

```
src/
├── App.js              # Main application component
├── index.js            # React entry point
└── (minimal structure - single component app)

public/
├── index.html          # HTML template
└── manifest.json       # PWA manifest
```

## 🔧 Key Features Explained

### ENS Integration
- Automatically resolves .eth names for delegates
- Shows verification checkmarks for ENS-verified addresses
- Provides professional delegate identification

### Real Contract Integration
- Interacts with actual UP token contract on Base
- Reads real token balances and delegation status
- Makes authentic blockchain transactions

### Delegate Research
- Steward addresses sourced from Tally governance data
- Ordered by actual voting power in Unlock DAO
- Real governance participants, not test addresses

### Transaction Safety
- Clear warnings about real blockchain transactions
- Gas fee estimation in MetaMask
- Proper error handling and user feedback

## 🌐 Network Information

- **Network**: Base (Chain ID: 8453)
- **Token**: UP (Unlock Protocol)
- **Contract**: `0xac27fa800955849d6d17cc8952ba9dd6eaa66187`
- **Explorer**: [BaseScan](https://basescan.org)

## 🔍 Delegate Information

The app includes real Unlock Protocol delegates researched from Tally governance:

1. **Top voting power holders** from actual governance data
2. **ENS-verified addresses** where available
3. **Active participants** in Unlock Protocol governance
4. **Researched from**: [Tally Unlock DAO](https://www.tally.xyz/gov/unlock-protocol)

## ⚠️ Important Notes

### Gas Fees
- All transactions require ETH for gas fees on Base network
- Typical delegation costs < $0.01 ETH
- Make sure you have sufficient ETH balance

### Real Transactions
- This app makes **real blockchain transactions**
- All delegations are permanent until changed
- Test with small amounts first if unsure

### Data Storage
- Delegation history stored in browser localStorage
- No external database or user accounts required
- Clear browser data will reset history

## 🐛 Troubleshooting

### MetaMask Connection Issues
```bash
# Ensure MetaMask is installed and unlocked
# Try refreshing the page
# Check that Base network is properly added
```

### Transaction Failures
- **Insufficient ETH**: Add ETH to Base network
- **Wrong Network**: App will auto-switch to Base
- **User Rejection**: Click "Confirm" instead of "Cancel"

### ENS Names Not Loading
- ENS resolution may take a few seconds
- Some addresses may not have ENS names
- Fallback to formatted addresses is automatic

## 🏆 Bounty Compliance

This app fulfills all Unlock Protocol bounty requirements:

- ✅ **Simple front-end application**
- ✅ **Delegates UP token voting rights on Base**
- ✅ **Three delegation options**: self, stewards, custom address
- ✅ **Counts and records delegations**
- ✅ **Uses correct UP token address**
- ✅ **Professional UI/UX**
- ✅ **Real blockchain integration**

## 📱 Browser Support

- **Chrome/Chromium** ✅ (Recommended)
- **Firefox** ✅
- **Safari** ✅ (with MetaMask extension)
- **Edge** ✅

## 🔗 Useful Links

- [Unlock Protocol](https://unlock-protocol.com)
- [Unlock Protocol Docs](https://docs.unlock-protocol.com)
- [Base Network](https://base.org)
- [Tally Governance](https://www.tally.xyz/gov/unlock-protocol)
- [MetaMask Setup](https://metamask.io)

## 📄 License

MIT License - Open source and free to use.

---

**Built with ❤️ for the Unlock Protocol community**

*Ready to unlock the future of decentralized governance!* 🚀