
export const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return "Full name is required";
  }
  if (name.trim().length < 2) {
    return "Full name must be at least 2 characters";
  }
  if (!/^[A-Za-z\s]+$/.test(name)) {
    return "Full name can only contain letters";
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return "Email address is required";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email address";
  }
  return null;
};

export const validatePhone = (phone: string, isRequired: boolean): string | null => {
  if (!isRequired && !phone) {
    return null;
  }
  if (phone.trim() && !/^\d{10}$/.test(phone)) {
    return "Phone number must be exactly 10 digits";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least 1 uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least 1 lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least 1 number";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must contain at least 1 special character";
  }
  return null;
};

export const validateAbout = (about: string): string | null => {
  if (!about.trim()) {
    return "About yourself is required";
  }
  if (about.trim().length < 50) {
    return `Minimum 50 characters required (currently ${about.trim().length})`;
  }
  if (about.trim().length > 500) {
    return `Maximum 500 characters allowed (currently ${about.trim().length})`;
  }
  return null;
};
