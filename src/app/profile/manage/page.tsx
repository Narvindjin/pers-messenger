import React from 'react';
import StyledContainer from "@/app/utils/container";
import {PageObject} from "@/app/profile/layout";
import FriendRequestForm from '@/app/ui/friendRequest/friendRequest';
import {auth} from "@/auth";
import FriendList from "@/app/ui/friendList/friendList";
import IncomingInviteList from '@/app/ui/incomingInviteList/incomingInviteList';
import OutgoingInviteList from '@/app/ui/outgoingInviteList/outgoingInviteList';

export default async function ManagePage() {
    const authenticatedUser = await auth();
  return (
    <StyledContainer>
        <div>
            <p>Мой ID: <span>{authenticatedUser?.user?.id}</span></p>
            <h1>Друзья</h1>
            <FriendList/>
            <h2>Добавить друга</h2>
            <FriendRequestForm/>
            <IncomingInviteList/>
            <OutgoingInviteList/>
        </div>
    </StyledContainer>
  );
}