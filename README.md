# ♻️ Green Loop WebApp

**Green Loop** is a web application that encourages environmental responsibility by rewarding users with Bitcoin for recycling plastic bottles.  
The goal is to create a transparent, secure, and decentralized incentive system that bridges **real-world sustainability** with **blockchain technology**.

---

## 🌍 Overview

Green Loop allows users to input the number of PET bottles they’ve recycled.  
Based on the amount, the platform automatically calculates and transfers the corresponding Bitcoin reward.

The app connects environmental action with digital value, creating a circular economy for sustainability.

---

## 💡 Core Features

- 🧾 **Recycling Tracking** — Users input the quantity of recycled PET bottles.
- 💰 **Bitcoin Rewards** — The system converts that quantity into BTC and sends it to the user’s wallet.
- 🔗 **Chainlink Integration** — Uses Chainlink Proof of Reserve feeds to ensure transparency and trust.
- 🧠 **Secure Backend** — Manages conversions, transactions, and user balances safely.
- 📊 **Transparent Dashboard** — Displays real-time Bitcoin prices, total reserves, and environmental impact.

---

## 🛡️ Why Chainlink Proof of Reserve?

Green Loop leverages Chainlink’s **Proof of Reserve (PoR)** feeds to verify that wrapped Bitcoin tokens (such as **WBTC**) are fully collateralized.

This ensures:
- The BTC-based rewards distributed by the system are **backed 1:1** by real Bitcoin reserves.
- The platform can **pause or adjust rewards** automatically if reserves fall below the total supply.
- Users can trust that their rewards maintain real value, verified by decentralized oracles.

Example feed used:
```solidity
AggregatorV3Interface(0xa81FE04086865e63E12dD3776978E49DEEa2ea4e); // WBTC Proof of Reserve
```

## How to run the project

1. Copy and paste this code on the project directory:
```npm i```

2. Then paste this one:
```npm run dev```
