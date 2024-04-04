'use client'
import {chattingPage} from "@/app/profile/chat/page";
import {managingPage} from "@/app/profile/manage/page";
import Link from "next/link";
import { SocketProvider } from "../providers/socketProvider";

type PageObject = {
    id: number;
    name: string;
    url: string;
}

const pageList:PageObject[] = [];

const addPage = (id: number, pageObject: PageObject) => {
    const newValue = id;
    pageObject.id = newValue;
    pageList.push(pageObject);
}

const constructPageList = () => {
    let index = 1;
    addPage(index, managingPage);
    index++
    addPage(index, chattingPage);
}

constructPageList();

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
      <SocketProvider>
        <div>
            <ul>
                {pageList.map((page) => {
                    return (
                        <li key={page.id}>
                          <Link href={page.url}>{page.name}</Link>
                        </li>
                    )
                })}
            </ul>
            {children}
        </div>
      </SocketProvider>
  );
}

export type {PageObject}