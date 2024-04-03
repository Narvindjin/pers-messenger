'use server'
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

interface PrevStateInterface {
  message: AuthError | undefined
}

export async function authenticate(
  prevState: PrevStateInterface | undefined,
  formData: FormData,
) {
  try {
    await signIn('email', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message: error,
      }
    }
    throw error;
  }
}