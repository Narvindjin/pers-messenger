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
    name: string
}

export interface Invite {
    id: string,
    from?: {
        name: string
    }
    to?: {
        name: string
    }
}

export interface MemberAdapter {
    user: User;
}

export interface Chat {
    id: string,
    lastUpdated: string,
    membersAdapters: MemberAdapter[],
    messages: Message[] | null,
    lastMessage: Message,
}

export interface Message {
    id: string,
    postDate: string,
    content: string,
    fromId: string,
    chatId: string,
}