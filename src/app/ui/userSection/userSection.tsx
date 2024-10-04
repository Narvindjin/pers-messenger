'use client'
import React from "react";
import {observer} from "mobx-react-lite";
import Image from 'next/image';
import { User } from "next-auth";
import AvatarUploadForm from "../avatarUploadForm/avatarUploadForm";
import ChangeNameForm from "../changeNameForm/changeNameForm";


function UserSection({user}:Readonly<{
    user: User;
  }>) {
        return (
            <>
            <p>Мой аватар:</p>
                {user.image ?
                <>
                    <Image src={user.image} width={100} height={100} alt={`Аватарка ${user.name}`}/>
                </>: null
            }
            <AvatarUploadForm/>
            <p>Мой ID: <span>{user.id}</span></p>
            <div>
                <ChangeNameForm/>
            </div>
            </>
        )
}

export default observer(UserSection)