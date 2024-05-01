'use client';

import {useFormStatus, useFormState} from 'react-dom';
import {removeFriendHandler} from "@/app/lib/actions/friendList";
import { Friend } from '@/app/lib/types';
import { useRouter } from 'next/navigation';

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
        <form action={formAction as unknown as string}>
            <div>
            <input type='text' name='friendId' readOnly value={friend.id} />
            <p>Друг: {friend.name}</p>
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
            Удалить друга
        </button>
    );
}