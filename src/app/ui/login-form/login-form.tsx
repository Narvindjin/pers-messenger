'use client';

import { useFormStatus, useFormState } from 'react-dom';
import { signInEmail, signInGithub } from "@/app/lib/actions";
import React from 'react'

export default function LoginForm() {
    const [OauthError, formAction] = useFormState(signInEmail, null);
    const [error, formOauthAction] = useFormState(signInGithub, null);

    return (
        <>
            <form action={formOauthAction as unknown as string}>
                <div>
                    <LoginButton text='Login with Github' />
                    <div>
                        {OauthError?.status === "error" && (
                            <p>{OauthError.errorMessage}</p>
                        )}
                    </div>
                </div>
            </form>
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
                    <LoginButton text='Login with Email' />
                    <div>
                        {error?.status === "error" && (
                            <p>{error.errorMessage}</p>
                        )}
                    </div>
                </div>
            </form>
        </>
    );
}

interface LoginButtonInterface {
    text: string
}

function LoginButton({ text }: LoginButtonInterface) {
    const { pending } = useFormStatus();

    return (
        <button type={"submit"} aria-disabled={pending}>
            {text}
        </button>
    );
}