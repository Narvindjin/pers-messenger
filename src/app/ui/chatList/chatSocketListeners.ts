import {chatContextInterface} from "@/app/contexts/chatContext";
import {SocketContextType} from "@/app/providers/socketProvider";
import {Message} from "@/app/lib/types";

export function initChatSocketListeners(context: chatContextInterface, socket: SocketContextType) {
    socket.socket.removeAllListeners("server-message");
    socket.socket.on('server-message', (message: Message) => {
        if (context.chatList) {
            const chat = context.chatList.find((chat) => chat.id === message.chatId)
            if (chat) {
                chat.lastMessage = message;
            } else {
                socket.socket.emit('request-new-chat', message.fromId)
            }
            if (context.currentChat?.id === message.chatId) {
                context.currentChat.messages?.push(message)
            }
        }
    })
}