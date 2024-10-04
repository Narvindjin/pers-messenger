'use client'
import React, {useContext} from "react";
import {useSocket} from "@/app/providers/socketProvider";
import Link from "next/link";
import {ChatContext, ChatContextObject} from "@/app/contexts/chatContext";
import {observer} from "mobx-react-lite";
import { initChatSocketListeners } from "@/app/listeners/chatSocketListeners";
import { UserContext, UserInterface } from "@/app/contexts/userContext";

interface PageSettings {
    id: number;
    name: string;
    url: string;
}

function ChatLinkList() {
    const socket = useSocket();
    const chatContext = useContext(ChatContext) as ChatContextObject
    const userContext = useContext(UserContext) as UserInterface
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
    initChatSocketListeners(chatContext, socket, userContext);

    const unreadInvites = chatContext.outgoingInviteArray.length + chatContext.incomingInviteArray.length

    return (
        <ul>
            <li>
                <Link onClick={() => clickHandler()} style={chatContext.outgoingInviteArray.filter((contextInvite) => {return contextInvite.accepted === true}).length + chatContext.incomingInviteArray.length > 0?{color:'red'}: undefined} href={managingPage.url}>{managingPage.name}{chatContext.outgoingInviteArray.filter((contextInvite) => {return contextInvite.accepted === true}).length + chatContext.incomingInviteArray.length > 0? ' нового:' + unreadInvites: null}</Link>
            </li>
            <li>
                <Link onClick={() => clickHandler()} style={chatContext.unreadChats > 0?{color:'red'}: undefined} href={chattingPage.url}>{chattingPage.name}{chatContext.unreadChats > 0? ' новых сообщений:' + chatContext.unreadChats: null}</Link>
            </li>
        </ul>
    )
}

export default observer(ChatLinkList)