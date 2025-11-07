import { Link } from 'react-router-dom';
import { ArrowRight, Upload } from 'lucide-react';

export default function Homepage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white relative">
      {/* Top Navigation */}
      <header className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/images/logo-white.png" alt="CVForge" className="w-8 h-8 text-primary-300" />
            <span className="tracking-widest text-sm font-semibold text-white/80">CVFORGE</span>
          </div>
          {/* Menu removed */}
        </div>
      </header>
      {/* Hero Section */}
      <main className="relative z-10 flex-1">
        <div className="mx-auto max-w-7xl px-6 h-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 h-full place-content-center lg:place-content-stretch justify-items-center lg:justify-items-start">
            {/* Left copy (centered on mobile) */}
            <div className="max-w-xl w-full h-full flex flex-col items-center justify-center text-center lg:text-left lg:items-start lg:justify-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Create an ATS‑friendly resume with AI‑powered feedback
              </h1>
              <p className="mt-4 sm:mt-6 text-white/80">
                CVForge helps you build a professional resume fast. Customize layout and content,
                get instant AI analysis on formatting, impact, and keywords, and export a polished PDF
                that passes Applicant Tracking Systems.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Link
                  to="/editor"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 text-white font-semibold px-5 py-3 hover:bg-primary-700 transition shadow-lg"
                >
                  Start editing your resume
                  <ArrowRight className="w-4 h-4" />
                </Link>
                {/* Upload button */}
                <label
                  htmlFor="cv-upload-input"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-primary-300 text-white bg-primary-600/10 hover:bg-primary-600/15 transition"
                >
                  Upload my CV
                  <Upload className="w-4 h-4" />
                </label>
              </div>
            </div>
            {/* Right: dashboard mock */}
            <div className="relative">
              {/* Right: CV image (hidden below lg for responsiveness) */}
              <div className="relative h-full hidden lg:block">
                <div className="w-full h-full">
                  <img
                    src="/images/cv-template.jpeg"
                    alt="CV preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Bottom wave */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,96 C240,144 480,0 720,48 C960,96 1200,96 1440,48 L1440,120 L0,120 Z"
          fill="rgba(255,255,255,0.06)"
        />
      </svg>
    </div>
  );
}