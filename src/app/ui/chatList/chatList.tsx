'use client'
import ChatOpenerItem from "@/app/ui/chatList/chatOpenerItem";
import React, {useContext, useEffect} from "react";
import {ChatContext, ChatContextObject} from "@/app/contexts/chatContext";
import {observer} from "mobx-react-lite";
import { Chat } from "@/app/lib/types";
import { ChatListContainer, CustomChatItem, CustomChatList } from "./style";


function ChatList({chats}:Readonly<{
    chats: Chat[]
  }>) {
    const chatContext = useContext(ChatContext) as ChatContextObject
    useEffect(() => {
        if (chats.length > 0 && (chats.length !== chatContext.chatList.length || chats[chats.length - 1].id !== chatContext.chatList[chatContext.chatList.length - 1].id)) {
            chatContext.updateChatList(chats)
        }
    }, chats)
        return (
            <ChatListContainer>
                {chats.length > 0?
                <CustomChatList>
                    {chatContext.chatList?.map((chat) => {
                        return (
                            <CustomChatItem key={chat.id}>
                                <ChatOpenerItem chat={chat}/>
                            </CustomChatItem>
                        )
                    })}
                </CustomChatList>:
                'Чатов нет'
                }
        </ChatListContainer>
        )
}

export default observer(ChatList)