'use client'
import React from "react";
import {observer} from "mobx-react-lite";
import { Invite } from "@/app/lib/types";
import IncomingInviteList from "../incomingInviteList/incomingInviteList";
import OutgoingInviteList from "../outgoingInviteList/outgoingInviteList";
import FriendRequestForm from "../friendRequest/friendRequest";


function InviteSection({incomingInviteList, outgoingInviteList}:Readonly<{
    incomingInviteList: Invite[];
    outgoingInviteList: Invite[];
  }>) {
        return (
            <>
                <div>
                    <h2>Добавить друга</h2>
                    <FriendRequestForm/>
                </div>
                <div>
                    <IncomingInviteList inviteList={incomingInviteList}/>
                </div>
                <div>
                    <OutgoingInviteList inviteList={outgoingInviteList}/>
                </div>
            </>
        )
}

export default observer(InviteSection)