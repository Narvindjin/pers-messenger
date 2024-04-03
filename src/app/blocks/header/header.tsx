'use client'
import React from 'react';
import StyledContainer from "@/app/utils/container";
import {StyledHeader, StyledList, StyledItem} from "@/app/blocks/header/style";
import Link from "next/link";

export default function Header() {
  return (
    <StyledHeader>
        <StyledContainer>
            <StyledList>
                <StyledItem>
                    <Link href={"/"}>Главная</Link>
                </StyledItem>
                <StyledItem>
                    <Link href={"/signin"}>Аутентификация</Link>
                </StyledItem>
                <StyledItem>
                    <Link href={"/profile"}>В профиль</Link>
                </StyledItem>
            </StyledList>
        </StyledContainer>
    </StyledHeader>
  );
}