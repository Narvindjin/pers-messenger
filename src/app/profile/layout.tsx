'use client'
import {chattingPage} from "@/app/profile/chat/page";
import {managingPage} from "@/app/profile/manage/page";
import Link from "next/link";

type PageObject = {
    id: number;
    name: string;
    url: string;
}

const pageList:PageObject[] = [];

const addPage = (id: number, pageObject: PageObject) => {
    pageObject.id = id;
    pageList.push(pageObject);
    id++;
}

const constructPageList = () => {
    let index = 0;
    addPage(index, managingPage);
    addPage(index, chattingPage);
}

constructPageList();

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
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
  );
}

export type {PageObject}