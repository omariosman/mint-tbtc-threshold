import * as ethers from "ethers"
import {
  TBTC,
  TBTCContracts,
  EthereumBridge,
  EthereumTBTCToken,
  EthereumTBTCVault,
  EthereumWalletRegistry,
  ElectrumClient,
  ChainIdentifier,
} from "@keep-network/tbtc-v2.ts"

// Create an Ethers provider. Pass the URL of your local Ethereum node.
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545")
// Create an Ethers signer. Pass the private key and the above provider.
const PRIVATE_KEY="";
const signer = new ethers.Wallet(PRIVATE_KEY, provider)

enum CONTRACT_ADDRESS {
    bridge = "0x84227190685c25c4aF662EE1bD0E4cd82e57360D",
    tbtcToken = "0xc63d2a04762529edB649d7a4cC3E57A0085e8544", 
    tbtcVault = "0xbe241D1B7b54bF06742cefd45A3440C6562f7603",
    walletRegistry = "0x8613A4029EaA95dA61AE65380aC2e7366451bF2b",
}

// Create a reference to your locally deployed tBTC contracts.
// ABI will be loaded from the following contract packages:
// - @keep-network/tbtc-v2
// - @keep-network/ecdsa
const tbtcContracts: TBTCContracts = {
  bridge: new EthereumBridge({address: CONTRACT_ADDRESS.bridge, signerOrProvider: signer}),
  tbtcToken: new EthereumTBTCToken({address: CONTRACT_ADDRESS.tbtcToken, signerOrProvider: signer}),
  tbtcVault: new EthereumTBTCVault({address: CONTRACT_ADDRESS.tbtcVault, signerOrProvider: signer}),
  walletRegistry: new EthereumWalletRegistry({address: CONTRACT_ADDRESS.walletRegistry, signerOrProvider: signer})
}

// Create an Electrum Bitcoin client pointing to your local regtest node.
const bitcoinClient = ElectrumClient.fromUrl("http://127.0.0.1:60401")

// Initialize the SDK.
const sdk = await TBTC.initializeCustom(tbtcContracts, bitcoinClient)

console.log(`sdk: ${JSON.stringify(sdk, null, 2)}`)

// Set the P2WPKH/P2PKH Bitcoin recovery address. It can be used to recover
// deposited BTC in case something exceptional happens.
const bitcoinRecoveryAddress: string = "bcrt1qhc26qr2twc4j86gjr47sev7wkjpwpmxsu2g496" // this is my regtest bech32 address //prefix: bcrt

// Define the default depositor (e.g., Ethereum chain ID in hex).
const defaultDepositor: ChainIdentifier = {
  identifierHex: "0x7A69", // hardhat: 0x7A69, development: 44D
  equals: function (identifier: ChainIdentifier): boolean {
    return this.identifierHex === identifier.identifierHex;
  },
};
  
sdk.deposits.setDefaultDepositor(defaultDepositor)

// Initiate the deposit.
const deposit = await sdk.deposits.initiateDeposit(bitcoinRecoveryAddress) // this line fails

// Take the Bitcoin deposit address. BTC must be sent here.
const bitcoinDepositAddress = await deposit.getBitcoinAddress()

console.log(`bitcoinDepositAddress: ${bitcoinDepositAddress}`)