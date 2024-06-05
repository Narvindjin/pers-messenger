'use server'
import prisma from "@/app/lib/prisma";
import {getUser} from "@/app/lib/actions";
import {Chat, Message, MessageHistoryResponse} from "@/app/lib/types";
import {User} from "next-auth";

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
        return message
    } catch (err) {
        console.log('message-error:', err)
        return err
    }
}

export async function deleteMessageHistory(chatId: string, userId: string):Promise<MessageHistoryResponse> {
    try {
            const chat = await prisma.chat.findUnique({
                where: {
                    id: chatId,
                },
                include: {
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
                if (userId === adapter.user.id) {
                    authorized = true;
                }
            }
            if (authorized) {
                const deletedMessages = await prisma.message.deleteMany({
                    where: {
                        chatId: chatId,
                    },
                });
                return {
                    refresh: false,
                    success: true,
                    errorMessage: 'Успех',
                    messageHistory: {
                        chatId: chatId,
                        messages: [],
                    },
                }
            } else {
                return {
                    refresh: false,
                    success: false,
                    errorMessage: 'Ошибка аутентификации',
                }
            }
        } catch (err) {
            console.log(err)
            return {
                refresh: false,
                success: false,
                errorMessage: 'Такого чата не существует',
            }
        }
}

export async function getMessageHistory(chatId: string, userId?: string):Promise<MessageHistoryResponse> {
    let user: User | null
    if (!userId) {
        user = await getUser();
    }
    if (user || userId) {
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
                if (adapter.user.id === user?.id || userId === adapter.user.id) {
                    authorized = true;
                }
            }
            if (chat.messages.length > 20) {
                chat.messages.length = 20;
            }
            chat.chatId = chatId;
            if (authorized) {
                return {
                    refresh: false,
                    success: true,
                    errorMessage: 'Успех',
                    messageHistory: chat,
                }
            } else {
                return {
                    refresh: false,
                    success: false,
                    errorMessage: 'Ошибка аутентификации',
                }
            }
        } catch (err) {
            console.log(err)
            return {
                refresh: false,
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
                                    messages: {
                                        orderBy: {
                                            postDate: 'desc',
                                        },
                                        take: 1,
                                        select: {
                                            id: true,
                                            postDate: true,
                                            content: true,
                                            fromId: true,
                                            chatId: true,
                                        }
                                    },
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
                const chat = object.chat;
                chat.lastMessage = chat.messages[0];
                chat.messages = null;
                arrayForReturn.push(chat as Chat);
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