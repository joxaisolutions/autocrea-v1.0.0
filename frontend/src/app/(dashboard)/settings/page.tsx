import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account settings and preferences</p>
      </div>

      <Separator className="bg-electric-500/20" />

      <div className="grid gap-6">
        <Card className="glass border-electric-500/20">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription className="text-gray-400">
              Manage your account information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Settings page coming soon...</p>
          </CardContent>
        </Card>

        <Card className="glass border-electric-500/20">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription className="text-gray-400">
              Customize your AUTOCREA experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Preferences coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
