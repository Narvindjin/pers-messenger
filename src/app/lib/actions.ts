'use server'
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { isRedirectError } from "next/dist/client/components/redirect";


export async function authenticate(
	prevState: string | undefined,
	formData: FormData,
) {
	try {
		const success = await signIn("email",{ redirectTo: "/profile", email: formData.get('email') });
		console.log({ prevState, success });
		return undefined;
	} catch (error) {
		console.log({ error });
        if (isRedirectError(error)) {
            throw error;
        }
		if (error instanceof Error) {
			const { type, cause } = error as AuthError;
			switch (type) {
				case "CredentialsSignin":
					return "Invalid credentials.";
				case "CallbackRouteError":
					return cause?.err?.toString();
				default:
					return "Something went wrong.";
			}
		}
		throw error;
	}
}