'use server'
import React from 'react';
import { getChatList } from '@/app/lib/actions/message';
import { getIncomingInviteList, getOutgoingInviteList } from '@/app/lib/actions/friendInvites';
import { Invite } from '@/app/lib/types';
import DataSetter from './data-setter';

export default async function DataGetter({
    children
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const constructDataSetter = async() => {
      const chatArray = await getChatList();
      const outgoingInviteArray:Invite[] = await getOutgoingInviteList();
      const incomingInviteArray:Invite[] = await getIncomingInviteList();
      const serverData = {
          chatArray: chatArray,
          outgoingInviteArray: outgoingInviteArray,
          incomingInviteArray: incomingInviteArray,
      }
      return (
          <DataSetter serverData={serverData}>
              {children}
          </DataSetter>
      );
    }
    return (
      <>
          {await constructDataSetter()}
      </>
  )
}