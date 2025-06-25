'use client';

import { useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function Home() {
  const MAX_TRADES = 100;
  const [url, setUrl] = useState('');
  const [wsUrl, setWsUrl] = useState<string | null>(null);
  const {
    messages: trades,
    error,
    setMessages,
    setError,
  } = useWebSocket(wsUrl);
  const limitedTrades = trades.slice(-MAX_TRADES);

  const handleConnect = () => {
    const sanitizedUrl = url.trim();
    if (
      !sanitizedUrl.startsWith('ws://') &&
      !sanitizedUrl.startsWith('wss://')
    ) {
      setError('Please enter a valid WebSocket URL.');
      return;
    }

    setWsUrl(sanitizedUrl);
  };

  const handleClear = () => {
    setMessages([]); // Clear the trades
  };

  const handleDisconnect = () => {
    setWsUrl(null);
  };

  return (
    <main className="min-h-screen p-8 sm:p-16 bg-white dark:bg-black text-black dark:text-white font-sans">
      <h1 className="text-2xl sm:text-4xl font-bold mb-8 text-center">
        Live Trades Viewer
      </h1>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Enter WebSocket URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (wsUrl) {
                handleDisconnect();
              } else {
                handleConnect();
              }
            }
          }}
          className="w-full sm:w-[400px] px-4 py-2 border rounded-lg bg-white dark:bg-zinc-900"
        />
        {!wsUrl ? (
          <button
            onClick={handleConnect}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Connect
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Disconnect
          </button>
        )}
        <button
          onClick={handleClear}
          className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 transition"
        >
          Clear
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-200 text-red-800 rounded-lg text-center">
          {error}
        </div>
      )}

      <div className="overflow-x-auto border border-zinc-300 dark:border-zinc-700 rounded-lg max-h-[500px] overflow-y-auto">
        <table className="min-w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white dark:bg-black z-10 border-b border-zinc-300 dark:border-zinc-700">
            <tr>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Symbol</th>
              <th className="px-4 py-2">Exchange</th>
            </tr>
          </thead>
          <tbody>
            {limitedTrades.map((trade, idx) => (
              <tr
                key={idx}
                className="border-b border-zinc-200 dark:border-zinc-800"
              >
                <td className="px-4 py-2">
                  {new Date(trade.timestamp || Date.now()).toLocaleTimeString()}
                </td>
                <td
                  className={
                    trade.side === 'buy' ? 'text-green-400' : 'text-red-400'
                  }
                >
                  {trade.price}
                </td>
                <td className="px-4 py-2">{trade.size ?? '-'}</td>
                <td className="px-4 py-2">{trade.symbol ?? '-'}</td>
                <td className="px-4 py-2">{trade.exchange ?? '-'}</td>
              </tr>
            ))}
            {limitedTrades.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-zinc-500">
                  {wsUrl
                    ? 'Waiting for trades...'
                    : 'No connection established.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
