'use server'
import React from 'react';
import StyledContainer from "@/app/utils/container";
import {StyledHeader, StyledList, StyledItem} from "@/app/blocks/header/style";
import Link from "next/link";
import { auth } from "@/auth"

export default async function Header() {
    const authenticated = await auth();
  return (
    <StyledHeader>
        <StyledContainer>
            <StyledList>
                <StyledItem>
                    <Link href={"/"}>Главная</Link>
                </StyledItem>
                {authenticated?
                <StyledItem>
                        <Link href={"/profile"}>В профиль</Link>
                </StyledItem>: ''}
                <StyledItem>
                    {authenticated? <Link href={"/api/auth/signout"}>Выйти из профиля</Link>: <Link href={"/signin"}>Аутентификация</Link>}
                </StyledItem>
                <StyledItem>
                    <Link href={"/api/auth/signin"}>В апи аутентификации</Link>
                </StyledItem>
            </StyledList>
        </StyledContainer>
    </StyledHeader>
  );
}