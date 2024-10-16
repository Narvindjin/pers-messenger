'use client'
import React, { useContext } from "react";
import InviteAcceptForm from "./inviteForm";
import { ChatContext, ChatContextObject } from "@/app/contexts/chatContext";
import { observer } from "mobx-react-lite";
import { InviteList } from "./style";

function IncomingInviteList() {
    const chatContext = useContext(ChatContext) as ChatContextObject;
    return (
        <>
            <h2>Входящие приглашения:</h2>
            <InviteList>
                {chatContext.incomingInviteArray.map((invite) => {
                    return (
                        <li key={invite.id}>
                            <InviteAcceptForm invite={invite} />
                        </li>
                    )
                })}
            </InviteList>
        </>
    )
}

export default observer(IncomingInviteList)