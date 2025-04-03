import './globals.css';
import { Providers } from '@/components/Providers';
import '@rainbow-me/rainbowkit/styles.css'; // Стили RainbowKit

export const metadata = {
  title: 'My Web3 App',
  description: 'A simple Web3 app with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}