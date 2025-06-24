import { useEffect, useRef, useState } from 'react';
import { Trade } from '../types/types';

export function useWebSocket(url: string | null) {
  const [messages, setMessages] = useState<Trade[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!url) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [data, ...prev.slice(0, 99)]); // Limit to 100
    };

    return () => ws.close();
  }, [url]);

  return messages;
}
