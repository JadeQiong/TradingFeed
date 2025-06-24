import { useEffect, useRef, useState } from 'react';
import { Trade } from '../types/types';

export function useWebSocket(url: string | null) {
  const [messages, setMessages] = useState<Trade[]>([]);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!url) {
      setMessages([]);
      setError(null);
      return;
    }

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prev) => [data, ...prev.slice(0, 99)]); // Limit to 100
      };
      ws.onerror = (event) => {
        setError('WebSocket error occurred.');
      };

      ws.onclose = (event) => {
        if (!event.wasClean) {
          setError('WebSocket connection closed unexpectedly.');
        }
      };

      setError(null); // reset error on successful connect

      return () => {
        ws.close();
        wsRef.current = null;
      };
    } catch (err) {
      setError('Failed to connect to WebSocket. Please check the URL.');
    }
  }, [url]);

  return { messages, error };
}
