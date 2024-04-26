'use server'
import prisma from "@/app/lib/prisma";

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