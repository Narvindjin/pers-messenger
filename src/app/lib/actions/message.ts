'use server'
import prisma from "@/app/lib/prisma";
import {getUser} from "@/app/lib/actions";
import {Chat, Message} from "@/app/lib/types";
import {Result} from '../actions';

interface MessageHistory extends Result {
    message?: Message,
}

export async function sendMessage(filteredMessage: string, chatId: string, senderId: string) {
    try {
        const message = await prisma.message.create({
            data: {
                content: filteredMessage,
                from: {
                    connect: {
                        id: senderId
                    }
                },
                chat: {
                    connect: {
                        id: chatId
                    } 
                },
            },
        })
        return true
    } catch (err) {
        console.log(err)
        return false
    }
}

export async function getMessageHistory(chatId: string):Promise<MessageHistory> {
    const user = await getUser();
    if (user) {
        try {
            const chat = await prisma.chat.findUnique({
                where: {
                    id: chatId,
                },
                include: {
                    messages: true,
                    membersAdapters: {
                        select: {
                            user: {
                                select: {
                                    id: true
                                }
                            }
                        }
                    }
                }
            });
            let authorized = false;
            for (const adapter of chat.membersAdapters) {
                if (adapter.user.id === user.id) {
                    authorized = true;
                }
            }
            if (chat.messages.length > 50) {
                chat.messages.length = 50;
            }
            if (authorized) {
                return {
                    refresh: true,
                    success: true,
                    errorMessage: 'Успех',
                    message: chat.messages,
                }
            }
        } catch (err) {
            console.log(err)
            return {
                refresh: true,
                success: false,
                errorMessage: 'Такого чата не существует',
            }
        }
    }
    return {
            refresh: true,
            success: false,
            errorMessage: 'Ошибка авторизации',
        }
}

export async function createChat(userId: string, receiverId: string) {
    try {
        const chat = await prisma.chat.create({
            data: {
                membersAdapters: {
                    create: [{
                            user: {
                                connect: {
                                    id: userId
                                }
                            }
                        }, {
                            user: {
                                connect: {
                                    id: receiverId
                                }
                            }
                        }
                    ]
                }
            },
        });
        return {
            refresh: true,
            success: true,
            errorMessage: chat.id as string,
        }
    } catch (err) {
        console.log(err)
        return {
            refresh: true,
            success: false,
            errorMessage: 'Ошибка при создании чата',
        }
    }
}

export async function getChatList () {
    const user = await getUser();
    if (user) {
        try {
            const userObject = await prisma.user.findUnique({
                where: {
                    id: user.id
                },
                select: {
                    chatAdapters: {
                        select: {
                            chat: {
                                select: {
                                    id: true,
                                    lastUpdated: true,
                                    membersAdapters: {
                                        where: {
                                            NOT: {
                                                user: {
                                                    id: user.id
                                                }
                                            }
                                        },
                                        select: {
                                            user: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    email: true,
                                                    image: true,
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                    },
                }
            });
            const arrayForReturn: Chat[] = [];
            for (const object of userObject.chatAdapters) {
                console.log(object.chat);
                arrayForReturn.push(object.chat as Chat);
            }
            if (arrayForReturn.length < 1) {
                return null
            }
            return arrayForReturn
        } catch(error) {
            console.log(error)
            return null;
        }
    }
    return null;
}