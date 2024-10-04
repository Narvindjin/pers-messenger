'use client'
import React from 'react';
import { UserContextContainer } from "@/app/contexts/userContext";
import { User } from "next-auth";

export default function UserWrapperClient({
    children, user
}: Readonly<{
    children: React.ReactNode
    user: User
}>) {
    if (user) {
        return (
            <UserContextContainer initialUser={user}>{children}</UserContextContainer>
        );
    }
    else {
        return (
            <>{children}</>
        );
    }
}