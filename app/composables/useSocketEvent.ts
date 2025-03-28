import type { Socket } from "socket.io-client";

const registeredSocketEvents = new Set<string>();

interface SocketEventOptions<T> {
  /**
   * Un identifiant unique pour ce listener (ex : blocId, "global", etc.)
   */
  key: string;

  /**
   * Si précisé, la propriété à checker pour filtrer par ID (ex : 'blocId')
   */
  filterProp?: keyof T;

  /**
   * Si précisé, le filtre attend cette valeur (ex : blocId === 42)
   */
  filterValue?: T[keyof T];
}

export function useSocketEvent<T>(
  eventName: string,
  options: SocketEventOptions<T>,
  callback: (payload: T) => void,
) {
  const socket: Socket = useSocket();
  const uniqueKey = `${eventName}-${options.key}`;

  if (!registeredSocketEvents.has(uniqueKey)) {
    socket.on(eventName, (payload: T) => {
      if (
        options.filterProp &&
        options.filterValue !== undefined &&
        payload[options.filterProp] !== options.filterValue
      ) {
        return;
      }

      callback(payload);
    });

    registeredSocketEvents.add(uniqueKey);
  }
}
