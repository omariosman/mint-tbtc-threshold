# tBTC Mint/Redeem Example

This is a TypeScript project that uses the [tBTC]([URL](https://docs.threshold.network/applications/tbtc-v2)) Bitcoin/Ethereum bridge to mint and redeem tBTC tokens.

This repository demonstrates an example workflow to mint and redeem tBTC tokens.

## How to Use the Repo?

### 1. Clone the Repository
```bash
git clone <repo-url>
```
### 2. Install Dependencies
```
npm install
```



### Minting tBTC 
1. Add a `.env` file with the following value:
```
PRIVATE_KEY=<your-ethereum-private-key>
BTC_RECOVERY_ADDRESS=<your-btc-segwit-address>
```

The `PRIVATE_KEY` is the private key of the ethereum account to which tBTC will be sent

The `BTC_RECOVERY_ADDRESS` will be used to recover your tokens back in case minting tBTC failed for any reason


2. Run the `src/getBTCAddr` script using this command
```
npm run getBTCAddr
```
This script will log a Bitcoin address on the terminal, send your BTC to this address


3. Run the `src/mintTBTC` script using this command
```
npm run mintTBTC
```


### Redeeming tBTC (Get your BTC back)
1. Add a `.env` file with the following value:
```
REDEEM_BTC_ADRESS=<your-btc-segwit-addr>
```

This is the address to which the btc will sent

2. Run the `src/redeemTBTC` script using this command: `npm run redeemTBTC`
