import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIo } from "socket.io";
import { Session } from "next-auth";

import { NextApiResponseServerSocket } from "@/app/lib/types";
import { sendMessageHandler } from "@/app/lib/actions/socket";
import { decode } from "next-auth/jwt";

export const config = {
    api: {
        bodyParser: false,
    },
};

interface MessageInterface {
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
            console.log(cookie);
            const name = process.env.NODE_ENV === "production"
            ? "__Secure-authjs.session-token"
            : "authjs.session-token";
            let startIndex = cookie?.indexOf(name);
            const endIndex = cookie?.indexOf('; ', startIndex);
            startIndex = cookie?.indexOf('=', startIndex);
            if (startIndex && endIndex) {
                let jwt: string|undefined;
                console.log(endIndex);
                if (endIndex === -1) {
                    jwt = cookie?.slice(startIndex + 1);
                } else {
                    jwt = cookie?.slice(startIndex + 1, endIndex);
                }
                console.log(process.env.AUTH_SECRET)
                const session = await decode({
                    token: jwt,
                    secret: process.env.AUTH_SECRET as string,
                    salt: name,
                }
                )
                initedSocket.data.userId = session?.sub
            }
          });
        res.socket.server.io = socket;
        socket.on('connection', async (initedSocket) => {
            const userId = initedSocket.data.session as string
            initedSocket.join(userId);
            initedSocket.on('chat-message', async (msgObject: MessageInterface) => {
                await sendMessageHandler(initedSocket, userId, msgObject.chatId, msgObject.message)
            });
            initedSocket.on('disconnect', () => {
                console.log(userId + ' disconnected');
              });
        })
    }
    res.end();
}

export default socketHandler;