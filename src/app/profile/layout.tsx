import {chattingPage} from "@/app/profile/chat/page";
import {managingPage} from "@/app/profile/manage/page";
import Link from "next/link";
import { SocketProvider } from "../providers/socketProvider";
import {ProfileOuterContextContainer} from "@/app/contexts/profileOuterContext";
import ChatLinkList from "@/app/ui/chatLinkList/chatLinkList";

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
                <div>
                    <ProfileOuterContextContainer>
                        <ChatLinkList/>
                    </ProfileOuterContextContainer>
                    {children}
                </div>
      </SocketProvider>
  );
}

export type {PageObject}