'use server'
import { Socket } from "socket.io"
import DOMPurify from "isomorphic-dompurify";

import { stringChecker } from '../actions';
import prisma from "@/app/lib/prisma";
import { sendMessage } from "./message";
import {Server} from "node:net";

interface Adapter {
    userId: string
}

export async function sendMessageMiddleStep(
    socket: Server,
    userId: string,
    chatId: string,
    message: string
){
    try {
        const chat = await prisma.chat.findUnique({
            where: {
                id: chatId,
            },
            select: {
                id: true,
                membersAdapters: {
                    select: {
                        userId: true
                    }
                },
            }
        });
        const adapters = chat.membersAdapters as Adapter[];
        const adapter = adapters.find((adapter) => adapter.userId === userId)
        if (adapter) {
            const sentMessage = await sendMessage(message, chatId, userId);
            for (const adapter of adapters) {
                console.log('adapter', adapter)
                socket.to(adapter.userId).emit('server-message', sentMessage)
            }
        } else {
            throw new Error('Ошибка авторизации')
        }
    } catch(err) {
        return err
    }
}

export async function sendMessageHandler(
    socket: Server,
    userId: string,
    chatId: any,
    message: any
) {
    const checker = await stringChecker(chatId); 
    const checkerMessage = await stringChecker(message);
    if (checker && checkerMessage) {
        const filteredChatId = DOMPurify.sanitize(chatId as string);
        const filteredMessage = DOMPurify.sanitize(message as string);
        const result = sendMessageMiddleStep(socket, userId, filteredChatId, filteredMessage);
        return result;
    } else {
        throw new Error('Присылается какя-то дичь')
    }
}

export async function triggerReceiverRefresh(socket: Socket, receiverId: string) {
    socket.to(receiverId).emit('refresh')
}