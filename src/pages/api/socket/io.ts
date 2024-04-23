import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIo } from "socket.io";
import { auth } from "@/auth";

import { NextApiResponseServerSocket } from "@/app/lib/types";

export const config = {
    api: {
        bodyParser: false,
    },
};

const socketHandler = async (req: NextApiRequest, res: NextApiResponseServerSocket) => {
    if (!res.socket.server.io) {
        const session = await auth(req, res)
        const path = "/api/socket/io";
        const httpServer: NetServer = res.socket.server as any;
        const socket = new ServerIo(httpServer, {
            path: path,
            addTrailingSlash: false,
        });
        socket.use((socket, next) => {
            if (session && session.user) {
              next();
            } else {
              next(new Error("invalid"));
            }
          });
        res.socket.server.io = socket;
        socket.on('connection', (initedSocket) => {
            console.log('user connected')
            console.log(session)
            initedSocket.on('chat-message', (msg) => {
                console.log('message: ' + msg);
            });
            initedSocket.on('disconnect', () => {
                console.log('user disconnected');
              });
        })
    }
    res.end();
}

export default socketHandler;