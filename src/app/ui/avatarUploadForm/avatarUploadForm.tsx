'use client'

import {useFormStatus, useFormState} from 'react-dom';
import {useContext, useEffect} from "react";
import {observer} from "mobx-react-lite";
import React from 'react'
import { uploadAvatarHandler } from '@/app/lib/actions';
import { useSession } from 'next-auth/react';
import { UserContext } from '@/app/contexts/userContext';

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
                    <label htmlFor={'profilePicture'}>Загрузите свой аватар:</label>
                </div>
                <input name={'profilePicture'} id={'profilePicture'} accept="image/png, image/jpeg, image/jpg" required type={"file"} />
                <ChangeAvatarButton/>
                <div>
                    {!error?.success && error?.errorMessage && (
                        <p>{error.errorMessage}</p>
                    )}
                </div>
            </div>
        </form>
    );
}

function ChangeAvatarButton() {
    const {pending} = useFormStatus();

    return (
        <button type={"submit"} aria-disabled={pending}>
            Сменить аватар
        </button>
    );
}

export default observer(ChangeNameForm)