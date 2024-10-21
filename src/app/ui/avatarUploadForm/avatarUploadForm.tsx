'use client'

import {useFormStatus, useFormState} from 'react-dom';
import {useContext, useEffect} from "react";
import {observer} from "mobx-react-lite";
import React from 'react'
import { uploadAvatarHandler } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';
import { UserContext } from '@/app/contexts/userContext';
import { CustomButton } from '../components/button/button';
import { AvatarInput } from './style';
import { CustomLabel } from '../components/label/label';
import { ErrorText } from '../incomingInviteList/style';

function ChangeNameForm() {
    const [error, formAction] = useFormState(uploadAvatarHandler, null);
    const { update } = useSession()
    const userContext = useContext(UserContext);
    useEffect(() => {
        if (error?.refresh && error.success) {
            error.refresh = false;
            const refreshAndUpdate = async () => {
                error.refresh = false;
                await update(userContext.user?.id);
                window.location.reload();
            }
            refreshAndUpdate()
        }
    }, [error])

    return (
        <form action={formAction as unknown as string}>
            <div>
                <div>
                    <CustomLabel htmlFor={'profilePicture'}>Загрузите свой аватар:</CustomLabel>
                </div>
                <AvatarInput name={'profilePicture'} id={'profilePicture'} accept="image/png, image/jpeg, image/jpg" required type={"file"} />
                <ChangeAvatarButton/>
                    {!error?.success && error?.errorMessage && (
                        <ErrorText>{error.errorMessage}</ErrorText>
                    )}
            </div>
        </form>
    );
}

function ChangeAvatarButton() {
    const {pending} = useFormStatus();

    return (
        <CustomButton type={"submit"} aria-disabled={pending}>
            Сменить аватар
        </CustomButton>
    );
}

export default observer(ChangeNameForm)