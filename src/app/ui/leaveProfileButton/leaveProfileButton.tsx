'use client'

import {useFormState} from "react-dom";
import {signOutHandler} from "@/app/lib/actions";
import React, {useState, useEffect} from "react";

export default function LeaveProfileButton({children}: Readonly<{ children: React.ReactNode; }>) {
    const [isRefreshed, setIsRefreshed] = useState(false)
    const [error, formAction] = useFormState(signOutHandler, null);
    useEffect(() => {
        if (error && error.status === "ok" && !isRefreshed) {
            setIsRefreshed(true)
            console.log(error.errorMessage)
            window.location.href = error.errorMessage
            }
        }, [isRefreshed, error])
    return (
        <form action={formAction as unknown as string}><button type={"submit"}>{children}</button></form>
    )
}