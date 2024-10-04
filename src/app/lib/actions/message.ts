'use server'
import prisma from "@/app/lib/prisma";
import {getUser, stringChecker} from "@/app/lib/actions";
import {Chat, MemberAdapter, MessageHistoryResponse} from "@/app/lib/types";
import { errorAuthorization, errorInvalidDataType } from "../errorTemplates";
import DOMPurify from "isomorphic-dompurify";

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
                    connect: adapterArray.map(c => ({ id: c.id })) || [],
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
                await prisma.message.deleteMany({
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
                return errorAuthorization
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

export async function messageHistoryHandler(
    previousState: MessageHistoryResponse | null,
    formData: FormData,
): Promise<MessageHistoryResponse>  {
    const chatId = formData.get('chatId');
    const checker = await stringChecker(chatId);
    if (checker) {
        const filteredId = DOMPurify.sanitize(chatId as string);
        const user = await getUser();
        if (user && user.id) {
            try {
            return await getMessageHistory(filteredId, user.id);
            } catch (err) {
                console.log(err)
                return {
                    refresh: true,
                    success: false,
                    errorMessage: 'Ошибка в вызове истории сообщений',
                }
            }
        } else {
            return errorAuthorization
        }
    } else {
        return errorInvalidDataType
    }
}

export async function getMessageHistoryClient(chatId: string) {
    const checker = await stringChecker(chatId);
    if (checker) {
        const user = await getUser();
        if (user && user.id) {
            getMessageHistory(chatId, user.id);
        } else {
            return errorAuthorization;
        }
    } else {
        return errorInvalidDataType;
    }
}

export async function getMessageHistory(chatId: string, userId: string, messageFromEnd?: number):Promise<MessageHistoryResponse> {
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
                                    id: true,
                                    bot: true
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
            let authorized = false;
            for (const adapter of chat.membersAdapters) {
                if (userId === adapter.user.id) {
                    authorized = true;
                }
            }
            if (chat.messages.length > 20) {
                chat.messages.slice(chat)
            }
            chat.chatId = chatId;
            if (authorized) {
                await clearUnread(chatId, userId)
                console.log(chat.membersAdapters, userId)
                const userMember = chat.membersAdapters.find((member) => member.user.id === userId)
                if (userMember) {
                    userMember.toUnreadMessages = [];
                }
                const botMembers = chat.membersAdapters.filter((member) => {
                    if (member.user.bot) {
                        return true
                    }
                    return false
                })
                if (botMembers.length > 0) {
                    for (const member of botMembers) {
                        if (member.toUnreadMessages.length > 0) {
                            member.toUnreadMessages = [];
                        }
                    }
                }
                return {
                    refresh: false,
                    success: true,
                    errorMessage: 'Успех',
                    messageHistory: chat,
                }
            } else {
                return errorAuthorization
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

export async function clearUnread(chatId: string, userId: string) {
    const adapterArray = await prisma.chatAdapter.findMany({
        where: {
            chatId: chatId,
            userId: userId,
        }
    })
    const returnAdapterArray:MemberAdapter[] = []
    for (const adapter of adapterArray) {
        const newAdapter = await prisma.chatAdapter.update({
            where: {
                id: adapter.id
            },
            data: {
                toUnreadMessages: {
                    set: [],
                },
            },
            include: {
                toUnreadMessages: true,
            }
        }) as MemberAdapter
        returnAdapterArray.push(newAdapter)
    }
    return returnAdapterArray
}

export async function createChat(userId: string, receiverId: string) {
    const existingChatAdapter = await prisma.chatAdapter.findFirst({
        where: {
            userId: userId,
            toUserId: receiverId
    }
})
    try {
        if (!existingChatAdapter) {
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
                chat.messages = [];
                if (object.toUnreadMessages) {
                    chat.unread = object.toUnreadMessages.length;
                }
                arrayForReturn.push(chat as Chat);
            }
            return arrayForReturn
        } catch(error) {
            console.log(error)
            return [];
        }
    }
    return [];
}