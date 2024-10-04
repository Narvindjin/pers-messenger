'use client'
import React from 'react';
import {observer} from "mobx-react-lite";
import UserSection from '@/app/ui/userSection/userSection';
import FriendSection from '@/app/ui/friendSection/friendSection';
import InviteSection from '@/app/ui/inviteSection/inviteSection';
import { ManagingSession } from './page';


function DesktopManagingPage(
    {
        managingSession
    }: Readonly<{
        managingSession: ManagingSession
    }>) {
        return (
            <>
                <UserSection user={managingSession.user}/>
                <FriendSection friendArray={managingSession.friendList} botArray={managingSession.unfriendedBotsList}/>
                <InviteSection incomingInviteList={managingSession.incomingInviteList} outgoingInviteList={managingSession.outgoingInviteList}/>
            </>
        )
}

export default observer(DesktopManagingPage)