import {createContext, Dispatch, SetStateAction, useState} from "react";
import React from "react";
import {Chat} from "@/app/lib/types";
import {Message} from "@/app/lib/types";
export interface chatContextInterface {
    currentChat: Chat | null;
    currentChatSetter: Dispatch<SetStateAction<Chat | null>> | null;
    changeMessageArray: Dispatch<SetStateAction<Message[]>> | null;
    currentMessageArray: Message[];
    chatList: Chat[] | null;
    chatListSetter: Dispatch<SetStateAction<Chat[] | null>> | null,
}

const initialState = {
    currentChat: null,
    currentChatSetter: null,
    chatList: null,
    chatListSetter: null,
    changeMessageArray: null,
    currentMessageArray: [],
}

export const ChatContext = createContext<chatContextInterface>(initialState)


const ChatContextContainer = ({ children }: React.PropsWithChildren) => {
    const [currentChat, updateCurrentChat] = useState<Chat | null>(null);
    const [currentMessageArray, editCurrentMessageArray] = useState<Message[]>([])
    const [chatList, updateChatList] = useState<Chat[] | null>(null);

    function changeCurrentChat(chat: Chat) {
        updateCurrentChat(chat);
        if (currentChat?.messages) {
            editCurrentMessageArray(currentChat?.messages!)
        }
    }

    return (
        <ChatContext.Provider value={{
            currentChat: currentChat,
            currentChatSetter: changeCurrentChat,
            changeMessageArray: editCurrentMessageArray,
            chatList: chatList,
            chatListSetter: updateChatList,
            currentMessageArray: currentMessageArray
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export {ChatContextContainer}
