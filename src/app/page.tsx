'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Welcome to My Web3 App</h1>
      <ConnectButton />
      {isConnected && (
        <div className="mt-8 text-center">
          <p className="text-lg">Address: {address}</p>
          <p className="text-lg">
            Balance: {balance?.formatted} {balance?.symbol}
          </p>
        </div>
      )}
    </main>
  );
}