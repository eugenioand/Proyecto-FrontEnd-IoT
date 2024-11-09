export function checkPassword(password: string): { valid: boolean; message: string } {
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);

    if (password.length < minLength) {
        return { valid: false, message: "La contraseña debe tener al menos 8 caracteres." };
    }
    if (!hasUpper) {
        return { valid: false, message: "La contraseña debe contener al menos 1 letra mayúscula." };
    }
    if (!hasLower) {
        return { valid: false, message: "La contraseña debe contener al menos 1 letra minúscula." };
    }
    if (!hasDigit) {
        return { valid: false, message: "La contraseña debe contener al menos 1 dígito." };
    }
    if (!hasSpecial) {
        return { valid: false, message: "La contraseña debe contener al menos 1 carácter especial (@, $, !, %, *, ?, &)." };
    }

    return { valid: true, message: "La contraseña es segura." };
}