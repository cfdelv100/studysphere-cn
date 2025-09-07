import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock, Users } from "lucide-react";
import { Link, useParams } from "react-router-dom";

// Mock data for study activities
const studyActivities = {
  "adventure-mud": {
    id: "adventure-mud",
    title: "Adventure MUD",
    description: "Immerse yourself in a text-based adventure game while learning Chinese vocabulary. Navigate through different scenarios and interact with characters to practice reading comprehension and vocabulary acquisition.",
    thumbnail: "🗺️",
    launchUrl: "http://localhost:8081",
    status: "active",
    features: [
      "Interactive storylines",
      "Context-based vocabulary learning",
      "Real-time feedback",
      "Progress tracking",
    ],
  },
  "typing-tutor": {
    id: "typing-tutor",
    title: "Typing Tutor",
    description: "Practice typing Chinese characters using pinyin input methods. Improve your typing speed and accuracy while reinforcing character recognition and pinyin associations.",
    thumbnail: "⌨️",
    launchUrl: "http://localhost:8082",
    status: "active",
    features: [
      "Pinyin input practice",
      "Speed tracking",
      "Accuracy metrics",
      "Character recognition",
    ],
  },
};

// Mock sessions data
const mockSessions = [
  {
    id: "1",
    groupName: "Core Vocabulary",
    groupId: "1",
    startTime: "2024-01-15 14:30",
    endTime: "2024-01-15 15:15",
    reviewItems: 23,
  },
  {
    id: "2",
    groupName: "Travel Phrases",
    groupId: "2",
    startTime: "2024-01-14 09:15",
    endTime: "2024-01-14 09:45",
    reviewItems: 15,
  },
  {
    id: "3",
    groupName: "Core Vocabulary",
    groupId: "1",
    startTime: "2024-01-13 16:00",
    endTime: "2024-01-13 16:30",
    reviewItems: 18,
  },
];

export default function StudyActivityDetail() {
  const { id } = useParams();
  const activity = studyActivities[id as keyof typeof studyActivities];

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

  const handleLaunch = (groupId: string = "1") => {
    const url = `${activity.launchUrl}?group_id=${groupId}`;
    window.open(url, "_blank");
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
                <ExternalLink className="mr-2 h-4 w-4" />
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
              {mockSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card-hover"
                >
                  <div className="flex items-center gap-4">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Link
                        to={`/groups/${session.groupId}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {session.groupName}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {session.startTime} - {session.endTime.split(' ')[1]}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{session.reviewItems} items</p>
                    <p className="text-sm text-muted-foreground">reviewed</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}