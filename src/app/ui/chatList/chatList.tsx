'use client'
import ChatOpenerItem from "@/app/ui/chatList/chatOpenerItem";
import React, {useContext, useEffect} from "react";
import {Chat} from "@/app/lib/types";
import {ChatContext, ChatContextObject} from "@/app/contexts/chatContext";
import {initChatSocketListeners} from "@/app/listeners/chatSocketListeners";
import {useSocket} from "@/app/providers/socketProvider";
import {UserContext} from "@/app/contexts/userContext";
import {observer} from "mobx-react-lite";

interface ChatArrayObject {
    chatArray: Chat[];
}

function ChatList({chatArray}: ChatArrayObject) {
    const socket = useSocket();
    const chatContext = useContext(ChatContext) as ChatContextObject
    const userContext = useContext(UserContext)
    useEffect(() => {
        chatContext?.updateChatList(chatArray)
    }, [chatArray]);
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

export default observer(ChatList)