'use server'
import {auth, signIn, signOut} from '@/auth';
import {redirect} from "next/dist/client/components/redirect";
import {validateEmail} from '../utils/utils';


export type SignInEmailResult =
    | {
    status: "error";
    errorMessage: string;
}
    | undefined;


export type Result = {
    success: boolean;
    errorMessage: null | string;
}
/**
 * Server action for email sign in with AuthJS.
 */
export async function signInEmail(
    previousState: SignInEmailResult | null,
    formData: FormData,
): Promise<SignInEmailResult> {
    let redirectUrl: string | null = null;
    try {
        const email = formData.get("email");
        if (validateEmail(email)) {
            redirectUrl = await signIn("nodemailer", {
                redirect: false,
                email,
            });
            if (!redirectUrl) {
                return {
                    status: "error",
                    errorMessage: "Не удалось авторизироваться с помощью почты, не найдена ссылка редиректа",
                };
            }
        } else {
            return {
                status: "error",
                errorMessage: "Введите почту в виде example@mail.com",
            };
        }
    } catch (error) {
        return {
            status: "error",
            errorMessage: "Не удалось авторизироваться с помощью почты",
        };
    }
    if (redirectUrl) {
        redirect(redirectUrl);
    }
}

export async function signOutHandler(
    previousState: SignInEmailResult | null,
    formData: FormData,
): Promise<SignInEmailResult> {
    let signoutObject: string | null = null;
    try {
        signoutObject = await signOut();
    } catch (error) {
        return {
            status: "error",
            errorMessage: "Не удалось выйти из аккаунта",
        };
    }
}

export async function getUser () {
    const session = await auth()
    if (session && session.user && session.user.id) {
        return session.user
    } else {
        return null
    }
}

export async function stringChecker(probablyString: any): Promise<Result | null> {
    if (typeof(probablyString) === 'string') {
        return null
    }
    return {
        success: false,
        errorMessage: 'Вы присылаете мне какую-то дичь',
    }
} 