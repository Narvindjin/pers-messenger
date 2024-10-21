'use client'
import React, { useContext } from "react";
import { ChatContext, ChatContextObject } from "@/app/contexts/chatContext";
import InviteDeleteForm from "./inviteForm";
import { observer } from "mobx-react-lite";
import { InviteList } from "../incomingInviteList/style";

function OutgoingInviteList() {
    const chatContext = useContext(ChatContext) as ChatContextObject;
    const inviteArray = chatContext.outgoingInviteArray;
    return (
        <>
            <h2>Исходящие приглашения:</h2>
            <InviteList>
                {inviteArray.map((invite) => {
                    return (
                        <li key={invite.id}>
                            <InviteDeleteForm invite={invite} />
                        </li>
                    )
                })}
            </InviteList>
        </>
    )
}

export default observer(OutgoingInviteList)