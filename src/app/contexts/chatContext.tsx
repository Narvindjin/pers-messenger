import {createContext, Dispatch, SetStateAction, useState} from "react";
import React from "react";
import {Chat} from "@/app/lib/types";

export interface chatContextInterface {
    currentChat: Chat | null;
    currentChatSetter: Dispatch<SetStateAction<Chat | null>> | null
    chatList: Chat[] | null;
    chatListSetter: Dispatch<SetStateAction<Chat[] | null>> | null,
}

const initialState = {
    currentChat: null,
    currentChatSetter: null,
    chatList: null,
    chatListSetter: null,
}

export const ChatContext = createContext<chatContextInterface>(initialState)


const ChatContextContainer = ({ children }: React.PropsWithChildren) => {
    const [currentChat, updateCurrentChat] = useState<Chat | null>(null)
    const [chatList, updateChatList] = useState<Chat[] | null>(null)

    return (
        <ChatContext.Provider value={{
            currentChat: currentChat,
            currentChatSetter: updateCurrentChat,
            chatList: chatList,
            chatListSetter: updateChatList,
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export {ChatContextContainer}
