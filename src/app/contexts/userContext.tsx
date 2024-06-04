'use client'
import {createContext, ReactNode, useState} from "react";
import React from "react";
import {User} from "next-auth";

export interface userInterface {
    user: User | null;
}

const initialState = {
    user: null,
}

export const UserContext = createContext<userInterface>(initialState)

interface Props {
    initialUser: User,
    children: ReactNode,
}

const UserContextContainer = ({ children, initialUser }: Props) => {
    const [user, updateUser] = useState<User | null>(initialUser)

    return (
        <UserContext.Provider value={{
            user: user,
        }}>
            {children}
        </UserContext.Provider>
    )
}

export {UserContextContainer}