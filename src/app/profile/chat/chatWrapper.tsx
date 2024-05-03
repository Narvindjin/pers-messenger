'use client'

import React from 'react';
import Chat from '@/app/ui/chat/chat';

import {ChatContextContainer} from "@/app/contexts/chatContext";


export default function ChatWrapper({
  children,
}: {
  children: React.ReactNode
}) {
    return (
            <ChatContextContainer>
                {children}
                <Chat/>
            </ChatContextContainer>
    );
}