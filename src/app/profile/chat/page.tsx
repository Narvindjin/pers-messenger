import React from 'react';
import {PageObject} from "@/app/profile/layout";
import StyledContainer from "@/app/utils/container";
import ChatList from "@/app/ui/chatList/chatList";
import ChatWrapper from "@/app/profile/chat/chatWrapper";

const chattingPageObject:PageObject = {
    id: 0,
    name: 'Чаты',
    url: '/profile/chat',
}


export default async function ChatPage() {
    return (
        <StyledContainer>
            <ChatWrapper>
                <ChatList/>
            </ChatWrapper>
        </StyledContainer>
    );
}

export {chattingPageObject};