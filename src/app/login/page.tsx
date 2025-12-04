"use client";
import LoginForm from "@/components/LoginForm";
import Link from "next/link";

const Page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default Page;
