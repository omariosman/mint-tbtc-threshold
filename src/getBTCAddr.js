import * as fs from "fs";
import * as ethers from "ethers";
import dotenv from "dotenv";
import { TBTC } from "@keep-network/tbtc-v2.ts";
dotenv.config();
const RPC_URL = "https://ethereum-sepolia.rpc.subquery.network/public";
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const PRIVATE_KEY = process.env.PRIVATE_KEY;
// Create Ethereum signer
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const sdk = await TBTC.initializeSepolia(signer);
// Set the P2WPKH/P2PKH Bitcoin recovery address. It can be used to recover
// deposited BTC in case something exceptional happens.
const bitcoinRecoveryAddress = process.env.BTC_RECOVERY_ADDRESS;
// Initiate the deposit.
const deposit = await sdk.deposits.initiateDeposit(bitcoinRecoveryAddress);
const btcAddr = await deposit.getBitcoinAddress();
console.log(`Bitcoin Address: ${btcAddr}`);
const receipt = deposit.getReceipt();
fs.writeFileSync("receipt.json", JSON.stringify(receipt, null, 2));
