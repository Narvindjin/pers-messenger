'use server'
import prisma from "@/app/lib/prisma";
import {getUser} from "@/app/lib/actions";
import {Chat} from "@/app/lib/types";

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
        return 'Сообщение доставлено'
    } catch (err) {
        return 'Произошла ошибка'
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
                                                id: true,
                                                name: true,
                                                email: true,
                                                image: true,
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
                arrayForReturn.push(object.chat as Chat);
            }
            if (arrayForReturn.length < 1) {
                return null
            }
            return arrayForReturn
        } catch(error) {
            console.log('error')
            return null;
        }
    }
    return null;
}