import {chatContextInterface} from "@/app/contexts/chatContext";
import {SocketContextType} from "@/app/providers/socketProvider";
import {Message, MessageHistory, MessageHistoryResponse} from "@/app/lib/types";

export function initChatSocketListeners(context: chatContextInterface, socket: SocketContextType) {
    if (socket.socket) {
        console.log('set listeners')
        socket.socket.removeAllListeners("server-message");
        socket.socket.on('server-message', (message: Message) => {
            console.log('early-change')
            if (context.chatList) {
                const chat = context.chatList.find((chat) => chat.id === message.chatId)
                if (chat) {
                    chat.lastMessage = message;
                } else {
                    socket.socket.emit('request-new-chat', message.fromId)
                }
                if (context.currentChat?.id === message.chatId) {
                    console.log('active-change');
                    const newHistory = context.currentMessageArray.slice(0);
                    newHistory.push(message);
                    context.changeMessageArray!(newHistory);
                }
            }
        })
        socket.socket.on('server-history', (messageHistory: MessageHistoryResponse) => {
            if (messageHistory.success && context.currentChat && context.currentChat.id === messageHistory.messageHistory?.chatId) {
                const newCurrentChat = context.currentChat;
                newCurrentChat.messages = messageHistory.messageHistory.messages;
                if (context.currentChatSetter) {
                    context.currentChatSetter(newCurrentChat);
                }
                console.log('messages', context.currentChat.messages)
            } else if (!messageHistory.success) {
                console.log(messageHistory.errorMessage)
            }
        })
    }
}