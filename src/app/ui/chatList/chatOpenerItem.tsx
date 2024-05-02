import React, {useState} from "react";
import {Chat} from "@/app/lib/types";

interface ChatOpenerItemProps {
    updateCurrentChat: (value: (((prevState: (Chat | null)) => (Chat | null)) | Chat | null)) => void;
    chat: Chat;
    current: boolean;
}

export default function ChatOpenerItem({updateCurrentChat, chat, current}:ChatOpenerItemProps) {
    const [persistentName, changeName] = useState('default');
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
            {current? <p>текущий</p>:null}
            <h3>{createName()}</h3>
            <button onClick={() => updateCurrentChat(chat)}>Переключить чат</button>
        </div>
    )
}