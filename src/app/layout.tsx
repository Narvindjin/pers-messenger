import type { Metadata } from "next";
import StyledComponentsRegistry from "@/app/lib/registry";
import {StyledWrapper} from "@/app/style";
import Header from "@/app/blocks/header/header";
import UserWrapper from "@/app/blocks/userWrapper/userWrapper";

export const metadata: Metadata = {
  title: "Personal Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children, auth
}: Readonly<{
  children: React.ReactNode;
  auth: React.ReactNode;
}>) {
  return (
          <html lang="en">
              <StyledComponentsRegistry>
                    <body id={'root'}>
                        {auth}
                        <StyledWrapper>
                            <UserWrapper>
                                <Header/>
                                <main>
                                    {children}
                                </main>
                            </UserWrapper>
                        </StyledWrapper>
                    </body>
              </StyledComponentsRegistry>
          </html>
  );
}
