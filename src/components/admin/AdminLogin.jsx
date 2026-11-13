import React, { useState } from "react";
import { LogIn } from "lucide-react";
import Logo from "../ui/Logo";
import { FadeUp } from "../motion/Reveal";
import { Button, Field, inputClass, useAdminT } from "./AdminUI";

const AdminLogin = ({ onLogin, loginError, isLoggingIn }) => {
  const at = useAdminT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <main className="min-h-[100svh] flex items-center justify-center px-6 py-28">
      <FadeUp className="w-full max-w-sm">
        <div className="mb-10">
          <Logo className="text-white/90" />
        </div>
        <h1 className="font-serif font-light text-4xl text-white">{at('loginTitle')}</h1>
        <p className="mt-2 text-sm text-white/50">{at('loginDesc')}</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <Field label={at('email')} htmlFor="admin-email">
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
            />
          </Field>

          <Field label={at('password')} htmlFor="admin-password">
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
            />
          </Field>

          {loginError && (
            <p role="alert" className="text-sm text-red-300">{at(loginError)}</p>
          )}

          <Button type="submit" icon={LogIn} loading={isLoggingIn} className="w-full h-11 mt-2">
            {at('signIn')}
          </Button>
        </form>
      </FadeUp>
    </main>
  );
};

export default AdminLogin;
