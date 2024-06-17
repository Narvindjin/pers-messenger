import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIo } from "socket.io";
import { Session } from "next-auth";

import {Chat, NextApiResponseServerSocket} from "@/app/lib/types";
import {getOtherUsersInChat, sendMessageHandler} from "@/app/lib/actions/socket";
import { decode } from "next-auth/jwt";
import {deleteMessageHistory, getMessageHistory} from "@/app/lib/actions/message";

export const config = {
    api: {
        bodyParser: false,
    },
};

export interface MessageInterface {
    chatId: string;
    message: string;
}

const socketHandler = async (req: NextApiRequest, res: NextApiResponseServerSocket) => {
    if (!res.socket.server.io) {
        const path = "/api/socket/io";
        const httpServer: NetServer = res.socket.server as any;
        const socket = new ServerIo(httpServer, {
            path: path,
            addTrailingSlash: false,
        });
        socket.use(async (initedSocket, next) => {
            const cookie = initedSocket.handshake.headers.cookie;
            const name = process.env.NODE_ENV === "production"
            ? "__Secure-authjs.session-token"
            : "authjs.session-token";
            let startIndex = cookie?.indexOf(name);
            const endIndex = cookie?.indexOf('; ', startIndex);
            startIndex = cookie?.indexOf('=', startIndex);
            if (startIndex && endIndex) {
                let jwt: string|undefined;
                if (endIndex === -1) {
                    jwt = cookie?.slice(startIndex + 1);
                } else {
                    jwt = cookie?.slice(startIndex + 1, endIndex);
                }
                const session = await decode({
                    token: jwt,
                    secret: process.env.AUTH_SECRET as string,
                    salt: name,
                }
                )
                initedSocket.data.userId = session?.sub
                next();
            } else {
                next(new Error("invalid jwt token"))
            }
          });
        res.socket.server.io = socket;
        socket.on('connection', async (initedSocket) => {
            const userId = initedSocket.data.userId as string
            console.log('socket connected ', userId);
            initedSocket.join(userId);
            initedSocket.on('client-new-invite', async () => {

            })
            initedSocket.on('client-remove-invite', async () => {

            })
            initedSocket.on('chat-message', async (msgObject: MessageInterface) => {
                await sendMessageHandler(socket, userId, msgObject.chatId, msgObject.message)
            });
            initedSocket.on('get-history', async (chatId: string) => {
                if (chatId) {
                    const messageHistory = await getMessageHistory(chatId, userId);
                    initedSocket.emit('server-history', messageHistory)
                }
            });
            initedSocket.on('typing', async (chatId: string) => {
                if (chatId) {
                    const userIdArray = await getOtherUsersInChat(chatId, userId)
                    userIdArray.forEach((user) => {
                        socket.to(user).emit('server-typing', {chatId: chatId, userId: userId})
                    })
                }
            })
            initedSocket.on('stop-typing', async (chatId: string) => {
                if (chatId) {
                    const userIdArray = await getOtherUsersInChat(chatId, userId)
                    userIdArray.forEach((user) => {
                        socket.to(user).emit('server-stopped-typing', {chatId: chatId, userId: userId})
                    })
                }
            })
            initedSocket.on('delete-history', async (chatId: string) => {
                if (chatId) {
                    const messageHistory = await deleteMessageHistory(chatId, userId);
                    initedSocket.emit('server-history', messageHistory)
                }
            })
            initedSocket.on('disconnect', () => {
                console.log(userId + ' disconnected');
              });
        })
    }
    res.end();
}

export default socketHandler;