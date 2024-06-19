'use client';

import {useFormState, useFormStatus} from 'react-dom';
import {addToFriendListHandler} from "@/app/lib/actions/friendList";
import { Invite } from '@/app/lib/types';
import { useRouter } from 'next/navigation';
import {observer} from "mobx-react-lite";
import {ChatContext, ChatContextObject} from "@/app/contexts/chatContext";

function InviteAcceptForm({invite}: Readonly<{
    invite: Invite
  }>) {
    const context = ChatContext as ChatContextObject
    const [error, formAction] = useFormState(addToFriendListHandler, null);
    const router = useRouter();
    if (error?.refresh && error.success) {
        const index = context.inviteIdArray.findIndex(inviteId => inviteId === invite.from?.id)
        if (index) {
            context.inviteIdArray.splice(index, 1)
        }
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

export default observer(InviteAcceptForm)