import { Result } from "./actions";

export const errorInvalidDataType: Result = {
    refresh: true,
    success: false,
    errorMessage: 'Вы присылаете какую-то дичь',
}

export const errorAuthorization: Result = {
    refresh: true,
    success: false,
    errorMessage: 'Ошибка авторизации',
}

export const successResult: Result = {
    refresh: true,
    success: true,
    errorMessage: 'Успех',
}