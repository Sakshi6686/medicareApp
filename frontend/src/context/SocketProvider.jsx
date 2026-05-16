import React, { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client";
import { backendUrl } from "../utils/Constants";
const SocketContext = createContext(null);
export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = (props) => {
  const socket = useMemo(() => io(backendUrl), []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
