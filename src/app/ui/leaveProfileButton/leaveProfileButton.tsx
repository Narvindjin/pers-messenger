'use client'

import {useFormState} from "react-dom";
import {signOutHandler} from "@/app/lib/actions";
import React from "react";

export default function LeaveProfileButton({children}: Readonly<{ children: React.ReactNode; }>) {
    const [error, formAction] = useFormState(signOutHandler, null);
    return (
        <form action={formAction as unknown as string}><button type={"submit"}>{children}</button></form>
    )
}