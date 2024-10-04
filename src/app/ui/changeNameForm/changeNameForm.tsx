'use client'

import {useFormStatus, useFormState} from 'react-dom';
import {changeName} from "@/app/lib/actions/friendList";
import {useContext, useEffect} from "react";
import {UserContext} from "@/app/contexts/userContext";
import {observer} from "mobx-react-lite";
import React from 'react'
import { useSession } from "next-auth/react"

function ChangeNameForm() {
    const { update } = useSession()
    const [error, formAction] = useFormState(changeName, null);
    const userContext = useContext(UserContext)

    useEffect(() => {
        if (error?.refresh && error.success) {
            console.log('change name')
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
                <div>
                    <label htmlFor={'name'}>Введите новый никнейм:</label>
                </div>
                <input name={'name'} id={'name'} placeholder={userContext.user?.name? userContext.user?.name: undefined} required type={"text"}/>
                <ChangeNameButton/>
                <div>
                    {!error?.success && error?.errorMessage && (
                        <p>{error.errorMessage}</p>
                    )}
                </div>
            </div>
        </form>
    );
}

function ChangeNameButton() {
    const {pending} = useFormStatus();

    return (
        <button type={"submit"} aria-disabled={pending}>
            Сменить никнейм
        </button>
    );
}

export default observer(ChangeNameForm)