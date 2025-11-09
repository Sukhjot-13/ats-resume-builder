"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Build Your Perfect ATS-Friendly Resume
            </h1>
            <p className="mx-auto max-w-[700px] text-lg md:text-xl">
              Our AI-powered platform helps you create tailored resumes that stand out to recruiters and Applicant Tracking Systems.
            </p>
            <div className="space-x-4">
              <Link href="/dashboard">
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Get Started
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Features That Get You Hired
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Leverage cutting-edge AI to optimize your resume for every job application.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-10 py-12">
            <Card className="flex flex-col items-center text-center p-6">
              <CardHeader>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 text-primary mb-4"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" x2="8" y1="13" y2="13"></line>
                  <line x1="16" x2="8" y1="17" y2="17"></line>
                  <line x1="10" x2="8" y1="9" y2="9"></line>
                </svg>
                <CardTitle>AI-Powered Parsing</CardTitle>
              </CardHeader>
              <CardContent>
                Upload your existing resume and let our AI extract and structure your data effortlessly.
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center p-6">
              <CardHeader>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 text-primary mb-4"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <CardTitle>ATS Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                Tailor your resume content to specific job descriptions to pass Applicant Tracking Systems.
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center p-6">
              <CardHeader>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 text-primary mb-4"
                >
                  <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v18Z"></path>
                  <path d="M14 2v6h6"></path>
                  <path d="M10 12.5L12 14l4-4"></path>
                </svg>
                <CardTitle>Professional Templates</CardTitle>
              </CardHeader>
              <CardContent>
                Choose from a variety of modern and professional templates to present your best self.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                How It Works
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our simple 3-step process to a perfect resume.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:grid-cols-3 lg:gap-10 py-12">
            <Card className="flex flex-col items-center text-center p-6">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                  1
                </div>
                <CardTitle>Upload</CardTitle>
              </CardHeader>
              <CardContent>
                Upload your current resume in PDF or DOCX format.
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center p-6">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                  2
                </div>
                <CardTitle>Tailor</CardTitle>
              </CardHeader>
              <CardContent>
                Paste the job description and let our AI tailor your resume.
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center p-6">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                  3
                </div>
                <CardTitle>Download</CardTitle>
              </CardHeader>
              <CardContent>
                Choose a template and download your optimized resume as a PDF.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground text-center">
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Ready to Land Your Dream Job?
          </h2>
          <p className="mx-auto max-w-[700px] text-lg md:text-xl">
            Start building your perfect resume today and get noticed by top employers.
          </p>
          <Link href="/dashboard">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Create My Resume
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-background">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 ATS-Friendly Resume Builder. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-muted-foreground">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-muted-foreground">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}