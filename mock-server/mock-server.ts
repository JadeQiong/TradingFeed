// mock-server.ts
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { Trade } from './types.ts';

const symbols = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'DOGE/USD'];
const exchanges = ['Binance', 'Coinbase', 'Kraken', 'Bybit'];

function generateTrade(): Trade {
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  const exchange = exchanges[Math.floor(Math.random() * exchanges.length)];
  const price = +(Math.random() * 50000 + 500).toFixed(2);
  const size = +(Math.random() * 5 + 0.01).toFixed(2);
  const side: Trade['side'] = Math.random() > 0.5 ? 'buy' : 'sell';

  return {
    id: uuidv4(),
    timestamp: Date.now(),
    symbol,
    price,
    size,
    side,
    exchange,
  };
}

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected.');

  const interval = setInterval(() => {
    const trade = generateTrade();
    ws.send(JSON.stringify(trade));
  }, 1000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected.');
  });
});

console.log('Mock WebSocket server running at ws://localhost:8080');
