import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiRequest } from "@/lib/api";
import { ArrowLeft, Search } from "lucide-react";

interface Word { id: number; simplified: string; traditional: string; pinyin: string; english: string; hskLevel: number | null; correct: number; incorrect: number }
interface WordGroup { id: number; name: string; description: string; wordCount: number }

export default function GroupDetail() {
  const { id } = useParams();
  const [group, setGroup] = useState<WordGroup | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    apiRequest<{ group: WordGroup; words: Word[] }>(`/api/groups/${id}`)
      .then((result) => { setGroup(result.group); setWords(result.words); })
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load this word group."));
  }, [id]);

  const filteredWords = useMemo(() => words.filter((word) => `${word.simplified} ${word.traditional} ${word.pinyin} ${word.english}`.toLowerCase().includes(searchQuery.toLowerCase())), [words, searchQuery]);

  return (
    <Layout>
      <div className="space-y-6">
        <Button variant="ghost" asChild><Link to="/groups"><ArrowLeft className="mr-2 h-4 w-4" />All word groups</Link></Button>
        {error ? <p role="alert" className="text-destructive">{error}</p> : !group ? <p className="text-muted-foreground">Loading word group…</p> : <>
          <Card><CardHeader><CardTitle className="text-2xl">{group.name}</CardTitle><CardDescription>{group.description}</CardDescription><Badge variant="secondary" className="mt-3 w-fit">{group.wordCount} words</Badge></CardHeader></Card>
          <Card><CardContent className="pt-6"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder={`Search ${group.name} vocabulary…`} value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="pl-10" /></div></CardContent></Card>
          <Card><CardHeader><CardTitle>Words in {group.name} ({filteredWords.length})</CardTitle></CardHeader><CardContent>
            <div className="rounded-md border overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Mandarin</TableHead><TableHead>Pinyin</TableHead><TableHead>English</TableHead><TableHead className="text-center">Correct</TableHead><TableHead className="text-center">Incorrect</TableHead></TableRow></TableHeader><TableBody>
              {filteredWords.map((word) => <TableRow key={word.id}><TableCell><Link to={`/words/${word.id}`} className="font-chinese text-lg text-primary hover:underline" lang="zh">{word.simplified}</Link>{word.traditional !== word.simplified && <span className="ml-2 text-sm text-muted-foreground" lang="zh">{word.traditional}</span>}</TableCell><TableCell className="font-mono">{word.pinyin}</TableCell><TableCell>{word.english}</TableCell><TableCell className="text-center">{word.correct}</TableCell><TableCell className="text-center">{word.incorrect}</TableCell></TableRow>)}
              {!filteredWords.length && <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No words match this search.</TableCell></TableRow>}
            </TableBody></Table></div>
          </CardContent></Card>
        </>}
      </div>
    </Layout>
  );
}
