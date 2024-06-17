'use server'
import prisma from "@/app/lib/prisma";
import DOMPurify from "isomorphic-dompurify";
import { getUser, Result, stringChecker } from '../actions';
import { createChat } from "./message";
import {deleteInvite} from "@/app/lib/actions/friendInvites";

export const getIsFriend = async(userId:string, receiverId:string) => {
    const isFriend = await prisma.user.findUnique({
        where: {
            id: userId,
            friendOf: {
                some: {
                    id: receiverId,
                }
            }
        },
        select: {
            id: true,
        }
    });
    return isFriend
}

export async function getFriendList() {
    const user = await getUser();
    if (user) {
        try {
            const userObject = await prisma.user.findUnique({
                where: {
                    id: user.id
                },
                include: {
                    friendOf: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                }
            });

            return userObject.friendOf
        } catch(error) {
            console.log('error')
            return null;
        }
    }
    return null;
}

export async function changeName(
    previousState: Result | null,
    formData: FormData,
): Promise<Result> {
    const name = formData.get('name');
    const checker = await stringChecker(name);
    if (checker) {
        const filteredName = DOMPurify.sanitize(name as string);
        const user = await getUser();
        if (user) {
            try {
                const newUser = prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        name: filteredName
                    }
                });
                return {
                    refresh: true,
                    success: true,
                    errorMessage: 'Успех',
                    }
                } catch (err) {
                console.log(err)
                return {
                    refresh: true,
                    success: false,
                    errorMessage: 'Ошибка при смене имени',
                }
            }
        }
    }
}

export async function addBotFriendHandler(
    previousState: Result | null,
    formData: FormData,
): Promise<Result> {
    const id = formData.get('botId');
    const checker = await stringChecker(id);
    if (checker) {
        const filteredId = DOMPurify.sanitize(id as string);
        const user = await getUser();
        if (user) {
            try {
                const bot = prisma.user.findFirst({
                    where: {
                        id: filteredId,
                        bot: true,
                    }
                });
                if (bot) {
                    await prisma.user.update({
                        where: {id: user.id},
                        data: {
                            friends: {
                                connect: {
                                    id: filteredId
                                }
                            },
                            friendOf: {
                                connect: {
                                    id: filteredId
                                }
                            },
                        },
                    })
                    const chat = await createChat(user.id!, filteredId)
                    return {
                        refresh: true,
                        success: true,
                        errorMessage: 'Успех',
                    }
                }
            } catch (err) {
                console.log(err)
                return {
                    refresh: true,
                    success: false,
                    errorMessage: 'Ошибка при добавлении в френд лист',
                }
            }
        }
    }
}

export async function addToFriendList (userId: string, receiverId: string): Promise<Result> {
    try {
        const user = await prisma.user.update({
            where: {id: userId},
            data: {
                friends: {
                    connect: {
                            id: receiverId
                    }
                },
                friendOf: {
                    connect: {
                            id: receiverId
                    }
                },
            },
        })
        const inviteArray  = await prisma.invite.deleteMany({
            where: {
              OR: [
                {
                  fromId: userId,
                  toId: receiverId,
                },
                {
                    fromId: receiverId,
                    toId: userId,
                },
              ],
            },
          });
        const chat = await createChat(userId, receiverId)
        return {
            refresh: true,
            success: true,
            errorMessage: 'Успех',
        }
    } catch (err) {
        console.log(err)
        return {
            refresh: true,
            success: false,
            errorMessage: 'Ошибка при добавлении в френд лист',
        }
    }
}

export async function removeFromFriendList (userId: string, receiverId: string): Promise<Result> {
        try {
            const user = await prisma.user.update({
                where: {id: userId},
                data: {
                    friends: {
                        disconnect: {
                                id: receiverId
                        }
                    },
                    friendOf: {
                        disconnect: {
                                id: receiverId
                        }
                    },
                },
            });
            const removedAdapters = await prisma.chatAdapter.deleteMany({
                where: {
                    AND: [{
                      OR: [{
                          userId: userId
                      }, {
                          userId: receiverId
                      }]
                    }, {
                        OR: [{
                            toUserId: userId
                        }, {
                            toUserId: receiverId
                        }]
                    }
                    ]
                }
            })
            return {
                refresh: true,
                success: true,
                errorMessage: 'Успех',
            }
        } catch (err) {
            console.log(err)
            return {
                refresh: true,
                success: false,
                errorMessage: 'Ошибка при удалении из френд листа',
            }
        }
}

export async function removeFriendHandler(
    previousState: Result | null,
    formData: FormData,
): Promise<Result> {
    const friendId = formData.get('friendId');
    const checker = await stringChecker(friendId);
    if (checker) {
        const filteredId = DOMPurify.sanitize(friendId as string);
        const user = await getUser();
        if (user) {
            try {
            return await removeFromFriendList(user.id as string, filteredId);
            } catch (err) {
                console.log(err)
                return {
                    refresh: true,
                    success: false,
                    errorMessage: 'Ошибка в удалении из друзей',
                }
            }
        } else {
            return {
                refresh: true,
                success: false,
                errorMessage: 'Ошибка авторизации',
            }
        }
    } else {
        return {
                refresh: true,
                success: false,
                errorMessage: 'Вы присылаете мне какую-то дичь',
            }
    }
}

export async function addToFriendListHandler(
    previousState: Result | null,
    formData: FormData,
): Promise<Result> {
    const inviteId = formData.get('inviteId');
    const rejected = formData.get('rejected')
    const checker = await stringChecker(inviteId);
    if (checker) {
        const filteredId = DOMPurify.sanitize(inviteId as string);
        const user = await getUser();
        if (user) {
            try {
                const invite = await prisma.invite.findUnique({
                    where: {
                        id: filteredId,
                        toId: user.id as string
                    },
            })
                if (rejected === 'true') {
                    return await deleteInvite(invite.fromId, filteredId)
                } else {
                    return await addToFriendList(user.id as string, invite.fromId);
                }
            } catch (err) {
                console.log(err)
                return {
                    refresh: true,
                    success: false,
                    errorMessage: 'Нет инвайта для добавления в друзья',
                }
            }
        } else {
            return {
                refresh: true,
                success: false,
                errorMessage: 'Ошибка авторизации',
            }
        }
    } else {
        return {
                refresh: true,
                success: false,
                errorMessage: 'Вы присылаете мне какую-то дичь',
            }
    }
}