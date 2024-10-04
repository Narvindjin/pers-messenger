'use client';

import React, {MutableRefObject, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { addToFriendListHandler } from "@/app/lib/actions/friendList";
import { Invite } from '@/app/lib/types';
import { useRouter } from 'next/navigation';
import { observer } from "mobx-react-lite";
import { useSocket } from '@/app/providers/socketProvider';

function InviteAcceptForm({ invite }: Readonly<{
    invite: Invite
}>) {
    const socket = useSocket();
    const [error, formAction] = useFormState(addToFriendListHandler, null);
    const [rejectBool, changeRejectBool] = useState<null | boolean>(null)
    const { pending } = useFormStatus();
    const formRef: MutableRefObject<null | HTMLFormElement> = useRef(null)
    const router = useRouter();
    if (error?.refresh && error.success) {
        error.refresh = false;
        router.refresh();
    }

    useEffect(() => {
        if (rejectBool !== null && formRef.current) {
            (formRef.current).submit();
        }
    }, [rejectBool])

    const submitHandler = (evt: SyntheticEvent) => {
        evt.preventDefault();
        const eventSubmitter = (evt.nativeEvent as SubmitEvent).submitter as HTMLButtonElement
        let accept = false;
        if (eventSubmitter && eventSubmitter.name === "accept") {
            accept = true
        }
        if (socket.socket && socket.socket.connected) {
            if (accept) {
                socket.socket.emit('accept-invite', invite.id)
            } else {
                socket.socket.emit('delete-invite', invite.id, false)
            }
        } else {
            if (accept) {
                changeRejectBool(false);
            } else {
                changeRejectBool(true)
            }
        }
    }


    return (
        <form ref={formRef} action={formAction as unknown as string} onSubmit={submitHandler}>
            <div>
                <input type='text' name='inviteId' readOnly value={invite.id} />
                <p>Инвайт от {invite.from!.name}</p>
                <input type='hidden' name='rejected' value={rejectBool + ''} readOnly />
                <div>
                {invite.accepted? <p>Инвайт принят</p>:
                    <>
                        <button type={"submit"} name='accept' value={'true'} aria-disabled={pending}>
                            Принять инвайт
                        </button>
                        <button type={"submit"} name='reject' value={'true'} aria-disabled={pending}>
                            Отклонить инвайт
                        </button>
                    </>
                }
                </div>
            </div>
            <div>
                {!error?.success && error?.errorMessage && (
                    <p>{error.errorMessage}</p>
                )}
            </div>
        </form>
    );
}

export default observer(InviteAcceptForm)