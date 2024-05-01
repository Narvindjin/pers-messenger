'use client';

import {useFormStatus, useFormState} from 'react-dom';
import {addToFriendListHandler} from "@/app/lib/actions/friendList";
import { Invite } from '@/app/lib/types';
import { useRouter } from 'next/navigation';

export default function InviteAcceptForm({invite}: Readonly<{
    invite: Invite
  }>) {
    const [error, formAction] = useFormState(addToFriendListHandler, null);
    const router = useRouter();
    if (error?.refresh && error.success) {
        error.refresh = false;
        router.refresh();
    }

    return (
        <form action={formAction as unknown as string}>
            <div>
            <input type='text' name='inviteId' readOnly value={invite.id} />
            <p>Инвайт от {invite.from!.name}</p>
            <AcceptButton/>
            </div>
            <div>
            {!error?.success && error?.errorMessage && (
                    <p>{error.errorMessage}</p>
                )}
            </div>
        </form>
    );
}

function AcceptButton() {
    const {pending} = useFormStatus();

    return (
        <button type={"submit"} aria-disabled={pending}>
            Принять инвайт
        </button>
    );
}