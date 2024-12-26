import { Hex } from "@keep-network/tbtc-v2.ts"

export const deserializeHex = (data: any, expectedLength: number): Hex => {
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
