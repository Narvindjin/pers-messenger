'use client'
import React, {useContext, useEffect, useState} from "react";
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
        for (const member of chat.membersAdapters) {
            console.log(member)
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
            <button onClick={() => chatContext.currentChatSetter ? chatContext.currentChatSetter(chat) : null}>Переключить чат</button>
        </div>
    )
}