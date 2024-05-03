'use client'
import React, {useContext, useState} from "react";
import {Chat} from "@/app/lib/types";
import {ChatContext} from "@/app/contexts/chatContext";

interface ChatOpenerItemProps {
    chat: Chat;
}

export default function ChatOpenerItem({chat}:ChatOpenerItemProps) {
    const [persistentName, changeName] = useState('default');
    const chatContext = useContext(ChatContext)
    const createName = () => {
        let name = '';
        for (const member of chat.memberAdapters) {
            name = name + member.user.name
        }
        changeName(name)
        return persistentName;
    }
    return (
        <div>
            {chatContext.currentChat?.id === chat.id? <p>текущий</p>:null}
            <h3>{createName()}</h3>
            <button onClick={() => chatContext.currentChatSetter ? chatContext.currentChatSetter(chat) : null}>Переключить чат</button>
        </div>
    )
}