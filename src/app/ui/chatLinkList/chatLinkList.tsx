'use client'
import React, {useContext} from "react";
import {useSocket} from "@/app/providers/socketProvider";
import Link from "next/link";
import {managingPage} from "@/app/profile/manage/page";
import {chattingPage} from "@/app/profile/chat/page";
import {ProfileOuterContext} from "@/app/contexts/profileOuterContext";

export default function ChatLinkList() {
    const socket = useSocket();
    const outerContext = useContext(ProfileOuterContext)

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