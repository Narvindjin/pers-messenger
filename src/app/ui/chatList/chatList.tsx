'use server'
import React from 'react';
import {getChatList} from "@/app/lib/actions/message";
import ChatOpenerItem from "@/app/ui/chatList/chatOpenerItem";

export default async function ChatList() {
    const constructChatList = async () => {
        const chatArray = await getChatList();
        if (chatArray) {
            return (
                <ul>
                    {chatArray.map((chat) => {
                        return (
                            <li key={chat.id}>
                                <ChatOpenerItem chat={chat}/>
                            </li>
                        )
                    })}
                </ul>
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