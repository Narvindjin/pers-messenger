'use client'
import React, {useContext} from "react";
import {useSocket} from "@/app/providers/socketProvider";
import Link from "next/link";
import {ProfileOuterContext} from "@/app/contexts/profileOuterContext";

interface PageSettings {
    id: number;
    name: string;
    url: string;
}

export default function ChatLinkList() {
    const socket = useSocket();
    const outerContext = useContext(ProfileOuterContext)
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
                <Link onClick={() => clickHandler()} style={outerContext.unansweredNotifications?{color:'red'}: undefined} href={managingPage.url}>{managingPage.name}{outerContext.unansweredNotifications? ' нового:' + outerContext.unansweredNotifications: null}</Link>
            </li>
            <li>
                <Link onClick={() => clickHandler()} style={outerContext.unreadMessages?{color:'red'}: undefined} href={chattingPage.url}>{chattingPage.name}{outerContext.unreadMessages? ' новых сообщений:' + outerContext.unreadMessages: null}</Link>
            </li>
        </ul>
    )
}