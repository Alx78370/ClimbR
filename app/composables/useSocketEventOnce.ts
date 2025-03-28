import type { Socket } from "socket.io-client";

const registeredSocketEvents = new Set<string>();

export function useSocketEventOnce<T extends { blocId: number }>(
  eventName: string,
  blocId: number,
  callback: (payload: T) => void,
) {
  const key = `${eventName}-${blocId}`;
  const socket: Socket = useSocket();

  if (!registeredSocketEvents.has(key)) {
    socket.on(eventName, (payload: T) => {
      if (payload.blocId === blocId) {
        callback(payload);
      }
    });

    registeredSocketEvents.add(key);
  }
}
