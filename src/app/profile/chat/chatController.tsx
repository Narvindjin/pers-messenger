'use client'
import React, { useContext } from 'react';
import Chat from "@/app/ui/chat/chat";
import ChatList from '@/app/ui/chatList/chatList';
import { Chat as ChatType } from '@/app/lib/types';
import {observer} from "mobx-react-lite";
import { ChatContext, ChatContextObject } from '@/app/contexts/chatContext';
import { ChatContainerDesktop } from './style';


function ChatController(
    {
        chatList,
    }: Readonly<{
        chatList: ChatType[];
    }>) {
        const chatContext = useContext(ChatContext) as ChatContextObject;
        return (
            <ChatContainerDesktop>
                <ChatList chats={chatList}/>
                <Chat/>
            </ChatContainerDesktop>
        )
}

export default observer(ChatController)