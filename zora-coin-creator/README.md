# Zora Coin Creator

This project allows users to generate coins using the Zora SDK on the Base Sepolia testnet, utilizing Pinata for IPFS storage.

## Prerequisites

- Node.js and npm (or yarn) installed.
- A crypto wallet (e.g., MetaMask) configured for the Base Sepolia testnet.
- Testnet ETH on Base Sepolia (can be obtained from a faucet).
- A Pinata account with API Key, API Secret, and JWT.

## Setup

1.  **Clone the repository (or download the files).**

2.  **Navigate to the project directory:**
    ```bash
    cd zora-coin-creator
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

4.  **Create a `.env` file** in the root of the project directory (`zora-coin-creator/.env`) and add your Pinata credentials:
    ```plaintext
    REACT_APP_PINATA_API_KEY=your_pinata_api_key
    REACT_APP_PINATA_API_SECRET=your_pinata_api_secret
    REACT_APP_PINATA_JWT=your_pinata_jwt
    ```
    Replace `your_pinata_api_key`, `your_pinata_api_secret`, and `your_pinata_jwt` with your actual Pinata credentials.

## Running the Application

1.  **Start the development server:**
    ```bash
    npm start
    # or
    # yarn start
    ```
    This will open the application in your default web browser, usually at `http://localhost:3000`.

## How to Use

1.  Open the application in your browser.
2.  Connect your wallet (ensure it's on the Base Sepolia testnet).
3.  Fill in the coin name and symbol.
4.  Upload an image for your coin.
5.  Click "Create Coin".
6.  Confirm the transaction in your wallet.
7.  Once the transaction is successful, you will see the transaction hash.

## Testing on Base Sepolia Testnet

-   **Network Name:** Base Sepolia Testnet
-   **RPC URL:** `https://sepolia.base.org`
-   **Chain ID:** `84532`
-   **Currency Symbol:** ETH

Make sure your wallet is connected to this network and you have testnet ETH.