'use client';

import {useFormState, useFormStatus} from 'react-dom';
import {authenticate} from '@/app/lib/actions';

export default function LoginForm() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined as Awaited<undefined>);

    return (
        <form action={dispatch as string}>
            <div>
                <div>
                    <div>
                        <label htmlFor="email">
                            Email
                        </label>
                        <div>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                required
                            />
                        </div>
                    </div>
                </div>
                <LoginButton/>
                <div
                >
                    {errorMessage && (
                        <>
                            <p>{errorMessage}</p>
                        </>
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
            Log in
        </button>
    );
}