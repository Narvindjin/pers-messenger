'use client';

import React, { MutableRefObject, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { addToFriendListHandler } from "@/app/lib/actions/friendList";
import { Invite } from '@/app/lib/types';
import { useRouter } from 'next/navigation';
import { observer } from "mobx-react-lite";
import { useSocket } from '@/app/providers/socketProvider';
import { HiddenInput } from '@/app/utils/mixins';
import { AcceptButton, DeclineButton, ErrorText, InviteButtonContainer, InviteContainer, InviteName, InviteNameContainer } from './style';
import { HiddenSpan } from '../components/hiddenSpan/hiddenSpan';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function InviteAcceptForm({ invite }: Readonly<{
    invite: Invite
}>) {
    const socket = useSocket();
    const [error, formAction] = useFormState(addToFriendListHandler, null);
    const [rejectBool, changeRejectBool] = useState<null | boolean>(null);
    const [socketWorking, changeSocketWorking] = useState<boolean>(true)
    const { pending } = useFormStatus();
    const formRef: MutableRefObject<null | HTMLFormElement> = useRef(null)
    const router = useRouter();
    if (error?.refresh && error.success) {
        error.refresh = false;
        router.refresh();
    }

    useEffect(() => {
        if (rejectBool !== null && formRef.current) {
            changeSocketWorking(false);
            (formRef.current).requestSubmit();
        }
    }, [rejectBool])

    const submitHandler = (evt: SyntheticEvent) => {
        if (socketWorking) {
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
    }


    return (
        <form ref={formRef} action={formAction as unknown as string} onSubmit={submitHandler}>
            <InviteContainer>
                <HiddenInput type='text' name='inviteId' readOnly value={invite.id} />
                <InviteNameContainer>
                    <InviteName>{invite.from!.name}</InviteName>
                </InviteNameContainer>
                <input type='hidden' name='rejected' value={rejectBool + ''} readOnly />
                <InviteButtonContainer>
                    {invite.accepted ? <p>Инвайт принят</p> :
                        <>
                            <AcceptButton type={"submit"} name='accept' value={'true'} aria-disabled={pending}>
                                <FontAwesomeIcon icon={faCheck} />
                                <HiddenSpan>Принять инвайт</HiddenSpan>
                            </AcceptButton>
                            <DeclineButton type={"submit"} name='reject' value={'true'} aria-disabled={pending}>
                                <FontAwesomeIcon icon={faXmark} />
                                <HiddenSpan>Отклонить инвайт</HiddenSpan>
                            </DeclineButton>
                        </>
                    }
                </InviteButtonContainer>
            </InviteContainer>
            <div>
                {!error?.success && error?.errorMessage && (
                    <ErrorText>{error.errorMessage}</ErrorText>
                )}
            </div>
        </form>
    );
}

export default observer(InviteAcceptForm)