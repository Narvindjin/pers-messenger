'use client'
import React, {useContext} from "react";
import {useSocket} from "@/app/providers/socketProvider";
import Link from "next/link";
import {ChatContext, ChatContextObject} from "@/app/contexts/chatContext";
import {observer} from "mobx-react-lite";

interface PageSettings {
    id: number;
    name: string;
    url: string;
}

function ChatLinkList() {
    const socket = useSocket();
    const chatContext = useContext(ChatContext) as ChatContextObject
    const managingPage:PageSettings = {
        id: 0,
        name: 'Друзья и ботики',
        url: '/profile/manage'
    }

    const chattingPage:PageSettings = {
        id: 1,
        name: 'Чаты',
        url: '/profile/chat'
    }

    const clickHandler = () => {
        if (socket.socket && socket.socket.connected) {
            socket.socket.emit('update-links')
        }
    }
    return (
        <ul>
            <li>
                <Link onClick={() => clickHandler()} style={chatContext.inviteIdArray.length > 0?{color:'red'}: undefined} href={managingPage.url}>{managingPage.name}{chatContext.inviteIdArray.length > 0? ' нового:' + chatContext.inviteIdArray.length: null}</Link>
            </li>
            <li>
                <Link onClick={() => clickHandler()} style={chatContext.unreadChats > 0?{color:'red'}: undefined} href={chattingPage.url}>{chattingPage.name}{chatContext.unreadChats > 0? ' новых сообщений:' + chatContext.unreadChats: null}</Link>
            </li>
        </ul>
    )
}

export default observer(ChatLinkList)