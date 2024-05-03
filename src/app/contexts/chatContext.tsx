import {createContext, Dispatch, SetStateAction, useState} from "react";
import React from "react";
import {Chat} from "@/app/lib/types";

interface chatContextInterface {
    currentChat: Chat | null;
    currentChatSetter: Dispatch<SetStateAction<Chat | null>> | null
}

const initialState = {
    currentChat: null,
    currentChatSetter: null
}

export const ChatContext = createContext<chatContextInterface>(initialState)


const ChatContextContainer = ({ children }: React.PropsWithChildren) => {
    const [currentChat, updateCurrentChat] = useState<Chat | null>(null)

    return (
        <ChatContext.Provider value={{
            currentChat: currentChat,
            currentChatSetter: updateCurrentChat,
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export {ChatContextContainer}
