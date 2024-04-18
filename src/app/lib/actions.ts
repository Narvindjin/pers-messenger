'use server'
import {auth, signIn, signOut} from '@/auth';
import {redirect} from "next/dist/client/components/redirect";
import {validateEmail} from '../utils/utils';
import prisma from "@/app/lib/prisma";
import DOMPurify from "isomorphic-dompurify";


export type SignInEmailResult =
    | {
    status: "error";
    errorMessage: string;
}
    | undefined;


export type SendInviteResult = {
    success: boolean;
    errorMessage: null | string;
}
/**
 * Server action for email sign in with AuthJS.
 */
export async function signInEmail(
    previousState: SignInEmailResult | null,
    formData: FormData,
): Promise<SignInEmailResult> {
    let redirectUrl: string | null = null;
    try {
        const email = formData.get("email");
        if (validateEmail(email)) {
            redirectUrl = await signIn("nodemailer", {
                redirect: false,
                email,
            });
            if (!redirectUrl) {
                return {
                    status: "error",
                    errorMessage: "Не удалось авторизироваться с помощью почты, не найдена ссылка редиректа",
                };
            }
        } else {
            return {
                status: "error",
                errorMessage: "Введите почту в виде example@mail.com",
            };
        }
    } catch (error) {
        return {
            status: "error",
            errorMessage: "Не удалось авторизироваться с помощью почты",
        };
    }
    if (redirectUrl) {
        redirect(redirectUrl);
    }
}

export async function signOutHandler(
    previousState: SignInEmailResult | null,
    formData: FormData,
): Promise<SignInEmailResult> {
    let signoutObject: string | null = null;
    try {
        signoutObject = await signOut();
    } catch (error) {
        return {
            status: "error",
            errorMessage: "Не удалось выйти из аккаунта",
        };
    }
}

const getIsFriend = async(userId:string, receiverId:string) => {
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

interface Friend {
    id: string,
    email: string
}

interface Invite {
    toId: string,
}

export async function friendInviteHandler(
    previousState: SendInviteResult | null,
    formData: FormData,
): Promise<SendInviteResult> {
    const id = formData.get('friendRequestId');
    if (typeof(id) === 'string') {
        const filteredId = DOMPurify.sanitize(id);
        const session = await auth()
        if (session && session.user) {
            const email = session.user.email;
            const receivingUser = await prisma.user.findUnique({
                where: {
                    id: filteredId,
                    email: true,
                },
                select: {
                    id: true,
                    friends: {
                        select: {
                            id: true,
                            email: true,
                        }
                    },
                    outgoingInvites: {
                        select: {
                            fromId: true,
                        }
                    }
                }
            });
            const friendArray = user.friends as Friend[];
            const inviteArray = user.outgoingInvites as Invite[];
            const isFriend = friendArray.find((friend) => friend.id === filteredId);
            if (isFriend) {
                return {
                    success: false,
                    errorMessage: 'Уже в френдлисте',
                }
            }
            const isInvited = inviteArray.find((invite) => invite.toId === filteredId)
            if (isInvited) {
                return {
                    success: false,
                    errorMessage: 'Уже заинвайчен',
                }
            }
            try {
                const message = await prisma.invite.create({
                    data: {
                        from: {
                            connect: {
                                where: {
                                    id: user.id
                                }
                            }
                        },
                        to: {
                            connect: {
                                where: {
                                    id: filteredId
                                }
                            }
                        },
                    },
                })
                return {
                    success: true,
                    errorMessage: 'Успех',
                }
            } catch (err) {
                console.log(err)
                return {
                    success: false,
                    errorMessage: 'Ошибка при создании инвайта',
                }
            }
        }
        return {
            success: false,
            errorMessage: 'Ошибка авторизации',
        }
    }
        return {
            success: false,
            errorMessage: 'Вы присылаете мне какую-то дичь',
        }
}

export async function sendMessage(message: string, receiverId: string) {
    const session = await auth()
    const filteredMessage = DOMPurify.sanitize(message);
    if (session && session.user) {
        const user = session.user;
        const isFriend = await getIsFriend(user.id!, receiverId);
        if (isFriend) {
            try {
                const message = await prisma.message.create({
                    data: {
                        content: filteredMessage,
                        from: {
                            connect: {
                                where: {
                                    id: user.id
                                }
                            }
                        },
                        to: {
                            connect: {
                                where: {
                                    id: receiverId
                                }
                            }
                        },
                    },
                })
                return 'Сообщение доставлено'
            } catch (err) {
                return 'Произошла ошибка'
            }
        } else {
            return 'Не в друзьях'
        }
    } else {
        return 'Неавторизирован'
    }
}

export async function getFriendList() {
    const session = await auth();
    if (session && session.user) {
        const user = session.user;
        try {
            return await prisma.user.findUnique({
                where: {
                    id: user.id
                },
                include: {
                    friendOf: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                }
            })
        } catch(error) {
            console.log('error')
            return null;
        }
    }
    return null;
}