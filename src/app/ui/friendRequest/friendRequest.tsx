'use client';

import {useFormStatus, useFormState} from 'react-dom';
import {friendInviteHandler} from "@/app/lib/actions/friendInvites";

export default function FriendRequestForm() {
    const [error, formAction] = useFormState(friendInviteHandler, null);

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
                {error?.errorMessage && (
      <p>{error.errorMessage}</p>
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