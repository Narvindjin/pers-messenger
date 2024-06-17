'use client';

import {useFormState, useFormStatus} from 'react-dom';
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
                <ButtonContainer/>
            </div>
            <div>
            {!error?.success && error?.errorMessage && (
                    <p>{error.errorMessage}</p>
                )}
            </div>
        </form>
    );
}

function ButtonContainer() {
    const {pending} = useFormStatus();

    return (
        <div>
            <button type={"submit"} name={'rejected'} value={'false'} aria-disabled={pending}>
                Принять инвайт
            </button>
            <button type={"submit"} name={'rejected'} value={'true'} aria-disabled={pending}>
                Отклонить инвайт
            </button>
        </div>
    );
}