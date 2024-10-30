'use client'
import React from 'react';
import {useFormStatus, useFormState} from 'react-dom';
import {useRouter} from 'next/navigation';
import {Bot} from "@/app/lib/types";
import {addBotFriendHandler} from "@/app/lib/actions/friendList";
import {observer} from "mobx-react-lite";
import { InviteName } from '../incomingInviteList/style';
import Image from 'next/image';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HiddenSpan } from '../components/hiddenSpan/hiddenSpan';
import { AddFriendButton, CustomForm, FriendContainer, FriendNameContainer } from '../friendList/style';
import { HiddenInput } from '@/app/utils/mixins';
import { defaultAvatarSrc } from '@/app/utils/utils';

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
        <CustomForm action={formAction as unknown as string}>
            <FriendContainer>
                {bot.image? 
                    <Image src={bot.image}  width={75} height={75} alt='Аватар пользователя'/>:
                    <Image src={defaultAvatarSrc} width={75} height={75} alt='Аватар пользователя'/>
                }
                <FriendNameContainer>
                    <InviteName>{bot.name}</InviteName>
                </FriendNameContainer>
                <HiddenInput name={'botId'} value={bot.id} required readOnly type={"hidden"}/>
                <BefriendButton/>
            </FriendContainer>
        </CustomForm>
    );
}

function BefriendButton() {
    const {pending} = useFormStatus();

    return (
        <AddFriendButton type={"submit"} aria-disabled={pending}>
            <FontAwesomeIcon icon={faPlus} />
            <HiddenSpan>Добавить бота</HiddenSpan>
        </AddFriendButton>
    );
}

export default observer(AddBotForm)