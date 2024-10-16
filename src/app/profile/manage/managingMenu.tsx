/* eslint-disable react/prop-types */
'use client'
import React, { useState } from 'react';
import {observer} from "mobx-react-lite";
import UserSection from '@/app/ui/userSection/userSection';
import FriendSection from '@/app/ui/friendSection/friendSection';
import InviteSection from '@/app/ui/inviteSection/inviteSection';
import { ManagingSession } from './page';

type Section = null | 'user' | 'friend' | 'invite'
interface ButtonProps {
    section: Section,
    children: React.ReactNode
}


function ManagingMenu(
    {
        managingSession
    }: Readonly<{
        managingSession: ManagingSession
    }>) {
        const [currentSection, setCurrentSection] = useState(null as Section)
        const clickHandler = (section: Section) => {
            setCurrentSection(section)
        }
        const ButtonWrapper = ({section, children}: ButtonProps) => {
            return (
                <button type='button' onClick={() => clickHandler(section)}>{children}</button>
            )
        }
        const ButtonList = () => {
            return (
                <ul>
                    <li>
                        <ButtonWrapper section={'user'}>Профиль</ButtonWrapper>
                    </li>
                    <li>
                        <ButtonWrapper section={'friend'}>Друзья</ButtonWrapper>
                    </li>
                    <li>
                        <ButtonWrapper section={'invite'}>Приглашения</ButtonWrapper>
                    </li>
                </ul>
            )
        }
        const ReturnSection = () => {
            switch(currentSection) {
                case null: return <ButtonList/>
                case 'user': return <UserSection user={managingSession.user}/>
                case 'friend': return <FriendSection friendArray={managingSession.friendList} botArray={managingSession.unfriendedBotsList}/>
                case 'invite' : return <InviteSection/>
                default: return <ButtonList/>
            }
        }
        return (
            <ReturnSection></ReturnSection>
        )
}

export default observer(ManagingMenu)