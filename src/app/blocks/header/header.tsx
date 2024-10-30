'use client'
import React, {useContext} from 'react';
import StyledContainer from "@/app/utils/container";
import {StyledHeader, StyledItem, MenuContainer, NameContainer, StyledHeaderContainer} from "@/app/blocks/header/style";
import Link from "next/link";
import LeaveProfileButton from "@/app/ui/leaveProfileButton/leaveProfileButton";
import {UserContext} from "@/app/contexts/userContext";

export default function Header() {
    const userObject = useContext(UserContext)
  return (
    <StyledHeader>
        <StyledContainer>
            <StyledHeaderContainer>
                <NameContainer>
                    <StyledItem>
                        <Link href={"/"}>Главная</Link>
                    </StyledItem>
                </NameContainer>
                <MenuContainer>
                {userObject.user?
                
                <StyledItem>
                        <Link href={"/profile"}>К чатам</Link>
                </StyledItem>: ''}
                <StyledItem>
                    {userObject.user? <LeaveProfileButton>Выйти из профиля</LeaveProfileButton>: <Link href={"/signin"}>Аутентификация</Link>}
                </StyledItem>
                </MenuContainer>
            </StyledHeaderContainer>
        </StyledContainer>
    </StyledHeader>
  );
}