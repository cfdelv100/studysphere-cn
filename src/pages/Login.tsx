import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/auth/AuthContext";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/dashboard";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(email, password);
      navigate(redirectTo, { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to StudySphere</CardTitle>
          <CardDescription>Use your account to access your vocabulary and study history.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block space-y-2 text-sm font-medium">Email<Input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <label className="block space-y-2 text-sm font-medium">Password<Input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button className="w-full" disabled={submitting}>{submitting ? "Signing in…" : "Sign in"}</Button>
            <p className="text-sm text-center text-muted-foreground">New here? <Link className="text-primary underline" to="/register">Create an account</Link></p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
