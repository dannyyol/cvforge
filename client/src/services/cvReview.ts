export interface CVSection {
  name: string;
  score: number;
  suggestions: string[];
}

export interface CVReviewResponse {
  overall_score: number;
  categories: {
    "ATS Compatibility": number;
    "Content Quality": number;
    Formatting: number;
  };
  strengths: string[];
  areas_to_improve: string[];
  sections: CVSection[];
}

export async function reviewCv(
  resumeText: string,
  model?: string,
  apiBase = "http://127.0.0.1:8000"
): Promise<CVReviewResponse> {
  const res = await fetch(`${apiBase}/api/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume_text: resumeText, model }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error (${res.status}): ${text}`);
  }

  return (await res.json()) as CVReviewResponse;
}