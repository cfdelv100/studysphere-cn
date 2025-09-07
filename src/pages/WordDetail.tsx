import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Volume2, BookOpen, Calendar, Target } from "lucide-react";
import { Link, useParams } from "react-router-dom";

// Mock data for word detail
const mockWords = {
  "1": {
    id: "1",
    chinese: "你好",
    pinyin: "nǐ hǎo",
    english: "Hello",
    definition: "A common greeting used throughout the day. Literally means 'you good'.",
    correct: 15,
    incorrect: 3,
    totalReviews: 18,
    groups: ["Core Vocabulary", "Greetings"],
    example: {
      chinese: "你好吗？",
      pinyin: "nǐ hǎo ma?",
      english: "How are you?",
    },
    recentSessions: [
      {
        date: "2024-01-15",
        activity: "Adventure MUD",
        result: "correct",
      },
      {
        date: "2024-01-14", 
        activity: "Typing Tutor",
        result: "correct",
      },
      {
        date: "2024-01-13",
        activity: "Adventure MUD", 
        result: "incorrect",
      },
    ],
  },
};

export default function WordDetail() {
  const { id } = useParams();
  const word = mockWords[id as keyof typeof mockWords];

  if (!word) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-destructive">Word Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The requested word could not be found.
          </p>
          <Button asChild className="mt-4">
            <Link to="/words">Back to Words</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const accuracy = Math.round((word.correct / word.totalReviews) * 100);

  const playAudio = () => {
    console.log(`Playing audio for: ${word.chinese}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Word Information */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-4xl font-chinese text-chinese-primary mb-2">
                  {word.chinese}
                </CardTitle>
                <CardDescription className="text-lg">
                  <span className="font-mono text-muted-foreground">{word.pinyin}</span>
                  <span className="mx-2">•</span>
                  <span className="font-medium">{word.english}</span>
                </CardDescription>
              </div>
              <Button onClick={playAudio} variant="outline" size="lg">
                <Volume2 className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Definition</h3>
                <p className="text-muted-foreground">{word.definition}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Example</h3>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="font-chinese text-lg text-chinese-primary">
                    {word.example.chinese}
                  </p>
                  <p className="font-mono text-sm text-muted-foreground">
                    {word.example.pinyin}
                  </p>
                  <p className="text-sm">{word.example.english}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Word Groups</h3>
                <div className="flex flex-wrap gap-2">
                  {word.groups.map((group, index) => (
                    <Badge key={index} variant="secondary">
                      <BookOpen className="mr-1 h-3 w-3" />
                      {group}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{accuracy}%</div>
              <Progress value={accuracy} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Correct</CardTitle>
              <Target className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{word.correct}</div>
              <p className="text-xs text-muted-foreground">Total correct answers</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Incorrect</CardTitle>
              <Target className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{word.incorrect}</div>
              <p className="text-xs text-muted-foreground">Total incorrect answers</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Recent review sessions for this word
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {word.recentSessions.map((session, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card-hover"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{session.activity}</p>
                      <p className="text-sm text-muted-foreground">{session.date}</p>
                    </div>
                  </div>
                  <Badge
                    variant={session.result === "correct" ? "default" : "destructive"}
                  >
                    {session.result}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}