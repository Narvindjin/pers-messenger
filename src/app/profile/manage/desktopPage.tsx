'use client'
import React from 'react';
import {observer} from "mobx-react-lite";
import UserSection from '@/app/ui/userSection/userSection';
import FriendSection from '@/app/ui/friendSection/friendSection';
import InviteSection from '@/app/ui/inviteSection/inviteSection';
import { ManagingSession } from './page';
import { Column, ColumnContainer } from './style';


function DesktopManagingPage(
    {
        managingSession
    }: Readonly<{
        managingSession: ManagingSession
    }>) {
        return (
            <ColumnContainer>
                <Column>
                    <UserSection user={managingSession.user}/>
                    <InviteSection/>
                </Column>
                <Column>
                    <FriendSection friendArray={managingSession.friendList} botArray={managingSession.unfriendedBotsList}/>
                </Column>
            </ColumnContainer>
        )
}

export default observer(DesktopManagingPage)