import type { Metadata } from "next";
import StyledComponentsRegistry from "@/lib/registry";
import {StyledWrapper} from "@/app/style";
import Header from "@/app/blocks/header/header";

export const metadata: Metadata = {
  title: "Personal Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
          <html lang="en">
              <StyledComponentsRegistry>
                    <body>
                        <StyledWrapper>
                            <Header/>
                            <main>
                                {children}
                            </main>
                        </StyledWrapper>
                    </body>
              </StyledComponentsRegistry>
          </html>
  );
}
