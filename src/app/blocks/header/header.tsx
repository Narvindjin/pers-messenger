'use client'
import React from 'react';
import StyledContainer from "@/app/utils/container";
import {StyledHeader} from "@/app/blocks/header/style";
import Link from "next/link";

export default function Header() {
  return (
    <StyledHeader>
        <StyledContainer>
            <Link href={"/"}>Главная</Link>
            <Link href={"/auth/signin"}>Аутентификация</Link>
            <Link href={"/profile/managingPage"}>В профиль</Link>
        </StyledContainer>
    </StyledHeader>
  );
}