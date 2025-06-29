import { useEffect, useRef, useState } from 'react';
import { Trade } from '../types/types';

export function useWebSocket(url: string | null) {
  const [messages, setMessages] = useState<Trade[]>([]);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!url) {
      //    setMessages([]);
      setError(null);
      return;
    }

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Check that data has the expected shape
          if (
            typeof data !== 'object' ||
            data === null ||
            typeof data.price !== 'number' ||
            typeof data.size !== 'number' ||
            typeof data.symbol !== 'string' ||
            typeof data.timestamp !== 'number'
          ) {
            console.warn('Malformed trade data:', data);
            return;
          }
          if (!data || !data.price || !data.size || !data.symbol) {
            console.warn('Received invalid data:', data);
            return;
          }
          setMessages((prev) => [data, ...prev]);
        } catch (err) {
          console.warn('Failed to parse incoming message:', event.data, err);
        }
      };

      ws.onerror = (event) => {
        console.log(event);
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
      console.log('WebSocket connection error:', err);
      setError('Failed to connect to WebSocket. Please check the URL.');
    }
  }, [url]);

  return { messages, error, setMessages, setError };
}
