'use client'
import React, { useContext, useEffect } from 'react';
import { ChatContext, ChatContextObject } from '@/app/contexts/chatContext';
import { Chat, Invite } from '@/app/lib/types';
import { observer } from 'mobx-react-lite';

interface ServerData {
    chatArray: Chat[],
    outgoingInviteArray:Invite[],
    incomingInviteArray:Invite[],
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
      if (serverData.incomingInviteArray) {
        chatContext.setIncomingInviteArray(serverData.incomingInviteArray)
      }
      if (serverData.outgoingInviteArray) {
        chatContext.setOutgoingInviteArray(serverData.outgoingInviteArray)
      }
    }, [serverData.chatArray, serverData.incomingInviteArray, serverData.outgoingInviteArray])
    return (
        <>
        {children}
        </>  
    );
}

export default observer(DataSetter)