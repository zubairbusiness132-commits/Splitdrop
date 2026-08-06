export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  toolId: string;
  description: string;
  prompt: string;
  tags: string[];
}

export const PROMPT_LIBRARY_TEMPLATES: PromptTemplate[] = [
  {
    id: 'chatgpt-code-refactor',
    title: 'Senior Software Architect Code Review & Refactor',
    category: 'Coding & Tech',
    toolId: 'coding-prompt-builder',
    description: 'Refactor complex code for performance, readability, type safety and clean architecture.',
    tags: ['Coding', 'Refactoring', 'Architecture'],
    prompt: `Act as a Senior Principal Software Architect.
Review the following code for performance bottlenecks, security vulnerabilities, edge-case bugs, and anti-patterns.
Provide:
1. Refactored, production-ready code with clean typing and modern syntax.
2. Step-by-step breakdown of architectural improvements.
3. Edge cases handled and performance benchmark estimations.

Target Framework/Language: [Specify Language/Framework]
Code Snippet:
\`\`\`
[Insert your code here]
\`\`\``
  },
  {
    id: 'seo-blog-brief',
    title: 'E-E-A-T Comprehensive SEO Content Brief',
    category: 'SEO & Content',
    toolId: 'seo-prompt-builder',
    description: 'Generate an in-depth article outline with primary keywords, user intent & search engine ranking strategy.',
    tags: ['SEO', 'Blogging', 'E-E-A-T'],
    prompt: `Act as an expert SEO Director and Senior Content Strategist.
Create a comprehensive 2,000+ word SEO Article Outline and Brief.

Target Keyword: [Insert Primary Keyword]
Secondary Keywords: [Keyword 1, Keyword 2, Keyword 3]
Target Search Intent: Informational & Problem Solving

Requirements:
1. Catchy Meta Title (under 60 characters) and Meta Description (under 155 characters) with high CTR hook.
2. Detailed Heading Structure (H1, H2, H3) with exact subtopics to cover.
3. E-E-A-T optimization rules (Expertise, Experience, Authoritativeness, Trustworthiness).
4. FAQ section with Schema.org markup recommendations.
5. Internal & External link positioning recommendations.`
  },
  {
    id: 'midjourney-cyberpunk-portrait',
    title: 'Cinematic Cyberpunk Street Portrait (Midjourney v6.1)',
    category: 'Image Generation',
    toolId: 'midjourney-prompt-builder',
    description: 'Photorealistic cyberpunk street portrait with vivid neon reflections and volumetric atmosphere.',
    tags: ['Midjourney', 'Cyberpunk', 'Portrait'],
    prompt: `Cinematic eye-level street portrait of a cyberpunk hacker in a rainy Tokyo alley at night, vivid blue and magenta neon lights reflecting on wet pavement, wearing high-tech tactile streetwear, volumetric fog, dramatic rim lighting, shot on 35mm lens f/1.4, Unreal Engine 5 render style, hyperdetailed skin texture, 8k resolution --ar 16:9 --style raw --v 6.1 --stylize 250`
  },
  {
    id: 'veo-drone-flyover',
    title: 'Cinematic Coastal Mountain Drone Flyover (Google Veo)',
    category: 'Video Generation',
    toolId: 'veo-prompt-builder',
    description: 'High-speed cinematic drone video sequence along misty ocean cliffs at golden hour.',
    tags: ['Veo', 'Drone', 'Cinematic'],
    prompt: `Cinematic 4K drone shot descending rapidly along dramatic mossy sea cliffs in Iceland during golden hour sunset, ocean waves crashing against black sand shore, misty sea spray glowing in sunlight, smooth forward dolly-zoom camera movement, lens flare, filmic color grade, photorealistic 60fps --ar 16:9`
  },
  {
    id: 'logo-minimalist-tech',
    title: 'Minimalist Tech Startup Vector Logo',
    category: 'Logo Design',
    toolId: 'logo-prompt-builder',
    description: 'Clean geometry logo mark for modern software and AI startups.',
    tags: ['Logo', 'Minimalist', 'Tech'],
    prompt: `Minimalist geometric vector logo mark for an AI technology company named "Nexus AI", overlapping smooth gradient lines forming an abstract letter 'N', flat vector art style, gradient electric cyan and deep indigo, isolated on clean white background, high symmetry, professional brand mark, vector graphics, no 3D photorealism, no noise --no realistic photos, complex shadows`
  },
  {
    id: 'youtube-viral-hook-script',
    title: 'Viral YouTube Shorts 60-Second Script',
    category: 'YouTube & Video',
    toolId: 'youtube-script-prompt-builder',
    description: 'High-retention 60-second video script with pattern interrupt hook and visual cues.',
    tags: ['YouTube', 'Shorts', 'Script'],
    prompt: `Act as a master viral YouTube content creator.
Write a fast-paced 60-second script for YouTube Shorts / TikTok.

Topic: [Insert Topic Here]
Goal: Maximize Watch Time & Engagement

Script Format:
[0:00 - 0:03] - Pattern Interrupt Hook (Bold claim or surprising question)
[0:03 - 0:15] - Core Problem / The Big Reveal
[0:15 - 0:45] - 3 Rapid-Fire Actionable Tips (With B-Roll & Text Overlay Cues)
[0:45 - 0:60] - Mindblowing Conclusion + Natural CTA (Call to Action)

Include specific [VISUAL CUE], [TEXT OVERLAY], and [SOUND EFFECT] markers for video editing.`
  },
  {
    id: 'claude-deep-research',
    title: 'Claude 3.5 Structural Deep Research & Synthesis',
    category: 'Research & Writing',
    toolId: 'claude-prompt-builder',
    description: 'Comprehensive research synthesis with XML tag structure and source evaluation.',
    tags: ['Claude', 'Research', 'XML Tags'],
    prompt: `<role>
You are an elite Lead Intelligence Analyst and Academic Researcher.
</role>

<context>
The user needs a rigorous, objective deep-dive analysis on the target topic.
Target Subject: [Insert Subject / Query]
</context>

<instructions>
1. Synthesize current developments, market impacts, technical fundamentals, and future outlook.
2. Evaluate potential risks, counter-arguments, and edge cases.
3. Structure your response using clear markdown headings and comparative tables where appropriate.
</instructions>

<output_format>
- Executive Summary (3 Key Bullet Points)
- Detailed Analysis & Historical Context
- Technological / Strategic Comparison Matrix
- Future Projections & Strategic Recommendations
</output_format>`
  },
  {
    id: 'resume-ats-bullet-generator',
    title: 'ATS High-Impact Achievement Bullet Points',
    category: 'Career & HR',
    toolId: 'resume-prompt-builder',
    description: 'Transform mundane job responsibilities into metric-driven ATS resume bullet points using the XYZ formula.',
    tags: ['Resume', 'Career', 'ATS'],
    prompt: `Act as a Silicon Valley Senior Technical Recruiter and Resume Specialist.
Transform the following job duties into 5 high-impact, ATS-optimized accomplishment bullets using Google's XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".

Target Role: [Insert Job Title]
Target Industry: [Insert Industry]
Raw Responsibilities / Project Details:
- [Paste raw notes or past duties here]

Rules:
- Start every bullet with a strong action verb (e.g., Spearheaded, Engineered, Accelerated).
- Quantify impact with realistic metrics (percentages, dollar amounts, time saved).
- Seamlessly integrate high-value keywords for [Insert Target Role].`
  }
];
