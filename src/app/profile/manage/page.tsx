import React from 'react';
import StyledContainer from "@/app/utils/container";
import { Bot, Friend, Invite } from '@/app/lib/types';
import StructureController from './structureController';
import { User } from 'next-auth';
import { getManagingSession } from '@/app/lib/actions';

export interface ManagingSession {
    user: User;
    outgoingInviteList: Invite[];
    incomingInviteList: Invite[];
    unfriendedBotsList: Bot[];
    friendList: Friend[] | null;
}

export default async function ManagePage() {
    const managingSession = await getManagingSession();
  return (
    <StyledContainer>
        {managingSession?
        <StructureController managingSession={managingSession}></StructureController>:
        'Произошла ошибка аутентификации'
    }   
    </StyledContainer>
  );
}