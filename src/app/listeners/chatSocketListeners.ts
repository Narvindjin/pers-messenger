'use client'
import {ChatContextObject} from "@/app/contexts/chatContext";
import {SocketContextType} from "@/app/providers/socketProvider";
import {Invite, Message, MessageHistoryResponse, TypingInterface} from "@/app/lib/types";
import {UserInterface} from "@/app/contexts/userContext";
import { useRouter } from "next/navigation";


export function initChatSocketListeners(context: ChatContextObject, socket: SocketContextType, userContext: UserInterface) {
    if (socket.socket && !socket.socket.inited) {
        socket.socket.inited = true
        socket.socket.removeAllListeners();
        socket.socket.on('server-message', (message: Message) => {
            const self = message.fromId === userContext.user?.id
            const sendNotificationCheck = context.addMessage(message, self)
            if (sendNotificationCheck) {
                socket.socket.emit('clear-unread', message.chatId)
            }
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
        socket.socket.on('user-cleared-unread', (chatId: string) => {
            if (userContext.user?.id) {
                context.clearSelfUnread(chatId, userContext.user?.id)
            }
        })
        socket.socket.on('reload', () => {
            const router = useRouter();
            router.refresh();
        })
        socket.socket.on('server-history', (messageHistory: MessageHistoryResponse) => {
            context.handleNewMessageHistory(messageHistory)
        });
        socket.socket.on('client-deleted-incoming-invite', (invite: Invite) => {
            const index = context.incomingInviteArray.findIndex(contextInvite => invite.id === contextInvite.id)
            if (index > -1) {
                const newArray = Array.from(context.incomingInviteArray);
                newArray.splice(index, 1);
                context.setIncomingInviteArray(newArray)
            }
        })
        socket.socket.on('client-deleted-outgoing-invite', (invite: Invite) => {
            const index = context.outgoingInviteArray.findIndex(contextInvite => invite.id === contextInvite.id)
            if (index > -1) {
                const newArray = Array.from(context.outgoingInviteArray);
                newArray.splice(index, 1);
                context.setOutgoingInviteArray(newArray)
            }
        })
        socket.socket.on('client-created-invite', (invite: Invite) => {
            if (!context.incomingInviteArray.find(contextInvite => invite.id === contextInvite.id)) {
                const newArray = Array.from(context.incomingInviteArray);
                newArray.push(invite);
                context.setIncomingInviteArray(newArray)
            }
        })
        socket.socket.on('client-accepted-outgoing-invite', (invite: Invite) => {
            const newArray = Array.from(context.outgoingInviteArray);
            const contextInvite = newArray.find(contextInvite => invite.id === contextInvite.id)
            if (contextInvite) {
                contextInvite.accepted = true;
                context.setOutgoingInviteArray(newArray)
            }
        })
        socket.socket.on('client-accepted-incoming-invite', (invite: Invite) => {
            const newArray = Array.from(context.incomingInviteArray);
            const contextInvite = newArray.find(contextInvite => invite.id === contextInvite.id)
            if (contextInvite) {
                contextInvite.accepted = true;
                context.setIncomingInviteArray(newArray)
            }
        })
    }
}