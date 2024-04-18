import React from 'react';
import StyledContainer from "@/app/utils/container";
import {PageObject} from "@/app/profile/layout";
import FriendRequestForm from '@/app/ui/friendRequest/friendRequest';

const managingPage:PageObject = {
    id: 0,
    name: 'Друзья и ботики',
    url: '/profile/manage',
}

export default async function ManagePage() {
  return (
    <StyledContainer>
        <div>
            <h1>Друзья</h1>
            <FriendRequestForm/>
            <h2>Добавить друга</h2>
        </div>
    </StyledContainer>
  );
}

export {managingPage}