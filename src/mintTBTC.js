import * as fs from "fs";
import * as ethers from "ethers";
import { TBTC, Deposit } from "@keep-network/tbtc-v2.ts";
import { deserializeHex } from "./services/deserialize.js";
import dotenv from "dotenv";
dotenv.config();
// Public sepolia rpc node
const RPC_URL = "https://ethereum-sepolia.rpc.subquery.network/public";
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const PRIVATE_KEY = process.env.PRIVATE_KEY;
console.log(`PRIVATE_KEY: ${PRIVATE_KEY}`);
// Create Ethereum signer
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const sdk = await TBTC.initializeSepolia(signer);
// Read the receipt from the JSON file
const receiptData = JSON.parse(fs.readFileSync("receipt.json", "utf-8"));
const receipt = {
    depositor: receiptData.depositor,
    blindingFactor: deserializeHex(receiptData.blindingFactor, 8),
    walletPublicKeyHash: deserializeHex(receiptData.walletPublicKeyHash, 20),
    refundPublicKeyHash: deserializeHex(receiptData.refundPublicKeyHash, 20),
    refundLocktime: deserializeHex(receiptData.refundLocktime, 4),
    extraData: receiptData.extraData
        ? deserializeHex(receiptData.extraData, 32)
        : undefined,
};
const deposit = await Deposit.fromReceipt(receipt, sdk.tbtcContracts, sdk.bitcoinClient);
console.log(await deposit.getBitcoinAddress());
const txHash = await deposit.initiateMinting();
console.log(`txHash: ${JSON.stringify(txHash, null, 2)}`);
