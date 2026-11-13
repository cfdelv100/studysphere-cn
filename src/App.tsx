import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/auth/AuthContext";
import { RequireAuth } from "@/components/RequireAuth";
import { RequireAdmin } from "@/components/RequireAdmin";
import Dashboard from "./pages/Dashboard";
import StudyActivities from "./pages/StudyActivities";
import StudyActivityDetail from "./pages/StudyActivityDetail";
import Words from "./pages/Words";
import WordDetail from "./pages/WordDetail";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import Sessions from "./pages/Sessions";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import LearningActivity from "./pages/LearningActivity";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminUsers from "./pages/AdminUsers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<RequireAuth />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/study-activities" element={<StudyActivities />} />
                <Route path="/study-activities/:id" element={<StudyActivityDetail />} />
                <Route path="/typing-tutor" element={<LearningActivity key="typing-tutor" />} />
                <Route path="/story-reader" element={<LearningActivity key="story-reader" />} />
                <Route path="/character-quiz" element={<LearningActivity key="character-quiz" />} />
                <Route path="/words" element={<Words />} />
                <Route path="/words/:id" element={<WordDetail />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/groups/:id" element={<GroupDetail />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/settings" element={<Settings />} />
                <Route element={<RequireAdmin />}>
                  <Route path="/admin/users" element={<AdminUsers />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
