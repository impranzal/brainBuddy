// Email validation: simple regex for format
export function validateEmail(email: string): boolean {
  const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return re.test(email);
}

// Password strength: min 8 chars, at least one letter and one number
export function validatePasswordStrength(password: string): boolean {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
  return re.test(password);
} 