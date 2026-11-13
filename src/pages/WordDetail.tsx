import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/api";
import { ArrowLeft, Volume2 } from "lucide-react";

interface Word { id: number; simplified: string; traditional: string; pinyin: string; english: string; category: string; hskLevel: number | null; correct: number; incorrect: number }
interface WordGroup { id: number; name: string }

export default function WordDetail() {
  const { id } = useParams();
  const [word, setWord] = useState<Word | null>(null);
  const [groups, setGroups] = useState<WordGroup[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    apiRequest<{ word: Word; groups: WordGroup[] }>(`/api/words/${id}`)
      .then((result) => { setWord(result.word); setGroups(result.groups); })
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load this word."));
  }, [id]);

  return (
    <Layout>
      <div className="mx-auto max-w-3xl space-y-6">
        <Button variant="ghost" asChild><Link to="/words"><ArrowLeft className="mr-2 h-4 w-4" />All words</Link></Button>
        {error ? <p role="alert" className="text-destructive">{error}</p> : !word ? <p className="text-muted-foreground">Loading word…</p> : <>
          <Card><CardHeader><div className="flex items-start justify-between gap-4"><div><CardTitle className="font-chinese text-5xl" lang="zh">{word.simplified}</CardTitle>{word.traditional !== word.simplified && <CardDescription className="mt-2">Traditional: <span lang="zh">{word.traditional}</span></CardDescription>}</div><Button variant="outline" size="icon" title="Play pronunciation" onClick={() => window.speechSynthesis?.speak(new SpeechSynthesisUtterance(word.simplified))}><Volume2 className="h-4 w-4" /></Button></div></CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2"><div><p className="text-sm text-muted-foreground">Pinyin</p><p className="mt-1 text-xl font-mono">{word.pinyin}</p></div><div><p className="text-sm text-muted-foreground">Meaning</p><p className="mt-1 text-xl">{word.english}</p></div><div><p className="text-sm text-muted-foreground">Category</p><p className="mt-1"><Badge variant="secondary" className="capitalize">{word.category}{word.hskLevel ? ` · HSK ${word.hskLevel}` : ""}</Badge></p></div><div><p className="text-sm text-muted-foreground">Your review history</p><p className="mt-1">{word.correct} correct · {word.incorrect} incorrect</p></div></CardContent>
          </Card>
          <Card><CardHeader><CardTitle>Word Groups</CardTitle><CardDescription>Browse this word in its themed vocabulary groups.</CardDescription></CardHeader><CardContent className="flex flex-wrap gap-2">{groups.map((group) => <Button key={group.id} variant="outline" asChild><Link to={`/groups/${group.id}`}>{group.name}</Link></Button>)}{!groups.length && <p className="text-sm text-muted-foreground">This word is not assigned to a group yet.</p>}</CardContent></Card>
        </>}
      </div>
    </Layout>
  );
}
