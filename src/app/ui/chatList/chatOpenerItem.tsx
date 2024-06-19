'use client'
import React, {useContext, useEffect, useState} from "react";
import {Chat, Message} from "@/app/lib/types";
import {ChatContext, ChatContextObject} from "@/app/contexts/chatContext";
import {UserContext} from "@/app/contexts/userContext";
import {observer} from "mobx-react-lite";

interface ChatOpenerItemProps {
    chat: Chat;
}

function ChatOpenerItem({chat}:ChatOpenerItemProps) {
    const [persistentName, changeName] = useState('default');
    const chatContext = useContext(ChatContext) as ChatContextObject
    const user = useContext(UserContext)

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
                            <p>От: {message.fromId === user.user?.id ? 'Вы' : chat.membersAdapters.find((member) => member.user.id === message!.fromId).user.name}</p>
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
        <div style={chat.unread? {backgroundColor:"grey"}: undefined}>
            {chatContext.currentChat?.id === chat.id? <p>текущий</p>:null}
            <h3>{persistentName}</h3>
            {chat.unread? <p>Непрочитанных сообщений: {chat.unread}</p>: null}
            {returnLastMessage()}
            <button onClick={() => chatContext.currentChat!==chat ? chatContext.setCurrentChat(chat) : null}>Переключить чат</button>
        </div>
    )
}

export default observer(ChatOpenerItem)