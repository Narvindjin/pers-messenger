'use server'
import { auth, signIn, signOut } from '@/auth';
import { redirect } from "next/dist/client/components/redirect";
import { validateEmail } from '../utils/utilsServer';
import { AuthError } from "next-auth"
import { Invite } from './types';
import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { errorAuthorization } from './errorTemplates';
import fs from "node:fs/promises";
import prisma from "@/app/lib/prisma";
import { existsSync } from 'node:fs';
import { ManagingSession } from '../profile/manage/page';
import { getIncomingInviteList, getOutgoingInviteList, getUnfriendedBots } from './actions/friendInvites';
import { getFriendList } from './actions/friendList';

export type SignInEmailResult = {
    status: "error" | "ok";
    errorMessage: string;
} | undefined;


export type Result = {
    success: boolean;
    refresh: boolean;
    errorMessage: null | string;
    invite?: Invite;
    errorObject?: z.typeToFlattenedError<FormData>
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
        console.log(email)
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
        console.log(error)
        return {
            status: "error",
            errorMessage: "Не удалось авторизироваться с помощью почты",
        };
    }
    if (redirectUrl) {
        redirect('/verify-request')
    }
}

export async function signInGithub
    (
        previousState: SignInEmailResult | null,
        formData: FormData,
    ): Promise<SignInEmailResult> {
    try {
        await signIn("github");
    }
    catch (error) {
        if (error instanceof AuthError) {
            console.log(error)
            return {
                status: "error",
                errorMessage: "Не удалось авторизироваться",
            };
        } else {
            throw error
        }
    }
}

export async function getManagingSession(): Promise<ManagingSession | null> {
    const user = await getUser();
    if (user) {
        const incomingInviteList = await getIncomingInviteList(user);
        const outgoingInviteList =  await getOutgoingInviteList(user);
        const friendList = await getFriendList(user);
        const unfriendedBotsList = await getUnfriendedBots(user);
        const managingSession:ManagingSession = {
            incomingInviteArray: incomingInviteList,
            outgoingInviteArray: outgoingInviteList,
            friendList: friendList,
            unfriendedBotsList: unfriendedBotsList,
            user: user
        }
        return managingSession
    } else {
        return null
    }
}

export async function signOutHandler(): Promise<SignInEmailResult> {
    let url: string | null = null;
    try {
        const urlObject = await signOut({ redirect: false, redirectTo: "/" });
        url = urlObject.redirect
    } catch (error) {
        console.log(error)
        return {
            status: "error",
            errorMessage: "Не удалось выйти из аккаунта",
        };
    }
    if (url) {
        return {
                status: "ok",
                errorMessage: url
            }
        }
}

export async function getUser() {
    const session = await auth()
    if (session && session.user && session.user.id) {
        return session.user
    } else {
        return null
    }
}

export async function normalizeString(string: string) {
    return string.trim().toLowerCase()
}

export async function stringChecker(probablyString: any): Promise<boolean> {
    if (typeof (probablyString) === 'string') {
        return true
    }
    return false
}

export async function uploadAvatarHandler(
    previousState: Result | null,
    formData: FormData
): Promise<Result> {
    const user = await getUser();
    if (user) {
        try {
            const schema = zfd.formData({
                profilePicture: zfd.file(z.instanceof(File)).refine((file) => file.size < 10000000, {
                    message: "Максимальный размер файла: 10МБ.",
                }).refine((file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
                    {
                        message: "Файл должен быть одного из форматов: jpg, jpeg или png.",
                    })
            });
            const parseResult = schema.safeParse(formData);
            if (!parseResult.success) {
                const errorObject = parseResult.error.flatten();
                return {
                    success: false,
                    refresh: false,
                    errorMessage: 'Ошибка в форме',
                    errorObject: errorObject,
                }
            } else {
                try {
                    const image = parseResult.data.profilePicture
                    let type = '.jpg';
                    if (image.type === "image/png") {
                        type = '.png'
                    }
                    const filePath = `/uploads/${Date.now()}_${user.id}${type}`;
                    const prefixForFS = "./public";
                    const filePathInFS = prefixForFS + filePath;
                    const arrayBuffer = await image.arrayBuffer();
                    const buffer = new Uint8Array(arrayBuffer)
                    await fs.writeFile(filePathInFS, buffer);
                    try {
                        const userFromDB = await prisma.user.findUnique({
                            where: {
                                id: user.id
                            },
                            select: {
                                image: true
                            }
                        })
                        console.log('user from DB: ', userFromDB)
                        if (userFromDB.image) {
                            const pathInFS = prefixForFS + userFromDB.image
                            const exists = existsSync(pathInFS)
                            if (exists) {
                                await fs.unlink(pathInFS)
                            }
                        }
                        await prisma.user.update({
                            where: {
                                id: user.id,
                            },
                            data: {
                                image: filePath,
                            },
                          })
                    } catch (err) {
                        console.log(err)
                        return {
                            success: false,
                            refresh: false,
                            errorMessage: 'Ошибка с перезаписью старого файла'
                        }  
                    }
                } catch (err) {
                    console.log(err)
                    return {
                        success: false,
                        refresh: false,
                        errorMessage: 'Ошибка с записью файла'
                    }
                }
            }
            return {
                success: true,
                refresh: true,
                errorMessage: 'Успех'
            }
        } catch (err) {
            console.log(err)
            return {
                success: false,
                refresh: false,
                errorMessage: 'Не удалось загрузить картинку'
            }
        }
    } else {
        return errorAuthorization
    }
}