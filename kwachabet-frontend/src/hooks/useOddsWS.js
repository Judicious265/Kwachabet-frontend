import { useEffect, useRef, useCallback } from 'react';
import { useOddsStore } from '../store';

export function useOddsWS() {
  const ws = useRef(null);
  const timer = useRef(null);
  const { setEvents, setConnected } = useOddsStore();

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000/ws/odds';
    if (ws.current?.readyState === WebSocket.OPEN) return;
    try {
      ws.current = new WebSocket(WS_URL);
      ws.current.onopen    = () => { setConnected(true); clearTimeout(timer.current); };
      ws.current.onmessage = (e) => {
  try {
    const d = JSON.parse(e.data);
    if (d.type === 'odds_update' && d.events && d.events.length > 0) {
      setEvents(d.events);
    }
  } catch {}
};
      ws.current.onclose = () => { setConnected(false); timer.current = setTimeout(connect, 5000); };
      ws.current.onerror = () => ws.current?.close();
    } catch {}
  }, [setEvents, setConnected]);

  useEffect(() => {
    connect();
    return () => { clearTimeout(timer.current); ws.current?.close(); };
  }, [connect]);
}
