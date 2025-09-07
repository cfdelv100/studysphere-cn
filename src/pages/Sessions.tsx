import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Search,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Clock,
  Users,
  GraduationCap
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for sessions
const mockSessions = [
  {
    id: "1",
    groupName: "Core Vocabulary",
    groupId: "1",
    activityName: "Adventure MUD",
    activityId: "adventure-mud",
    startTime: "2024-01-15 14:30",
    endTime: "2024-01-15 15:15",
    reviewItems: 23,
    duration: 45,
  },
  {
    id: "2",
    groupName: "Travel Phrases",
    groupId: "2", 
    activityName: "Typing Tutor",
    activityId: "typing-tutor",
    startTime: "2024-01-14 09:15",
    endTime: "2024-01-14 09:45",
    reviewItems: 15,
    duration: 30,
  },
  {
    id: "3",
    groupName: "Core Vocabulary",
    groupId: "1",
    activityName: "Adventure MUD",
    activityId: "adventure-mud",
    startTime: "2024-01-13 16:00",
    endTime: "2024-01-13 16:30",
    reviewItems: 18,
    duration: 30,
  },
  {
    id: "4",
    groupName: "Food & Dining",
    groupId: "3",
    activityName: "Story Reader",
    activityId: "story-reader",
    startTime: "2024-01-12 11:20",
    endTime: "2024-01-12 12:05",
    reviewItems: 27,
    duration: 45,
  },
  {
    id: "5",
    groupName: "Business Terms",
    groupId: "4",
    activityName: "Character Quiz",
    activityId: "character-quiz",
    startTime: "2024-01-11 13:45",
    endTime: "2024-01-11 14:15",
    reviewItems: 12,
    duration: 30,
  },
];

type SortField = "startTime" | "groupName" | "activityName" | "reviewItems" | "duration";
type SortDirection = "asc" | "desc";

export default function Sessions() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("startTime");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  
  const itemsPerPage = 50;
  const totalPages = Math.ceil(mockSessions.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-muted-foreground" />;
    }
    return sortDirection === "asc" ? 
      <ChevronUp className="h-3 w-3" /> : 
      <ChevronDown className="h-3 w-3" />;
  };

  const filteredSessions = mockSessions.filter(session =>
    session.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.activityName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    const modifier = sortDirection === "asc" ? 1 : -1;
    
    // Handle date sorting
    if (sortField === "startTime") {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }
    
    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal) * modifier;
    }
    return ((aVal as number) - (bVal as number)) * modifier;
  });

  const paginatedSessions = sortedSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
            <p className="text-muted-foreground">
              Review your study session history and progress
            </p>
          </div>
        </div>

        {/* Search */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by group or activity name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sessions Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Study Sessions ({sortedSessions.length} total)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort("groupName")}
                    >
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Group
                        {getSortIcon("groupName")}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort("activityName")}
                    >
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        Activity
                        {getSortIcon("activityName")}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort("startTime")}
                    >
                      <div className="flex items-center gap-1">
                        Start Time
                        {getSortIcon("startTime")}
                      </div>
                    </TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none text-center"
                      onClick={() => handleSort("duration")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-4 w-4" />
                        Duration
                        {getSortIcon("duration")}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none text-center"
                      onClick={() => handleSort("reviewItems")}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Review Items
                        {getSortIcon("reviewItems")}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <Link 
                          to={`/groups/${session.groupId}`}
                          className="font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          {session.groupName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link 
                          to={`/study-activities/${session.activityId}`}
                          className="font-medium text-chinese-accent hover:text-chinese-accent/80 transition-colors"
                        >
                          {session.activityName}
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatDateTime(session.startTime)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatDateTime(session.endTime)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">
                          {session.duration}m
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium text-success">
                          {session.reviewItems}
                        </span>
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