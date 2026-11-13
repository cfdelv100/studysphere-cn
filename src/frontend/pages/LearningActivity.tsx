import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";

interface GeneratedQuestion {
  type: string;
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
  targetWord: string;
}

const activities = {
  "/typing-tutor": {
    title: "Typing Tutor",
    description: "Practice typing Chinese characters and pinyin.",
    prompt: "你好",
    hint: "nǐ hǎo",
    placeholder: "Type the pinyin for the characters above",
    answers: ["ni hao", "nihao", "nǐ hǎo", "nǐhǎo"],
    targetWord: "你好",
  },
  "/story-reader": {
    title: "Story Reader",
    description: "Read a short Chinese passage and check your understanding.",
    prompt: "小明今天去公园。他看见一只小猫。",
    hint: "Where did Xiaoming go today?",
    placeholder: "Write your answer in English",
    answers: ["park", "the park"],
    targetWord: "公园",
  },
  "/character-quiz": {
    title: "Character Quiz",
    description: "Test your knowledge of Chinese characters and meanings.",
    prompt: "学",
    hint: "What does this character mean?",
    placeholder: "Enter the meaning",
    answers: ["study", "learn"],
    targetWord: "学",
  },
};

export default function LearningActivity() {
  const { pathname } = useLocation();
  const activity = activities[pathname as keyof typeof activities];
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [baseAnswerCorrect, setBaseAnswerCorrect] = useState<boolean | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState("");
  const sessionIdRef = useRef<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [generatedAnswers, setGeneratedAnswers] = useState<Record<number, string>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [checkedAnswers, setCheckedAnswers] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!activity) return;
    const activityId = pathname.slice(1);
    let cancelled = false;
    const finishSession = () => {
      const activeSessionId = sessionIdRef.current;
      if (!activeSessionId) return;
      sessionIdRef.current = null;
      void fetch(`/api/sessions/${activeSessionId}/finish`, { method: "POST", credentials: "same-origin", keepalive: true });
    };
    const groupId = Number(new URLSearchParams(window.location.search).get("group_id"));
    apiRequest<{ id: string }>("/api/sessions/start", {
      method: "POST",
      body: JSON.stringify({ activityId, ...(Number.isInteger(groupId) && groupId > 0 ? { groupId } : {}) }),
    }).then(({ id }) => {
      if (cancelled) {
        void fetch(`/api/sessions/${id}/finish`, { method: "POST", credentials: "same-origin", keepalive: true });
        return;
      }
      sessionIdRef.current = id;
      setSessionId(id);
    }).catch((cause) => setSessionError(cause instanceof Error ? cause.message : "Could not start this study session."));
    window.addEventListener("pagehide", finishSession);
    return () => {
      cancelled = true;
      finishSession();
      window.removeEventListener("pagehide", finishSession);
    };
  }, [activity, pathname]);

  if (!activity) return null;

  const generateQuestions = async () => {
    setIsGenerating(true);
    setGenerationError("");
    try {
      const result = await apiRequest<{ questions: GeneratedQuestion[] }>("/api/questions", {
        method: "POST",
        body: JSON.stringify({
          activity: pathname.slice(1),
          excludeQuestions: generatedQuestions.map((question) => question.question).slice(-40),
        }),
      });
      setGeneratedQuestions((current) => [...current, ...result.questions]);
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "Question generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const checkGeneratedAnswer = (index: number) => {
    setCheckedQuestions((current) => ({ ...current, [index]: true }));
    const expectedAnswer = generatedQuestions[index].answer.trim().toLocaleLowerCase();
    const submittedAnswer = generatedAnswers[index]?.trim().toLocaleLowerCase();
    setCheckedAnswers((current) => ({ ...current, [index]: submittedAnswer === expectedAnswer }));
    void apiRequest(`/api/sessions/${sessionId}/reviews`, { method: "POST", body: JSON.stringify({ correct: submittedAnswer === expectedAnswer, wordText: generatedQuestions[index].targetWord }) })
      .catch((cause) => setSessionError(cause instanceof Error ? cause.message : "Could not save review progress."));
  };

  const resetGeneratedQuestion = (index: number) => {
    setGeneratedAnswers((current) => ({ ...current, [index]: "" }));
    setCheckedQuestions((current) => ({ ...current, [index]: false }));
    setCheckedAnswers((current) => ({ ...current, [index]: false }));
  };

  const checkBaseAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submittedAnswer = answer.trim().toLocaleLowerCase();
    const isCorrect = activity.answers.some((expected) => submittedAnswer === expected.toLocaleLowerCase());
    setBaseAnswerCorrect(isCorrect);
    setChecked(true);
    if (sessionId) {
      void apiRequest(`/api/sessions/${sessionId}/reviews`, { method: "POST", body: JSON.stringify({ correct: isCorrect, wordText: activity.targetWord }) })
        .catch((cause) => setSessionError(cause instanceof Error ? cause.message : "Could not save review progress."));
    }
  };

  const resetBaseQuestion = () => {
    setAnswer("");
    setChecked(false);
    setBaseAnswerCorrect(null);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-2xl space-y-6">
        <Button variant="ghost" asChild>
          <Link to="/study-activities"><ArrowLeft className="mr-2 h-4 w-4" />All activities</Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{activity.title}</CardTitle>
            <CardDescription>{activity.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {sessionError && <p role="alert" className="text-sm text-destructive">{sessionError}</p>}
            <div className="rounded-lg bg-muted p-6 text-center">
              <p className="text-3xl font-semibold" lang="zh">{activity.prompt}</p>
              <p className="mt-3 text-muted-foreground">{activity.hint}</p>
            </div>
            <form onSubmit={checkBaseAnswer} className="space-y-4">
              <Input value={answer} onChange={(event) => { setAnswer(event.target.value); setChecked(false); }} placeholder={activity.placeholder} />
              <div className="flex gap-2">
                <Button type="submit" disabled={!answer.trim() || checked || !sessionId}><Check className="mr-2 h-4 w-4" />Check answer</Button>
                <Button type="button" variant="outline" onClick={resetBaseQuestion}><RotateCcw className="mr-2 h-4 w-4" />Reset</Button>
              </div>
              {checked && <p role="status" className={baseAnswerCorrect ? "text-sm font-medium text-success" : "text-sm font-medium text-destructive"}>{baseAnswerCorrect ? "Correct!" : `Incorrect. The answer is ${activity.answers[0]}.`}</p>}
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Practice with more questions</CardTitle>
            <CardDescription>Generate five new questions tailored to this activity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Button type="button" onClick={generateQuestions} disabled={isGenerating || !sessionId}>
              {isGenerating ? "Generating…" : "Generate more Questions"}
            </Button>
            {generationError && <p role="alert" className="text-sm text-destructive">{generationError}</p>}
            {generatedQuestions.map((question, index) => (
              <div key={`${index}-${question.question}`} className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{index + 1}. {question.question}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{question.type}</span>
                </div>
                {question.targetWord && <p className="text-sm text-muted-foreground">Target: <span lang="zh">{question.targetWord}</span></p>}
                {question.choices.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {question.choices.map((choice) => (
                      <Button key={choice} type="button" size="sm" variant={generatedAnswers[index] === choice ? "default" : "outline"} disabled={checkedQuestions[index]} onClick={() => setGeneratedAnswers((current) => ({ ...current, [index]: choice }))}>{choice}</Button>
                    ))}
                  </div>
                ) : (
                  <Input value={generatedAnswers[index] ?? ""} disabled={checkedQuestions[index]} onChange={(event) => setGeneratedAnswers((current) => ({ ...current, [index]: event.target.value }))} placeholder="Type your answer" />
                )}
                {checkedQuestions[index] ? (
                  <div role="status" className={checkedAnswers[index] ? "space-y-1 text-sm text-success" : "space-y-1 text-sm text-destructive"}>
                    <p className="font-semibold">{checkedAnswers[index] ? "Correct!" : "Incorrect."}</p>
                    {!checkedAnswers[index] && <p>Correct answer: <strong>{question.answer}</strong></p>}
                    <p>{question.explanation}</p>
                  </div>
                ) : (
                  <Button type="button" size="sm" disabled={!generatedAnswers[index]?.trim() || !sessionId} onClick={() => checkGeneratedAnswer(index)}>Check answer</Button>
                )}
                <Button type="button" size="sm" variant="outline" onClick={() => resetGeneratedQuestion(index)}><RotateCcw className="mr-2 h-4 w-4" />Reset</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
