import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Billing & Plans</h1>
        <p className="text-gray-400 mt-1">Manage your subscription and billing</p>
      </div>

      <Separator className="bg-electric-500/20" />

      {/* Current Plan */}
      <Card className="glass border-electric-500/20 bg-gradient-to-br from-electric-500/5 to-cyber-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Current Plan</CardTitle>
              <CardDescription className="text-gray-400 mt-1">
                You are currently on the Free Trial plan
              </CardDescription>
            </div>
            <Badge className="bg-electric-500 text-white">Free Trial</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-400">Projects</p>
              <p className="text-2xl font-bold">0 / 3</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">AI Requests</p>
              <p className="text-2xl font-bold">0 / 100</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Storage</p>
              <p className="text-2xl font-bold">0 MB / 500 MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Pro Plan */}
          <Card className="glass border-electric-500/20 hover:border-electric-500/40 transition-colors">
            <CardHeader>
              <CardTitle className="text-xl">Pro</CardTitle>
              <CardDescription className="text-gray-400">For serious developers</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-gray-400">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Unlimited projects</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">1000 AI requests/month</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">10GB storage</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Priority support</span>
                </li>
              </ul>
              <Button className="w-full btn-primary">
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="glass border-electric-500/20 hover:border-electric-500/40 transition-colors">
            <CardHeader>
              <CardTitle className="text-xl">Enterprise</CardTitle>
              <CardDescription className="text-gray-400">For teams & companies</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-gray-400">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Everything in Pro</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Unlimited AI requests</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">100GB storage</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Dedicated support</span>
                </li>
              </ul>
              <Button className="w-full btn-outline">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
