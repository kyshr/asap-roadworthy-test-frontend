export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return null;
};

export const validatePhoneNumber = (phone: string): string | null => {
  if (!phone.trim()) {
    return "Phone number is required";
  }
  // Allow various phone number formats (with or without dashes, spaces, parentheses)
  const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length < 10) {
    return "Phone number must contain at least 10 digits";
  }
  if (!phoneRegex.test(phone)) {
    return "Please enter a valid phone number";
  }
  return null;
};

export const validateEmailOrPhone = (value: string): string | null => {
  if (!value.trim()) {
    return "Email or phone number is required";
  }
  // Check if it's an email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(value)) {
    return null; // Valid email
  }
  // Check if it's a phone number
  const digitsOnly = value.replace(/\D/g, "");
  if (digitsOnly.length >= 10) {
    return null; // Valid phone
  }
  return "Please enter a valid email address or phone number";
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/(?=.*\d)/.test(password)) {
    return "Password must contain at least one number";
  }
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return "Name is required";
  }
  if (name.trim().length < 2) {
    return "Name must be at least 2 characters long";
  }
  if (name.trim().length > 50) {
    return "Name must be less than 50 characters";
  }
  return null;
};

export const validateRole = (role: string): string | null => {
  if (!role) {
    return "Role is required";
  }
  if (role !== "user" && role !== "admin") {
    return "Role must be either 'user' or 'admin'";
  }
  return null;
};

