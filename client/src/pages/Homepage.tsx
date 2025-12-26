import { Link } from 'react-router-dom';
import { ArrowRight, Upload, Sparkles, CheckCircle, ShieldCheck, Clock, Download, Github } from 'lucide-react';

export default function Homepage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-white text-neutral-900">
      <div className="absolute inset-y-0 left-0 w-full lg:w-1/2 z-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-b from-primary-50 via-primary-100 to-primary-50 [clip-path:none] lg:[clip-path:ellipse(100%_140%_at_0%_50%)]" />
      </div>
      <header className="relative z-10 w-full">
        <div className="mx-auto max-w-7xl px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="CVForge" className="w-8 h-8" />
            <span className="tracking-widest text-sm font-semibold">CVFORGE</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href='https://github.com/dannyyol/cvforge'
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 border border-neutral-200 text-neutral-700 hover:bg-neutral-100 shadow-sm"
              aria-label="GitHub repository"
              title="GitHub"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">Star on GitHub</span>
            </a>
          </div>
        </div>
      </header>
      <main className="relative z-10 overflow-hidden flex-1 flex flex-col">
        <section className="relative flex-1 flex items-center">
          <div className="mx-auto max-w-7xl px-6 py-12 md:py-0 lg:py-0 grid lg:grid-cols-2 gap-10 lg:gap-20 xl:gap-24 items-center">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-black leading-tight">
                Build a job‑winning CV
              </h1>
              <p className="mt-5 text-neutral-700">
                Pick a template, import your CV, and let AI refine every section for recruiters and ATS.
              </p>
              
              <div className="mt-8">
                <div className="text-neutral-800 font-semibold">How it works</div>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                  <div className="inline-flex items-center gap-2 font-medium">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold">1</span>
                    Choose a template
                  </div>
                  <div className="inline-flex items-center gap-2 font-medium">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold">2</span>
                    Upload your CV
                  </div>
                  <div className="inline-flex items-center gap-2 font-medium">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold">3</span>
                    Get AI suggestions
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/editor"
                  className="inline-flex items-center gap-2 rounded-full bg-success-500 text-white px-6 py-3 font-semibold shadow hover:bg-success-600"
                >
                  Create your CV
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <label
                  htmlFor="cv-upload-input"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 border border-neutral-900 text-neutral-900 bg-white font-semibold hover:bg-neutral-50"
                >
                  Upgrade a CV
                  <Upload className="w-4 h-4" />
                </label>
                <input id="cv-upload-input" type="file" className="hidden" />
              </div>
              </div>
          
            </div>
            <div className="relative lg:mx-auto lg:w-[600px] xl:w-[540px] 2xl:w-[640px]">
              <img src="/images/hero.png" alt="Product hero" className="w-full h-auto rounded-2xl" />
              <div className="absolute left-1/2 -translate-x-1/2 -top-10 bg-white rounded-full ring-1 ring-black/5 px-4 py-2 text-sm font-semibold flex items-center gap-2 motion-safe:animate-bounce transition-transform hover:scale-[1.03] hover:-translate-y-0.5" style={{ animationDuration: '3.4s', animationDelay: '0.4s' }}>
                <Sparkles className="w-4 h-4 text-primary-600" />
                AI‑powered
              </div>
              <div className="absolute -left-10 top-6 bg-white rounded-full ring-1 ring-black/5 px-4 py-2 text-sm font-semibold flex items-center gap-2 motion-safe:animate-bounce transition-transform hover:scale-[1.03] hover:-translate-y-0.5" style={{ animationDuration: '3.2s', animationDelay: '0.2s' }}>
                <ShieldCheck className="w-4 h-4 text-success-600" />
                ATS Ready
              </div>
              <div className="absolute right-0 -top-8 bg-white rounded-full ring-1 ring-black/5 px-4 py-2 text-sm font-semibold flex items-center gap-2 motion-safe:animate-bounce transition-transform hover:scale-[1.03] hover:-translate-y-0.5" style={{ animationDuration: '3.6s', animationDelay: '0.6s' }}>
                <Clock className="w-4 h-4 text-orange-600" />
                Quick Setup
              </div>
              <div className="absolute left-0 bottom-4 bg-white rounded-full ring-1 ring-black/5 px-4 py-2 text-sm font-semibold flex items-center gap-2 motion-safe:animate-bounce transition-transform hover:scale-[1.03] hover:-translate-y-0.5" style={{ animationDuration: '3.8s', animationDelay: '0.9s' }}>
                <Sparkles className="w-4 h-4 text-primary-600" />
                Smart Suggestions
              </div>
              <div className="absolute -right-6 bottom-8 bg-white rounded-full ring-1 ring-black/5 px-4 py-2 text-sm font-semibold flex items-center gap-2 motion-safe:animate-bounce transition-transform hover:scale-[1.03] hover:-translate-y-0.5" style={{ animationDuration: '4s', animationDelay: '1.1s' }}>
                <Download className="w-4 h-4 text-neutral-700" />
                Export PDF
              </div>
            </div>
          </div>
        </section>
        <section className="bg-primary-900 text-white mt-0">
          <div className="mx-auto max-w-6xl px-6 py-6">
            <h2 className="text-2xl md:text-3xl font-bold">What CVForge does for you</h2>
            <p className="mt-3 text-white/80">
              CVForge helps you build a polished, ATS‑friendly CV with AI guidance, smart formatting, and instant export.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="inline-flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 ring-1 ring-white/10">
                <ShieldCheck className="w-5 h-5 text-success-400" />
                <span className="text-sm">Pass ATS scans</span>
              </div>
              <div className="inline-flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 ring-1 ring-white/10">
                <Sparkles className="w-5 h-5 text-pink-300" />
                <span className="text-sm">AI suggestions</span>
              </div>
              <div className="inline-flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 ring-1 ring-white/10">
                <Clock className="w-5 h-5 text-orange-300" />
                <span className="text-sm">Quick setup</span>
              </div>
              <div className="inline-flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 ring-1 ring-white/10">
                <CheckCircle className="w-5 h-5 text-success-400" />
                <span className="text-sm">Role‑based templates</span>
              </div>
              <div className="inline-flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 ring-1 ring-white/10">
                <Sparkles className="w-5 h-5 text-primary-300" />
                <span className="text-sm">Auto formatting</span>
              </div>
              <div className="inline-flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 ring-1 ring-white/10">
                <Download className="w-5 h-5 text-white" />
                <span className="text-sm">One‑click PDF export</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
