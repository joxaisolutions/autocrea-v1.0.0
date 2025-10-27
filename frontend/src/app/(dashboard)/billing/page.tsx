'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Zap, Building2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { PLAN_LIMITS } from '@/types/user';

export default function BillingPage() {
  const currentPlan = 'free-trial';
  const limits = PLAN_LIMITS[currentPlan];

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
              <p className="text-2xl font-bold">0 / {limits.maxProjects}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">AI Requests</p>
              <p className="text-2xl font-bold">0 / {limits.maxAIRequests}</p>
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
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Creator Plan */}
          <Card className="glass border-electric-500/20 hover:border-electric-500/40 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-electric-500" />
                <CardTitle className="text-xl">Creator</CardTitle>
              </div>
              <CardDescription className="text-gray-400">For indie developers</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-gray-400">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">10 projects</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">500 AI requests/month</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">5GB storage</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Git integration</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Analytics dashboard</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Community support</span>
                </li>
              </ul>
              <Button className="w-full btn-primary">
                Upgrade to Creator
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan - Featured */}
          <Card className="glass border-electric-500 relative overflow-hidden hover:border-electric-500 transition-colors">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-electric-500 to-cyber-500"></div>
            <Badge className="absolute top-4 right-4 bg-electric-500 text-white">Most Popular</Badge>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-electric-500" />
                <CardTitle className="text-xl">Pro</CardTitle>
              </div>
              <CardDescription className="text-gray-400">For professional developers</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$79</span>
                <span className="text-gray-400">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">Unlimited projects</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">2000 AI requests/month</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">20GB storage</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Team collaboration</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Custom domains</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Priority support</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Advanced analytics</span>
                </li>
              </ul>
              <Button className="w-full btn-primary bg-gradient-to-r from-electric-500 to-cyber-500">
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="glass border-electric-500/20 hover:border-electric-500/40 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-electric-500" />
                <CardTitle className="text-xl">Enterprise</CardTitle>
              </div>
              <CardDescription className="text-gray-400">For teams & companies</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">Custom</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
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
                  <span className="text-sm">100GB+ storage</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Dedicated support</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">SLA guarantee</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Custom integrations</span>
                </li>
              </ul>
              <Button className="w-full btn-outline">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Plan Comparison */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Compare Plans</h2>
        <Card className="glass border-electric-500/20">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-electric-500/20">
                    <th className="text-left py-4 px-4">Feature</th>
                    <th className="text-center py-4 px-4">Free Trial</th>
                    <th className="text-center py-4 px-4">Creator</th>
                    <th className="text-center py-4 px-4">Pro</th>
                    <th className="text-center py-4 px-4">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-electric-500/10">
                    <td className="py-4 px-4">Projects</td>
                    <td className="text-center py-4 px-4">3</td>
                    <td className="text-center py-4 px-4">10</td>
                    <td className="text-center py-4 px-4">Unlimited</td>
                    <td className="text-center py-4 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b border-electric-500/10">
                    <td className="py-4 px-4">AI Requests</td>
                    <td className="text-center py-4 px-4">100/mo</td>
                    <td className="text-center py-4 px-4">500/mo</td>
                    <td className="text-center py-4 px-4">2000/mo</td>
                    <td className="text-center py-4 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b border-electric-500/10">
                    <td className="py-4 px-4">Storage</td>
                    <td className="text-center py-4 px-4">500MB</td>
                    <td className="text-center py-4 px-4">5GB</td>
                    <td className="text-center py-4 px-4">20GB</td>
                    <td className="text-center py-4 px-4">100GB+</td>
                  </tr>
                  <tr className="border-b border-electric-500/10">
                    <td className="py-4 px-4">Deployment</td>
                    <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-electric-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-electric-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-electric-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-electric-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-electric-500/10">
                    <td className="py-4 px-4">Git Integration</td>
                    <td className="text-center py-4 px-4">-</td>
                    <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-electric-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-electric-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-electric-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-electric-500/10">
                    <td className="py-4 px-4">Collaboration</td>
                    <td className="text-center py-4 px-4">-</td>
                    <td className="text-center py-4 px-4">-</td>
                    <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-electric-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-electric-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-electric-500/10">
                    <td className="py-4 px-4">Custom Domain</td>
                    <td className="text-center py-4 px-4">-</td>
                    <td className="text-center py-4 px-4">-</td>
                    <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-electric-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-electric-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-electric-500/10">
                    <td className="py-4 px-4">Analytics</td>
                    <td className="text-center py-4 px-4">-</td>
                    <td className="text-center py-4 px-4">Basic</td>
                    <td className="text-center py-4 px-4">Advanced</td>
                    <td className="text-center py-4 px-4">Advanced</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Support</td>
                    <td className="text-center py-4 px-4">Community</td>
                    <td className="text-center py-4 px-4">Community</td>
                    <td className="text-center py-4 px-4">Priority</td>
                    <td className="text-center py-4 px-4">Dedicated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
