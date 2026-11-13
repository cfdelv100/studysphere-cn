import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";

interface PracticeQuestion {
  type: string;
  question: string;
  context?: string;
  choices: string[];
  answer: string;
  acceptedAnswers?: string[];
  explanation: string;
  targetWord: string;
}

interface Activity {
  title: string;
  description: string;
  questions: PracticeQuestion[];
}

const storyPassage = "小明今天去公园。他看见一只小猫。小猫在树下睡觉。小明坐在旁边看书。";

const activities: Record<string, Activity> = {
  "/typing-tutor": {
    title: "Typing Tutor",
    description: "Practice typing Chinese characters and pinyin.",
    questions: [
      { type: "pinyin-to-character", context: "你好", question: "Type the pinyin for these characters.", choices: [], answer: "nǐ hǎo", acceptedAnswers: ["ni hao", "nihao", "nǐhǎo"], explanation: "你好 is pronounced nǐ hǎo and means hello.", targetWord: "你好" },
      { type: "pinyin-to-character", context: "谢谢", question: "Type the pinyin for these characters.", choices: [], answer: "xiè xie", acceptedAnswers: ["xie xie", "xiexie", "xièxie"], explanation: "谢谢 (xiè xie) means thank you.", targetWord: "谢谢" },
      { type: "pinyin-to-character", context: "再见", question: "Type the pinyin for these characters.", choices: [], answer: "zài jiàn", acceptedAnswers: ["zai jian", "zaijian", "zàijiàn"], explanation: "再见 (zài jiàn) means goodbye.", targetWord: "再见" },
      { type: "pinyin-to-character", context: "请", question: "Type the pinyin for this character.", choices: [], answer: "qǐng", acceptedAnswers: ["qing"], explanation: "请 is pronounced qǐng and can mean please.", targetWord: "请" },
      { type: "pinyin-to-character", context: "对不起", question: "Type the pinyin for these characters.", choices: [], answer: "duì bu qǐ", acceptedAnswers: ["dui bu qi", "duibuqi", "duìbuqǐ"], explanation: "对不起 (duì bu qǐ) means sorry or excuse me.", targetWord: "对不起" },
    ],
  },
  "/story-reader": {
    title: "Story Reader",
    description: "Read a short Chinese passage and check your understanding.",
    questions: [
      { type: "story-comprehension", context: storyPassage, question: "Where did Xiaoming go?", choices: [], answer: "the park", acceptedAnswers: ["park"], explanation: "The story says 小明今天去公园: Xiaoming went to the park today.", targetWord: "公园" },
      { type: "story-comprehension", context: storyPassage, question: "What animal did Xiaoming see?", choices: [], answer: "a cat", acceptedAnswers: ["cat", "a kitten", "kitten"], explanation: "He saw 一只小猫, a little cat.", targetWord: "小猫" },
      { type: "vocabulary-in-context", context: storyPassage, question: "Where was the cat sleeping?", choices: [], answer: "under a tree", acceptedAnswers: ["under the tree", "beneath a tree", "beneath the tree"], explanation: "小猫在树下睡觉 means the cat was sleeping under a tree.", targetWord: "树下" },
      { type: "story-comprehension", context: storyPassage, question: "What was Xiaoming doing beside the cat?", choices: [], answer: "reading a book", acceptedAnswers: ["reading", "he was reading a book"], explanation: "小明坐在旁边看书 means Xiaoming sat beside it and read a book.", targetWord: "看书" },
      { type: "vocabulary-in-context", context: storyPassage, question: "What does 公园 mean?", choices: [], answer: "park", acceptedAnswers: ["a park", "the park"], explanation: "公园 (gōng yuán) means park.", targetWord: "公园" },
    ],
  },
  "/character-quiz": {
    title: "Character Quiz",
    description: "Test your knowledge of Chinese characters and meanings.",
    questions: [
      { type: "character-meaning", context: "学", question: "What does this character mean?", choices: [], answer: "study", acceptedAnswers: ["learn", "to study", "to learn"], explanation: "学 (xué) means to study or learn.", targetWord: "学" },
      { type: "character-meaning", context: "人", question: "What does this character mean?", choices: [], answer: "person", acceptedAnswers: ["people", "a person"], explanation: "人 (rén) means person or people.", targetWord: "人" },
      { type: "character-meaning", context: "水", question: "What does this character mean?", choices: [], answer: "water", acceptedAnswers: [], explanation: "水 (shuǐ) means water.", targetWord: "水" },
      { type: "character-meaning", context: "火", question: "What does this character mean?", choices: [], answer: "fire", acceptedAnswers: [], explanation: "火 (huǒ) means fire.", targetWord: "火" },
      { type: "character-meaning", context: "大", question: "What does this character mean?", choices: [], answer: "big", acceptedAnswers: ["large"], explanation: "大 (dà) means big or large.", targetWord: "大" },
    ],
  },
};

const normalizeAnswer = (answer: string) => answer.trim().toLocaleLowerCase().replace(/\s+/g, " ");

