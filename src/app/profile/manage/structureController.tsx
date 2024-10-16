'use client'
import React, { useContext, useEffect } from 'react';
import {observer} from "mobx-react-lite";
import { useWindowSize } from '@/app/utils/utils';
import { breakpoints } from '@/app/utils/breakpoints';
import ManagingMenu from './managingMenu';
import DesktopPage from './desktopPage';
import { ManagingSession } from './page';
import { ChatContext, ChatContextObject } from '@/app/contexts/chatContext';
import { setData } from '@/app/data-getters/profile/data-setter';


function StructureController(
    {
        managingSession
    }: Readonly<{
        managingSession: ManagingSession
    }>) {
        const windowObject = useWindowSize();
        const chatContext = useContext(ChatContext) as ChatContextObject;
        useEffect(() => {
            setData(chatContext, managingSession)
        }, [managingSession])
        return (
            <>
                {windowObject.width! < breakpoints.mobile? <ManagingMenu managingSession={managingSession}/>: <DesktopPage managingSession={managingSession}/>}
            </>
        )
}

export default observer(StructureController)