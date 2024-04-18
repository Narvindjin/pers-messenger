import React from 'react';
import {PageObject} from "@/app/profile/layout";
import Chat from '@/app/ui/chat/chat';

const chattingPageObject:PageObject = {
    id: 0,
    name: 'Чаты',
    url: '/profile/chat',
}


export default function ChatPage() {
    return (
        <Chat/>
    );
}

export {chattingPageObject};