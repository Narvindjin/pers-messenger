'use server'
import DOMPurify from "isomorphic-dompurify";

import { stringChecker } from '../actions';
import prisma from "@/app/lib/prisma";
import { sendMessage } from "./message";
import {Server} from "node:net";
import {requestBotResponse} from "@/app/lib/actions/botActions";


interface UserInAdapter {
    bot: boolean | undefined
}

export interface Adapter {
    userId: string;
    user: UserInAdapter;
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
                        userId: true,
                        user: {
                            select: {
                                bot: true
                            }
                        }
                    }
                },
            }
        });
        const adapters = chat.membersAdapters as Adapter[];
        const adapter = adapters.find((adapter) => adapter.userId === userId)
        if (adapter) {
            let adapterArray: {id:string}[] = [];
            let allAdaptersArray: {id:string}[] = [];
            for (const newAdapter of adapters) {
                const adapterObject = {id: newAdapter.userId}
                allAdaptersArray.push(adapterObject)
                if (newAdapter.userId !== userId) {
                    adapterArray.push(adapterObject)
                }
            }
            const sentMessage = await sendMessage(message, chatId, userId, adapterArray);
            for (const adapter of adapters) {
                socket.to(adapter.userId).emit('server-message', sentMessage)
                if (adapter.user.bot) {
                    for (const finalAdapter of adapters) {
                        if (adapter.userId !== finalAdapter.userId) {
                            socket.to(finalAdapter.userId).emit('server-typing', {chatId: chatId, userId: adapter.userId})
                        }
                    }
                    const returnMessage = await requestBotResponse(message, chatId, adapter.userId, allAdaptersArray);
                    for (const finalAdapter of adapters) {
                        if (adapter.userId !== finalAdapter.userId) {
                            socket.to(finalAdapter.userId).emit('server-stopped-typing', {chatId: chatId, userId: adapter.userId})
                            socket.to(finalAdapter.userId).emit('server-message', returnMessage)
                        }
                    }
                }
            }

        } else {
            throw new Error('Ошибка авторизации')
        }
    } catch(err) {
        return err
    }
}

export async function getOtherUsersInChat(chatId: string, userId: string) {
    const checker = await stringChecker(chatId);
    if (checker) {
        const chat = await prisma.chat.findUnique({
            where: {
                id: chatId
            },
            select: {
                membersAdapters: {
                    select: {
                        userId: true
                    }
                },
            }
        });
        if (chat) {
            const userIdArray = chat.membersAdapters as Array<{ userId: string }>;
            let authorized = false;
            const newArray: Array<string> = [];
            for (const user of userIdArray) {
                if (user.userId === userId) {
                    authorized = true;
                } else {
                    newArray.push(user.userId)
                }
            }
            if (authorized) {
                return newArray
            } else {
                throw new Error('Ошибка авторизации')
            }
        } else {
            throw new Error('Чата не существует')
        }
    } else {
        throw new Error('Присылается какая-то дичь')
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

export async function getGeneralInfo(
    userId
) {
    const checker = await stringChecker(userId);
    if (checker) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                incomingInvites: true,
                membersAdapters: {
                    select: {
                        toUnreadMessages: true
                    }
                },
            }
        });
    } else {
        throw new Error('Присылается какя-то дичь')
    }
}