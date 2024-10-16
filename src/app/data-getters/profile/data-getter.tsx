'use server'
import React from 'react';
import { getChatList } from '@/app/lib/actions/message';
import { getIncomingInviteList, getOutgoingInviteList } from '@/app/lib/actions/friendInvites';
import { Invite } from '@/app/lib/types';
import DataSetter from './data-setter';
import { getUser } from '@/app/lib/actions';

export default async function DataGetter({
    children
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const constructDataSetter = async() => {
      const chatArray = await getChatList();
      const user = await getUser()
      let outgoingInviteArray:Invite[] = [];
      let incomingInviteArray:Invite[] = [];
      if (user) {
        outgoingInviteArray = await getOutgoingInviteList(user);
        incomingInviteArray = await getIncomingInviteList(user);
      }
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