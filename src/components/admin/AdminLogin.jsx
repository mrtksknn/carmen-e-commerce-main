import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Key, LogIn, Database } from "lucide-react";

const AdminLogin = ({ onLogin, loginError, isLoggingIn }) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <Card className="bg-[#0f0f0f]/80 backdrop-blur-2xl border-primary/20 shadow-2xl overflow-hidden rounded-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-light via-primary to-primary-hover"></div>

          <CardHeader className="space-y-3 pt-8 pb-4 text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20 shadow-[0_0_20px_rgba(120,34,34,0.3)]">
              <Database className="text-primary w-8 h-8" />
            </div>
            <CardTitle className="text-3xl font-serif text-white tracking-wider">Admin Portal</CardTitle>
            <CardDescription className="text-gray-400 font-sans text-sm px-4">
              Enter the admin password to access the management dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {loginError && (
                <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-200 text-sm animate-pulse-once">
                  <span className="flex-shrink-0 bg-red-500/20 p-1 rounded-full">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </span>
                  {loginError}
                </div>
              )}

              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                    <Key size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-4 py-3.5 bg-[#171717] border border-gray-800 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white placeholder-gray-600 transition-all font-sans text-sm shadow-inner"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-primary to-primary-hover text-white rounded-xl font-medium tracking-wide hover:shadow-[0_0_20px_rgba(120,34,34,0.4)] transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 mt-2"
              >
                {isLoggingIn ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
