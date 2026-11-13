import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, BookOpen, Target, TrendingUp } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface StudySession { id: string; activityName: string; startedAt: string; accessedAt: string; durationSeconds: number; wordsReviewed: number; correct: number; incorrect: number }

export default function Dashboard() {
  const [lastSession, setLastSession] = useState<StudySession | null>(null);
  const [weeklyProgress, setWeeklyProgress] = useState({ wordsReviewed: 0, sessionsCompleted: 0, studyTime: 0, averageAccuracy: 0 });

  useEffect(() => {
    apiRequest<{ sessions: StudySession[] }>("/api/sessions?search=").then(({ sessions }) => {
      setLastSession(sessions[0] ?? null);
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const thisWeek = sessions.filter((session) => new Date(session.startedAt).getTime() >= weekAgo);
      const correct = thisWeek.reduce((total, session) => total + session.correct, 0);
      const reviewed = thisWeek.reduce((total, session) => total + session.wordsReviewed, 0);
      setWeeklyProgress({
        wordsReviewed: reviewed,
        sessionsCompleted: thisWeek.length,
        studyTime: Math.round(thisWeek.reduce((total, session) => total + session.durationSeconds, 0) / 60),
        averageAccuracy: reviewed ? Math.round((correct / reviewed) * 100) : 0,
      });
    }).catch(() => setLastSession(null));
  }, []);

  const accessedAt = lastSession
    ? new Date(lastSession.startedAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;
  const duration = lastSession
    ? `${Math.floor(lastSession.durationSeconds / 60)}m ${lastSession.durationSeconds % 60}s`
    : null;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's your learning progress overview.
            </p>
          </div>
        </div>

        {/* Last Session Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Last Session
            </CardTitle>
            <CardDescription>
              Most recently accessed activity and session progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lastSession ? <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Activity</p>
                <p className="text-lg font-semibold">{lastSession.activityName}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Accessed</p>
                <p className="text-lg font-semibold">{accessedAt}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                <p className="text-lg font-semibold">{duration}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Words Reviewed</p>
                <p className="text-lg font-semibold text-chinese-accent">
                  {lastSession.wordsReviewed}
                </p>
              </div>
            </div> : <p className="text-sm text-muted-foreground">Open one of the study activities to start tracking your latest activity.</p>}
          </CardContent>
        </Card>

        {/* Weekly Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Words Reviewed</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {weeklyProgress.wordsReviewed}
              </div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {weeklyProgress.sessionsCompleted}
              </div>
              <p className="text-xs text-muted-foreground">Completed this week</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {Math.floor(weeklyProgress.studyTime / 60)}h{" "}
                {weeklyProgress.studyTime % 60}m
              </div>
              <p className="text-xs text-muted-foreground">Total this week</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {weeklyProgress.averageAccuracy}%
              </div>
              <p className="text-xs text-muted-foreground">Average accuracy</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
