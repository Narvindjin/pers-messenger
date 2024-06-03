'use server'
import React from 'react';
import {getChatList} from "@/app/lib/actions/message";
import ChatList from "@/app/ui/chatList/chatList";

export default async function ChatListWrapper() {
    const constructChatList = async () => {
        const chatArray = await getChatList();
        if (chatArray) {
            return (
                <ChatList chatArray={chatArray}/>
            )
        }
        return null
    }
    return (
        <>
            {await constructChatList()}
        </>
    )
}