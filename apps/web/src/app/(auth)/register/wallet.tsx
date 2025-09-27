import * as React from 'react'
import { Connector, useConnect } from 'wagmi'

export function WalletOptions() {
  const { connectors, connect } = useConnect()

  return connectors.map((connector) => (
    <button key={connector.uid} onClick={() => connect({ connector })}  className="w-2xl ml-[10%] tems-center justify-center  rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">
   
      {connector.name}
    
    </button>
  ))
}