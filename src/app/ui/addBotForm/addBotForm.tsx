'use client'
import React from 'react';
import {useFormStatus, useFormState} from 'react-dom';
import {useRouter} from 'next/navigation';
import {Bot} from "@/app/lib/types";
import {addBotFriendHandler} from "@/app/lib/actions/friendList";
import {observer} from "mobx-react-lite";
import { ErrorText } from '../incomingInviteList/style';

interface BotProps {
    bot: Bot
}

function AddBotForm({bot}: BotProps) {
    const [error, formAction] = useFormState(addBotFriendHandler, null);
    const router = useRouter();
    if (error?.refresh && error.success) {
        error.refresh = false;
        router.refresh();
    }

    return (
        <form action={formAction as unknown as string}>
            <div>
                <div>
                    <p>Ботик: {bot.name}</p>
                </div>
                <input name={'botId'} value={bot.id} required type={"hidden"}/>
                <BefriendButton/>
                    {!error?.success && error?.errorMessage && (
                        <ErrorText>{error.errorMessage}</ErrorText>
                    )}
            </div>
        </form>
    );
}

function BefriendButton() {
    const {pending} = useFormStatus();

    return (
        <button type={"submit"} aria-disabled={pending}>
            Добавить ботика
        </button>
    );
}

export default observer(AddBotForm)