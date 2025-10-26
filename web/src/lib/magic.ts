// lib/magic.ts
import { Magic } from "magic-sdk";
import { HederaExtension } from "@magic-ext/hedera";

// const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY!, {
//   network: {
//     rpcUrl: "https://testnet.hedera.com", // Hedera testnet RPC
//     chainId: 296, // Hedera testnet chain ID
//   },
//   extensions: [
//     new HederaExtension({
//       network: "testnet",
//     }),
//   ],
// });

const customNodeOptions = {
  rpcUrl: "https://polygon-rpc.com", // your ethereum, polygon, or optimism mainnet/testnet rpc URL
  chainId: 137, // corresponding chainId for your rpc url
};

const magic = new Magic("PUBLISHABLE_API_KEY", {
  network: customNodeOptions, // connected to Polygon Mainnet!
});

export default magic;
