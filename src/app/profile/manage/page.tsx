import React from 'react';
import StyledContainer from "@/app/utils/container";
import FriendRequestForm from '@/app/ui/friendRequest/friendRequest';
import {auth} from "@/auth";
import FriendList from "@/app/ui/friendList/friendList";
import IncomingInviteList from '@/app/ui/incomingInviteList/incomingInviteList';
import OutgoingInviteList from '@/app/ui/outgoingInviteList/outgoingInviteList';
import AddBotList from "@/app/ui/addBotList/addBotList";
import ChangeNameForm from "@/app/ui/changeNameForm/changeNameForm";

export default async function ManagePage() {
    const authenticatedUser = await auth();
  return (
    <StyledContainer>
        <div>
            <p>Мой ID: <span>{authenticatedUser?.user?.id}</span></p>
            <div>
                <ChangeNameForm/>
            </div>
            <div>
                <FriendList/>
            </div>
            <div>
                <h2>Добавить друга</h2>
                <FriendRequestForm/>
            </div>
            <div>
                <AddBotList/>
            </div>
            <div>
                <IncomingInviteList/>
            </div>
            <div>
                <OutgoingInviteList/>
            </div>
        </div>
    </StyledContainer>
  );
}