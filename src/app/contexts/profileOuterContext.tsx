import {createContext, Dispatch, SetStateAction, useState} from "react";
import React from "react";
export interface ProfileOuterContextInterface {
    unreadMessages: number;
    unansweredNotifications: number;
    setUnreadMessages: Dispatch<SetStateAction<number>> | null;
    setUnansweredNotifications: Dispatch<SetStateAction<number>> | null;
}

const initialState = {
    unreadMessages: 0,
    setUnreadMessages: null,
    unansweredNotifications: 0,
    setUnansweredNotifications: null,
}

export const ProfileOuterContext = createContext<ProfileOuterContextInterface>(initialState)


const ProfileOuterContextContainer = ({ children }: React.PropsWithChildren) => {
    const [unreadMessages, setUnreadMessages] = useState<number>(0);
    const [unansweredNotifications, setUnansweredNotifications] = useState<number>(0);

    return (
        <ProfileOuterContext.Provider value={{
            unreadMessages: unreadMessages,
            setUnreadMessages: setUnreadMessages,
            unansweredNotifications: unansweredNotifications,
            setUnansweredNotifications: setUnansweredNotifications,
        }}>
            {children}
        </ProfileOuterContext.Provider>
    )
}

export {ProfileOuterContextContainer}