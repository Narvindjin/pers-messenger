'use client';

import {useFormStatus, useFormState} from 'react-dom';
import {friendInviteHandler} from "@/app/lib/actions/friendInvites";
import { useRouter } from 'next/navigation';
import {useSocket} from "@/app/providers/socketProvider";
import {UserContext} from "@/app/contexts/userContext";
import {useContext} from "react";

export default function FriendRequestForm() {
    const [result, formAction] = useFormState(friendInviteHandler, null);
    const router = useRouter();
    const socket = useSocket();
    if (result?.refresh && result.success) {
        socket.socket.emit('client-new-invite', result.errorMessage)
        result.refresh = false;
        router.refresh();
    }

    return (
        <form action={formAction as unknown as string}>
            <div>
                <div>
                    <div>
                        <label htmlFor="friendRequestId">
                            ID пользователя, которого хотите добавить в друзья
                        </label>
                        <div>
                            <input
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
        <button type={"submit"} aria-disabled={pending}>
            Кинуть инвайт
        </button>
    );
}