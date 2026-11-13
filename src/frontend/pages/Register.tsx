import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/auth/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(displayName, email, password);
      navigate("/dashboard", { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create the account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your StudySphere account</CardTitle>
          <CardDescription>Your study history and review counts will be saved to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block space-y-2 text-sm font-medium">Name<Input autoComplete="name" required maxLength={80} value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label>
            <label className="block space-y-2 text-sm font-medium">Email<Input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <label className="block space-y-2 text-sm font-medium">Password (at least 12 characters)<Input type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button className="w-full" disabled={submitting}>{submitting ? "Creating account…" : "Create account"}</Button>
            <p className="text-sm text-center text-muted-foreground">Already have an account? <Link className="text-primary underline" to="/login">Sign in</Link></p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
