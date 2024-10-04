'use client'
import React from 'react';
import {observer} from "mobx-react-lite";
import { useWindowSize } from '@/app/utils/utils';
import { breakpoints } from '@/app/utils/breakpoints';
import ManagingMenu from './managingMenu';
import DesktopPage from './desktopPage';
import { ManagingSession } from './page';


function StructureController(
    {
        managingSession
    }: Readonly<{
        managingSession: ManagingSession
    }>) {
        const windowObject = useWindowSize();
        return (
            <>
                {windowObject.width! < breakpoints.mobile? <ManagingMenu managingSession={managingSession}/>: <DesktopPage managingSession={managingSession}/>}
            </>
        )
}

export default observer(StructureController)