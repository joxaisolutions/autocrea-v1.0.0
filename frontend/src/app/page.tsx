import Link from 'next/link';
import { ArrowRight, Sparkles, Code2, Zap, Globe, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-electric-500/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-electric-500" />
              <span className="text-2xl font-bold gradient-text">AUTOCREA</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="#about" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link
                href="/sign-in"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-electric-500/10 border border-electric-500/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-electric-500" />
            <span className="text-sm text-electric-500">Powered by JoxCoder AI</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build Web Apps
            <br />
            <span className="gradient-text">Without Writing Code</span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            AUTOCREA is an AI-powered platform that transforms your ideas into fully functional
            web applications. From 0 to 100, no coding required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/sign-up"
              className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
            >
              <span>Start Building Free</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className="btn-outline inline-flex items-center space-x-2 text-lg px-8 py-4"
            >
              <span>Learn More</span>
            </Link>
          </div>

          {/* Hero Image/Demo */}
          <div className="mt-20 relative">
            <div className="glass rounded-2xl p-4 border border-electric-500/20 max-w-5xl mx-auto">
              <div className="bg-deep-black rounded-lg p-8 cyber-grid min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <Code2 className="h-24 w-24 text-electric-500 mx-auto mb-4 animate-pulse-glow" />
                  <p className="text-2xl font-semibold gradient-text">Your IDE, Reimagined</p>
                  <p className="text-gray-400 mt-2">Monaco Editor + AI + Terminal</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-electric-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyber-500/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Create</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Professional tools powered by AI to build, deploy, and scale your applications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass rounded-xl p-8 border border-electric-500/10 hover:border-electric-500/30 transition-all card-hover">
              <div className="h-12 w-12 bg-electric-500/20 rounded-lg flex items-center justify-center mb-6">
                <Sparkles className="h-6 w-6 text-electric-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">AI Code Generation</h3>
              <p className="text-gray-300">
                Powered by JoxCoder, our specialized AI model that generates clean, production-ready
                code from natural language.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass rounded-xl p-8 border border-electric-500/10 hover:border-electric-500/30 transition-all card-hover">
              <div className="h-12 w-12 bg-electric-500/20 rounded-lg flex items-center justify-center mb-6">
                <Code2 className="h-6 w-6 text-electric-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Powerful Editor</h3>
              <p className="text-gray-300">
                Monaco Editor with syntax highlighting, autocomplete, and refactoring tools. Same
                technology as VS Code.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass rounded-xl p-8 border border-electric-500/10 hover:border-electric-500/30 transition-all card-hover">
              <div className="h-12 w-12 bg-electric-500/20 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-electric-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Instant Deployment</h3>
              <p className="text-gray-300">
                Deploy your apps to Vercel, Netlify, or Railway with one click. Automatic builds
                and continuous deployment.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass rounded-xl p-8 border border-electric-500/10 hover:border-electric-500/30 transition-all card-hover">
              <div className="h-12 w-12 bg-electric-500/20 rounded-lg flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-electric-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Terminal Access</h3>
              <p className="text-gray-300">
                Integrated terminal with npm, git, and all your favorite commands. Full control
                when you need it.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass rounded-xl p-8 border border-electric-500/10 hover:border-electric-500/30 transition-all card-hover">
              <div className="h-12 w-12 bg-electric-500/20 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-electric-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Secure Sandbox</h3>
              <p className="text-gray-300">
                Execute code in isolated Docker containers. Your projects are safe and secure.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass rounded-xl p-8 border border-electric-500/10 hover:border-electric-500/30 transition-all card-hover">
              <div className="h-12 w-12 bg-electric-500/20 rounded-lg flex items-center justify-center mb-6">
                <ArrowRight className="h-6 w-6 text-electric-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Real-time Collaboration</h3>
              <p className="text-gray-300">
                Work together with your team in real-time. See cursors, edits, and collaborate
                seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-navy-400">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Start free, scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="glass rounded-2xl p-8 border border-electric-500/10">
              <h3 className="text-2xl font-bold mb-2">Free Trial</h3>
              <p className="text-gray-300 mb-6">Perfect for trying out</p>
              <div className="mb-8">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-gray-300">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>3 projects</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>100 AI requests/month</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>500MB storage</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Basic deployment</span>
                </li>
              </ul>
              <Link href="/sign-up" className="btn-outline w-full block text-center">
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="glass rounded-2xl p-8 border-2 border-electric-500 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-electric-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-gray-300 mb-6">For serious developers</p>
              <div className="mb-8">
                <span className="text-5xl font-bold">$19</span>
                <span className="text-gray-300">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Unlimited projects</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>1000 AI requests/month</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>10GB storage</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Advanced deployment</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link href="/sign-up" className="btn-primary w-full block text-center">
                Start Pro Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="glass rounded-2xl p-8 border border-electric-500/10">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-gray-300 mb-6">For teams & companies</p>
              <div className="mb-8">
                <span className="text-5xl font-bold">$99</span>
                <span className="text-gray-300">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Unlimited AI requests</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>100GB storage</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Real-time collaboration</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-electric-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Dedicated support</span>
                </li>
              </ul>
              <Link href="/sign-up" className="btn-outline w-full block text-center">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="glass rounded-3xl p-12 md:p-16 text-center border border-electric-500/20 relative overflow-hidden">
            <div className="absolute inset-0 cyber-grid opacity-20"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Start Building?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of developers creating amazing applications with AUTOCREA
              </p>
              <Link
                href="/sign-up"
                className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-electric-500/10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Code2 className="h-6 w-6 text-electric-500" />
                <span className="text-xl font-bold gradient-text">AUTOCREA</span>
              </div>
              <p className="text-gray-400">
                AI-powered web development platform by JoxAI
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="https://joxai.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    About JoxAI
                  </a>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-electric-500/10 text-center text-gray-400">
            <p>© 2025 AUTOCREA by JoxAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
