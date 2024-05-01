'use server'
import React from 'react';
import StyledContainer from "@/app/utils/container";
import {StyledHeader, StyledList, StyledItem} from "@/app/blocks/header/style";
import Link from "next/link";
import {auth} from "@/auth"
import LeaveProfileButton from "@/app/ui/leaveProfileButton/leaveProfileButton";

export default async function Header() {
    const authenticatedUser = await auth();
  return (
    <StyledHeader>
        <StyledContainer>
            <StyledList>
                <StyledItem>
                    <Link href={"/"}>Главная</Link>
                </StyledItem>
                {authenticatedUser?
                <StyledItem>
                        <Link href={"/profile"}>В профиль {authenticatedUser.user?.name}</Link>
                </StyledItem>: ''}
                <StyledItem>
                    {authenticatedUser? <LeaveProfileButton>Выйти из профиля</LeaveProfileButton>: <Link href={"/signin"}>Аутентификация</Link>}
                </StyledItem>
                <StyledItem>
                    <Link href={"/api/auth/signin"}>В апи аутентификации</Link>
                </StyledItem>
            </StyledList>
        </StyledContainer>
    </StyledHeader>
  );
}