import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiRequest } from "@/lib/api";
import { ChevronLeft, ChevronRight, Volume2, Search, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";

interface Word { id: number; simplified: string; traditional: string; pinyin: string; english: string; category: string; hskLevel: number | null; correct: number; incorrect: number }
type SortField = "simplified" | "pinyin" | "english" | "correct" | "incorrect";

export default function Words() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalWords, setTotalWords] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("simplified");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setLoading(true);
      const params = new URLSearchParams({ page: String(currentPage), limit: "50", search: searchQuery });
      apiRequest<{ words: Word[]; total: number; totalPages: number }>(`/api/words?${params}`)
        .then((result) => { setWords(result.words); setTotalWords(result.total); setTotalPages(result.totalPages); setError(""); })
        .catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load vocabulary."))
        .finally(() => setLoading(false));
    }, searchQuery ? 200 : 0);
    return () => window.clearTimeout(timeoutId);
  }, [currentPage, searchQuery]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection((direction) => direction === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDirection("asc"); }
  };
  const sortIcon = (field: SortField) => sortField !== field ? <ArrowUpDown className="h-3 w-3 text-muted-foreground" /> : sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
  const sortedWords = [...words].sort((a, b) => {
    const result = typeof a[sortField] === "number" && typeof b[sortField] === "number"
      ? (a[sortField] as number) - (b[sortField] as number)
      : String(a[sortField]).localeCompare(String(b[sortField]));
    return result * (sortDirection === "asc" ? 1 : -1);
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold tracking-tight">Words</h1><p className="text-muted-foreground">Browse all vocabulary available in the database.</p></div>
        <Card><CardContent className="pt-6"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search characters, pinyin, or English…" value={searchQuery} onChange={(event) => { setSearchQuery(event.target.value); setCurrentPage(1); }} className="pl-10" /></div></CardContent></Card>
        <Card>
          <CardHeader><CardTitle>Vocabulary ({totalWords} words)</CardTitle></CardHeader>
          <CardContent>
            {error && <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  {([["simplified", "Mandarin"], ["pinyin", "Pinyin"], ["english", "English"]] as const).map(([field, label]) => <TableHead key={field} className="cursor-pointer" onClick={() => handleSort(field)}><span className="inline-flex items-center gap-1">{label}{sortIcon(field)}</span></TableHead>)}
                  <TableHead>Group topic</TableHead><TableHead className="text-center cursor-pointer" onClick={() => handleSort("correct")}>Correct {sortIcon("correct")}</TableHead><TableHead className="text-center cursor-pointer" onClick={() => handleSort("incorrect")}>Incorrect {sortIcon("incorrect")}</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {sortedWords.map((word) => <TableRow key={word.id}>
                    <TableCell><div className="flex items-center gap-2"><Link to={`/words/${word.id}`} className="font-chinese text-lg font-medium text-chinese-primary hover:text-chinese-accent" lang="zh">{word.simplified}</Link>{word.traditional !== word.simplified && <span className="text-sm text-muted-foreground" lang="zh">({word.traditional})</span>}<Button variant="ghost" size="sm" title={`Play ${word.simplified}`} onClick={() => window.speechSynthesis?.speak(new SpeechSynthesisUtterance(word.simplified))} className="h-6 w-6 p-0"><Volume2 className="h-3 w-3" /></Button></div></TableCell>
                    <TableCell className="font-mono text-muted-foreground">{word.pinyin}</TableCell><TableCell>{word.english}</TableCell><TableCell><Badge variant="secondary" className="capitalize">{word.category}{word.hskLevel ? ` · HSK ${word.hskLevel}` : ""}</Badge></TableCell><TableCell className="text-center">{word.correct}</TableCell><TableCell className="text-center">{word.incorrect}</TableCell>
                  </TableRow>)}
                  {!loading && !sortedWords.length && <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No vocabulary matches this search.</TableCell></TableRow>}
                  {loading && <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">Loading vocabulary…</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-4"><Button variant="outline" disabled={currentPage <= 1 || loading} onClick={() => setCurrentPage((page) => page - 1)}><ChevronLeft className="h-4 w-4 mr-1" />Previous</Button><p className="text-sm text-muted-foreground">Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong></p><Button variant="outline" disabled={currentPage >= totalPages || loading} onClick={() => setCurrentPage((page) => page + 1)}>Next<ChevronRight className="h-4 w-4 ml-1" /></Button></div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
