import * as ethers from "ethers";
import * as fs from "fs";
import { TBTC } from "@keep-network/tbtc-v2.ts";
// Create an Ethers provider. Pass the URL of an Ethereum mainnet node.
// For example, Alchemy or Infura.
const RPC_URL = "https://ethereum-sepolia.rpc.subquery.network/public";
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
// Create an Ethers signer. Pass the private key and the above provider.
const PRIVATE_KEY = "";
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
// If you want to initialize the SDK just for read-only actions, it is
// enough to pass the provider. 
// const sdkReadonly = await TBTC.initializeSepolia(provider)
// If you want to make transactions as well, you have to pass the signer.
const sdk = await TBTC.initializeSepolia(signer);
console.log(sdk);
// Set the P2WPKH/P2PKH Bitcoin recovery address. It can be used to recover
// deposited BTC in case something exceptional happens.
const bitcoinRecoveryAddress = "tb1qaqxcnhsre2acw2jh82mdglscn4dssrshatmcr2";
// Initiate the deposit.
const deposit = await sdk.deposits.initiateDeposit(bitcoinRecoveryAddress);
const receipt = deposit.getReceipt();
fs.writeFileSync("receipt.json", JSON.stringify(receipt, null, 2));