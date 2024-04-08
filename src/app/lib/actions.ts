'use server'
import { signIn, signOut, auth } from '@/auth';
import { redirect } from "next/dist/client/components/redirect";
import { validateEmail } from '../utils/utils';
import prisma from "@/app/lib/prisma";
import DOMPurify from "isomorphic-dompurify";


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

export async function sendMessage(message: string, receiverId: string) {
	const session = await auth()
	const filteredMessage = DOMPurify.sanitize(message);
	if (session && session.user) {
		const user = session.user;
		const isFriend = await prisma.user.findUnique({
			where: {
				id: user.id,
				friendOf: {
					id: receiverId
				}
			}
		});
		if (isFriend) {
			const message = await prisma.message.create({
			  data: {

			  },
			})
		} else {
			return 'Не в друзьях'
		}
	} else {
		return 'Неавторизирован'
	}
}