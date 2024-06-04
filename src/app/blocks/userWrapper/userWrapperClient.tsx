'use client'
import React from 'react';
import {UserContextContainer} from "@/app/contexts/userContext";
import {User} from "next-auth";

export default function UserWrapperClient({
    children, user
}: Readonly<{
    children: React.ReactNode
    user: User
}>) {
    return (
        <UserContextContainer children={children} initialUser={user}/>
    );
}