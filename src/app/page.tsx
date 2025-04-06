'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useSendTransaction, useReadContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { sepolia } from 'wagmi/chains';
import { useState } from 'react';

import WETH_ABI from '@/abi/WETH.json';

const WETH_ADDRESS = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14';

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({
    address,
    chainId: sepolia.id
  });
  const { sendTransaction, isPending, isSuccess, error } = useSendTransaction();
  const [txHash, setTxHash] = useState<null | `0x${string}`>(null);

  const handleTestTransaction = () => {
    if (!address) return;

    sendTransaction({
      to: address, // Отправляем на тот же адрес (тестовая транзакция)
      value: parseEther('0.001'), // Отправляем 0.001 ETH
      chainId: sepolia.id, // Указываем сеть Sepolia
    }, {
      onSuccess: (hash) => {
        setTxHash(hash); // Сохраняем хэш успешной транзакции
      },
      onError: (err) => {
        console.error('Transaction error:', err);
      },
    });
  };

  const { data }: {data?: bigint} = useReadContract({
    address: WETH_ADDRESS,
    abi: WETH_ABI,
    functionName: 'balanceOf',
    args: [address],
    chainId: sepolia.id, 
  });

  // console.log('Current chain:', chain?.name);
  // console.log('Current address:', address);
  // console.log('Balance:', BigInt(balance?.value ?? 0).toString());

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Welcome to My Web3 App</h1>
      <ConnectButton />
      {isConnected && (
        <>
          <div className="mt-8 text-center">
            <p className="text-lg">Address: {address}</p>
            <p className="text-lg">
              Balance: {balance ? formatEther(balance.value).slice(0, 7) : '0'} {balance?.symbol}
            </p>
             <p className="text-lg">
              WETH Balance: {data ? formatEther(data).slice(0, 7) : '0'} WETH
            </p>
          </div>
          <button
            onClick={handleTestTransaction}
            // disabled={isLoading || balance?.value < parseEther('0.001')}
                        disabled={isPending}

            className={`mt-4 px-4 py-2 font-bold text-white rounded ${
              isPending ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-700'
            }`}
          >
            {isPending ? 'Отправка...' : 'Отправить тестовую транзакцию'}
          </button>
          {isSuccess && txHash && (
            <p className="mt-2 text-green-600">
              Транзакция успешна! Хэш: <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                className="underline"
              >
                {txHash.slice(0, 6)}...{txHash.slice(-4)}
              </a>
            </p>
          )}
          {error && (
            <p className="mt-2 text-red-600">Ошибка: {error.message}</p>
          )}
          {chain?.name.toLowerCase() === 'sepolia' && (
            <a
              href="https://sepolia-faucet.pk910.de/#/"
              target="_blank"
              className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Получить тестовый ETH
            </a>
          )}
        </>
      )}
    </main>
  );
}