export default function LearningActivity() {
  const { pathname } = useLocation();
  const activity = activities[pathname];
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState("");
  const sessionIdRef = useRef<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<PracticeQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  useEffect(() => {
    if (!activity) return;
    let cancelled = false;
    const activityId = pathname.slice(1);
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

  const requestQuestions = async () => {
    if (!activity) return [];
    setIsGenerating(true);
    setGenerationError("");
    try {
      const result = await apiRequest<{ questions: PracticeQuestion[] }>("/api/questions", {
        method: "POST",
        body: JSON.stringify({
          activity: pathname.slice(1),
          excludeQuestions: generatedQuestions.map((question) => question.question).slice(-40),
        }),
      });
      return result.questions;
    } catch (cause) {
      setGenerationError(cause instanceof Error ? cause.message : "Question generation failed.");
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMore = async () => {
    const questions = await requestQuestions();
    if (questions.length) setGeneratedQuestions((current) => [...current, ...questions]);
  };

  if (!activity) return null;

  const generatedIndex = questionIndex - activity.questions.length;
  const currentQuestion = questionIndex < activity.questions.length
    ? activity.questions[questionIndex]
    : generatedQuestions[generatedIndex];
  const totalQuestions = activity.questions.length + generatedQuestions.length;

  const handleCheckAnswer = async () => {
    if (!currentQuestion || !sessionId || isChecked) return;
    const submittedAnswer = normalizeAnswer(answer);
    const acceptedAnswers = [currentQuestion.answer, ...(currentQuestion.acceptedAnswers ?? [])].map(normalizeAnswer);
    const answerIsCorrect = acceptedAnswers.includes(submittedAnswer);
    setIsCorrect(answerIsCorrect);
    setIsChecked(true);
    try {
      await apiRequest(`/api/sessions/${sessionId}/reviews`, {
        method: "POST",
        body: JSON.stringify({ correct: answerIsCorrect, wordText: currentQuestion.targetWord }),
      });
    } catch (cause) {
      setSessionError(cause instanceof Error ? cause.message : "Could not save review progress.");
    }
  };

  const handleNextQuestion = async () => {
    if (!isChecked || isGenerating) return;
    if (questionIndex + 1 < totalQuestions) {
      setAnswer("");
      setIsChecked(false);
      setIsCorrect(false);
      setQuestionIndex((index) => index + 1);
      return;
    }
    const nextQuestions = await requestQuestions();
    if (!nextQuestions.length) return;
    setGeneratedQuestions((current) => [...current, ...nextQuestions]);
    setQuestionIndex(totalQuestions);
    setAnswer("");
    setIsChecked(false);
    setIsCorrect(false);
  };

  const resetCurrentQuestion = () => {
    setAnswer("");
    setIsChecked(false);
    setIsCorrect(false);
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
            {currentQuestion ? <>
              <div className="rounded-lg bg-muted p-6 text-center">
                <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Question {questionIndex + 1} of {totalQuestions}</p>
                {currentQuestion.context && <p className="text-3xl font-semibold" lang="zh">{currentQuestion.context}</p>}
                <p className="mt-3 text-muted-foreground">{currentQuestion.question}</p>
              </div>
              {currentQuestion.choices.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-2">
                  {currentQuestion.choices.map((choice) => <Button key={choice} type="button" variant={answer === choice ? "default" : "outline"} disabled={isChecked} onClick={() => setAnswer(choice)}>{choice}</Button>)}
                </div>
              ) : (
                <Input value={answer} disabled={isChecked} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && answer.trim() && !isChecked) void handleCheckAnswer(); }} placeholder="Type your answer" />
              )}
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={handleCheckAnswer} disabled={!answer.trim() || isChecked || !sessionId}><Check className="mr-2 h-4 w-4" />Check answer</Button>
                <Button type="button" variant="outline" onClick={resetCurrentQuestion}><RotateCcw className="mr-2 h-4 w-4" />Reset</Button>
                {isChecked && <Button type="button" onClick={handleNextQuestion} disabled={isGenerating}>
                  {isGenerating ? "Generating next question…" : "Next Question"}
                </Button>}
              </div>
              {isChecked && <div role="status" className={isCorrect ? "space-y-1 text-sm text-success" : "space-y-1 text-sm text-destructive"}>
                <p className="font-semibold">{isCorrect ? "Correct!" : "Incorrect."}</p>
                {!isCorrect && <p>Correct answer: <strong>{currentQuestion.answer}</strong></p>}
                <p>{currentQuestion.explanation}</p>
              </div>}
            </> : <p className="text-muted-foreground">Loading question…</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>More practice</CardTitle>
            <CardDescription>Generate five additional activity-specific questions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button type="button" onClick={handleGenerateMore} disabled={isGenerating || !sessionId}>
              {isGenerating ? "Generating…" : "Generate more Questions"}
            </Button>
            {generationError && <p role="alert" className="text-sm text-destructive">{generationError}</p>}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
