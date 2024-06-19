'use client';

import {useFormStatus, useFormState} from 'react-dom';
import {deleteInviteHandler} from "@/app/lib/actions/friendInvites";
import { Invite } from '@/app/lib/types';
import { useRouter } from 'next/navigation';
import {useSocket} from "@/app/providers/socketProvider";

export default function AvatarUploadForm({invite}: Readonly<{
    invite: Invite
  }>) {
    const [result, formAction] = useFormState(uploadAvatarHandler, null);
    const router = useRouter();
    if (result?.refresh && result.success) {
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