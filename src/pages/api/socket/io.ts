import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIo } from "socket.io";

import {NextApiResponseServerSocket} from "@/app/lib/types";
import {getOtherUsersInChat, sendMessageHandler} from "@/app/lib/actions/socket";
import { decode } from "next-auth/jwt";
import {clearUnread, deleteMessageHistory, getMessageHistory} from "@/app/lib/actions/message";
import { stringChecker } from "@/app/lib/actions";
import { checkForInvite, deleteInvite } from "@/app/lib/actions/friendInvites";
import { addToFriendList } from "@/app/lib/actions/friendList";

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
            let currentChatTyping: string | null = null;
            initedSocket.join(userId);
            initedSocket.on('chat-message', async (msgObject: MessageInterface) => {
                if (msgObject.chatId && await stringChecker(msgObject.chatId)) {
                    await stopTyping(msgObject.chatId)
                    await sendMessageHandler(socket, userId, msgObject.chatId, msgObject.message)   
                }
            });
            initedSocket.on('clear-unread', async (chatId: string) => {
                if (chatId && await stringChecker(chatId)) {
                    const adapterArray = await clearUnread(chatId, userId)
                    adapterArray.forEach((adapter) => {
                        if (adapter.toUserId) {
                            socket.to(adapter.toUserId).emit('user-cleared-unread', chatId)
                        }
                    })
                }
            })
            initedSocket.on('get-history', async (chatId: string, messageFromEnd: number) => {
                if (chatId && await stringChecker(chatId)) {
                    const messageHistory = await getMessageHistory(chatId, userId, messageFromEnd);
                    initedSocket.emit('server-history', messageHistory)
                }
            });
            async function stopTyping (chatId: string) {
                const userIdArray = await getOtherUsersInChat(chatId, userId)
                if (userIdArray) {
                    currentChatTyping = null;
                    userIdArray.forEach((user) => {
                        console.log('stopped-typing: ', user)
                        socket.to(user).emit('server-stopped-typing', {chatId: chatId, userId: userId})
                    })
                }
            }

            initedSocket.on('typing', async (chatId: string) => {
                if (chatId && await stringChecker(chatId) && chatId !== currentChatTyping) {
                    if (currentChatTyping) {
                        await stopTyping(currentChatTyping)
                    }
                    currentChatTyping = chatId;
                    const userIdArray = await getOtherUsersInChat(chatId, userId)
                    userIdArray.forEach((user) => {
                        socket.to(user).emit('server-typing', {chatId: chatId, userId: userId})
                    })
                }
            })
            initedSocket.on('stop-typing', async (chatId: string) => {
                if (chatId && await stringChecker(chatId) && chatId === currentChatTyping) {
                    await stopTyping(chatId);
                }
            })
            initedSocket.on('delete-history', async (chatId: string) => {
                if (chatId && await stringChecker(chatId)) {
                    const messageHistory = await deleteMessageHistory(chatId, userId);
                    initedSocket.emit('server-history', messageHistory)
                }
            })
            initedSocket.on('delete-invite', async (inviteId: string, fromSender: boolean) => {
                if (inviteId && await stringChecker(inviteId)) {
                    console.log('checker-step')
                    const deletedInvite = await deleteInvite(inviteId, userId, fromSender);
                    console.log('invite-step', deletedInvite)
                    if (deletedInvite.success) {
                        socket.to(deletedInvite.invite!.to!.id).emit('client-deleted-incoming-invite', deletedInvite.invite)
                        socket.to(deletedInvite.invite!.from!.id).emit('client-deleted-outgoing-invite', deletedInvite.invite)
                    }
                }
            })
            initedSocket.on('created-invite', async (inviteId: string) => {
                if (inviteId && await stringChecker(inviteId)) {
                    const createdInvite = await checkForInvite(inviteId, userId);
                    if (createdInvite && createdInvite.to?.id) {
                        socket.to(createdInvite.to?.id).emit('client-created-invite', createdInvite)
                    }
                }
            })
            initedSocket.on('accept-invite', async (inviteId: string) => {
                if (inviteId && await stringChecker(inviteId)) {
                    const invite = await checkForInvite(inviteId, userId, true);
                    if (invite) {
                        const friendResult = await addToFriendList(invite.from!.id, invite.to!.id)
                        if (friendResult.success) {
                            socket.to(invite.from!.id).emit('client-accepted-outgoing-invite', invite);
                            socket.to(invite.to!.id).emit('client-accepted-incoming-invite', invite);
                        }
                    }
                }
            })
            initedSocket.on('disconnect', async () => {
                if (currentChatTyping) {
                    await stopTyping(currentChatTyping)
                }
                console.log(userId + ' disconnected');
              });
        })
    }
    res.end();
}

export default socketHandler;