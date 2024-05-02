import React, {useEffect} from 'react';
import {getChatList} from "@/app/lib/actions/message";
import ChatOpenerItem from "@/app/ui/chatList/chatOpenerItem";
import {Chat} from "@/app/lib/types";

export type ChatFriendListProps = {
    updateCurrentChat: (value: (((prevState: (Chat | null)) => (Chat | null)) | Chat | null)) => void
    currentChat: Chat | null;
}

export default function ChatList({updateCurrentChat, currentChat}:ChatFriendListProps) {
    useEffect(() => {
        /*сделать чат контекстом???*/
    }, [])
    const constructFriendList = async () => {
        const chatArray = await getChatList();
        if (chatArray) {
            return (
                <ul>
                    {chatArray.map((chat) => {
                        return (
                            <li key={chat.id}>
                                <ChatOpenerItem current={!!(currentChat && currentChat.id === chat.id)} chat={chat} updateCurrentChat={updateCurrentChat}/>
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
            {await constructFriendList()}
        </>
    )
}