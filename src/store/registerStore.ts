import { create } from "zustand";
import {
  validateEmail,
  validatePhoneNumber,
  validatePassword,
  validateName,
} from "@/lib/validations";

interface RegisterFormData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: "user" | "admin";
}

interface RegisterFormErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  submit?: string;
}

interface RegisterStore {
  formData: RegisterFormData;
  errors: RegisterFormErrors;
  isSubmitting: boolean;
  setField: (field: keyof RegisterFormData, value: string) => void;
  clearError: (field: keyof RegisterFormErrors) => void;
  setFieldError: (field: keyof RegisterFormErrors, error: string) => void;
  validateForm: () => boolean;
  setSubmitting: (isSubmitting: boolean) => void;
  setSubmitError: (error: string) => void;
  reset: () => void;
}

const initialFormData: RegisterFormData = {
  name: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  role: "user",
};

export const useRegisterStore = create<RegisterStore>((set, get) => ({
  formData: initialFormData,
  errors: {},
  isSubmitting: false,

  setField: (field, value) => {
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    }));
    // Clear error when user starts typing
    const currentErrors = get().errors;
    if (currentErrors[field]) {
      set((state) => ({
        errors: { ...state.errors, [field]: undefined },
      }));
    }
  },

  clearError: (field) => {
    set((state) => ({
      errors: { ...state.errors, [field]: undefined },
    }));
  },

  setFieldError: (field, error) => {
    set((state) => ({
      errors: { ...state.errors, [field]: error },
    }));
  },

  validateForm: () => {
    const { formData } = get();
    const newErrors: RegisterFormErrors = {};

    const nameError = validateName(formData.name);
    if (nameError) {
      newErrors.name = nameError;
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    const phoneNumberError = validatePhoneNumber(formData.phoneNumber);
    if (phoneNumberError) {
      newErrors.phoneNumber = phoneNumberError;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Role is always "user" for registration, no validation needed

    set({ errors: newErrors });
    return Object.keys(newErrors).length === 0;
  },

  setSubmitting: (isSubmitting) => {
    set({ isSubmitting });
  },

  setSubmitError: (error) => {
    set((state) => ({
      errors: { ...state.errors, submit: error },
    }));
  },

  reset: () => {
    set({
      formData: initialFormData,
      errors: {},
      isSubmitting: false,
    });
  },
}));

