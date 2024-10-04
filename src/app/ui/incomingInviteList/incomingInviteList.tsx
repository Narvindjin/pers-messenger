'use client'
import React, { useContext, useEffect } from "react";
import InviteAcceptForm from "./inviteForm";
import { ChatContext, ChatContextObject } from "@/app/contexts/chatContext";
import { observer } from "mobx-react-lite";
import { Invite } from "@/app/lib/types";

function IncomingInviteList({inviteList}: {
    inviteList: Invite[]
}) {
    const chatContext = useContext(ChatContext) as ChatContextObject;
    useEffect(() => {
        chatContext.setIncomingInviteArray(inviteList)
    }, [inviteList])
    const inviteArray = chatContext.incomingInviteArray;
    return (
        <>
            <h2>Входящие приглашения:</h2>
            <ul>
                {inviteArray.map((invite) => {
                    return (
                        <li key={invite.id}>
                            <InviteAcceptForm invite={invite} />
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

export default observer(IncomingInviteList)