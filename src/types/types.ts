export type Trade = {
  id: string;
  timestamp: number;
  symbol: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
  exchange: string;
};
