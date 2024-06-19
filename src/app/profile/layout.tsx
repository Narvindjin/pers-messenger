import { SocketProvider } from "../providers/socketProvider";
import ChatLinkList from "@/app/ui/chatLinkList/chatLinkList";
import {ChatContextContainer} from "@/app/contexts/chatContext";

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
              <div>
                  <ChatLinkList/>
                  {children}
              </div>
          </ChatContextContainer>
      </SocketProvider>
  );
}

export type {PageObject}