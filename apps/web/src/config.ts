import { createConfig, http } from 'wagmi'
import { sepolia, polygonAmoy } from 'wagmi/chains'
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [sepolia, polygonAmoy],
  connectors: [
    metaMask()
  ],
  transports: {
    [polygonAmoy.id]: http(),
    [sepolia.id]: http(),
  },
})