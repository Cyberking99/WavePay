<div align="center">

# 🌊 WavePay

> **Seamless Stablecoin Payments on Base.**

**A mobile-first, decentralized payment platform powered by Privy and Base.**

![Base](https://img.shields.io/badge/Base-Enabled-blue?style=for-the-badge&logo=coinbase&logoColor=white)
![Privy](https://img.shields.io/badge/Privy-Auth-indigo?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

[🚀 Live Demo](#-demo) • [📱 Features](#-key-features) • [🏗️ Architecture](#️-technical-architecture) • [💻 Development](#-getting-started) • [📖 Docs](#-documentation)

---

</div>

---

## 🌟 What is WavePay?

WavePay is a **mobile-first decentralized payment platform** built on **Base**, enabling users to send and receive stablecoins seamlessly using social logins and simplified wallet management.

### 🎯 The Problem We Solve

Traditional crypto payments often suffer from:

- ❌ **Complex Onboarding** (seed phrases, wallet connections)
- ❌ **Poor UX** (desktop-focused interfaces)
- ❌ **Opaque Transactions** (confusing addresses and fees)
- ❌ **Slow Speeds & High Costs** (L1 limitations)

**WavePay changes this by bringing a seamless, secure, and mobile-responsive payment experience to Base.**

---

## 💡 Our Solution

WavePay offers a **comprehensive payment ecosystem** designed for mass adoption.

### 👥 For Users

- ✅ **Secure Authentication** - Login with email or social accounts powered by Privy
- ✅ **Send & Receive** - Easily transfer stablecoins to friends or addresses
- ✅ **Payment Links** - Create shareable links to request funds instantly
- ✅ **Transaction History** - Track your spending and income with clarity
- ✅ **Offramp Integration** - (Coming Soon) seamless fiat conversion
- ✅ **Dashboard** - A unified view of your assets and activity

### 🚀 Built on Base

- 📱 **Mobile-First Design** - Fully responsive interface using Shadcn UI
- ⚡ **Fast Transactions** - Powered by Base's high-speed L2 network
- 💰 **Low Fees** - Affordable payments for everyone

---

## ⚡ Key Features

### 🔐 Secure & Simple Auth

- **Privy Integration**: No need to manage complex seed phrases manually.
- **Social Login**: Onboard users with familiar methods (Email, Google, Twitter).

### 💸 Seamless Payments

- **Instant Transfers**: Send USDC and other stablecoins in seconds.
- **Cross-Border Ready**: Decentralized infrastructure works globally.
- **Gas Optimized**: Leveraging Base for minimal transaction costs.

### 📊 Smart Dashboard

- **Asset Overview**: Real-time balance updates.
- **Activity Log**: Detailed history of all onchain interactions.
- **Profile Management**: customizable user settings.

---

## ⛓️ Contract Addresses

| Name | Address |
|---|---|
| USDC | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |
| SwapRouter | `0x2626664c2603336E57B271c5C0b26F421741e481` |
| Quoter | `0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a` |

---

## 🏗️ Technical Architecture

### 💻 Frontend (Vite + React)

**Deployed on Base Sepolia Testnet**

```
src/
├── components/          # Reusable UI components (Shadcn)
├── pages/
│   ├── Dashboard.tsx    # User overview
│   ├── Send.tsx         # Payment flow
│   ├── Pay.tsx          # Payment link handler
│   └── Profile.tsx      # User settings
├── hooks/               # Custom React hooks
├── lib/
│   ├── blockchain/      # Chains, ABI, and Contract interactions
│   └── constants.ts     # Config and Addresses
└── styling/             # Tailwind configuration
```

**Tech Stack:**

- ⚛️ **React 18** - Component-based UI
- ⚡ **Vite** - Blazing fast build tool
- 🎨 **Tailwind CSS + Shadcn** - Beautiful, accessible UI components
- 🔗 **Wagmi + Viem** - Type-safe Ethereum interactions
- 🔑 **Privy** - Next-gen wallet connector and auth
- 📡 **TanStack Query** - Powerful async state management

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Git
- A Base Sepolia wallet (optional for dev, required for transactions)

### Installation

```bash
# Clone the repository
git clone https://github.com/Cyberking99/WavePay.git
cd WavePay/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your VITE_BASE_URL, VITE_API_URL, etc.

# Run development server
npm run dev
```

---

## 📱 Demo

### 🎯 Live Demo

- **Frontend:** [https://wave-pay.vercel.app/](https://wave-pay.vercel.app/)
- **Chain:** Base Sepolia
- **Explorer:** [BaseScan](https://sepolia.basescan.org/)

---

## 📜 License

MIT License - see [LICENSE](LICENSE)
