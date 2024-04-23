import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as ServerSocket } from "socket.io";

export type NextApiResponseServerSocket = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: ServerSocket
        }
    }
}

export type User = {
    id: string,
    email: string,
    name: string,
    image: string
}

export interface Friend {
    id: string,
    email: string
}

export interface Invite {
    id: string,
    from?: {
        email: string
    }
    to?: {
        email: string
    }
}