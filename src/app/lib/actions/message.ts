'use server'
import prisma from "@/app/lib/prisma";
import {getUser} from "@/app/lib/actions";
import {Chat, MessageHistoryResponse} from "@/app/lib/types";
import {User} from "next-auth";

export async function sendMessage(filteredMessage: string, chatId: string, senderId: string, adapterArray: {id: string}[]) {
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
                unreadByUserAdapters: {
                    connect: {
                        id: adapterArray
                    }
                }
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
                        adapters: [],
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
    if (user) {
        userId = user.id
    }
    if (userId) {
        try {
            const chat = await prisma.chat.findUnique({
                where: {
                    id: chatId,
                },
                include: {
                    messages: true,
                    membersAdapters: {
                        select: {
                            id: true,
                            user: {
                                select: {
                                    id: true
                                }
                            },
                            toUnreadMessages: {
                                select: {
                                    id: true
                                }
                            }
                        }
                    }
                }
            });
            let userMemberAdapterId: string;
            let authorized = false;
            for (const adapter of chat.membersAdapters) {
                if (adapter.user.id === user?.id || userId === adapter.user.id) {
                    authorized = true;
                    userMemberAdapterId = adapter.user.id
                }
            }
            if (chat.messages.length > 20) {
                chat.messages.length = 20;
            }
            chat.chatId = chatId;
            if (authorized) {
                await clearUnread(chatId, userId)
                const userMember = chat.membersAdapters.find((member) => member.id === userId)
                userMember.toUnreadMessages = [];
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

export async function clearUnread(chatId: string, userId: string) {
    const updatedMembersAdapter = await prisma.chatAdapter.update({
        where: {
            chatId: chatId,
            userId: userId,
        },
        data: {
            toUnreadMessages:{
                set: [],
            }
        }
    })
}

export async function createChat(userId: string, receiverId: string) {
    const existingChatAdapter = await prisma.chatAdapter.findFirst({
        where: {
            userId: userId,
            toUserId: receiverId
    }
})
    try {
        if (existingChatAdapter) {
            const chat = await prisma.chat.create({
                data: {
                    membersAdapters: {
                        create: [{
                            user: {
                                connect: {
                                    id: userId
                                }
                            },
                            toUser: {
                                connect: {
                                    id: receiverId
                                }
                            }
                        }, {
                            user: {
                                connect: {
                                    id: receiverId
                                }
                            },
                            toUser: {
                                connect: {
                                    id: userId
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
        } else {
            return {
                refresh: true,
                success: true,
                errorMessage: 'Чат уже есть'
            }
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
                    outgoingChatAdapters: {
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
                            },
                            toUnreadMessages: {
                                select: {
                                    id: true,
                                }
                            },
                        },
                    },
                }
            });
            const arrayForReturn: Chat[] = [];
            for (const object of userObject.outgoingChatAdapters) {
                const chat = object.chat;
                chat.unread = 0;
                chat.lastMessage = chat.messages[0];
                chat.messages = null;
                if (object.toUnreadMessages) {
                    chat.unread = object.toUnreadMessages.length;
                }
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