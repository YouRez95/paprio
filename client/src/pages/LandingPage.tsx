import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, PenTool, Sparkles, Zap, FileText } from "lucide-react";
import { Link } from "react-router";

export default function LandingPage() {
  return (
    <>
      <main className="flex-1 mx-auto w-full">
        <section className="py-20 md:py-32 lg:py-40 xl:py-48 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                ✨ Professional LaTeX Made Simple
              </div>
              <div className="space-y-4 max-w-4xl">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  Build LaTeX Documents Visually
                </h1>
                <p className="mx-auto max-w-[700px] text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Drag, drop, and customize pre-built components to create
                  stunning academic papers, CVs, and reports. Get LaTeX quality
                  without touching a single line of code.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-base px-8 py-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  Start Building Free
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base px-8 py-6"
                >
                  Explore Templates →
                </Button>
              </div>
              <div className="pt-8 flex items-center gap-8 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  Free templates included
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full py-20 md:py-28 lg:py-36 bg-white dark:bg-gray-900  "
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  LaTeX Power, Visual Simplicity
                </h2>
                <p className="max-w-[800px] text-lg text-gray-600 dark:text-gray-300">
                  Everything a LaTeX developer builds manually, now available as
                  drag-and-drop components
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
              <Card className="border-2 hover:border-blue-500 transition-all hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">Visual Builder</CardTitle>
                  <CardDescription className="text-base">
                    Drag and drop pre-built LaTeX components like tables,
                    equations, figures, and boxes. No syntax to memorize.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 hover:border-purple-500 transition-all hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                    <PenTool className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl">
                    Professional Templates
                  </CardTitle>
                  <CardDescription className="text-base">
                    Start with expert-crafted templates for academic papers,
                    theses, CVs, and reports. Customize every detail.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 hover:border-green-500 transition-all hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl">Instant Preview</CardTitle>
                  <CardDescription className="text-base">
                    See your document render in real-time. What you see is
                    exactly what you get in the final PDF.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="w-full py-20 md:py-28 lg:py-36 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  From Idea to PDF in Minutes
                </h2>
                <p className="max-w-[800px] text-lg text-gray-600 dark:text-gray-300">
                  Our streamlined workflow makes document creation effortless
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-5xl">
              <div className="grid gap-12 lg:gap-16">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl font-bold shadow-lg">
                    1
                  </div>
                  <div className="flex-1 text-center lg:text-left space-y-2">
                    <h3 className="text-2xl font-bold">Choose Your Format</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      Select document type (A4, Letter), pick a template, or
                      start with a blank canvas. Configure margins, fonts, and
                      layout options.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white text-2xl font-bold shadow-lg">
                    2
                  </div>
                  <div className="flex-1 text-center lg:text-left space-y-2">
                    <h3 className="text-2xl font-bold">
                      Build with Components
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      Add pre-made LaTeX elements: title blocks, abstract boxes,
                      tables, equations, figures, bibliographies, and more.
                      Customize colors, borders, and spacing.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white text-2xl font-bold shadow-lg">
                    3
                  </div>
                  <div className="flex-1 text-center lg:text-left space-y-2">
                    <h3 className="text-2xl font-bold">Export & Share</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      Download your perfectly formatted PDF or get the LaTeX
                      source code. Share directly with collaborators or submit
                      to journals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="w-full py-20 md:py-28 lg:py-36 bg-white dark:bg-gray-900"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Simple, Transparent Pricing
                </h2>
                <p className="max-w-[800px] text-lg text-gray-600 dark:text-gray-300">
                  Start free, upgrade when you need more power
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-3">
              <Card className="border-2 hover:shadow-lg transition-all">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">Free</CardTitle>
                  <CardDescription className="text-base">
                    Perfect for students and trying out
                  </CardDescription>
                  <div className="pt-4">
                    <div className="text-5xl font-bold">$0</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Forever free
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Check className="mr-3 h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>3 documents per month</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-3 h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Access to basic templates</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-3 h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>PDF export</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-3 h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Standard components library</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-4 border-blue-500 relative hover:shadow-2xl transition-all scale-105">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-2xl mb-2">Pro</CardTitle>
                  <CardDescription className="text-base">
                    For professionals and researchers
                  </CardDescription>
                  <div className="pt-4">
                    <div className="text-5xl font-bold">$10</div>
                    <div className="text-sm text-gray-500 mt-1">
                      per month, billed monthly
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Check className="mr-3 h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">Unlimited documents</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-3 h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">All premium templates</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-3 h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">
                        Advanced components & boxes
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-3 h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">Custom table builders</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-3 h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>LaTeX source code export</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-3 h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Start Pro Trial
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-2 hover:shadow-lg transition-all">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">Enterprise</CardTitle>
                  <CardDescription className="text-base">
                    For teams and institutions
                  </CardDescription>
                  <div className="pt-4">
                    <div className="text-5xl font-bold">Custom</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Contact for pricing
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Check className="mr-3 h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Everything in Pro</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-3 h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Custom template creation</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-3 h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Team collaboration tools</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-3 h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>API access</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-3 h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Dedicated account manager</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-3 h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>SLA guarantee</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="outline">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="mt-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                ✨ <span className="font-medium">Coming Soon:</span> AI-powered
                content generation and LaTeX code assistance
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-50 dark:bg-gray-900 border-t">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <FileText className="h-6 w-6" />
                <span className="ml-2 text-lg font-bold">EASYTEX</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Professional LaTeX documents without the code. Built by LaTeX
                developers, for everyone.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="#features"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="#pricing"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/templates"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    Templates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/docs"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guides"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    to="/support"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/terms"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 EASYTEX. All rights reserved.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Made with ❤️ by LaTeX enthusiasts
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
