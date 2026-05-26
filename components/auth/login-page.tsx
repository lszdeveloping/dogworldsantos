"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";

type Tab = "login" | "register";

export function LoginPage() {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassphrase, setShowPassphrase] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    passphrase: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    if (!loginForm.email || !loginForm.password) {
      setError("Preencha todos os campos.");
      return;
    }
    setSubmitting(true);
    const err = await login(loginForm.email, loginForm.password);
    setSubmitting(false);
    if (err) setError(err);
  };

  const handleRegister = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    const { name, email, password, confirm, passphrase } = registerForm;
    if (!name || !email || !password || !confirm || !passphrase) {
      setError("Preencha todos os campos.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setSubmitting(true);
    const err = await register(name, email, password, passphrase);
    setSubmitting(false);
    if (err) setError(err);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#006400] to-[#004d00] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex size-16 items-center justify-center overflow-hidden rounded-full bg-white/10">
            <Image
              src="/dogworld.jpg"
              alt="DogWorld"
              width={64}
              height={64}
              className="size-full object-cover"
            />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">DogWorld</h1>
            <p className="text-sm text-white/70">Sistema de Gestão</p>
          </div>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="pb-2">
            {/* Tabs */}
            <div className="flex rounded-lg bg-muted p-1">
              <button
                onClick={() => { setTab("login"); setError(""); }}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
                  tab === "login"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => { setTab("register"); setError(""); }}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
                  tab === "register"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Cadastrar
              </button>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            {tab === "login" ? (
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    autoComplete="email"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Senha</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      autoComplete="current-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="mt-2 w-full" disabled={submitting}>
                  {submitting ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Nome completo</label>
                  <Input
                    placeholder="João Silva"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    autoComplete="name"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    autoComplete="email"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Senha</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Confirmar senha</label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Repita a senha"
                    value={registerForm.confirm}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirm: e.target.value })}
                    autoComplete="new-password"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Senha de cadastro</label>
                  <div className="relative">
                    <Input
                      type={showPassphrase ? "text" : "password"}
                      placeholder="Fornecida pelo administrador"
                      value={registerForm.passphrase}
                      onChange={(e) => setRegisterForm({ ...registerForm, passphrase: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassphrase(!showPassphrase)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassphrase ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="mt-2 w-full" disabled={submitting}>
                  {submitting ? "Criando conta..." : "Criar conta"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
