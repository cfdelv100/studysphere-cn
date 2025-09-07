import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Target, TrendingUp } from "lucide-react";

const mockData = {
  lastSession: {
    date: "2024-01-15",
    activity: "Adventure MUD",
    duration: "45 minutes",
    wordsReviewed: 23,
    accuracy: 85,
  },
  weeklyProgress: {
    wordsLearned: 45,
    sessionsCompleted: 8,
    studyTime: 380, // minutes
    averageAccuracy: 87,
  },
};

export default function Dashboard() {
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
              Your most recent study session details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Activity</p>
                <p className="text-lg font-semibold">{mockData.lastSession.activity}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p className="text-lg font-semibold">{mockData.lastSession.date}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                <p className="text-lg font-semibold">{mockData.lastSession.duration}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Words Reviewed</p>
                <p className="text-lg font-semibold text-chinese-accent">
                  {mockData.lastSession.wordsReviewed}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Accuracy</span>
                <span className="text-sm text-muted-foreground">
                  {mockData.lastSession.accuracy}%
                </span>
              </div>
              <Progress value={mockData.lastSession.accuracy} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Words Learned</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {mockData.weeklyProgress.wordsLearned}
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
                {mockData.weeklyProgress.sessionsCompleted}
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
                {Math.floor(mockData.weeklyProgress.studyTime / 60)}h{" "}
                {mockData.weeklyProgress.studyTime % 60}m
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
                {mockData.weeklyProgress.averageAccuracy}%
              </div>
              <p className="text-xs text-muted-foreground">Average accuracy</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}