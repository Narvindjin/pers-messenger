'use client';

import {useFormStatus, useFormState} from 'react-dom';
import {deleteInviteHandler} from "@/app/lib/actions/friendInvites";
import { Invite } from '@/app/lib/types';
import { useRouter } from 'next/navigation';
import React, { FormEvent } from 'react';
import { useSocket } from '@/app/providers/socketProvider';

export default function InviteDeleteForm({invite}: Readonly<{
    invite: Invite
  }>) {
    const socket = useSocket();
    const [result, formAction] = useFormState(deleteInviteHandler, null);
    const router = useRouter();
    if (result?.refresh && result.success) {
        result.refresh = false;
        router.refresh();
    }

    const submitHandler = (evt:FormEvent<HTMLFormElement>) => {
        if (socket.socket && socket.socket.connected) {
            evt.preventDefault();
            socket.socket.emit('delete-invite', invite.id, true)
        }
    }

    return (
        <form action={formAction as unknown as string} onSubmit={submitHandler}>
            <div>
            <input type='text' name='inviteId' readOnly value={invite.id} />
            <p>Инвайт для {invite!.to!.name}</p>
            {invite.accepted? <p>Инвайт принят</p>: <DeleteButton/>}
            </div>
                {!result?.success && result?.errorMessage && (
                    <p>{result.errorMessage}</p>
                )}
        </form>
    );
}

function DeleteButton() {
    const {pending} = useFormStatus();
    return (
        <button type={"submit"} aria-disabled={pending}>
            Удалить инвайт
        </button>
    );
}