'use client'
import ChatOpenerItem from "@/app/ui/chatList/chatOpenerItem";
import React, {useContext, useEffect} from "react";
import {Chat} from "@/app/lib/types";
import {ChatContext} from "@/app/contexts/chatContext";
import {initChatSocketListeners} from "@/app/listeners/chatSocketListeners";
import {useSocket} from "@/app/providers/socketProvider";
import {UserContext} from "@/app/contexts/userContext";

interface ChatArrayObject {
    chatArray: Chat[];
}

export default function ChatList({chatArray}: ChatArrayObject) {
    const socket = useSocket();
    const chatContext = useContext(ChatContext)
    const userContext = useContext(UserContext)
    useEffect(() => {
        if (chatContext.chatListSetter) {
            chatContext.chatListSetter(chatArray);
        }
    }, [chatContext.chatListSetter, chatArray]);
    useEffect(() => {
        initChatSocketListeners(chatContext, socket, userContext);
    }, [socket, chatContext]);
        return (
            <ul>
                {chatContext.chatList?.map((chat) => {
                    return (
                        <li key={chat.id}>
                            <ChatOpenerItem chat={chat}/>
                        </li>
                    )
                })}
            </ul>
        )
}