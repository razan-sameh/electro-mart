import Logo from "@/components/reusable/Logo";
import React from "react";
import LoginForm from "./components/LoginForm";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-body rounded-xl shadow-md p-6 sm:p-8 lg:p-10">
        <div className="text-center mb-6">
          <Logo />
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold mb-6">
          Login into your account
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
