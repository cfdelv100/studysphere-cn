import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiRequest } from "@/lib/api";
import { Search, ArrowUpDown, ChevronUp, ChevronDown, FolderOpen } from "lucide-react";

interface WordGroup { id: number; name: string; description: string; wordCount: number }
type SortField = "name" | "wordCount";

export default function Groups() {
  const [groups, setGroups] = useState<WordGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [error, setError] = useState("");
  useEffect(() => { apiRequest<{ groups: WordGroup[] }>("/api/groups").then((result) => setGroups(result.groups)).catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load groups.")); }, []);

  const shownGroups = useMemo(() => groups.filter((group) => `${group.name} ${group.description}`.toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => {
    const comparison = sortField === "name" ? a.name.localeCompare(b.name) : a.wordCount - b.wordCount;
    return comparison * (sortDirection === "asc" ? 1 : -1);
  }), [groups, searchQuery, sortField, sortDirection]);
  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDirection((direction) => direction === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDirection("asc"); }
  };
  const icon = (field: SortField) => sortField !== field ? <ArrowUpDown className="h-3 w-3" /> : sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;

  return (
    <Layout>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold tracking-tight">Word Groups</h1><p className="text-muted-foreground">Open a topic to see its Mandarin vocabulary.</p></div>
        <Card><CardContent className="pt-6"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search groups…" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="pl-10" /></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><FolderOpen className="h-5 w-5" />Groups ({shownGroups.length})</CardTitle></CardHeader><CardContent>
          {error && <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}
          <div className="rounded-md border overflow-x-auto"><Table><TableHeader><TableRow><TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>Group {icon("name")}</TableHead><TableHead>Description</TableHead><TableHead className="text-center cursor-pointer" onClick={() => toggleSort("wordCount")}>Words {icon("wordCount")}</TableHead></TableRow></TableHeader>
            <TableBody>{shownGroups.map((group) => <TableRow key={group.id} className="cursor-pointer"><TableCell><Link to={`/groups/${group.id}`} className="flex items-center gap-2 font-medium text-primary hover:underline"><FolderOpen className="h-4 w-4" />{group.name}</Link></TableCell><TableCell className="text-muted-foreground">{group.description}</TableCell><TableCell className="text-center"><Link to={`/groups/${group.id}`} className="font-medium text-primary hover:underline">{group.wordCount}</Link></TableCell></TableRow>)}{!shownGroups.length && <TableRow><TableCell colSpan={3} className="py-8 text-center text-muted-foreground">No groups found.</TableCell></TableRow>}</TableBody>
          </Table></div>
          <p className="mt-3 text-sm text-muted-foreground">Showing all {shownGroups.length} groups</p>
        </CardContent></Card>
      </div>
    </Layout>
  );
}
