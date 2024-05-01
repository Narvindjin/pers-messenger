'use client';

import {useFormStatus, useFormState} from 'react-dom';
import {deleteInviteHandler} from "@/app/lib/actions/friendInvites";
import { Invite } from '@/app/lib/types';
import { useRouter } from 'next/navigation';

export default function InviteDeleteForm({invite}: Readonly<{
    invite: Invite
  }>) {
    const [error, formAction] = useFormState(deleteInviteHandler, null);
    const router = useRouter();
    if (error?.refresh && error.success) {
        error.refresh = false;
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
                {!error?.success && error?.errorMessage && (
                    <p>{error.errorMessage}</p>
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