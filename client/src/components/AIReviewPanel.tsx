import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Target, FileText, Zap, Award, Clock, RefreshCw } from 'lucide-react';

interface AIReviewPanelProps {
  overallScore: number;
}

export default function AIReviewPanel({ overallScore }: AIReviewPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [visibleSections, setVisibleSections] = useState<number[]>([]);

  const handleRefresh = () => {
    setIsLoading(true);
    setVisibleSections([]);
    setShowReview(false);

    setTimeout(() => {
      setIsLoading(false);
      setShowReview(true);
    }, 1500);
  };

  useEffect(() => {
    if (showReview && visibleSections.length === 0) {
      const sections = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      sections.forEach((section, index) => {
        setTimeout(() => {
          setVisibleSections(prev => [...prev, section]);
        }, index * 400);
      });
    }
  }, [showReview]);
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBannerVariantClass = (score: number) => {
    if (score >= 80) return 'ai-score-banner ai-score-banner--good';
    if (score >= 60) return 'ai-score-banner ai-score-banner--medium';
    return 'ai-score-banner ai-score-banner--bad';
  };

  const getScoreValueClass = (score: number) => {
    if (score >= 80) return 'ai-score-value ai-score-value--good';
    if (score >= 60) return 'ai-score-value ai-score-value--medium';
    return 'ai-score-value ai-score-value--bad';
  };

  const getProgressFillVariantClass = (score: number) => {
    const base = 'ai-score-progress-fill';
    if (score >= 80) return `${base} ai-score-progress-fill--good`;
    if (score >= 60) return `${base} ai-score-progress-fill--medium`;
    return `${base} ai-score-progress-fill--bad`;
  };

  return (
    <div className="ai-panel">
      <div className="ai-container">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">AI Review</h2>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Analyzing...' : 'Refresh Analysis'}
          </button>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <Sparkles className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-6 text-lg font-medium text-gray-700">Analyzing your CV with AI...</p>
            <p className="mt-2 text-sm text-gray-500">This will only take a moment</p>
          </div>
        )}

        {!isLoading && !showReview && (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-8">
              <Sparkles className="w-16 h-16 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Optimize Your CV?</h3>
            <p className="text-gray-600 text-lg max-w-2xl mb-8 leading-relaxed">
              Click the button above to get instant AI-powered feedback on your CV, including ATS compatibility,
              content quality, and personalized recommendations.
            </p>
            <div className="flex gap-8 text-base text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className='text-sm'>ATS Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className='text-sm'>Content Review</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className='text-sm'>Keyword Tips</span>
              </div>
            </div>
          </div>
        )}

        {!isLoading && showReview && (
          <div className="space-y-6">
        {visibleSections.includes(0) && (
          <div className="animate-fadeIn">
            <div className={getBannerVariantClass(overallScore)}>
              <div className="ai-flex-between">
                <div className="flex items-start gap-4">
                  <div className="bg-white rounded-full p-3 shadow-sm">
                    <Sparkles className={`w-8 h-8 ${getScoreColor(overallScore)}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">CV Score</h2>
                    <p className="text-sm text-gray-600">Based on industry standards and best practices</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={getScoreValueClass(overallScore)}>{overallScore}</div>
                  <div className="text-sm text-gray-500 font-medium">/ 100</div>
                </div>
              </div>
              <div className="ai-score-progress">
                <div
                  className={getProgressFillVariantClass(overallScore)}
                  style={{ width: `${overallScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {visibleSections.includes(1) && (
          <div className="ai-grid-3 animate-fadeIn">
            <ScoreCard
              icon={<Target className="w-5 h-5 text-blue-600" />}
              label="ATS Compatibility"
              score={85}
              bgColor="bg-blue-50"
            />
            <ScoreCard
              icon={<FileText className="w-5 h-5 text-purple-600" />}
              label="Content Quality"
              score={72}
              bgColor="bg-purple-50"
            />
            <ScoreCard
              icon={<Award className="w-5 h-5 text-orange-600" />}
              label="Formatting"
              score={90}
              bgColor="bg-orange-50"
            />
          </div>
        )}

        {visibleSections.includes(2) && (
          <div className="ai-grid-2 animate-fadeIn">
            <div className="bg-green-50 border border-green-200 rounded-lg p-5">
              <div className="ai-mini-header">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="ai-title-md">Strengths</h3>
              </div>
              <ul className="space-y-3">
                <StrengthItem text="Clear and concise professional summary" />
                <StrengthItem text="Strong action verbs in work experience" />
                <StrengthItem text="Quantified achievements with metrics" />
                <StrengthItem text="Clean, professional formatting" />
                <StrengthItem text="Relevant technical skills well-organized" />
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">Areas to Improve</h3>
              </div>
              <ul className="space-y-3">
                <WeaknessItem text="Add more industry-specific keywords" />
                <WeaknessItem text="Include certifications or courses" />
                <WeaknessItem text="Expand on project outcomes" />
                <WeaknessItem text="Add LinkedIn profile URL" />
                <WeaknessItem text="Some bullet points could be more specific" />
              </ul>
            </div>
          </div>
        )}

        {visibleSections.includes(3) && (
          <div className="ai-card animate-fadeIn">
            <div className="ai-section-header">
              <FileText className="w-5 h-5 text-gray-700" />
              <h3 className="ai-title-lg">Section-by-Section Analysis</h3>
            </div>
            <div className="space-y-4">
              <SectionAnalysis
                section="Professional Summary"
                score={78}
                feedback="Good overview but could include more specific achievements and unique value proposition."
                suggestions={['Add 1-2 key metrics', 'Highlight your unique selling point', 'Tailor to target role']}
              />
              <SectionAnalysis
                section="Work Experience"
                score={85}
                feedback="Strong descriptions with quantified achievements. Excellent use of action verbs."
                suggestions={['Add more context to recent roles', 'Include team size managed']}
              />
              <SectionAnalysis
                section="Education"
                score={90}
                feedback="Well-structured with relevant details. Consider adding relevant coursework for entry-level positions."
                suggestions={['Add GPA if above 3.5', 'Include honors or awards']}
              />
              <SectionAnalysis
                section="Skills"
                score={82}
                feedback="Good variety of technical and soft skills. Consider organizing by proficiency level."
                suggestions={['Add emerging technologies', 'Include soft skills', 'Group by category']}
              />
            </div>
          </div>
        )}

        {visibleSections.includes(4) && (
          <div className="ai-ats-card animate-fadeIn">
            <div className="flex items-center gap-2 mb-5">
              <Target className="w-5 h-5 text-blue-700" />
              <h3 className="text-xl font-semibold text-gray-900">ATS Compatibility Score: 85/100</h3>
            </div>
            <div className="space-y-4">
              <ATSCheckItem status="pass" text="Standard section headings used" />
              <ATSCheckItem status="pass" text="Simple, ATS-friendly formatting" />
              <ATSCheckItem status="pass" text="No graphics or complex tables" />
              <ATSCheckItem status="warning" text="Some industry keywords missing" />
              <ATSCheckItem status="warning" text="Could benefit from more specific job titles" />
            </div>
            <div className="mt-4 p-4 bg-white rounded-lg">
              <p className="ai-paragraph leading-relaxed">
                <strong>What is ATS?</strong> Applicant Tracking Systems scan resumes before humans see them.
                A score of 85+ means your CV will likely pass most ATS filters.
              </p>
            </div>
          </div>
        )}

        {visibleSections.includes(5) && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 animate-fadeIn">
            <div className="flex items-center gap-2 mb-5">
              <Zap className="w-5 h-5 text-yellow-600" />
              <h3 className="text-xl font-semibold text-gray-900">Keyword Optimization</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="ai-flex-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Current Keywords</span>
                  <span className="text-sm text-gray-500">15 found</span>
                </div>
                <div className="ai-flex-wrap-gap">
                  <KeywordBadge keyword="JavaScript" status="strong" />
                  <KeywordBadge keyword="React" status="strong" />
                  <KeywordBadge keyword="Project Management" status="strong" />
                  <KeywordBadge keyword="Team Leadership" status="medium" />
                  <KeywordBadge keyword="Agile" status="medium" />
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Suggested Keywords to Add</span>
                  <span className="text-sm text-gray-500">8 recommendations</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <SuggestedKeyword keyword="TypeScript" />
                  <SuggestedKeyword keyword="CI/CD" />
                  <SuggestedKeyword keyword="Cloud Computing" />
                  <SuggestedKeyword keyword="Data Analysis" />
                  <SuggestedKeyword keyword="Stakeholder Management" />
                </div>
              </div>
            </div>
          </div>
        )}

        {visibleSections.includes(6) && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 animate-fadeIn">
            <div className="flex items-center gap-2 mb-5">
              <FileText className="w-5 h-5 text-gray-700" />
              <h3 className="text-xl font-semibold text-gray-900">Formatting & Readability</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReadabilityMetric label="Reading Level" value="Professional" status="good" />
              <ReadabilityMetric label="Total Word Count" value="487 words" status="good" />
              <ReadabilityMetric label="Average Section Length" value="Optimal" status="good" />
              <ReadabilityMetric label="White Space Usage" value="Excellent" status="good" />
              <ReadabilityMetric label="Font Consistency" value="Consistent" status="good" />
              <ReadabilityMetric label="Bullet Point Length" value="Could be shorter" status="warning" />
            </div>
          </div>
        )}

        {visibleSections.includes(7) && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 animate-fadeIn">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-5 h-5 text-purple-700" />
              <h3 className="text-xl font-semibold text-gray-900">Priority Action Items</h3>
            </div>
            <div className="space-y-3">
              <ActionItem priority="high" text="Add 3-5 industry-specific keywords to increase ATS score" />
              <ActionItem priority="high" text="Include LinkedIn profile URL in contact information" />
              <ActionItem priority="medium" text="Quantify more achievements with specific metrics" />
              <ActionItem priority="medium" text="Add relevant certifications or recent courses" />
              <ActionItem priority="low" text="Shorten some bullet points to 1-2 lines" />
              <ActionItem priority="low" text="Consider adding a portfolio or GitHub link" />
            </div>
          </div>
        )}

        {visibleSections.includes(8) && (
          <div className="ai-industry-tips-card animate-fadeIn">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-green-700" />
              <h3 className="text-xl font-semibold text-gray-900">Industry-Specific Tips</h3>
            </div>
            <div className="space-y-4">
              <IndustryTip
                title="Tech Industry Focus"
                description="Your CV shows strong technical skills. Consider adding open-source contributions, GitHub profile, and specific technologies used in each project."
              />
              <IndustryTip
                title="Leadership Emphasis"
                description="Highlight team sizes managed, mentorship activities, and cross-functional collaboration experiences to appeal to senior roles."
              />
              <IndustryTip
                title="Results-Oriented Language"
                description="Continue using metrics and quantifiable outcomes. Hiring managers in your field respond well to data-driven achievements."
              />
            </div>
          </div>
        )}
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreCard({ icon, label, score, bgColor }: { icon: React.ReactNode; label: string; score: number; bgColor: string }) {
  return (
    <div className={`ai-card-md ${bgColor}`}>
      <div className="ai-mini-header">
        {icon}
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className="text-3xl font-bold text-gray-900">{score}</div>
      <div className="text-xs text-gray-500 mt-1">/ 100</div>
    </div>
  );
}

function StrengthItem({ text }: { text: string }) {
  return (
    <li className="ai-list-item">
      <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
      <span>{text}</span>
    </li>
  );
}

function WeaknessItem({ text }: { text: string }) {
  return (
    <li className="ai-list-item">
      <TrendingDown className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
      <span>{text}</span>
    </li>
  );
}

function SectionAnalysis({ section, score, feedback, suggestions }: { section: string; score: number; feedback: string; suggestions: string[] }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="ai-analysis-card">
      <div className="ai-analysis-header">
        <h4 className="ai-subtitle">{section}</h4>
        <div className={`text-xl font-bold ${getScoreColor(score)}`}>{score}/100</div>
      </div>
      <p className="ai-paragraph mb-3">{feedback}</p>
      <div className="ai-suggestions-list">
        <p className="ai-suggestions-title">Suggestions:</p>
        {suggestions.map((suggestion, idx) => (
          <div key={idx} className="ai-suggestion-item">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>{suggestion}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ATSCheckItem({ status, text }: { status: 'pass' | 'warning' | 'fail'; text: string }) {
  const config = {
    pass: { icon: <CheckCircle className="w-5 h-5 text-green-600" />, color: 'text-gray-700' },
    warning: { icon: <AlertCircle className="w-5 h-5 text-yellow-600" />, color: 'text-gray-700' },
    fail: { icon: <AlertCircle className="w-5 h-5 text-red-600" />, color: 'text-gray-700' },
  };

  return (
    <div className="ai-ats-item">
      {config[status].icon}
      <span className={`text-sm ${config[status].color}`}>{text}</span>
    </div>
  );
}

function KeywordBadge({ keyword, status }: { keyword: string; status: 'strong' | 'medium' | 'weak' }) {
  const classes = {
    strong: 'ai-keyword-strong',
    medium: 'ai-keyword-medium',
    weak: 'ai-keyword-weak',
  };

  return <span className={classes[status]}>{keyword}</span>;
}

function SuggestedKeyword({ keyword }: { keyword: string }) {
  return <span className="ai-suggested-keyword">+ {keyword}</span>;
}

function ReadabilityMetric({ label, value, status }: { label: string; value: string; status: 'good' | 'warning' | 'error' }) {
  const statusClass = {
    good: 'ai-readability-good',
    warning: 'ai-readability-warning',
    error: 'ai-readability-error',
  }[status];

  return (
    <div className="ai-readability-metric">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className={`text-sm font-semibold ${statusClass}`}>{value}</span>
    </div>
  );
}

function ActionItem({ priority, text }: { priority: 'high' | 'medium' | 'low'; text: string }) {
  const config = {
    high: { className: 'ai-priority-high', label: 'HIGH' },
    medium: { className: 'ai-priority-medium', label: 'MEDIUM' },
    low: { className: 'ai-priority-low', label: 'LOW' },
  };

  return (
    <div className="ai-action-item">
      <span className={config[priority].className}>{config[priority].label}</span>
      <span className="text-sm text-gray-700 flex-1">{text}</span>
    </div>
  );
}

function IndustryTip({ title, description }: { title: string; description: string }) {
  return (
    <div className="ai-industry-tip">
      <h4 className="ai-tip-title">{title}</h4>
      <p className="ai-tip-description">{description}</p>
    </div>
  );
}
