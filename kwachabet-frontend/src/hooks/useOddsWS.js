import { useEffect, useRef, useCallback } from 'react';
import { useOddsStore } from '../store';

export function useOddsWS() {
  const ws       = useRef(null);
  const timer    = useRef(null);
  const attempts = useRef(0);
  const { setEvents, setConnected } = useOddsStore();

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000/ws/odds';

    // Don't reconnect if already open or connecting
    if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) return;

    try {
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        setConnected(true);
        attempts.current = 0;
        clearTimeout(timer.current);
      };

      ws.current.onmessage = (e) => {
        try {
          const d = JSON.parse(e.data);
          if (d.type === 'odds_update' && d.events && d.events.length > 0) {
            setEvents(d.events);
          }
        } catch {}
      };

      ws.current.onclose = () => {
        setConnected(false);
        // Exponential backoff — wait longer each failed attempt
        // 5s, 10s, 20s, 40s, max 60s
        attempts.current = Math.min(attempts.current + 1, 4);
        const delay = Math.min(5000 * Math.pow(2, attempts.current - 1), 60000);
        timer.current = setTimeout(connect, delay);
      };

      ws.current.onerror = () => {
        ws.current?.close();
      };
    } catch {}
  }, [setEvents, setConnected]);

  useEffect(() => {
    // Small delay before first connect — lets the page load first
    timer.current = setTimeout(connect, 2000);
    return () => {
      clearTimeout(timer.current);
      ws.current?.close();
    };
  }, [connect]);
}
