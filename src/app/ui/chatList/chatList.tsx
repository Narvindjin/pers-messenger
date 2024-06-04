'use client'
import ChatOpenerItem from "@/app/ui/chatList/chatOpenerItem";
import React, {useContext, useEffect} from "react";
import {Chat} from "@/app/lib/types";
import {ChatContext} from "@/app/contexts/chatContext";
import {initChatSocketListeners} from "@/app/ui/chatList/chatSocketListeners";
import {useSocket} from "@/app/providers/socketProvider";

interface ChatArrayObject {
    chatArray: Chat[];
}

export default function ChatList({chatArray}: ChatArrayObject) {
    const socket = useSocket();
    const chatContext = useContext(ChatContext)
    useEffect(() => {
        if (chatContext.chatListSetter) {
            chatContext.chatListSetter(chatArray);
        }
    }, [chatContext.chatListSetter, chatArray]);
    useEffect(() => {
        initChatSocketListeners(chatContext, socket);
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