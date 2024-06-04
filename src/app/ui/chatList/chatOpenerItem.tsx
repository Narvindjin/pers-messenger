'use client'
import React, {useContext, useEffect, useState} from "react";
import {Chat} from "@/app/lib/types";
import {ChatContext} from "@/app/contexts/chatContext";
import {UserContext} from "@/app/contexts/userContext";

interface ChatOpenerItemProps {
    chat: Chat;
}

export default function ChatOpenerItem({chat}:ChatOpenerItemProps) {
    const [persistentName, changeName] = useState('default');
    const chatContext = useContext(ChatContext)
    const user = useContext(UserContext)
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
        <div>
            {chatContext.currentChat?.id === chat.id? <p>текущий</p>:null}
            <h3>{persistentName}</h3>
            <p>Последнее сообщение:</p>
            <p>От: {chat.lastMessage.fromId === user.user?.id? 'Вы': chat.membersAdapters.find((member) => member.user.id === chat.lastMessage.fromId).user.name}</p>
            <p>{chat.lastMessage.content}</p>
            <button onClick={() => chatContext.currentChatSetter ? chatContext.currentChatSetter(chat) : null}>Переключить чат</button>
        </div>
    )
}