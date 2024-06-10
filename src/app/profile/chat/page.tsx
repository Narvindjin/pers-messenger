import React from 'react';
import {PageObject} from "@/app/profile/layout";
import StyledContainer from "@/app/utils/container";
import ChatWrapper from "@/app/profile/chat/chatWrapper";
import ChatListWrapper from "@/app/ui/chatList/chatListWrapper";


export default async function ChatPage() {
    return (
        <StyledContainer>
            <ChatWrapper>
                <ChatListWrapper/>
            </ChatWrapper>
        </StyledContainer>
    );
}