import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Trash2, 
  Shield, 
  Database,
  Palette,
  Volume2
} from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [resetConfirmText, setResetConfirmText] = useState("");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);
  
  const isDarkMode = theme === "dark";

  const handleThemeToggle = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  const handleResetHistory = () => {
    if (resetConfirmText === "reset me") {
      // Mock reset functionality
      console.log("Resetting database history...");
      setResetDialogOpen(false);
      setResetConfirmText("");
      toast.success("History has been reset successfully", {
        description: "All study progress and session data has been cleared.",
      });
    } else {
      toast.error("Please type 'reset me' to confirm", {
        description: "The confirmation text must match exactly.",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-6 w-6" />
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your application preferences and data
        </p>

        {/* Appearance Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of your learning environment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Dark Mode</Label>
                <div className="text-sm text-muted-foreground">
                  Toggle between light and dark theme
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <Switch 
                  checked={isDarkMode}
                  onCheckedChange={handleThemeToggle}
                />
                <Moon className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audio Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Audio & Pronunciation
            </CardTitle>
            <CardDescription>
              Configure audio feedback and pronunciation features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Sound Effects</Label>
                <div className="text-sm text-muted-foreground">
                  Enable sound feedback for interactions
                </div>
              </div>
              <Switch 
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Auto-play Pronunciation</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically play audio when viewing words
                </div>
              </div>
              <Switch 
                checked={autoPlayAudio}
                onCheckedChange={setAutoPlayAudio}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="shadow-card border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Manage your learning data and progress history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Reset Learning History</Label>
                  <div className="text-sm text-muted-foreground max-w-md">
                    This will permanently delete all study sessions, progress data, 
                    and word review history. This action cannot be undone.
                  </div>
                </div>
                
                <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Reset History
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-destructive" />
                        Confirm Reset
                      </AlertDialogTitle>
                      <AlertDialogDescription className="space-y-3">
                        <p>
                          This action will permanently delete all your learning progress, 
                          including:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>All study session history</li>
                          <li>Word review statistics</li>
                          <li>Progress tracking data</li>
                          <li>Performance metrics</li>
                        </ul>
                        <p>
                          To confirm this action, please type{" "}
                          <strong className="text-destructive">reset me</strong> below:
                        </p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    <Input
                      placeholder="Type 'reset me' to confirm"
                      value={resetConfirmText}
                      onChange={(e) => setResetConfirmText(e.target.value)}
                      className="mt-4"
                    />
                    
                    <AlertDialogFooter>
                      <AlertDialogCancel 
                        onClick={() => {
                          setResetConfirmText("");
                          setResetDialogOpen(false);
                        }}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleResetHistory}
                        className="bg-destructive hover:bg-destructive/90"
                        disabled={resetConfirmText !== "reset me"}
                      >
                        Reset All Data
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Application Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Version:</span>
              <span className="font-mono">1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Build Date:</span>
              <span className="font-mono">2024-01-15</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Environment:</span>
              <span className="font-mono">Development</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}