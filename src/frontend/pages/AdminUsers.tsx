import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/api";

interface Account { id: string; email: string; displayName: string; role: "user" | "admin"; createdAt: string }

export default function AdminUsers() {
  const [users, setUsers] = useState<Account[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<{ users: Account[] }>("/api/admin/users")
      .then((result) => setUsers(result.users))
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load accounts."));
  }, []);

  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
          <CardDescription>Administrator view of registered StudySphere accounts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          {users.map((account) => (
            <div key={account.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-4">
              <div><p className="font-medium">{account.displayName}</p><p className="text-sm text-muted-foreground">{account.email}</p></div>
              <div className="flex items-center gap-3"><Badge variant={account.role === "admin" ? "default" : "secondary"}>{account.role}</Badge><span className="text-xs text-muted-foreground">Joined {new Date(account.createdAt).toLocaleDateString()}</span></div>
            </div>
          ))}
          {!users.length && !error && <p className="text-sm text-muted-foreground">Loading accounts…</p>}
        </CardContent>
      </Card>
    </Layout>
  );
}
