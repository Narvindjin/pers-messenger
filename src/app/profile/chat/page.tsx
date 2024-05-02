import React, {useState} from 'react';
import {PageObject} from "@/app/profile/layout";
import Chat from '@/app/ui/chat/chat';
import StyledContainer from "@/app/utils/container";
import ChatList from "@/app/ui/chatList/chatList";

const chattingPageObject:PageObject = {
    id: 0,
    name: 'Чаты',
    url: '/profile/chat',
}


export default function ChatPage() {
    const [currentChat, updateCurrentChat] = useState<Chat | null>(null)
    return (
        <StyledContainer>
            <ChatList updateCurrentChat={updateCurrentChat} currentChat={currentChat}/>
            <Chat currentChat={currentChat}/>
        </StyledContainer>
    );
}

export {chattingPageObject};