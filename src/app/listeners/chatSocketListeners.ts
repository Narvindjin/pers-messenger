import {ChatContextObject} from "@/app/contexts/chatContext";
import {SocketContextType} from "@/app/providers/socketProvider";
import {Message, MessageHistoryResponse, TypingInterface} from "@/app/lib/types";
import {UserInterface} from "@/app/contexts/userContext";

export function initChatSocketListeners(context: ChatContextObject, socket: SocketContextType, userContext: UserInterface) {
    if (socket.socket) {
        socket.socket.removeAllListeners();
        socket.socket.on('server-message', (message: Message) => {
            context.addMessage(message)
        });
        socket.socket.on('server-typing', (typingObject: TypingInterface) => {
            if (typingObject.userId !== userContext.user?.id) {
                context.checkAndChangeWritingArray(typingObject, true)
            }
        });
        socket.socket.on('server-stopped-typing', (typingObject: TypingInterface) => {
            if (typingObject.userId !== userContext.user?.id) {
                context.checkAndChangeWritingArray(typingObject, false)
            }
        });
        socket.socket.on('server-history', (messageHistory: MessageHistoryResponse) => {
            context.handleNewMessageHistory(messageHistory)
        });
        socket.socket.on('incoming-invite', (fromId: string) => {
            if (!context.inviteIdArray.find(inviteId => inviteId === fromId)) {
                context.inviteIdArray.push(fromId);
            }
        })
        socket.socket.on('remove-incoming-invite', (fromId: string) => {
            const index = context.inviteIdArray.findIndex(inviteId => inviteId === fromId)
            if (index) {
                context.inviteIdArray.splice(index, 1);
            }
        })
    }
}