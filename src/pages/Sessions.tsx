import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiRequest } from "@/lib/api";
import { Search, Clock, GraduationCap } from "lucide-react";

interface StudySession { id: string; activityId: string; activityName: string; startedAt: string; endedAt: string | null; durationSeconds: number; wordsReviewed: number; correct: number; incorrect: number; accuracy: number; groupId: number | null; groupName: string | null }

export default function Sessions() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(true);
      apiRequest<{ sessions: StudySession[] }>(`/api/sessions?search=${encodeURIComponent(searchQuery)}`)
        .then((result) => { setSessions(result.sessions); setError(""); })
        .catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load session history."))
        .finally(() => setLoading(false));
    }, searchQuery ? 200 : 0);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)}m ${seconds % 60}s`;

  return (
    <Layout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold tracking-tight">Sessions</h1><p className="text-muted-foreground">Search your study history, start times, duration, and review progress.</p></div>
        <Card><CardContent className="pt-6"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by activity, group, or date…" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="pl-10" /></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Study history ({sessions.length})</CardTitle></CardHeader><CardContent>
          {error && <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}
          <div className="rounded-md border overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Activity</TableHead><TableHead>Activated</TableHead><TableHead>Ended</TableHead><TableHead>Duration</TableHead><TableHead>Words reviewed</TableHead><TableHead>Correct / incorrect</TableHead><TableHead>Accuracy</TableHead></TableRow></TableHeader><TableBody>
            {sessions.map((session) => <TableRow key={session.id}>
              <TableCell><div className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-muted-foreground" /><Link to={`/${session.activityId}`} className="font-medium text-primary hover:underline">{session.activityName}</Link></div>{session.groupName && <Link to={`/groups/${session.groupId}`} className="ml-6 text-xs text-muted-foreground hover:underline">{session.groupName}</Link>}</TableCell>
              <TableCell className="whitespace-nowrap">{new Date(session.startedAt).toLocaleString()}</TableCell><TableCell className="whitespace-nowrap">{session.endedAt ? new Date(session.endedAt).toLocaleString() : <Badge variant="secondary">In progress</Badge>}</TableCell><TableCell>{formatDuration(session.durationSeconds)}</TableCell><TableCell>{session.wordsReviewed}</TableCell><TableCell><span className="text-success">{session.correct}</span> / <span className="text-destructive">{session.incorrect}</span></TableCell><TableCell>{session.accuracy}%</TableCell>
            </TableRow>)}
            {!loading && !sessions.length && <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">No session history matches your search.</TableCell></TableRow>}
            {loading && <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">Loading sessions…</TableCell></TableRow>}
          </TableBody></Table></div>
        </CardContent></Card>
      </div>
    </Layout>
  );
}
