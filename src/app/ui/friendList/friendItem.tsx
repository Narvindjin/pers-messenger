'use client';
import React, { useEffect } from 'react';
import {useFormStatus, useFormState} from 'react-dom';
import {removeFriendHandler} from "@/app/lib/actions/friendList";
import { Friend } from '@/app/lib/types';
import { useRouter } from 'next/navigation';
import { HiddenInput } from '@/app/utils/mixins';
import Image from 'next/image';
import { defaultAvatarSrc } from '@/app/utils/utils';

export default function RemoveFriendForm({friend}: Readonly<{
    friend: Friend
  }>) {
    const [error, formAction] = useFormState(removeFriendHandler, null);
    const router = useRouter();
    if (error?.refresh && error.success) {
        error.refresh = false;
        router.refresh();
    }
    useEffect(() => {
        console.log(friend.image)
    }, [])

    return (
        <form action={formAction as unknown as string}>
            <div>
                <HiddenInput type='text' name='friendId' readOnly value={friend.id} />
                {friend.image? 
                <Image src={friend.image}  width={100} height={100} alt='Аватар пользователя'/>:
                <Image src={defaultAvatarSrc} width={100} height={100} alt='Аватар пользователя'/>
                }
                {friend.name}
                <DeleteButton/>
            </div>
        </form>
    );
}

function DeleteButton() {
    const {pending} = useFormStatus();

    return (
        <button type={"submit"} aria-disabled={pending}>
            Удалить друга
        </button>
    );
}