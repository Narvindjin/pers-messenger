'use server'
import prisma from "@/app/lib/prisma";
import DOMPurify from "isomorphic-dompurify";
import {Bot, Friend} from '../types';
import { getUser, Result, stringChecker } from '../actions';
import { addToFriendList } from "./friendList";


type IncomingInvite = {
    fromId: string
}

type OutgoingInvite = {
    toId: string
}

export async function friendInviteHandler(
    previousState: Result | null,
    formData: FormData,
): Promise<Result> {
    const id = formData.get('friendRequestId');
    const checker = await stringChecker(id);
    if (checker) {
        const filteredId = DOMPurify.sanitize(id as string);
        const user = await getUser();
        if (user) {
            const senderId = user.id as string;
            if (senderId === filteredId) {
                return {
                    refresh: true,
                    success: false,
                    errorMessage: 'Вы и так сами себе друг',
                }
            }
            const receivingUser = await prisma.user.findUnique({
                where: {
                    id: filteredId,
                },
                select: {
                    id: true,
                    email: true,
                    friends: {
                        select: {
                            id: true,
                            email: true,
                        }
                    },
                    incomingInvites: {
                        select: {
                            fromId: true,
                        }
                    },
                    outgoingInvites: {
                        select: {
                            toId: true,
                        }
                    }
                }
            });
            if (!receivingUser) {
                return {
                    refresh: true,
                    success: false,
                    errorMessage: 'Пользователя с таким ID не существует',
                }
            }
            const friendArray = receivingUser.friends as Friend[];
            const inviteArray = receivingUser.incomingInvites as IncomingInvite[];
            const outgoingInviteArray = receivingUser.outgoingInvites as OutgoingInvite[];
            const isFriend = friendArray.find((friend) => friend.id === senderId);
            if (isFriend) {
                return {
                    refresh: true,
                    success: false,
                    errorMessage: 'Уже в френдлисте',
                }
            }
            const isInvited = inviteArray.find((invite) => invite.fromId === senderId)
            if (isInvited) {
                return {
                    refresh: true,
                    success: false,
                    errorMessage: 'Уже заинвайчен',
                }
            }
            const isInviting = outgoingInviteArray.find((invite) => invite.toId === senderId)
            if (isInviting) {
                return await addToFriendList(senderId, filteredId)
            }
            return await createInvite(senderId, filteredId)
        }
        return {
            refresh: true,
            success: false,
            errorMessage: 'Ошибка авторизации',
        }
    } else {
        return {
            refresh: true,
            success: false,
            errorMessage: 'Ошибка авторизации'
        }
    }
}

export async function getUnfriendedBots(){
    const user = await getUser();
    if (user) {
        const botArray = prisma.user.findMany({
            where: {
                bot: true,
                friendOf: {
                    none: {
                        id: user.id
                    }
                }
            }
        }) as Bot[]
        return botArray
    }
    return [] as Bot[]
}

export async function deleteInviteHandler(
    previousState: Result | null,
    formData: FormData,
): Promise<Result> {
    const id = formData.get('inviteId');
    const checker = await stringChecker(id);
    if (checker) {
        const filteredId = DOMPurify.sanitize(id as string);
        const user = await getUser();
        if (user) {
            return await deleteInvite(user.id as string, filteredId);
        }
        return {
            refresh: true,
            success: false,
            errorMessage: 'Ошибка авторизации',
        }
    } else {
        return {
            refresh: true,
            success: false,
            errorMessage: 'Вы присылаете мне какую-то дичь',
        }
    }
}

export async function deleteInvite (senderId: string, inviteId: string): Promise<Result> {
    try {
        const invite = await prisma.invite.delete({
            where: {fromId: senderId, id: inviteId},
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
            errorMessage: 'Ошибка при удалении инвайта',
        }
    }
}

async function createInvite (senderId: string, receiverId: string): Promise<Result> {
    try {
        if (senderId === receiverId) {
            throw new Error('same ids')
        }
        const invite = await prisma.invite.create({
            data: {
                from: {
                    connect: {
                            id: senderId
                    }
                },
                to: {
                    connect: {
                            id: receiverId
                    }
                },
            },
        })
        console.log(invite)
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
            errorMessage: 'Ошибка при создании инвайта',
        }
    }
}

export async function getIncomingInviteList() {
    const user = await getUser();
    if (user){
        try {
            const userObject = await prisma.user.findUnique({
                where: {
                    id: user.id
                },
                include: {
                    incomingInvites: {
                        select: {
                            id: true,
                            from: {
                                select: {
                                    name: true
                                }
                            },
                        },
                    },
                }
            });
            return userObject.incomingInvites
        } catch(error) {
            console.log('invite error')
            return null;
        }
    }
    return null;
}

export async function getOutgoingInviteList() {
    const user = await getUser();
    if (user){
        try {
            const userObject = await prisma.user.findUnique({
                where: {
                    id: user.id
                },
                include: {
                    outgoingInvites: {
                        select: {
                            id: true,
                            to: {
                                select: {
                                    name: true
                                }
                            },
                        },
                    },
                }
            });
            return userObject.outgoingInvites
        } catch(error) {
            console.log('invite error')
            return null;
        }
    }
    return null;
}