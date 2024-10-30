'use client';
import React from 'react';
import {useFormStatus, useFormState} from 'react-dom';
import {removeFriendHandler} from "@/app/lib/actions/friendList";
import { Friend } from '@/app/lib/types';
import { useRouter } from 'next/navigation';
import { HiddenInput } from '@/app/utils/mixins';
import Image from 'next/image';
import { defaultAvatarSrc } from '@/app/utils/utils';
import { CustomForm, DeleteFriendButton, FriendContainer, FriendNameContainer } from './style';
import { InviteButtonContainer, InviteName} from '../incomingInviteList/style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HiddenSpan } from '../components/hiddenSpan/hiddenSpan';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function RemoveFriendForm({friend}: Readonly<{
    friend: Friend
  }>) {
    const [error, formAction] = useFormState(removeFriendHandler, null);
    const router = useRouter();
    if (error?.refresh && error.success) {
        error.refresh = false;
        router.refresh();
    }

    return (
        <CustomForm action={formAction as unknown as string}>
            <FriendContainer>
                <HiddenInput type='text' name='friendId' required readOnly value={friend.id} />
                {friend.image? 
                <Image src={friend.image}  width={75} height={75} alt='Аватар пользователя'/>:
                <Image src={defaultAvatarSrc} width={75} height={75} alt='Аватар пользователя'/>
                }
                <FriendNameContainer>
                    <InviteName>
                        {friend.name}
                    </InviteName>
                </FriendNameContainer>
                <InviteButtonContainer>
                    <DeleteButton/>
                </InviteButtonContainer>
            </FriendContainer>
        </CustomForm>
    );
}

function DeleteButton() {
    const {pending} = useFormStatus();

    return (
        <DeleteFriendButton type={"submit"} aria-disabled={pending}>
            <FontAwesomeIcon icon={faXmark} />
            <HiddenSpan>Удалить из друзей</HiddenSpan>
        </DeleteFriendButton>
    );
}