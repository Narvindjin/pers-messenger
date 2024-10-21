'use client'

import {useFormStatus, useFormState} from 'react-dom';
import {changeName} from "@/app/lib/actions/friendList";
import {useContext, useEffect} from "react";
import {UserContext} from "@/app/contexts/userContext";
import {observer} from "mobx-react-lite";
import React from 'react'
import { useSession } from "next-auth/react"
import { TextBlock } from '../components/textBlock/textBlock';
import { CustomChangeNameButton, CustomLabel } from './style';
import { CustomInput } from '../components/input/input';
import { ErrorText } from '../incomingInviteList/style';

function ChangeNameForm() {
    const { update } = useSession()
    const [error, formAction] = useFormState(changeName, null);
    const userContext = useContext(UserContext)

    useEffect(() => {
        if (error?.refresh && error.success) {
            const refreshAndUpdate = async () => {
                error.refresh = false;
                await update(userContext.user?.id);
                window.location.reload();
            }
            refreshAndUpdate();
        }
    }, [error])

    return (
        <form action={formAction as unknown as string}>
            <div>
                <TextBlock>Ваш текущий никнейм: <b>{userContext.user?.name}</b></TextBlock>
                <div>
                    <CustomLabel htmlFor={'name'}>Введите новый никнейм:</CustomLabel>
                </div>
                <CustomInput name={'name'} id={'name'} placeholder={userContext.user?.name? userContext.user?.name: undefined} required type={"text"}/>
                <ChangeNameButton/>
                    {!error?.success && error?.errorMessage && (
                        <ErrorText>{error.errorMessage}</ErrorText>
                    )}
            </div>
        </form>
    );
}

function ChangeNameButton() {
    const {pending} = useFormStatus();

    return (
        <CustomChangeNameButton type={"submit"} aria-disabled={pending}>
            Сменить никнейм
        </CustomChangeNameButton>
    );
}

export default observer(ChangeNameForm)