import { SocketProvider } from "../providers/socketProvider";
import React from "react";
import ChatLinkList from "@/app/ui/chatLinkList/chatLinkList";
import {ChatContextContainer} from "@/app/contexts/chatContext";
import DataGetter from "../data-getters/profile/data-getter";

type PageObject = {
    id: number;
    name: string;
    url: string;
}

export default async function ProfileLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
      <SocketProvider>
          <ChatContextContainer>
            <DataGetter>
                <div>
                    <ChatLinkList/>
                    {children}
                </div>
              </DataGetter>
          </ChatContextContainer>
      </SocketProvider>
  );
}

export type {PageObject}