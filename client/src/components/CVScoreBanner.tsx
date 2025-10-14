import { Sparkles, ChevronRight } from 'lucide-react';

export default function CVScoreBanner() {
  return (
    <div className="score-banner">
      <div className="score-banner-content">
        <div className="flex items-center gap-3">
          <div className="score-banner-icon">
            <Sparkles className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="score-banner-text">
              Tailor this CV for the job, and get more interviews
            </p>
          </div>
        </div>
        <button className="score-banner-cta">
          Try it
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
