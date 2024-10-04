'use client'
import React, { useContext, useEffect } from "react";
import { ChatContext, ChatContextObject } from "@/app/contexts/chatContext";
import InviteDeleteForm from "./inviteForm";
import { observer } from "mobx-react-lite";
import { Invite } from "@/app/lib/types";

function OutgoingInviteList({inviteList}: {
    inviteList: Invite[]
}) {
    const chatContext = useContext(ChatContext) as ChatContextObject;
    useEffect(() => {
        chatContext.setOutgoingInviteArray(inviteList)
    }, [inviteList])
    const inviteArray = chatContext.outgoingInviteArray;
    return (
        <>
            <h2>Исходящие приглашения:</h2>
            <ul>
                {inviteArray.map((invite) => {
                    return (
                        <li key={invite.id}>
                            <InviteDeleteForm invite={invite} />
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

export default observer(OutgoingInviteList)