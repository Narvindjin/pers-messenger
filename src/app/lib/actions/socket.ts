'use server'
import { Session } from "next-auth"
import { Socket } from "socket.io"
import DOMPurify from "isomorphic-dompurify";

import { stringChecker } from '../actions';
import prisma from "@/app/lib/prisma";
import { sendMessage } from "./message";

interface Adapter {
    userId: string
}

export async function sendMessageMiddleStep(
    socket: Socket,
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
            await sendMessage(message, chatId, userId);
            const filteredUsers = adapters.filter((adapter) => adapter.userId !== userId)
            for (const user of filteredUsers) {
                socket.to(user.userId).emit('messageSent', chatId)
            }
        } else {
            throw new Error('Ошибка авторизации')
        }
    } catch(err) {
        return 'Ошибка при отправке сообщения'
    }
}

export async function sendMessageHandler(
    socket: Socket,
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
        return 'Вы присылаете мне какую-то дичь'
    }
}

export async function triggerReceiverRefresh(socket: Socket, receiverId: string) {
    socket.to(receiverId).emit('refresh')
}