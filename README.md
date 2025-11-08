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

## 🌐 Base Architecture — Supabase × Pinata × Edge Functions

Our backend was designed to combine serverless infrastructure, decentralized storage, and secure execution.
The integration of Supabase, Pinata (IPFS), and Edge Functions ensures persistence, auditability, and low cost — all without relying on traditional servers.

 - Supabase — Web3-Ready Database and Authentication
     - Supabase serves as the core database of the system, hosting all structured entities — such as profiles, transactions, and recycling records — in PostgreSQL with Row-Level Security (RLS). Additionally, we use:
       1. Edge Functions for critical logic and on-chain integration (e.g., triggering events for Solidity contracts);
       2. An isolated Service Role Key within the functions, guaranteeing secure and controlled access;
       3. JWTs and Policies to authenticate wallets, without exposing public keys on the front-end.

 - Pinata × IPFS — Decentralized Storage
     - All media generated in the process — proofs, transaction metadata, or recycling hashes — is sent to Pinata, which makes the files available on the IPFS (InterPlanetary File System).
     - Benefits:
       1. Immutability: The CID hash guarantees permanent data integrity.
       2. Transparency: Any user can publicly validate the content.
       3. Decoupling: The front-end only references the CID, without depending on centralized servers.

     - Example Flow:
       1. Edge Function receives the transaction's JSON.
       2. Serializes and sends it via pinFileToIPFS (Pinata SDK).
       3. Returns the CID and writes this identifier to Supabase.
       4. The smart contract can optionally store the same CID on-chain.

---

## ⚡ Edge Functions - Public Gateway and Integrator
 - Edge Functions act as a point of convergence between:
   1. The front-end (Next.js / React);
   2. The database (Supabase Postgres);
   3. The decentralized storage (Pinata/IPFS);
   4. And, when applicable, the blockchain (via Web3.js or ethers.js).

 - Example: When registering a collection or a recycling transaction, the user calls the public route
   ```
   https://<...>.functions.supabase.co/register-transaction.
   ```
 - This function:
   1. Validates the received data (quantity, wallet, timestamp).
   2. Stores metadata in Supabase.
   3. Sends the file or JSON to Pinata (IPFS).
   4. Returns the CID hash and the operation summary to the front-end.

 - All calls are CORS-enabled and can be public (verify_jwt=false) to simplify integration with DApps, bots, and Web3 front-ends.

💾 Benefits of the Stack
| Component | Function | Primary Advantage |
| :--- | :--- | :--- |
| **Supabase** | Database, authentication, and serverless functions | Security and scalable relational structure |
| **Pinata / IPFS** | Decentralized storage | Data integrity and immutability |
| **Edge Functions** | Orchestration and business logic | Instant, serverless deployment |
| **Blockchain Layer (ETH/USDC)** | Settlement and traceability | Transparency and end-to-end trust |

---
## 🗺 Base-Sepolia Links

https://base-sepolia.blockscout.com/address/0x3D8c549f6645F5b33ce9E7eD1b5f79656AB65BA0

https://base-sepolia.blockscout.com/address/0x35FbA5dE07ed5479c8a151b78013b8Fea0FE67B4

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




# How to run the project

## 1. Clone and install:
```
git clone https://github.com/yourusername/greenloop.git
cd greenloop
npm install
```

## 2. Environment Variables
   Create ==.env.local==:
```
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_here
NEXT_PUBLIC_BASE_RPC=https://mainnet.base.org
```
> Get Pinata JWT: https://pinata.cloud

## 3. Run Locally
```
npm run dev
```

## Contributors
- Guilherme Binsfeld
- Samuel Stefano
- Raul Scalassara Alencar

## Final Words
> "Recycle today. Earn crypto tomorrow."
- **GreenLoop** is more than a hackathon project — it's a **real-world solution** for **sustainability** + **blockchain.Judges**: Try the live demo. Mint a token. See the future.

---

**Built with love, code, and a greener planet in mind.**




