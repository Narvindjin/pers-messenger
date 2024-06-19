'use client';

import {useFormStatus, useFormState} from 'react-dom';
import {deleteInviteHandler} from "@/app/lib/actions/friendInvites";
import { Invite } from '@/app/lib/types';
import { useRouter } from 'next/navigation';
import {ChatContext, ChatContextObject} from "@/app/contexts/chatContext";
import {useSocket} from "@/app/providers/socketProvider";

export default function InviteDeleteForm({invite}: Readonly<{
    invite: Invite
  }>) {
    const [result, formAction] = useFormState(deleteInviteHandler, null);
    const socket = useSocket();
    const router = useRouter();
    if (result?.refresh && result.success) {
        socket.socket.emit('client-remove-invite', result.errorMessage)
        result.refresh = false;
        router.refresh();
    }

    return (
        <form action={formAction as unknown as string}>
            <div>
            <input type='text' name='inviteId' readOnly value={invite.id} />
            <p>Инвайт для {invite!.to!.name}</p>
            <DeleteButton/>
            </div>
            <div>
                {!result?.success && result?.errorMessage && (
                    <p>{result.errorMessage}</p>
                )}
            </div>
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