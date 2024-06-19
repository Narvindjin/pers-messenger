'use client'

import {createContext, Dispatch, SetStateAction, useContext, useEffect, useState} from "react"
import { io as socketClient } from "socket.io-client"
import {Chat, Message} from "@/app/lib/types";

export type SocketContextType = {
    socket: any | null,
    isConnected: boolean,
}

const socketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
})

export const useSocket = () => {
    return useContext(socketContext);
}

export const SocketProvider = ({
    children, currentChat
}: Readonly<{
    children: React.ReactNode,
    currentChat: Chat | null
}>) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        //Сменить url на продакшне
        const socketInstance = new (socketClient as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
            path: "/api/socket/io",
            addTrailingSlash: false,
        })

        socketInstance.on("connect", () => {
            console.log('connected')
            setIsConnected(true)
        })

        socketInstance.on("disconnect", () => {
            setIsConnected(false)
        })

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        }
    }, [])

    return (
        <socketContext.Provider value={{
            socket: socket,
            isConnected: isConnected,
        }}>
            {children}
        </socketContext.Provider>
    )
}