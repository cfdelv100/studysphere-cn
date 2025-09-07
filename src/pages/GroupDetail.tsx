import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  Search,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  FolderOpen
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

// Mock data
const mockGroups = {
  "1": {
    id: "1",
    name: "Core Vocabulary",
    description: "Essential words for beginners learning Chinese",
    wordCount: 45,
    words: [
      {
        id: "1",
        chinese: "你好",
        pinyin: "nǐ hǎo",
        english: "Hello",
        correct: 15,
        incorrect: 3,
      },
      {
        id: "2", 
        chinese: "谢谢",
        pinyin: "xiè xiè",
        english: "Thank you",
        correct: 22,
        incorrect: 1,
      },
      {
        id: "3",
        chinese: "学习",
        pinyin: "xué xí",
        english: "To study/learn",
        correct: 8,
        incorrect: 5,
      },
      {
        id: "4",
        chinese: "中文",
        pinyin: "zhōng wén",
        english: "Chinese language",
        correct: 12,
        incorrect: 2,
      },
      {
        id: "5",
        chinese: "朋友",
        pinyin: "péng yǒu",
        english: "Friend",
        correct: 18,
        incorrect: 4,
      },
    ],
  },
  "2": {
    id: "2",
    name: "Travel Phrases",
    description: "Useful phrases for traveling in China",
    wordCount: 28,
    words: [
      {
        id: "6",
        chinese: "机场",
        pinyin: "jī chǎng",
        english: "Airport",
        correct: 10,
        incorrect: 2,
      },
      {
        id: "7",
        chinese: "酒店",
        pinyin: "jiǔ diàn",
        english: "Hotel",
        correct: 15,
        incorrect: 1,
      },
    ],
  },
};

type SortField = "chinese" | "pinyin" | "english" | "correct" | "incorrect";
type SortDirection = "asc" | "desc";

export default function GroupDetail() {
  const { id } = useParams();
  const group = mockGroups[id as keyof typeof mockGroups];
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("chinese");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  
  if (!group) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-destructive">Group Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The requested word group could not be found.
          </p>
          <Button asChild className="mt-4">
            <Link to="/groups">Back to Groups</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const itemsPerPage = 50;
  const totalPages = Math.ceil(group.words.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const playAudio = (chinese: string) => {
    console.log(`Playing audio for: ${chinese}`);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-muted-foreground" />;
    }
    return sortDirection === "asc" ? 
      <ChevronUp className="h-3 w-3" /> : 
      <ChevronDown className="h-3 w-3" />;
  };

  const filteredWords = group.words.filter(word =>
    word.chinese.toLowerCase().includes(searchQuery.toLowerCase()) ||
    word.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    word.english.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedWords = [...filteredWords].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const modifier = sortDirection === "asc" ? 1 : -1;
    
    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal) * modifier;
    }
    return ((aVal as number) - (bVal as number)) * modifier;
  });

  const paginatedWords = sortedWords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Group Info */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-start gap-4">
              <FolderOpen className="h-8 w-8 text-primary mt-1" />
              <div className="flex-1">
                <CardTitle className="text-2xl">{group.name}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {group.description}
                </CardDescription>
                <div className="mt-3">
                  <Badge variant="secondary">
                    {group.wordCount} words
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Search */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search words in this group..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Words Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Words in {group.name} ({sortedWords.length} words)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort("chinese")}
                    >
                      <div className="flex items-center gap-1">
                        Chinese
                        {getSortIcon("chinese")}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort("pinyin")}
                    >
                      <div className="flex items-center gap-1">
                        Pinyin
                        {getSortIcon("pinyin")}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort("english")}
                    >
                      <div className="flex items-center gap-1">
                        English
                        {getSortIcon("english")}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none text-center"
                      onClick={() => handleSort("correct")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        # Correct
                        {getSortIcon("correct")}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none text-center"
                      onClick={() => handleSort("incorrect")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        # Incorrect
                        {getSortIcon("incorrect")}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedWords.map((word) => (
                    <TableRow key={word.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link 
                            to={`/words/${word.id}`}
                            className="font-chinese text-lg font-medium text-chinese-primary hover:text-chinese-accent transition-colors"
                          >
                            {word.chinese}
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => playAudio(word.chinese)}
                            className="h-6 w-6 p-0"
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-muted-foreground">
                        {word.pinyin}
                      </TableCell>
                      <TableCell>{word.english}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-success-light text-success">
                          {word.correct}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-destructive/10 text-destructive">
                          {word.incorrect}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <Button 
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <div className="text-sm text-muted-foreground">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </div>
              
              <Button 
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}