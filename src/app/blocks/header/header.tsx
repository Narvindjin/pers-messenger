'use client'
import React, {useContext} from 'react';
import StyledContainer from "@/app/utils/container";
import {StyledHeader, StyledList, StyledItem} from "@/app/blocks/header/style";
import Link from "next/link";
import LeaveProfileButton from "@/app/ui/leaveProfileButton/leaveProfileButton";
import {UserContext} from "@/app/contexts/userContext";

export default function Header() {
    const userObject = useContext(UserContext)
  return (
    <StyledHeader>
        <StyledContainer>
            <StyledList>
                <StyledItem>
                    <Link href={"/"}>Главная</Link>
                </StyledItem>
                {userObject.user?
                <StyledItem>
                        <Link href={"/profile"}>В профиль {userObject.user.name}</Link>
                </StyledItem>: ''}
                <StyledItem>
                    {userObject.user? <LeaveProfileButton>Выйти из профиля</LeaveProfileButton>: <Link href={"/signin"}>Аутентификация</Link>}
                </StyledItem>
                <StyledItem>
                    <Link href={"/api/auth/signin"}>В апи аутентификации</Link>
                </StyledItem>
            </StyledList>
        </StyledContainer>
    </StyledHeader>
  );
}