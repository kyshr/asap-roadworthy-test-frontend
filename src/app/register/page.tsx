"use client";
import RegisterForm from "@/components/RegisterForm";
import Link from "next/link";

const Page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Page;
