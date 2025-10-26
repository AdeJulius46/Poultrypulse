import { createConfig, http } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { defineChain } from "viem";

export const blockdag = defineChain({
  id: 1043, // Example chain ID, replace with BlockDAG's real one
  name: "BlockDAG",
  network: "blockdag",
  nativeCurrency: {
    decimals: 18,
    name: "BDAG",
    symbol: "BDAG",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.primordial.bdagscan.com/"], // main RPC endpoint
    },
    public: {
      http: ["https://rpc.primordial.bdagscan.com/"],
    },
  },
  blockExplorers: {
    default: {
      name: "BlockDAG Explorer",
      url: "https://explorer.blockdag.network",
    },
  },
  testnet: true, // set to true if it's a testnet
});

export const config = createConfig({
  chains: [blockdag],
  connectors: [metaMask()],
  transports: {
    [blockdag.id]: http(),
  },
});
