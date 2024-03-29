'use client'

type PageObject = {
    id: number;
    name: string;
    url: string;
    current: boolean;
}



const pageList: = {

}
export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
      <div>
          <div>profile layout</div>
          {children}
      </div>
  );
}