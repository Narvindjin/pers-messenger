'use client'
import React, { useContext, useEffect } from 'react';
import { ChatContext, ChatContextObject } from '@/app/contexts/chatContext';
import { Chat, Invite } from '@/app/lib/types';
import { observer } from 'mobx-react-lite';

interface ServerData extends ManagingData {
    chatArray: Chat[]
}

export interface ManagingData {
  outgoingInviteArray: Invite[];
  incomingInviteArray: Invite[];
}

export const setData = (chatContext: ChatContextObject, session: ManagingData) => {
  chatContext.setIncomingInviteArray(session.incomingInviteArray)
  chatContext.setOutgoingInviteArray(session.outgoingInviteArray)
}

function DataSetter({
    children,
    serverData
  }: Readonly<{
    children: React.ReactNode;
    serverData: ServerData
  }>) {
    const chatContext = useContext(ChatContext) as ChatContextObject;
    useEffect(() => {
      if (serverData.chatArray) {
        chatContext.updateChatList(serverData.chatArray)
      }
      if (serverData.incomingInviteArray || serverData.outgoingInviteArray) {
        setData(chatContext, serverData)
      }
    }, [serverData.chatArray, serverData.incomingInviteArray, serverData.outgoingInviteArray])
    return (
        <>
        {children}
        </>  
    );
}

export default observer(DataSetter)