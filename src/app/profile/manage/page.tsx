import React from 'react';
import StyledContainer from "@/app/utils/container";
import {PageObject} from "@/app/profile/layout";
import FriendRequestForm from '@/app/ui/friendRequest/friendRequest';
import {auth} from "@/auth";
import FriendList from "@/app/ui/friendList/friendList";

const managingPage:PageObject = {
    id: 0,
    name: 'Друзья и ботики',
    url: '/profile/manage',
}

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
            <h3>Входящие инвайты</h3>

        </div>
    </StyledContainer>
  );
}

export {managingPage}