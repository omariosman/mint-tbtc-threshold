import * as ethers from "ethers";
import { TBTC } from "@keep-network/tbtc-v2.ts"
import { BigNumber } from "ethers"

import dotenv from "dotenv";
dotenv.config();

// Public sepolia rpc node
const RPC_URL="https://ethereum-sepolia.rpc.subquery.network/public"
const provider = new ethers.providers.JsonRpcProvider(RPC_URL)

const PRIVATE_KEY = (process.env.PRIVATE_KEY as unknown) as ethers.utils.SigningKey;

// Create Ethereum signer
const signer = new ethers.Wallet(PRIVATE_KEY, provider)

const sdk = await TBTC.initializeSepolia(signer)

// Set the P2WPKH/P2PKH or P2WSH/P2SH Bitcoin redeemer address. This is the
// address where redeemed BTC will land.
const bitcoinRedeemerAddress: string = process.env.REDEEM_BTC_ADRESS as string;

// Set the desired redemption amount using 1e18 precision. No need to do an 
// explicit approval on the TBTC token upfront.
const amount = BigNumber.from(0.009 * 1e18)

// Request redemption. This action will burn TBTC tokens and register a
// redemption request in the bridge. Returns the hash of the request redemption
// transaction and the target wallet public key that will handle the redemption.
const {
  targetChainTxHash,
  walletPublicKey
} = await sdk.redemptions.requestRedemption(bitcoinRedeemerAddress, amount)

console.log(`targetChainTxHash: ${JSON.stringify(targetChainTxHash, null, 2)}`)
console.log(`walletPublicKey: ${JSON.stringify(walletPublicKey, null, 2)}`)

