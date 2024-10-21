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
    bot?: boolean,
    image?: string,
}

export interface Invite {
    id: string,
    from?: {
        name: string,
        id: string,
    }
    to?: {
        name: string,
        id: string,
    }
    accepted?: boolean
}

export interface IdAndRecipient {
    id: string,
    recipientId: string,
}

export interface MemberAdapter {
    user: User;
    toUnreadMessages: Message[];
    toUserId?: string
}

export interface Chat {
    id: string,
    membersAdapters: MemberAdapter[],
    messages: Message[],
    lastMessage: Message,
    writingArray: User[] | null,
    unread?: number,
}

export interface Bot {
    id: string,
    name: string,
    roomUrl: string | null,
    imageUrl: string,
    botPurpose: string,
}

export interface MessageHistory {
    messages: Message[],
    chatId: string,
    membersAdapters: MemberAdapter[];
}

export interface Message {
    id: string,
    postDate: Date,
    content: string,
    fromId: string,
    chatId: string,
    unread?: boolean,
}

export interface MessageHistoryResponse extends Result {
    messageHistory?: MessageHistory,
}

export interface TypingInterface {
    chatId: string,
    userId: string,
}