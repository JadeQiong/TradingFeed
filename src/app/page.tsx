'use client';

import { useState, useEffect, JSX } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Trade } from '@/types/types';

export default function Home(): JSX.Element {
  const MAX_TRADES: number = 100;
  const [url, setUrl] = useState<string>('');
  const [wsUrl, setWsUrl] = useState<string | null>(null);
  const [glitchText, setGlitchText] = useState<boolean>(false);
  const {
    messages: trades,
    error,
    setMessages,
    setError,
  } = useWebSocket(wsUrl);
  const limitedTrades: Trade[] = trades.slice(-MAX_TRADES);

  // Trigger glitch effect periodically
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 200);
    }, 8000);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleConnect = (): void => {
    const sanitizedUrl: string = url.trim();
    if (
      !sanitizedUrl.startsWith('ws://') &&
      !sanitizedUrl.startsWith('wss://')
    ) {
      setError('Please enter a valid WebSocket URL.');
      return;
    }

    setWsUrl(sanitizedUrl);
    setError(null);
  };

  const handleClear = (): void => {
    setMessages([]);
  };

  const handleDisconnect = (): void => {
    setWsUrl(null);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-ping"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-ping"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      {/* Matrix Rain Effect */}
      {/* <div className="absolute inset-0 pointer-events-none opacity-5">
        {[...Array(20)].map((_, i: number) => (
          <div
            key={i}
            className="absolute top-0 text-green-400 text-xs animate-pulse"
            style={{
              left: `${i * 5}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          >
            {[...Array(50)].map((_, j: number) => (
              <div key={j} className="opacity-20">
                {String.fromCharCode(0x30A0 + Math.random() * 96)}
              </div>
            ))}
          </div>
        ))}
      </div> */}

      <main className="relative z-10 p-8 sm:p-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className={`text-4xl sm:text-6xl font-bold mb-4 ${glitchText ? 'animate-pulse' : ''}`}
          >
            <span className="bg-gradient-to-r from-cyan-400 via-green-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              LIVE TRADES
            </span>
          </h1>
          <div className="flex justify-center items-center gap-2 text-sm text-cyan-400">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
            <span>NEURAL NETWORK ACTIVE</span>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-500/50 rounded-lg p-6 mb-8 shadow-2xl shadow-cyan-500/20">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <div className="relative w-full sm:w-[400px]">
              <input
                type="text"
                placeholder="ws://localhost:8080 or wss://..."
                value={url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUrl(e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    if (wsUrl) {
                      handleDisconnect();
                    } else {
                      handleConnect();
                    }
                  }
                }}
                className="w-full px-4 py-3 bg-black/60 border border-green-500/50 rounded-lg text-green-400 placeholder-green-600 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
            </div>

            <div className="flex gap-3">
              {!wsUrl ? (
                <button
                  onClick={handleConnect}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-cyan-600 text-black font-bold rounded-lg hover:from-green-500 hover:to-cyan-500 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/30 border border-green-400"
                >
                  ⚡ CONNECT
                </button>
              ) : (
                <button
                  onClick={handleDisconnect}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-lg hover:from-red-500 hover:to-pink-500 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-red-500/30 border border-red-400 animate-pulse"
                >
                  🔌 DISCONNECT
                </button>
              )}

              <button
                onClick={handleClear}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-500 hover:to-blue-500 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/30 border border-purple-400"
              >
                🗑 PURGE
              </button>
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <div
              className={`w-3 h-3 rounded-full ${wsUrl ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}
            ></div>
            <span className={wsUrl ? 'text-green-400' : 'text-red-400'}>
              {wsUrl
                ? 'NEURAL LINK ESTABLISHED'
                : 'OFFLINE - AWAITING CONNECTION'}
            </span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-400 text-center animate-pulse">
            <span className="font-bold">⚠️ SYSTEM ERROR:</span> {error}
          </div>
        )}

        {/* Data Stream Table */}
        <div className="bg-gray-900/90 backdrop-blur-sm border border-cyan-500/50 rounded-lg shadow-2xl shadow-cyan-500/20 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-900/50 to-purple-900/50 p-4 border-b border-cyan-500/50">
            <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
              DATA STREAM - LIVE FEED
              <span className="ml-auto text-sm text-green-400">
                {limitedTrades.length} PACKETS
              </span>
            </h2>
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-black backdrop-blur-sm border-b border-cyan-500/50">
                {/* <thead className="sticky top-0 bg-black/90 border-b border-cyan-500/50"> */}
                <tr className="text-cyan-400 text-sm">
                  <th className="px-4 py-3 font-bold">⏰ TIMESTAMP</th>
                  <th className="px-4 py-3 font-bold">💰 PRICE</th>
                  <th className="px-4 py-3 font-bold">📊 VOLUME</th>
                  <th className="px-4 py-3 font-bold">🎯 SYMBOL</th>
                  <th className="px-4 py-3 font-bold">🏢 EXCHANGE</th>
                </tr>
              </thead>
              <tbody>
                {limitedTrades.map((trade: Trade, idx: number) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-800/50 hover:bg-cyan-500/10 transition-colors duration-300 animate-fade-in"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <td className="px-4 py-3 text-gray-300 font-mono text-sm">
                      {new Date(
                        trade.timestamp || Date.now()
                      ).toLocaleTimeString()}
                    </td>
                    <td
                      className={`px-4 py-3 font-bold ${
                        trade.side === 'buy'
                          ? 'text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]'
                          : 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                      }`}
                    >
                      ${trade.price}
                    </td>
                    <td className="px-4 py-3 text-purple-400">
                      {trade.size ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-yellow-400 font-bold">
                      {trade.symbol ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-blue-400">
                      {trade.exchange ?? '-'}
                    </td>
                  </tr>
                ))}
                {limitedTrades.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-4">
                        <div className="text-6xl animate-spin">⚡</div>
                        <div className="text-lg">
                          {wsUrl
                            ? 'SCANNING FOR INCOMING DATA PACKETS...'
                            : 'NEURAL INTERFACE OFFLINE - ESTABLISH CONNECTION'}
                        </div>
                        <div className="flex gap-1">
                          {[...Array(3)].map((_, i: number) => (
                            <div
                              key={i}
                              className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.2}s` }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <div className="flex justify-center items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>UPTIME: {wsUrl ? '100%' : '0%'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>LATENCY: {wsUrl ? '<1ms' : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>BANDWIDTH: {wsUrl ? '99.9%' : '0%'}</span>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
