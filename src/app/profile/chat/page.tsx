import React from 'react';
import StyledContainer from "@/app/utils/container";
import ChatListWrapper from "@/app/ui/chatList/chatListWrapper";
import Chat from "@/app/ui/chat/chat";


export default async function ChatPage() {
    return (
        <StyledContainer>
                <ChatListWrapper/>
                <Chat></Chat>
        </StyledContainer>
    );
}