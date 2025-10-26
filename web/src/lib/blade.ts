import { BladeConnector, ConnectorStrategy } from "@bladelabs/blade-web3.js";

let bladeInstance: BladeConnector | null = null;

export const getBlade = async () => {
  // Only initialize on client-side
  if (typeof window === "undefined") {
    return null;
  }

  // Return existing instance if already initialized
  if (bladeInstance) {
    return bladeInstance;
  }

  try {
    // Initialize Blade for Hedera testnet
    bladeInstance = await BladeConnector.init(
      ConnectorStrategy.AUTO, // or ConnectorStrategy.WALLET_CONNECT
      {
        name: "Your App Name",
        description: "Your app description",
        url: window.location.origin,
        icons: [window.location.origin + "/logo.png"],
      }
    );

    return bladeInstance;
  } catch (error) {
    console.error("Failed to initialize Blade:", error);
    return null;
  }
};

export const disconnectBlade = async () => {
  if (bladeInstance) {
    try {
      await bladeInstance.killSession();
      bladeInstance = null;
    } catch (error) {
      console.error("Error disconnecting Blade:", error);
    }
  }
};
