import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Users } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "@/lib/api";

// Mock data for study activities
const studyActivities = {
  "typing-tutor": {
    id: "typing-tutor",
    title: "Typing Tutor",
    description: "Practice typing Chinese characters using pinyin input methods. Improve your typing speed and accuracy while reinforcing character recognition and pinyin associations.",
    thumbnail: "⌨️",
    launchUrl: "/typing-tutor",
    status: "active",
    features: [
      "Pinyin input practice",
      "Speed tracking",
      "Accuracy metrics",
      "Character recognition",
    ],
  },
  "story-reader": {
    id: "story-reader",
    title: "Story Reader",
    description: "Read Chinese stories with interactive vocabulary hints.",
    thumbnail: "📖",
    launchUrl: "/story-reader",
    status: "beta",
    features: ["Guided reading practice", "Vocabulary in context", "Reading comprehension"],
  },
  "character-quiz": {
    id: "character-quiz",
    title: "Character Quiz",
    description: "Test your knowledge of Chinese characters and meanings.",
    thumbnail: "❓",
    launchUrl: "/character-quiz",
    status: "active",
    features: ["Character recognition", "Meaning recall", "Self-paced practice"],
  },
};

interface StudySession { id: string; activityId: string; startedAt: string; durationSeconds: number; wordsReviewed: number }

export default function StudyActivityDetail() {
  const { id } = useParams();
  const activity = studyActivities[id as keyof typeof studyActivities];
  const [recentSessions, setRecentSessions] = useState<StudySession[]>([]);

  useEffect(() => {
    if (!id) return;
    apiRequest<{ sessions: StudySession[] }>("/api/sessions?search=")
      .then(({ sessions }) => setRecentSessions(sessions.filter((session) => session.activityId === id).slice(0, 5)))
      .catch(() => setRecentSessions([]));
  }, [id]);

  if (!activity) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-destructive">Activity Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The requested study activity could not be found.
          </p>
          <Button asChild className="mt-4">
            <Link to="/study-activities">Back to Activities</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const handleLaunch = () => {
    window.location.href = activity.launchUrl;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Activity Information */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="text-6xl">{activity.thumbnail}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-2xl">{activity.title}</CardTitle>
                  <Badge variant={activity.status === "active" ? "default" : "secondary"}>
                    {activity.status}
                  </Badge>
                </div>
                <CardDescription className="text-base leading-relaxed">
                  {activity.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {activity.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={() => handleLaunch()} className="w-full sm:w-auto">
                <Play className="mr-2 h-4 w-4" />
                Launch Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sessions List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Sessions
            </CardTitle>
            <CardDescription>
              History of sessions using this activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card-hover"
                >
                  <div className="flex items-center gap-4">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{new Date(session.startedAt).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{Math.floor(session.durationSeconds / 60)}m {session.durationSeconds % 60}s</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{session.wordsReviewed} words</p>
                    <p className="text-sm text-muted-foreground">reviewed</p>
                  </div>
                </div>
              ))}
              {!recentSessions.length && <p className="py-4 text-sm text-muted-foreground">No sessions for this activity yet.</p>}
              <Button variant="link" asChild><Link to="/sessions">View all session history</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
import { useEffect, useState } from "react";
