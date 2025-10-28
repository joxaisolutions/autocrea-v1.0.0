'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Key, Bell, Code, Palette, Globe, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useUser();

  // Fetch user data from Convex
  const userData = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user.id } : 'skip'
  );

  // Mutations
  const updateUserMutation = useMutation(api.users.updateUser);
  const updatePreferencesMutation = useMutation(api.users.updateUserPreferences);

  // Local state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [projectUpdates, setProjectUpdates] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [theme, setTheme] = useState('vs-dark');
  const [language, setLanguage] = useState('en');
  const [editorFontSize, setEditorFontSize] = useState(14);

  // Load user data when available
  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setEmail(userData.email || '');
      if (userData.preferences) {
        setAutoSave(userData.preferences.autoSave ?? true);
        setTheme(userData.preferences.editorTheme || 'vs-dark');
        setLanguage(userData.preferences.language || 'en');
        setEditorFontSize(userData.preferences.fontSize || 14);
      }
    }
  }, [userData]);

  // Load from Clerk user
  useEffect(() => {
    if (user && !userData) {
      setName(user.fullName || '');
      setEmail(user.primaryEmailAddress?.emailAddress || '');
    }
  }, [user, userData]);

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      await updateUserMutation({
        clerkId: user.id,
        name: name || undefined,
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleSavePreferences = async () => {
    if (!user) return;

    try {
      await updatePreferencesMutation({
        clerkId: user.id,
        preferences: {
          editorTheme: theme,
          fontSize: editorFontSize,
          autoSave,
          language,
        },
      });
      toast.success('Preferences saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account settings and preferences</p>
      </div>

      <Separator className="bg-electric-500/20" />

      {/* Profile Settings */}
      <Card className="glass border-electric-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-electric-500" />
            <CardTitle>Profile Settings</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-navy-900/50 border-electric-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  disabled
                  className="bg-navy-900/50 border-electric-500/20 pl-10 opacity-50 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              rows={3}
              placeholder="Tell us about yourself..."
              className="w-full rounded-md bg-navy-900/50 border border-electric-500/20 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-electric-500"
              defaultValue="Full-stack developer passionate about AI and web development"
            />
          </div>
          <Button onClick={handleSaveProfile} className="btn-primary">
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="glass border-electric-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-electric-500" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="current-password"
                type="password"
                placeholder="••••••••"
                className="bg-navy-900/50 border-electric-500/20 pl-10"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                className="bg-navy-900/50 border-electric-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                className="bg-navy-900/50 border-electric-500/20"
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-navy-900/30 border border-electric-500/10">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-400">Add an extra layer of security</p>
            </div>
            <Badge className="bg-gray-600">Coming Soon</Badge>
          </div>
          <Button className="btn-primary">
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="glass border-electric-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-electric-500" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-navy-900/30 border border-electric-500/10">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-400">Receive updates via email</p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-navy-900/30 border border-electric-500/10">
            <div>
              <p className="font-medium">Project Updates</p>
              <p className="text-sm text-gray-400">Get notified about project changes</p>
            </div>
            <Switch
              checked={projectUpdates}
              onCheckedChange={setProjectUpdates}
            />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-navy-900/30 border border-electric-500/10">
            <div>
              <p className="font-medium">AI Suggestions</p>
              <p className="text-sm text-gray-400">Receive AI-powered code suggestions</p>
            </div>
            <Switch
              checked={aiSuggestions}
              onCheckedChange={setAiSuggestions}
            />
          </div>
        </CardContent>
      </Card>

      {/* Editor Preferences */}
      <Card className="glass border-electric-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-electric-500" />
            <CardTitle>Editor Preferences</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Customize your code editor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="font-size">Font Size</Label>
              <Select value={String(editorFontSize)} onValueChange={(val) => setEditorFontSize(Number(val))}>
                <SelectTrigger className="bg-navy-900/50 border-electric-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12px</SelectItem>
                  <SelectItem value="14">14px</SelectItem>
                  <SelectItem value="16">16px</SelectItem>
                  <SelectItem value="18">18px</SelectItem>
                  <SelectItem value="20">20px</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme">Editor Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="bg-navy-900/50 border-electric-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark (Default)</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="monokai">Monokai</SelectItem>
                  <SelectItem value="github">GitHub</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-navy-900/30 border border-electric-500/10">
            <div>
              <p className="font-medium">Auto Save</p>
              <p className="text-sm text-gray-400">Automatically save your work</p>
            </div>
            <Switch
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
          </div>
        </CardContent>
      </Card>

      {/* General Preferences */}
      <Card className="glass border-electric-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-electric-500" />
            <CardTitle>General</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            General application preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-navy-900/50 border-electric-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSavePreferences} className="btn-primary">
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="glass border-red-500/20 bg-red-500/5">
        <CardHeader>
          <CardTitle className="text-red-400">Danger Zone</CardTitle>
          <CardDescription className="text-gray-400">
            Irreversible actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/20">
            <div>
              <p className="font-medium text-red-400">Delete Account</p>
              <p className="text-sm text-gray-400">Permanently delete your account and all data</p>
            </div>
            <Button variant="destructive" className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/40">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
