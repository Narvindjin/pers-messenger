'use client'
import React, {useContext, useEffect, useState} from "react";
import {Chat, Message} from "@/app/lib/types";
import {useFormState, useFormStatus} from 'react-dom';
import {ChatContext, ChatContextObject} from "@/app/contexts/chatContext";
import {UserContext} from "@/app/contexts/userContext";
import {observer} from "mobx-react-lite";
import { messageHistoryHandler } from "@/app/lib/actions/message";
import { useSocket } from "@/app/providers/socketProvider";

interface ChatOpenerItemProps {
    chat: Chat;
}

function ChatOpenerItem({chat}:ChatOpenerItemProps) {
    const socket = useSocket();
    const [persistentName, changeName] = useState('default');
    const chatContext = useContext(ChatContext) as ChatContextObject
    const [result, formAction] = useFormState(messageHistoryHandler, null);
    const user = useContext(UserContext)
    const {pending} = useFormStatus();

    useEffect(() => {
        if (result && result.success) {
            if (chatContext.currentChat) {
                socket.socket.volatile.emit('stop-typing', chatContext.currentChat.id);
            }
            chatContext.setCurrentChat(chat)
            socket.socket.emit('clear-unread', chat.id)
            chatContext.handleNewMessageHistory(result)
        } else if (!result?.success && result !== null) {
            console.log(result)
        }
    }, [result])

    const returnLastMessage = () => {
        let message: null | Message = null;
        if (chat.messages && chat.messages.length > 0) {
            message = chat.messages[chat.messages.length - 1];
        } else if (chat.lastMessage) {
            message = chat.lastMessage;
        }
        return (
            chat.writingArray? <p>{chat.writingArray[0].name} печатает...</p>:
                message?
                <div>
                            <p>Последнее сообщение:</p>
                            <p>От: {message.fromId === user.user?.id ? 'Вы' : chat.membersAdapters.find((member) => member.user.id === message!.fromId)!.user.name}</p>
                            <p>{message.content}</p>
                        </div>:
                    <div></div>
        )
    }

    const createName = () => {
        let name = '';
        for (const member of chat.membersAdapters) {
            if (member.user.name) {
                name = name + member.user.name
            } else {
                name = name + member.user.email
            }
        }
        changeName(name);
    }
    useEffect(() => {
        createName();
    }, [chat])
    return (
        <form action={formAction as unknown as string} style={chat.unread? {backgroundColor:"grey"}: undefined}>
            {chatContext.currentChat?.id === chat.id? <p>текущий</p>:null}
            <h3>{persistentName}</h3>
            <input type="hidden" name="chatId" value={chat.id}></input>
            {chat.unread? <p>Непрочитанных сообщений: {chat.unread}</p>: null}
            {returnLastMessage()}
            <button type={"submit"} aria-disabled={pending || chatContext.currentChat?.id === chat.id}>
                Переключить чат
            </button>
        </form>
    )
}

export default observer(ChatOpenerItem)