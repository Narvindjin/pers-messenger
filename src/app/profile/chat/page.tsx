import React from 'react';
import StyledContainer from "@/app/utils/container";
import { getChatList } from '@/app/lib/actions/message';
import ChatController from './chatController';


export default async function ChatPage() {
    const chatList = await getChatList();
    return (
        <StyledContainer>
                <ChatController chatList={chatList}></ChatController>
        </StyledContainer>
    );
}