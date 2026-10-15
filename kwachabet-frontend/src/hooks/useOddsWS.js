import { useEffect, useRef } from 'react';
import { useOddsStore } from '../store';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://kwachabet-backend.onrender.com/ws/odds';
const MAX_RETRIES = 5;          // give up after 5 attempts if backend is down
const BACKOFF    = [3, 6, 12, 24, 48]; // seconds between each retry

export function useOddsWS() {
  const { setEvents } = useOddsStore();
  const wsRef      = useRef(null);
  const retryRef   = useRef(0);
  const timerRef   = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    function connect() {
      if (!mountedRef.current) return;
      if (retryRef.current >= MAX_RETRIES) {
        // Backend is down — stop silently, don't flood console
        return;
      }

      try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          retryRef.current = 0; // reset on successful connect
        };

        ws.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            // Only update if we actually got events back
            if (Array.isArray(data) && data.length > 0) setEvents(data);
            else if (data.events && data.events.length > 0) setEvents(data.events);
          } catch (_) {}
        };

        ws.onerror = () => {
          // Let onclose handle reconnect — suppress error log
        };

        ws.onclose = () => {
          if (!mountedRef.current) return;
          const attempt = retryRef.current;
          if (attempt >= MAX_RETRIES) return;
          retryRef.current++;
          const delay = (BACKOFF[attempt] || 60) * 1000;
          timerRef.current = setTimeout(connect, delay);
        };
      } catch (_) {
        // WebSocket constructor can throw in SSR
      }
    }

    // Small initial delay so page renders first
    timerRef.current = setTimeout(connect, 2000);

    return () => {
      mountedRef.current = false;
      clearTimeout(timerRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null; // prevent reconnect on unmount
        wsRef.current.close();
      }
    };
  }, []);
}
