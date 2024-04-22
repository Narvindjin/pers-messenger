'use client';

import {useFormStatus, useFormState} from 'react-dom';
import {deleteInviteHandler} from "@/app/lib/actions/friendInvites";
import { Invite } from '@/app/lib/types';

export default function InviteDeleteForm({invite}: Readonly<{
    invite: Invite
  }>) {
    const [error, formAction] = useFormState(deleteInviteHandler, null);

    return (
        <form action={formAction as unknown as string}>
            <div>
            <input type='text' name='requestingId' readOnly value={invite.id} />
            <p>Инвайт от {invite.from.email}</p>
            <DeleteButton/>
            </div>
            <div>
                {error?.errorMessage && (
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