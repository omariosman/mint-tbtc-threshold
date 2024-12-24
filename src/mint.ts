import * as ethers from "ethers"
import * as fs from "fs";
import { TBTC, Deposit, DepositReceipt, Hex } from "@keep-network/tbtc-v2.ts"

const RPC_URL="https://ethereum-sepolia.rpc.subquery.network/public"
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
// Create an Ethers signer. Pass the private key and the above provider.
const PRIVATE_KEY = "";

const signer = new ethers.Wallet(PRIVATE_KEY, provider)

const sdk = await TBTC.initializeSepolia(signer)

// Read the receipt from the JSON file
const receiptData = JSON.parse(fs.readFileSync("receipt.json", "utf-8"));

function deserializeHex(data: any, expectedLength: number): Hex {
    if (data && data._hex && data._hex.data) {
        const byteArray = Uint8Array.from(data._hex.data);
        
        // Validate the byte array length
        if (byteArray.length !== expectedLength) {
            throw new Error(
                `Invalid length for hex data. Expected ${expectedLength} bytes, got ${byteArray.length}.`
            );
        }

        // Create and return a Hex instance
        const hexData = Hex.from(Buffer.from(byteArray));
        return hexData;
    }
    throw new Error("Invalid hex data format in JSON.");
  }

const receipt: DepositReceipt = {
    depositor: receiptData.depositor,
    blindingFactor: deserializeHex(receiptData.blindingFactor, 8),
    walletPublicKeyHash: deserializeHex(receiptData.walletPublicKeyHash, 20),
    refundPublicKeyHash: deserializeHex(receiptData.refundPublicKeyHash, 20),
    refundLocktime: deserializeHex(receiptData.refundLocktime, 4),
    extraData: receiptData.extraData
      ? deserializeHex(receiptData.extraData, 32)
      : undefined,
};
  

//console.log(`receipt: ${JSON.stringify(receipt, null, 2)}`)

const deposit: Deposit = await Deposit.fromReceipt(receipt, sdk.tbtcContracts, sdk.bitcoinClient)
console.log(await deposit.getBitcoinAddress())
const txHash = await deposit.initiateMinting()
console.log(`txHash: ${JSON.stringify(txHash, null, 2)}`)

