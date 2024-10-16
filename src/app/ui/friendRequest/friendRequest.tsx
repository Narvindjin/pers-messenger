'use client';

import {useFormStatus, useFormState} from 'react-dom';
import {friendInviteHandler} from "@/app/lib/actions/friendInvites";
import React, { useContext } from 'react'
import { useSocket } from '@/app/providers/socketProvider';
import { ChatContext } from '@/app/contexts/chatContext';
import { CustomInput } from '../components/input/input';
import { FriendButton } from './style';
import { CustomLabel } from '../components/label/label';

export default function FriendRequestForm() {
    const [result, formAction] = useFormState(friendInviteHandler, null);
    const socket = useSocket();
    const chatContext = useContext(ChatContext)
    if (result?.invite && result.success) {
        socket.socket.emit('created-invite', result.invite?.id)
        let inviteArray = chatContext?.outgoingInviteArray.slice();
        if (!inviteArray) {
            inviteArray = []
        }
        inviteArray?.push(result.invite);
        chatContext?.setOutgoingInviteArray(inviteArray!);
    }

    return (
        <form action={formAction as unknown as string}>
            <div>
                <div>
                    <div>
                        <CustomLabel htmlFor="friendRequestId">
                            ID пользователя, которого хотите добавить в друзья:
                        </CustomLabel>
                        <div>
                            <CustomInput
                                id="friendRequestId"
                                type="text"
                                name="friendRequestId"
                                placeholder="Введите ID пользователя"
                                required
                            />
                        </div>
                    </div>
                </div>
                <LoginButton/>
                <div>
                {!result?.success && result?.errorMessage && (
                    <p>{result.errorMessage}</p>
                )}
                </div>
            </div>
        </form>
    );
}

function LoginButton() {
    const {pending} = useFormStatus();

    return (
        <FriendButton type={"submit"} aria-disabled={pending}>
            Отправить инвайт
        </FriendButton>
    );
}