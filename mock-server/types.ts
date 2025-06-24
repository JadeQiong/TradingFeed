// src/types.ts
export type Trade = {
    id: string;               // Unique identifier (e.g. UUID)
    timestamp: number;        // Unix timestamp in milliseconds
    symbol: string;           // e.g. 'BTC/USD', 'ETH/USD'
    price: number;            // Trade price
    size: number;             // Trade size
    side: 'buy' | 'sell';     // Trade direction
    exchange: string;         // e.g. 'Binance', 'Coinbase'
  };
  