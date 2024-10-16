import React from 'react';
import StyledContainer from "@/app/utils/container";
import { Bot, Friend } from '@/app/lib/types';
import StructureController from './structureController';
import { User } from 'next-auth';
import { getManagingSession } from '@/app/lib/actions';
import { ManagingData } from '@/app/data-getters/profile/data-setter';

export interface ManagingSession extends ManagingData {
  user: User;
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