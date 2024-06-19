'use client'

import {useFormStatus, useFormState} from 'react-dom';
import {useRouter} from 'next/navigation';
import {changeName} from "@/app/lib/actions/friendList";
import {useContext} from "react";
import {UserContext} from "@/app/contexts/userContext";
import {observer} from "mobx-react-lite";

function ChangeNameForm() {
    const [error, formAction] = useFormState(changeName, null);
    const userContext = useContext(UserContext)
    const router = useRouter();
    if (error?.refresh && error.success) {
        error.refresh = false;
        router.refresh();
    }

    return (
        <form action={formAction as unknown as string}>
            <div>
                <div>
                    <p>Введите новый никнейм:</p>
                </div>
                <input name={'name'} placeholder={userContext.user?.name? userContext.user?.name: undefined} required type={"text"}/>
                <ChangeNameButton/>
                <div>
                    {!error?.success && error?.errorMessage && (
                        <p>{error.errorMessage}</p>
                    )}
                </div>
            </div>
        </form>
    );
}

function ChangeNameButton() {
    const {pending} = useFormStatus();

    return (
        <button type={"submit"} aria-disabled={pending}>
            Сменить никнейм
        </button>
    );
}

export default observer(ChangeNameForm)