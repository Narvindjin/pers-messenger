'use client';

import {useFormStatus, useFormState} from 'react-dom';
import {authenticate} from "@/app/lib/actions";


export default function LoginForm() {
    const [error, formAction] = useFormState(authenticate, 'hello');

    return (
        <form action={formAction as string}>
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
                <div>
                    {error && error !== 'hello' && (
                        <>
                          <p>{error}</p>
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