'use server'
import { signIn } from '@/auth';
import { redirect } from "next/dist/client/components/redirect";
import { validateEmail } from '../utils/utils';


export type SignInEmailResult =
	| {
		status: "error";
		errorMessage: string;
	}
	| undefined;

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