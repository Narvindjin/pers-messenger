'use server'
import { getUser } from "../actions";
import prisma from "@/app/lib/prisma";
import DOMPurify from "isomorphic-dompurify";
import { getIsFriend } from './friendList';

export async function sendMessage(message: string, receiverId: string) {
    const filteredMessage = DOMPurify.sanitize(message);
    const user = await getUser(); 
    if (user) {
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