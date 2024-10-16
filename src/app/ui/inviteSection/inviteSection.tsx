'use client'
import React from "react";
import {observer} from "mobx-react-lite";
import IncomingInviteList from "../incomingInviteList/incomingInviteList";
import OutgoingInviteList from "../outgoingInviteList/outgoingInviteList";
import FriendRequestForm from "../friendRequest/friendRequest";
import { ManagingColumn } from "../components/managingColumn/managingColumn";


function InviteSection() {
        return (
            <ManagingColumn>
                <div>
                    <h1>Добавить друга</h1>
                    <FriendRequestForm/>
                </div>
                <div>
                    <IncomingInviteList/>
                </div>
                <div>
                    <OutgoingInviteList/>
                </div>
            </ManagingColumn>
        )
}

export default observer(InviteSection)