'use client'
import React, { useContext } from 'react';
import Chat from "@/app/ui/chat/chat";
import ChatList from '@/app/ui/chatList/chatList';
import { Chat as ChatType } from '@/app/lib/types';
import {observer} from "mobx-react-lite";
import { ChatContext, ChatContextObject } from '@/app/contexts/chatContext';


function ChatController(
    {
        chatList,
    }: Readonly<{
        chatList: ChatType[];
    }>) {
        const chatContext = useContext(ChatContext) as ChatContextObject;
        return (
            <>
            {chatContext.currentChat? 
                <Chat/>:
                <ChatList chats={chatList}/>
            }   
            </>
        )
}

export default observer(ChatController)