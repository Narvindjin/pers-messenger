'use client'
import React from 'react';
import StyledContainer from "@/app/utils/container";
import Link from "next/link";


export default function Home() {
  return (
    <StyledContainer>
      это мой учбеный проект, он крутой (в будущем)
        <Link href={"/auth/signin"}>Войти</Link>
    </StyledContainer>
  );
}
