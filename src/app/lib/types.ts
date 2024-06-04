import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as ServerSocket } from "socket.io";
import {User} from "next-auth";
import {Result} from "@/app/lib/actions";

export type NextApiResponseServerSocket = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: ServerSocket
        }
    }
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
    lastUpdated: Date,
    membersAdapters: MemberAdapter[],
    messages: Message[] | null,
    lastMessage: Message,
}

export interface MessageHistory {
    messages: Message[],
    chatId: string
}

export interface Message {
    id: string,
    postDate: Date,
    content: string,
    fromId: string,
    chatId: string,
}

export interface MessageHistoryResponse extends Result {
    messageHistory?: MessageHistory,
}