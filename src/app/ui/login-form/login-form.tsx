'use client';

import {useFormStatus, useFormState} from 'react-dom';
import {signInEmail} from "@/app/lib/actions";

export default function LoginForm() {
    const [error, formAction] = useFormState(signInEmail, null);

    return (
        <form action={formAction as unknown as string}>
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
                {error?.status === "error" && (
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
            Log in
        </button>
    );
}