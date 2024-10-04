import React from 'react';
import {auth} from "@/auth"
import UserWrapperClient from "@/app/blocks/userWrapper/userWrapperClient";

export default async function UserWrapper({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    const session = await auth();
    const user = session?.user;
    if (user) {
        return (
            <UserWrapperClient user={user}>{children}</UserWrapperClient>
        );
    } else {
        return (
            <>{children}</>
        )
    }
}