import { create } from "zustand";
import { validateEmailOrPhone, validatePassword } from "@/lib/validations";

interface LoginFormData {
  emailOrPhone: string;
  password: string;
}

interface LoginFormErrors {
  emailOrPhone?: string;
  password?: string;
  submit?: string;
}

interface LoginStore {
  formData: LoginFormData;
  errors: LoginFormErrors;
  isSubmitting: boolean;
  setField: (field: keyof LoginFormData, value: string) => void;
  clearError: (field: keyof LoginFormErrors) => void;
  setFieldError: (field: keyof LoginFormErrors, error: string) => void;
  validateForm: () => boolean;
  setSubmitting: (isSubmitting: boolean) => void;
  setSubmitError: (error: string) => void;
  reset: () => void;
}

const initialFormData: LoginFormData = {
  emailOrPhone: "",
  password: "",
};

export const useLoginStore = create<LoginStore>((set, get) => ({
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
    const newErrors: LoginFormErrors = {};

    const emailOrPhoneError = validateEmailOrPhone(formData.emailOrPhone);
    if (emailOrPhoneError) {
      newErrors.emailOrPhone = emailOrPhoneError;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

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
