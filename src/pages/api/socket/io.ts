import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIo } from "socket.io";

import { NextApiResponseServerSocket } from "@/app/lib/types";

export const config = {
    api: {
        bodyParser: false,
    },
};

const socketHandler = (req: NextApiRequest, res: NextApiResponseServerSocket) => {
    if (!res.socket.server.io) {
        const path = "/api/socket/io";
        const httpServer: NetServer = res.socket.server as any;
        const socket = new ServerIo(httpServer, {
            path: path,
            addTrailingSlash: false,
        });
        res.socket.server.io = socket;
        socket.on('connection', (initedSocket) => {
            console.log('a user connected')
            initedSocket.on('chat-message', (msg) => {
                console.log('message: ' + msg);
            });
        })
    }
    res.end();
}

export default socketHandler;