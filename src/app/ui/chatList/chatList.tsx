'use client'
import ChatOpenerItem from "@/app/ui/chatList/chatOpenerItem";
import React, {useContext, useEffect} from "react";
import {ChatContext, ChatContextObject} from "@/app/contexts/chatContext";
import {observer} from "mobx-react-lite";
import { Chat } from "@/app/lib/types";


function ChatList({chats}:Readonly<{
    chats: Chat[]
  }>) {
    const chatContext = useContext(ChatContext) as ChatContextObject
    useEffect(() => {
        if (chats.length !== chatContext.chatList.length || chats[chats.length - 1].id !== chatContext.chatList[chatContext.chatList.length - 1].id) {
            chatContext.updateChatList(chats)
        }
    }, chats)
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