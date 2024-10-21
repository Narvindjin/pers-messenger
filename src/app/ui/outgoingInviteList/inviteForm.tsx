'use client';

import {useFormState} from 'react-dom';
import {deleteInviteHandler} from "@/app/lib/actions/friendInvites";
import { Invite } from '@/app/lib/types';
import { useRouter } from 'next/navigation';
import React, { FormEvent } from 'react';
import { useSocket } from '@/app/providers/socketProvider';
import { DeclineButton, ErrorText, InviteButtonContainer, InviteContainer, InviteName, InviteNameContainer } from '../incomingInviteList/style';
import { HiddenInput } from '@/app/utils/mixins';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HiddenSpan } from '../components/hiddenSpan/hiddenSpan';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function InviteDeleteForm({invite}: Readonly<{
    invite: Invite
  }>) {
    const socket = useSocket();
    const [result, formAction] = useFormState(deleteInviteHandler, null);
    const router = useRouter();
    if (result?.refresh && result.success) {
        result.refresh = false;
        router.refresh();
    }

    const submitHandler = (evt:FormEvent<HTMLFormElement>) => {
        if (socket.socket && socket.socket.connected) {
            evt.preventDefault();
            socket.socket.emit('delete-invite', invite.id, true)
        }
    }

    return (
        <form action={formAction as unknown as string} onSubmit={submitHandler}>
            <InviteContainer>
                <HiddenInput type='text' name='inviteId' readOnly value={invite.id} />
                <InviteNameContainer>
                    <InviteName>{invite!.to!.name}</InviteName>
                </InviteNameContainer>
                <InviteButtonContainer>
                    {invite.accepted ? <p>Инвайт принят</p> :
                            <DeclineButton type={"submit"} name='reject' value={'true'}>
                                <FontAwesomeIcon icon={faXmark} />
                                <HiddenSpan>Отклонить инвайт</HiddenSpan>
                            </DeclineButton>
                    }
                </InviteButtonContainer>
            </InviteContainer>
            {!result?.success && result?.errorMessage && (
                <ErrorText>{result.errorMessage}</ErrorText>
            )}
        </form>
    );
}