'use server'
import prisma from "@/app/lib/prisma";
import DOMPurify from "isomorphic-dompurify";
import {Bot, Friend, Invite} from '../types';
import { getUser, Result, stringChecker } from '../actions';
import { addToFriendList } from "./friendList";
import { errorAuthorization, errorInvalidDataType } from "../errorTemplates";
import { User } from "next-auth";


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
        return errorAuthorization
    } else {
        return errorInvalidDataType
    }
}

export async function getUnfriendedBots(user: User){
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
            return await deleteInvite(filteredId, user.id!, true);
        }
        return errorAuthorization
    } else {
        return errorInvalidDataType
    }
}

export async function deleteInvite (inviteId: string, deleterId: string, fromSender: boolean): Promise<Result> {
    try {
        let invite: Invite;
        if (fromSender) {
            invite = await prisma.invite.delete({
                where: {
                    id: inviteId,
                    fromId: deleterId,
                },
                select: {
                    id: true,
                    to: {
                        select: {
                            name: true,
                            id: true,
                        }
                    },
                    from: {
                        select: {
                            name: true,
                            id: true,
                        } 
                    }
                },
            })
        } else {
            invite = await prisma.invite.delete({
                where: {
                    id: inviteId,
                    toId: deleterId
                },
                select: {
                    id: true,
                    to: {
                        select: {
                            name: true,
                            id: true,
                        }
                    },
                    from: {
                        select: {
                            name: true,
                            id: true,
                        } 
                    }
                },
            })
        }
        return {
            refresh: true,
            success: true,
            errorMessage: invite.to!.id,
            invite: invite
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

export async function checkForInvite(inviteId: string, userId: string, incoming?: boolean): Promise<false | Invite | null> {
    try {
        let invite = null;
        if (incoming) {
            invite = await prisma.invite.findUnique({
                where: {id: inviteId, toId: userId},
                select: {
                    id: true,
                    to: {
                        select: {
                            name: true,
                            id: true,
                        }
                    },
                    from: {
                        select: {
                            name: true,
                            id: true,
                        } 
                    }
                },
            })
        } else {
            invite = await prisma.invite.findUnique({
                where: {id: inviteId, fromId: userId},
                select: {
                    id: true,
                    to: {
                        select: {
                            name: true,
                            id: true,
                        }
                    },
                    from: {
                        select: {
                            name: true,
                            id: true,
                        } 
                    }
                },
            })
        }
        if (invite) {
            return invite
        }
        return false
    } catch (err) {
        return null
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
            select: {
                id: true,
                from: {
                    select: {
                        name: true,
                        id: true,
                    }
                },
                to: {
                    select: {
                        name: true,
                        id: true,
                    }
                }
            }
        })
        return {
            refresh: true,
            success: true,
            errorMessage: receiverId,
            invite: invite,
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

export async function getIncomingInviteListWrapper() {
    const user = await getUser();
    if (user){
        return getIncomingInviteList(user)
    }
    return [];
}

export async function getIncomingInviteList(user: User) {
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
                                name: true,
                                id: true,
                            }
                        },
                    },
                },
            }
        });
        return userObject.incomingInvites
    } catch(error) {
        console.log('invite error')
        return [];
    }
}

export async function getOutgoingInviteList(user: User) {
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
                                name: true,
                                id: true
                            }
                        },
                    },
                },
            }
        });
        return userObject.outgoingInvites
    } catch(error) {
        console.log('invite error')
        return [];
    }
}

export async function getOutgoingInviteListWrapper() {
    const user = await getUser();
    if (user){
        return getOutgoingInviteList(user)
    }
    return [];
}