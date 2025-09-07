import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const studyActivities = [
  {
    id: "adventure-mud",
    title: "Adventure MUD",
    description: "Immersive text-based adventure game for vocabulary learning",
    thumbnail: "🗺️",
    launchUrl: "http://localhost:8081",
    status: "active",
  },
  {
    id: "typing-tutor",
    title: "Typing Tutor",
    description: "Practice typing Chinese characters with pinyin input",
    thumbnail: "⌨️",
    launchUrl: "http://localhost:8082",
    status: "active",
  },
  {
    id: "story-reader",
    title: "Story Reader",
    description: "Read Chinese stories with interactive vocabulary hints",
    thumbnail: "📖",
    launchUrl: "http://localhost:8083",
    status: "beta",
  },
  {
    id: "character-quiz",
    title: "Character Quiz",
    description: "Test your knowledge of Chinese characters and meanings",
    thumbnail: "❓",
    launchUrl: "http://localhost:8084",
    status: "active",
  },
];

export default function StudyActivities() {
  const handleLaunch = (activity: typeof studyActivities[0], groupId: string = "1") => {
    const url = `${activity.launchUrl}?group_id=${groupId}`;
    window.open(url, "_blank");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Study Activities</h1>
            <p className="text-muted-foreground">
              Choose from various interactive learning activities
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyActivities.map((activity) => (
            <Card key={activity.id} className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-4xl mb-2">{activity.thumbnail}</div>
                  <Badge
                    variant={activity.status === "active" ? "default" : "secondary"}
                  >
                    {activity.status}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{activity.title}</CardTitle>
                <CardDescription>{activity.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleLaunch(activity)}
                    className="flex-1"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Launch
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="flex-1"
                  >
                    <Link to={`/study-activities/${activity.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}