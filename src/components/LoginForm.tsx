"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoginStore } from "@/store/loginStore";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const {
    formData,
    errors,
    isSubmitting,
    setField,
    validateForm,
    setSubmitting,
    setSubmitError,
    setFieldError,
    reset,
  } = useLoginStore();
  const router = useRouter();
  const { setUser, checkAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    useLoginStore.setState({ errors: {} });

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmail = emailRegex.test(formData.emailOrPhone);

      const loginData = isEmail
        ? { email: formData.emailOrPhone, password: formData.password }
        : { phoneNumber: formData.emailOrPhone, password: formData.password };

      const response = await authApi.login(loginData);
      setUser(response.data.user);
      reset();

      // Redirect to intended page or home
      const redirectTo = sessionStorage.getItem("redirectAfterLogin") || "/";
      sessionStorage.removeItem("redirectAfterLogin");
      router.push(redirectTo);
    } catch (error: any) {
      const response = error.response?.data;

      // Handle field-specific validation errors
      if (response?.errors) {
        const apiErrors = response.errors;
        if (apiErrors.email) setFieldError("emailOrPhone", apiErrors.email);
        if (apiErrors.phoneNumber) setFieldError("emailOrPhone", apiErrors.phoneNumber);
        if (apiErrors.password) setFieldError("password", apiErrors.password);
      }

      // Handle general error message
      const message = response?.message || response?.error || "Login failed. Please try again.";
      if (!response?.errors) {
        setSubmitError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your email or phone number and password to login</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emailOrPhone">Email or Phone Number</Label>
            <Input
              id="emailOrPhone"
              type="text"
              placeholder="email@example.com or +1234567890"
              value={formData.emailOrPhone}
              onChange={(e) => setField("emailOrPhone", e.target.value)}
              className={errors.emailOrPhone ? "border-destructive" : ""}
            />
            {errors.emailOrPhone && <p className="text-sm text-destructive">{errors.emailOrPhone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setField("password", e.target.value)}
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          {errors.submit && <p className="text-sm text-destructive">{errors.submit}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
