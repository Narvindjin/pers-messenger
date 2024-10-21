'use client'
import React from "react";
import {observer} from "mobx-react-lite";
import Image from 'next/image';
import { User } from "next-auth";
import AvatarUploadForm from "../avatarUploadForm/avatarUploadForm";
import ChangeNameForm from "../changeNameForm/changeNameForm";
import { TextBlock } from "../components/textBlock/textBlock";
import { ManagingColumn } from "../components/managingColumn/managingColumn";
import { DivWithMargin } from "./style";
import IdBlock from "../idBlock/idBlock";
import { defaultAvatarSrc } from "@/app/utils/utils";


function UserSection({user}:Readonly<{
    user: User;
  }>) {
        return (
            <ManagingColumn>
                <h1>Профиль</h1>
                <IdBlock user={user}/>
                <DivWithMargin>
                    <ChangeNameForm/>
                </DivWithMargin>
                <DivWithMargin>
                    <TextBlock>Ваш аватар:</TextBlock>
                        {user.image ?
                        <>
                            <Image src={user.image} width={150} height={150} alt={`Аватарка ${user.name}`}/>
                        </>: <Image src={defaultAvatarSrc} width={150} height={150} alt={`Аватарка ${user.name}`}/>
                    }
                </DivWithMargin>
                <AvatarUploadForm/>
            </ManagingColumn>
        )
}

export default observer(UserSection)