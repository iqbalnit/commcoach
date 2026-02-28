// ─── Type Aliases ──────────────────────────────────────────────────────────────
export type CompanyKey = "google" | "amazon" | "microsoft" | "meta" | "apple" | "general";
export type RoleLevel = "director" | "vp";
export type StoryCategory = "impact" | "innovation" | "leadership" | "resilience" | "collaboration";
export type WeekStatus = "locked" | "available" | "in-progress" | "completed";

// ─── Core Interfaces ───────────────────────────────────────────────────────────
export interface Framework {
  id: string;
  name: string;
  acronym: string;
  description: string;
  source: string;
  steps: { label: string; description: string; example: string }[];
  useCases: string[];
  tips: string[];
}

export interface Scenario {
  id: string;
  title: string;
  context: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  framework: string;
  prompt: string;
  keyPoints: string[];
  commonMistakes: string[];
  expertTip: string;
  timeLimit: number; // seconds
  // Executive interview fields (optional — standard scenarios don't set these)
  isExecutive?: boolean;
  companies?: CompanyKey[];
  roleLevel?: RoleLevel[];
  leadershipPrinciple?: string;
  answerFrameworkHint?: string;
}

export interface Principle {
  id: string;
  title: string;
  description: string;
  coach: string;
  category: string;
  actionItems: string[];
  quote: string;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
}

// ─── Executive Content Interfaces ─────────────────────────────────────────────
export interface LearningResource {
  type: "read" | "watch" | "practice" | "reflect";
  title: string;
  description: string;
  estimatedMinutes: number;
}

export interface LearningPathWeek {
  week: number;
  title: string;
  theme: string;
  description: string;
  objectives: string[];
  resources: LearningResource[];
  practiceScenarioIds: string[];
  frameworkIds: string[];
  principleIds: string[];
  milestoneCheck: string;
}

export interface CompanyValue {
  name: string;
  description: string;
  exampleQuestion: string;
}

export interface CompanyProfile {
  id: CompanyKey;
  name: string;
  initial: string;
  color: string;
  tagline: string;
  values: CompanyValue[];
  interviewStyle: string;
  hiringBarNotes: string;
  redFlags: string[];
  greenFlags: string[];
}

export interface RoleLevelProfile {
  level: RoleLevel;
  title: string;
  scopeDescription: string;
  coreCompetencies: string[];
  signatureBehaviors: string[];
  commonGaps: string[];
  typicalQuestions: string[];
}

// ─── Frameworks ────────────────────────────────────────────────────────────────
export const frameworks: Framework[] = [
  {
    id: "prep",
    name: "PREP Framework",
    acronym: "PREP",
    description:
      "A structured approach to answering questions concisely and persuasively. Popularized by Matt Abrahams for spontaneous speaking situations.",
    source: "Matt Abrahams – Think Fast, Talk Smart",
    steps: [
      {
        label: "Point",
        description: "State your main point or answer upfront",
        example:
          "We should move our product launch to Q3 rather than Q2.",
      },
      {
        label: "Reason",
        description: "Give the primary reason supporting your point",
        example:
          "Q3 gives us time to address the three usability gaps our beta testers flagged.",
      },
      {
        label: "Example",
        description: "Provide a concrete example or evidence",
        example:
          "Our competitor launched prematurely last year and saw a 40% refund rate in week one.",
      },
      {
        label: "Point",
        description: "Restate your point to reinforce the message",
        example:
          "So a Q3 launch protects our reputation and sets us up for a stronger first month.",
      },
    ],
    useCases: [
      "Answering unexpected questions in meetings",
      "Elevator pitches",
      "Job interview responses",
      "Quick status updates",
    ],
    tips: [
      "Lead with your conclusion — don't make people wait for your point",
      "Keep each step to 1–2 sentences in spontaneous situations",
      "Practice with low-stakes questions to build the habit",
    ],
  },
  {
    id: "scr",
    name: "SCR Framework",
    acronym: "SCR",
    description:
      "A narrative structure used by McKinsey consultants and executive coaches to present complex information in a compelling, logical sequence.",
    source: "McKinsey Consulting / Executive Communication",
    steps: [
      {
        label: "Situation",
        description: "Establish the current context and background",
        example:
          "Our customer retention rate has declined 15% over the past two quarters.",
      },
      {
        label: "Complication",
        description: "Introduce the problem or tension that demands action",
        example:
          "If this trend continues, we project a $2M revenue loss by year-end and risk losing our top enterprise accounts.",
      },
      {
        label: "Resolution",
        description: "Present your recommended solution with clear next steps",
        example:
          "I'm recommending a three-part retention program: proactive outreach, a loyalty tier upgrade, and a dedicated success manager for our top 50 accounts.",
      },
    ],
    useCases: [
      "Executive presentations",
      "Board updates",
      "Proposing new initiatives",
      "Change management communications",
    ],
    tips: [
      "Keep the Situation brief — your audience likely knows most of it",
      "Make the Complication urgent and concrete with data",
      "The Resolution should feel inevitable given your setup",
    ],
  },
  {
    id: "star",
    name: "STAR Method",
    acronym: "STAR",
    description:
      "A behavioral storytelling framework that structures experience-based answers into compelling, evidence-backed narratives.",
    source: "Behavioral Interview / Leadership Coaching",
    steps: [
      {
        label: "Situation",
        description: "Set the scene with relevant context",
        example:
          "In my previous role, our team faced a critical product outage two days before a major client demo.",
      },
      {
        label: "Task",
        description: "Describe your specific responsibility",
        example:
          "As the engineering lead, I was responsible for restoring service and keeping the client informed.",
      },
      {
        label: "Action",
        description: "Explain exactly what YOU did",
        example:
          "I mobilized a war-room, delegated the technical fix to our senior dev, and personally called the client to set expectations and offer alternatives.",
      },
      {
        label: "Result",
        description: "Share the measurable outcome",
        example:
          "We restored service in 4 hours, the demo went ahead as planned, and the client signed a 2-year contract the following week.",
      },
    ],
    useCases: [
      "Job interviews",
      "Performance reviews",
      "Leadership storytelling",
      "Demonstrating competency",
    ],
    tips: [
      "Spend 60% of your time on Action and Result",
      "Quantify the result whenever possible",
      "Rehearse 5–7 core stories that can flex across different questions",
    ],
  },
  {
    id: "and-but-therefore",
    name: "And-But-Therefore",
    acronym: "ABT",
    description:
      "A narrative rhythm framework from screenwriting used to create engaging, conflict-driven stories that hold attention.",
    source: "Randy Olson / Matt Abrahams",
    steps: [
      {
        label: "And",
        description: "Establish the context and agreement",
        example:
          "Our team has been growing, and we've taken on more enterprise clients…",
      },
      {
        label: "But",
        description: "Introduce the conflict or problem",
        example:
          "…but our onboarding process hasn't scaled to match, creating friction for new accounts.",
      },
      {
        label: "Therefore",
        description: "Deliver the resolution or call to action",
        example:
          "Therefore, I'm proposing we dedicate one sprint to automating onboarding, which will save 8 hours per client.",
      },
    ],
    useCases: [
      "Pitches and proposals",
      "Storytelling in presentations",
      "Email subject lines and intros",
      "Motivating teams around a problem",
    ],
    tips: [
      "Avoid 'And... And... And...' — it kills narrative tension",
      "The 'But' is the heart of the story — make it compelling",
      "This works in writing AND speaking",
    ],
  },
  {
    id: "listen-ask-respond",
    name: "LAR: Listen-Ask-Respond",
    acronym: "LAR",
    description:
      "An active listening and response framework used by executive coaches to show genuine engagement and improve the quality of conversations.",
    source: "Executive Leadership Coaching",
    steps: [
      {
        label: "Listen",
        description: "Give full attention; resist formulating your response early",
        example:
          "Pause before responding. Nod, maintain eye contact, avoid interrupting.",
      },
      {
        label: "Ask",
        description: "Clarify before answering — ask one focused question",
        example:
          "\"When you say the project is 'off-track,' which milestone concerns you most?\"",
      },
      {
        label: "Respond",
        description: "Answer with precision, addressing what was actually asked",
        example:
          "\"Given that, here's what I'd prioritize in the next 72 hours…\"",
      },
    ],
    useCases: [
      "Difficult conversations",
      "Executive coaching sessions",
      "Stakeholder management",
      "Team 1:1s",
    ],
    tips: [
      "Silence is not weakness — pausing signals thoughtfulness",
      "Ask clarifying questions to buy thinking time gracefully",
      "Paraphrase what you heard before responding to confirm understanding",
    ],
  },
  {
    id: "woops",
    name: "WOOPS Framework",
    acronym: "WOOPS",
    description:
      "A recovery and improvisation framework to handle mistakes, interruptions, and unexpected moments with grace, inspired by improvisational theater principles.",
    source: "Matt Abrahams – Improvisational Communication",
    steps: [
      {
        label: "Welcome",
        description: "Accept the unexpected moment rather than fight it",
        example: "\"That's a great point I hadn't considered…\"",
      },
      {
        label: "Observe",
        description: "Notice what's actually happening in the room",
        example: "Read the energy — confusion, excitement, skepticism?",
      },
      {
        label: "Offer",
        description: "Give something useful — a question, acknowledgment, or pivot",
        example: "\"Let me address that directly before moving on.\"",
      },
      {
        label: "Pivot",
        description: "Steer back to your message or a productive direction",
        example: "\"Which connects back to why I think X is the right path…\"",
      },
      {
        label: "Summarize",
        description: "Anchor the moment with a clear takeaway",
        example: "\"So the key point remains: we need to act by Friday.\"",
      },
    ],
    useCases: [
      "Recovering from mistakes in presentations",
      "Handling hostile questions",
      "Managing interruptions",
      "Improvised speaking moments",
    ],
    tips: [
      "\"Yes, and...\" mindset: build on what happens rather than resisting it",
      "Mistakes handled well are often more memorable than perfection",
      "Practice improvisation regularly to build this muscle",
    ],
  },
  // ─── Executive Frameworks ──────────────────────────────────────────────────
  {
    id: "mece",
    name: "MECE Principle",
    acronym: "MECE",
    description:
      "Mutually Exclusive, Collectively Exhaustive — the cornerstone of McKinsey-style structured thinking. Ensures your analysis covers everything without overlap, producing airtight arguments executives trust.",
    source: "McKinsey & Company / Barbara Minto",
    steps: [
      {
        label: "Frame the Problem",
        description: "State the question you're solving clearly before structuring your answer",
        example: "\"The question is: why has our NPS dropped 12 points? Let me break this into three non-overlapping drivers.\"",
      },
      {
        label: "Identify Exhaustive Categories",
        description: "Create buckets that together cover 100% of the problem with no gaps",
        example: "Product quality, customer support, and pricing — these three categories capture all touchpoints in the customer journey.",
      },
      {
        label: "Verify Mutual Exclusivity",
        description: "Check that no item appears in more than one bucket",
        example: "\"Onboarding friction\" belongs under product, not support — move it and re-check your structure.",
      },
      {
        label: "Synthesize to Insight",
        description: "Draw a single governing insight from your MECE structure",
        example: "\"Of the three drivers, product quality accounts for 70% of the NPS drop — that's where we focus first.\"",
      },
    ],
    useCases: [
      "Board-level problem structuring",
      "Strategy presentations",
      "Answering 'How would you approach X?' interview questions",
      "Structuring written recommendations",
    ],
    tips: [
      "When in doubt, use a 3-part structure — executives trust the number 3",
      "MECE is a thinking tool first, a communication tool second",
      "Test your categories: can you add 'Other'? If yes, your structure has a gap",
    ],
  },
  {
    id: "pyramid",
    name: "Pyramid Principle",
    acronym: "Pyramid",
    description:
      "Barbara Minto's executive communication method: lead with the answer, then provide supporting arguments in groups of three, each supported by evidence. Eliminates suspense for executives who need conclusions first.",
    source: "Barbara Minto – The Pyramid Principle",
    steps: [
      {
        label: "State the Answer First",
        description: "Open with your recommendation or conclusion — not your analysis",
        example: "\"We should exit the European market. Here are the three reasons why.\"",
      },
      {
        label: "Group Supporting Arguments",
        description: "Present 2–4 supporting points that together prove your conclusion",
        example: "\"First, the regulatory environment has made profitability structurally impossible. Second, our TAM in Europe is 40% smaller than projected. Third, redeploying capital to APAC delivers 3x the return.\"",
      },
      {
        label: "Support Each Argument with Evidence",
        description: "Each supporting point is itself supported by data, examples, or logic",
        example: "\"On regulation: GDPR compliance alone costs us €2M annually and a new digital services tax takes effect in Q1.\"",
      },
    ],
    useCases: [
      "Executive emails and memos",
      "Board presentations",
      "Written recommendations",
      "Answering strategic questions in interviews",
    ],
    tips: [
      "Never bury the lead — executives will stop reading before they reach your conclusion",
      "Group supporting points horizontally (they must all address the same question)",
      "Practice the 'So what?' test at every level of your pyramid",
    ],
  },
  {
    id: "ogsm",
    name: "OGSM Framework",
    acronym: "OGSM",
    description:
      "Objectives, Goals, Strategies, Measures — a strategic planning and communication framework used by P&G, Nestlé, and other Fortune 500 companies to align teams around a shared plan on one page.",
    source: "P&G / Strategic Planning",
    steps: [
      {
        label: "Objective",
        description: "State your qualitative, aspirational destination — the 'North Star'",
        example: "\"Become the most trusted AI productivity platform in the enterprise market by 2026.\"",
      },
      {
        label: "Goals",
        description: "Define 3–5 quantitative targets that define success for the objective",
        example: "\"$50M ARR, 90% gross retention, NPS > 60, 5 Fortune 500 reference customers.\"",
      },
      {
        label: "Strategies",
        description: "Identify the 3–4 key strategic choices that will achieve the goals",
        example: "\"Land enterprise accounts via channel partners; expand product-led growth in SMB; build an ecosystem of integrations.\"",
      },
      {
        label: "Measures",
        description: "Define the KPIs and leading indicators for each strategy",
        example: "\"Channel revenue as % of total, weekly active users per seat, integration adoption rate.\"",
      },
    ],
    useCases: [
      "Presenting a business plan to the C-suite",
      "Aligning cross-functional teams on strategy",
      "Annual planning communications",
      "Interview questions about vision and planning",
    ],
    tips: [
      "The power of OGSM is on one page — if you can't fit it, your strategy is too complex",
      "Strategies explain HOW — they are not goals restated",
      "Leading indicators in Measures are more valuable than lagging ones",
    ],
  },
  {
    id: "five-whys",
    name: "The 5 Whys",
    acronym: "5 Whys",
    description:
      "A root-cause analysis technique from Toyota that uses sequential 'why' questions to dig past symptoms to the underlying cause — then communicate findings with credibility.",
    source: "Toyota Production System / Sakichi Toyoda",
    steps: [
      {
        label: "State the Problem",
        description: "Describe the observable problem precisely",
        example: "\"Customer escalations increased 35% in Q3.\"",
      },
      {
        label: "Ask Why (×3–5)",
        description: "Ask 'Why?' iteratively until you reach a root cause, not a symptom",
        example: "Why? → Support response time increased. Why? → Team was understaffed. Why? → Headcount freeze during org redesign. Why? → Finance didn't model support load correctly during planning.",
      },
      {
        label: "Identify the Root Cause",
        description: "The last 'why' that reveals a systemic issue, not a person",
        example: "\"Root cause: our planning process doesn't include support load modeling.\"",
      },
      {
        label: "Communicate the Finding",
        description: "Present root cause + resolution to stakeholders using SCR or PREP",
        example: "\"The escalation spike wasn't a support quality problem — it was a planning gap. Here's what we're changing in Q4 planning.\"",
      },
    ],
    useCases: [
      "Post-mortem communications",
      "Presenting root cause analysis to leadership",
      "Interview questions about problem-solving",
      "Turning complaints into insights",
    ],
    tips: [
      "Stop at the root cause, not the blame — root causes are systemic, not personal",
      "5 is a guideline, not a rule — sometimes 3 whys is enough",
      "Document and share your 5 Whys analysis; it shows rigor and builds credibility",
    ],
  },
  {
    id: "sbi",
    name: "SBI Feedback Model",
    acronym: "SBI",
    description:
      "Situation-Behavior-Impact: the Center for Creative Leadership's gold standard for delivering clear, specific, non-judgmental feedback that executives and senior leaders can act on.",
    source: "Center for Creative Leadership",
    steps: [
      {
        label: "Situation",
        description: "Anchor the feedback in a specific, recent moment — not a pattern",
        example: "\"In yesterday's leadership review when you presented the Q4 forecast…\"",
      },
      {
        label: "Behavior",
        description: "Describe exactly what you observed — no interpretation, no labels",
        example: "\"…you stated the numbers before checking whether the Finance team had reviewed them.\"",
      },
      {
        label: "Impact",
        description: "Share the effect — on you, the team, the business",
        example: "\"That created confusion in the room and the CFO asked three clarifying questions that pulled us off the main agenda.\"",
      },
    ],
    useCases: [
      "Peer-to-peer executive feedback",
      "360-degree feedback delivery",
      "Giving feedback to your own manager",
      "Coaching conversations",
    ],
    tips: [
      "Avoid 'you always' and 'you never' — SBI is about a specific moment",
      "The Impact is the most important step — it makes the feedback matter",
      "After SBI, ask a question: 'What's your take on this?' — then listen",
    ],
  },
  {
    id: "xyz-method",
    name: "XYZ Method",
    acronym: "XYZ",
    description:
      "Google's structured approach to writing and speaking about accomplishments: 'I accomplished X, measured by Y, by doing Z.' Cuts through vague achievements to specific, credible impact.",
    source: "Google Recruiting / Laszlo Bock – Work Rules!",
    steps: [
      {
        label: "X — What You Accomplished",
        description: "Lead with the outcome or achievement, not the activity",
        example: "\"I reduced customer onboarding time by 40%…\"",
      },
      {
        label: "Y — Measured By",
        description: "Quantify the result with a specific metric",
        example: "\"…as measured by median time-to-first-value dropping from 14 days to 8 days…\"",
      },
      {
        label: "Z — By Doing What",
        description: "Describe the specific action or approach you took",
        example: "\"…by redesigning the setup wizard and eliminating 6 manual steps that required engineering support.\"",
      },
    ],
    useCases: [
      "Writing LinkedIn summaries and resumes for exec roles",
      "Answering Google's behavioral interview questions",
      "Self-promotion in performance reviews",
      "Quantifying leadership impact in interviews",
    ],
    tips: [
      "Most people start with Z — flip it and lead with the result (X)",
      "If you can't fill in Y, you need a stronger example",
      "Practice converting all your STAR stories to XYZ format for Google interviews",
    ],
  },
  {
    id: "soar",
    name: "SOAR Leadership Story",
    acronym: "SOAR",
    description:
      "Strengths-Opportunities-Aspirations-Results: a positive psychology-based storytelling framework for leaders pitching themselves for executive roles — answers 'Why me?' with narrative force.",
    source: "Positive Psychology / Leadership Storytelling",
    steps: [
      {
        label: "Strengths",
        description: "Open with what you uniquely bring — your differentiated leadership strengths",
        example: "\"I build high-trust teams in ambiguous environments — I've done it three times across three different industries.\"",
      },
      {
        label: "Opportunities",
        description: "Articulate what you see in this role or space that others miss",
        example: "\"I see an opportunity here that most candidates won't see: the real leverage isn't in the product — it's in the ecosystem of partners that hasn't been activated.\"",
      },
      {
        label: "Aspirations",
        description: "Share your bold vision for what you'll create in this role",
        example: "\"My aspiration is to turn this division into a platform business within three years — not just a product line.\"",
      },
      {
        label: "Results",
        description: "Ground your story in past results that prove you can deliver",
        example: "\"In my last role, I built a partner ecosystem from zero to 40 partners, generating 30% of company revenue within 18 months.\"",
      },
    ],
    useCases: [
      "Executive interview opening statements",
      "Board candidate introductions",
      "Leadership philosophy questions",
      "Vision questions: 'What will you do in year one?'",
    ],
    tips: [
      "SOAR works best as a 90-second narrative — practice it until it flows naturally",
      "The Opportunity section is where most candidates are weak — do your homework",
      "Results come last because they validate the Strengths — not the other way around",
    ],
  },
  {
    id: "exec-presence",
    name: "Executive Presence Model",
    acronym: "EP Model",
    description:
      "Sylvia Ann Hewlett's research-backed model of executive presence: 67% of executive presence is Gravitas (how you act), 28% is Communication (how you speak), and 5% is Appearance. A complete framework for commanding any room.",
    source: "Sylvia Ann Hewlett – Executive Presence",
    steps: [
      {
        label: "Gravitas",
        description: "Project confidence, decisiveness, and composure under pressure — 67% of EP",
        example: "When the board asks a hard question, pause 2 seconds, nod, then answer calmly. Never show panic. Disagree with conviction when you have data.",
      },
      {
        label: "Communication",
        description: "Speak with clarity, brevity, and intent — 28% of EP",
        example: "Use fewer words, not more. Match your vocal energy to the room. Make eye contact with every key person when making a critical point.",
      },
      {
        label: "Appearance",
        description: "Signal belonging through grooming, dress, and physical bearing — 5% of EP",
        example: "In a FAANG interview, dress one level above casual. Sit tall. Use deliberate gestures. Enter the room as if you belong there — because you do.",
      },
    ],
    useCases: [
      "High-stakes executive interviews",
      "Board presentations",
      "First 90 days in a new executive role",
      "Building credibility with a new team",
    ],
    tips: [
      "Gravitas is the biggest lever — work on your composure under pressure first",
      "Vocal fry and upspeak undermine executive presence more than most people realize",
      "Ask a trusted peer: 'Do I project confidence when the stakes are high?' Then listen.",
    ],
  },
];

// ─── Scenarios (Standard + Executive) ─────────────────────────────────────────
export const scenarios: Scenario[] = [
  // Standard scenarios (existing)
  {
    id: "s1",
    title: "Deliver a 60-Second Elevator Pitch",
    context:
      "You're at a networking event and the CEO of a company you want to partner with asks: 'So, what does your company do?'",
    category: "Pitching",
    difficulty: "beginner",
    framework: "prep",
    prompt:
      "You have 60 seconds. Respond to: 'Tell me about your company.' Use the PREP framework.",
    keyPoints: [
      "Lead with your core value proposition",
      "Make it specific and memorable",
      "End with a hook or question to continue the conversation",
    ],
    commonMistakes: [
      "Starting with 'So basically...' or 'Um, well...'",
      "Listing features instead of outcomes",
      "Forgetting to include a call to action",
    ],
    expertTip:
      "Matt Abrahams: 'The best pitches make the listener the hero, not your product.'",
    timeLimit: 60,
  },
  {
    id: "s2",
    title: "Answer a Tough Question in a Meeting",
    context:
      "Mid-presentation, your VP asks: 'Why are we behind on this project and what are you doing about it?'",
    category: "Spontaneous Speaking",
    difficulty: "intermediate",
    framework: "prep",
    prompt:
      "Answer this difficult question on the spot using PREP. Don't be defensive — be direct and solution-focused.",
    keyPoints: [
      "Own the situation without over-explaining",
      "Lead with your answer, not the backstory",
      "Show you have a clear plan",
    ],
    commonMistakes: [
      "Starting with a long list of reasons before the solution",
      "Being vague about next steps",
      "Sounding defensive or blaming others",
    ],
    expertTip:
      "Executive coaches say: 'Answer the question asked, not the question you wished they asked.'",
    timeLimit: 90,
  },
  {
    id: "s3",
    title: "Propose a New Initiative to Leadership",
    context:
      "You have 5 minutes in a leadership meeting to propose investing in a new tool that will save the team time.",
    category: "Executive Communication",
    difficulty: "intermediate",
    framework: "scr",
    prompt:
      "Present your proposal using the SCR framework. Focus on business impact, not just features.",
    keyPoints: [
      "Frame around business problem, not tool features",
      "Use data to support your complication",
      "Make the ask clear and specific",
    ],
    commonMistakes: [
      "Starting with tool details instead of the business problem",
      "Underselling the cost of inaction",
      "Asking for approval without a clear recommendation",
    ],
    expertTip:
      "McKinsey principle: 'Answer first' — put your recommendation at the top, not at the end.",
    timeLimit: 300,
  },
  {
    id: "s4",
    title: "Tell a Leadership Story in an Interview",
    context:
      "An interviewer asks: 'Tell me about a time you led through a crisis.'",
    category: "Storytelling",
    difficulty: "intermediate",
    framework: "star",
    prompt:
      "Use the STAR method. Make the story specific, personal, and results-focused.",
    keyPoints: [
      "Be specific about YOUR role, not the team's",
      "Include the emotional dimension — what was at stake",
      "Quantify the result",
    ],
    commonMistakes: [
      "Saying 'we' instead of 'I' when describing your actions",
      "Vague results like 'it went well'",
      "Spending too long on Situation/Task, too little on Action/Result",
    ],
    expertTip:
      "\"Great stories have a moment of decision — the moment where your choices changed the outcome.\" — Executive Coach",
    timeLimit: 120,
  },
  {
    id: "s5",
    title: "Give Difficult Feedback to a Peer",
    context:
      "A colleague's work has been consistently late, affecting your team. You need to address it directly in a 1:1.",
    category: "Difficult Conversations",
    difficulty: "advanced",
    framework: "listen-ask-respond",
    prompt:
      "Open the conversation, share the observation, and use LAR to make it a dialogue, not a lecture.",
    keyPoints: [
      "Lead with observation, not judgment",
      "Ask before telling to understand their perspective",
      "Focus on behavior and impact, not character",
    ],
    commonMistakes: [
      "Starting with 'You always...' or 'You never...'",
      "Giving a speech instead of having a conversation",
      "Avoiding the real issue by softening too much",
    ],
    expertTip:
      "\"The goal of feedback is a better future, not a processed past.\" — Executive Coach Kim Scott (Radical Candor)",
    timeLimit: 180,
  },
  {
    id: "s6",
    title: "Recover from a Mistake in a Presentation",
    context:
      "You cited the wrong data in a slide and an audience member just called it out in front of 50 people.",
    category: "Spontaneous Speaking",
    difficulty: "advanced",
    framework: "woops",
    prompt:
      "Recover gracefully. Don't panic, don't over-apologize, don't lose your composure.",
    keyPoints: [
      "Acknowledge the error quickly and directly",
      "Thank the person for catching it",
      "Pivot back to your core message",
    ],
    commonMistakes: [
      "Over-apologizing and losing confidence",
      "Getting defensive",
      "Letting it derail the rest of your talk",
    ],
    expertTip:
      "Matt Abrahams: 'How you handle a mistake matters more than the mistake itself. It's a trust-building moment.'",
    timeLimit: 60,
  },
  {
    id: "s7",
    title: "Open a Team Meeting with Energy",
    context:
      "You're running a Monday morning all-hands and you want to set a positive, focused tone for the week.",
    category: "Leadership Communication",
    difficulty: "beginner",
    framework: "and-but-therefore",
    prompt:
      "Open the meeting using ABT structure to frame the week's challenge and rally the team.",
    keyPoints: [
      "Set context quickly — people know it's Monday",
      "Make the challenge feel real and urgent",
      "End with a clear call to action or theme for the week",
    ],
    commonMistakes: [
      "Starting with logistics and housekeeping",
      "Being too positive without acknowledging real challenges",
      "No clear call to action at the end",
    ],
    expertTip:
      "\"Start with why, not what.\" — Great leaders open with purpose, not agenda.",
    timeLimit: 120,
  },
  {
    id: "s8",
    title: "Handle a Hostile Question",
    context:
      "During a Q&A, an audience member asks aggressively: 'Your strategy seems completely wrong for this market. Why should anyone trust you?'",
    category: "Spontaneous Speaking",
    difficulty: "advanced",
    framework: "prep",
    prompt:
      "Respond to this hostile question without getting defensive. Stay calm, confident, and credible.",
    keyPoints: [
      "Don't match the aggression",
      "Acknowledge the perspective before reframing",
      "Bring data or evidence to ground your response",
    ],
    commonMistakes: [
      "Getting visibly rattled or flustered",
      "Being dismissive: 'That's not a fair question'",
      "Over-explaining or getting long-winded",
    ],
    expertTip:
      "\"Bridge technique: Acknowledge, Pivot, Bridge. Don't fight the frame — change it.\" — Media Training Coach",
    timeLimit: 90,
  },
  // ─── Executive Interview Scenarios ────────────────────────────────────────
  {
    id: "exec-1",
    title: "Describe Your Leadership Philosophy",
    context:
      "The panel asks: 'Tell us about your leadership philosophy and how it shows up in how you build teams.'",
    category: "Leadership Communication",
    difficulty: "advanced",
    framework: "soar",
    prompt:
      "Deliver a compelling 2–3 minute leadership philosophy statement. Use SOAR: what are your strengths, what opportunities do you see, what are your aspirations, and what results prove it?",
    keyPoints: [
      "Name your philosophy with a clear label — don't just describe it",
      "Ground it in at least one specific story from your career",
      "Connect it to the company's culture and needs",
    ],
    commonMistakes: [
      "Being abstract and generic ('I believe in people')",
      "Not connecting your philosophy to business outcomes",
      "Sounding rehearsed rather than authentic",
    ],
    expertTip:
      "Executive coaches say: 'Your leadership philosophy should be a story about what you believe, proved by what you've done.' Name it, claim it, prove it.",
    timeLimit: 180,
    isExecutive: true,
    companies: ["general", "google", "microsoft"],
    roleLevel: ["director", "vp"],
    answerFrameworkHint: "Use SOAR: lead with your Strengths, articulate an Opportunity you see, share your Aspiration, then ground it in Results.",
  },
  {
    id: "exec-2",
    title: "How Would You Scale Trust Across 500 Engineers?",
    context:
      "You're interviewing for a VP Engineering role. The CTO asks: 'How do you build and maintain trust at scale when you can't know everyone personally?'",
    category: "Executive Communication",
    difficulty: "advanced",
    framework: "scr",
    prompt:
      "Answer with a structured response using SCR. Show you have a systems-level perspective on trust — not just interpersonal skills.",
    keyPoints: [
      "Distinguish between trust at the team level vs. org level — they require different mechanisms",
      "Reference specific mechanisms you've used (rituals, transparency practices, feedback loops)",
      "Acknowledge what breaks trust at scale and how you prevent it",
    ],
    commonMistakes: [
      "Describing only small-team tactics that don't scale",
      "Answering with abstract values without operational specifics",
      "Not addressing the 'at scale' part of the question",
    ],
    expertTip:
      "Patrick Lencioni: 'Trust at scale requires structural transparency — not just personal relationships. Tell them about the systems you build, not just the relationships you have.'",
    timeLimit: 180,
    isExecutive: true,
    companies: ["general", "google", "amazon"],
    roleLevel: ["vp"],
    answerFrameworkHint: "Use SCR: Situation (current trust challenges at scale), Complication (what breaks down), Resolution (your specific mechanisms).",
  },
  {
    id: "exec-3",
    title: "Tell Me About Leading Through Ambiguity",
    context:
      "Amazon LP: 'Are Right, A Lot' and 'Bias for Action' are being tested. The interviewer asks: 'Tell me about a time you had to make a significant decision with incomplete information.'",
    category: "Storytelling",
    difficulty: "advanced",
    framework: "star",
    prompt:
      "Use STAR to tell a specific story. The story must demonstrate: how you gathered signal, how you made the decision, and what you learned from the outcome.",
    keyPoints: [
      "Show your decision-making process — not just the outcome",
      "Quantify what was at stake (budget, people, timeline)",
      "Include what you'd do differently — Amazon loves learning and growth",
    ],
    commonMistakes: [
      "Choosing a low-stakes example that doesn't feel 'significant'",
      "Showing that the decision was actually obvious in hindsight",
      "Omitting what you learned — this is critical for Amazon's culture",
    ],
    expertTip:
      "Amazon LP: 'Bias for Action' means calculated risk-taking, not recklessness. Show that you gathered the right signal quickly, not that you guessed.",
    timeLimit: 240,
    isExecutive: true,
    companies: ["amazon"],
    roleLevel: ["director", "vp"],
    leadershipPrinciple: "Amazon LP: Are Right, A Lot + Bias for Action",
    answerFrameworkHint: "Use STAR with extended focus on Action (your decision process) and Result (outcome + learning).",
  },
  {
    id: "exec-4",
    title: "How Do You Influence Without Authority?",
    context:
      "A common Director/VP question: 'Describe how you drive alignment across teams when you have no direct authority over them.'",
    category: "Executive Communication",
    difficulty: "advanced",
    framework: "prep",
    prompt:
      "Answer with a clear framework for how you influence cross-functionally. Support it with a real example and measurable outcome.",
    keyPoints: [
      "Name your approach — don't just tell a story",
      "Address the 'without authority' constraint explicitly",
      "Show that you can influence up (executives) as well as across (peers)",
    ],
    commonMistakes: [
      "Only describing interpersonal skills without structural mechanisms",
      "Example where you actually HAD authority — misreads the question",
      "Not addressing what you do when influence fails and escalation is needed",
    ],
    expertTip:
      "Executive coaches: 'Influence without authority requires three things: credibility, a shared problem, and a clear ask. If you're missing any one, you'll stall.'",
    timeLimit: 180,
    isExecutive: true,
    companies: ["google", "microsoft", "meta", "general"],
    roleLevel: ["director", "vp"],
    answerFrameworkHint: "Use PREP: Point (your approach to influencing without authority), Reason (why it works), Example (specific story), Point (the transferable principle).",
  },
  {
    id: "exec-5",
    title: "Describe a Decision With $10M+ Business Impact",
    context:
      "Amazon LP: 'Deliver Results' and 'Ownership' on the line. Interviewer: 'Tell me about the highest-impact business decision you've made or heavily influenced.'",
    category: "Storytelling",
    difficulty: "advanced",
    framework: "star",
    prompt:
      "Use STAR to tell a story with clear financial or business impact. Show you understand P&L, tradeoffs, and long-term consequences.",
    keyPoints: [
      "Quantify the impact — revenue, cost, customer count, efficiency gain",
      "Show you understood the tradeoffs, not just the upside",
      "Demonstrate ownership — you drove this, not just participated",
    ],
    commonMistakes: [
      "Underselling the impact out of modesty — own the number",
      "Not explaining WHY you made this decision (the analysis)",
      "Describing a team decision as if you were just an observer",
    ],
    expertTip:
      "Amazon LP Ownership: 'Think and act like an owner.' Show that you considered the long-term, not just the quarter — and that you accepted accountability for the outcome.",
    timeLimit: 240,
    isExecutive: true,
    companies: ["amazon", "general"],
    roleLevel: ["vp"],
    leadershipPrinciple: "Amazon LP: Deliver Results + Ownership",
    answerFrameworkHint: "Use STAR. In the Result section: quantify financial impact, then add the secondary impact (culture, customers, market position).",
  },
  {
    id: "exec-6",
    title: "How Would You Build an Engineering Org From Scratch?",
    context:
      "You're being considered for a VP Engineering role at a Series B company or a new division at a large tech firm. They ask: 'If you were starting with a blank slate, how would you build this org?'",
    category: "Executive Communication",
    difficulty: "advanced",
    framework: "scr",
    prompt:
      "Give a structured answer that demonstrates systems thinking. Cover hiring philosophy, culture, processes, and measurement — in that priority order.",
    keyPoints: [
      "Start with principles before process — what values shape your org design?",
      "Sequence matters: show you know what to do in months 1, 3, 6, 12",
      "Address how you'd adapt your approach based on stage, sector, and talent market",
    ],
    commonMistakes: [
      "Jumping straight to org charts and headcount without culture first",
      "Generic answers that don't reflect the specific stage or context",
      "Not mentioning how you'd measure whether the org is working",
    ],
    expertTip:
      "Great engineering leaders say: 'I hire the minimum viable team for the maximum viable culture. Get the norms right first, then scale headcount.'",
    timeLimit: 300,
    isExecutive: true,
    companies: ["google", "meta", "amazon", "general"],
    roleLevel: ["vp"],
    answerFrameworkHint: "Use SCR: Situation (the blank slate context), Complication (common org-building failure modes), Resolution (your specific approach, sequenced by time horizon).",
  },
  {
    id: "exec-7",
    title: "How Do You Build Trust With the C-Suite?",
    context:
      "Interview for a Director role reporting to a C-suite executive: 'How do you establish credibility and trust with senior stakeholders who are new to you?'",
    category: "Executive Communication",
    difficulty: "advanced",
    framework: "pyramid",
    prompt:
      "Use the Pyramid Principle: lead with your answer, then support it with 2–3 specific mechanisms you use. Ground it in a real example.",
    keyPoints: [
      "Distinguish between initial credibility (first 90 days) vs. sustained trust (ongoing)",
      "Be specific about what you do, not just what you believe",
      "Include how you handle disagreements with senior stakeholders",
    ],
    commonMistakes: [
      "Generic answers: 'I over-communicate' and 'I deliver on commitments'",
      "Not addressing what happens when you disagree with the C-suite",
      "Focusing only on impressing them vs. actually serving their goals",
    ],
    expertTip:
      "Executive coach: 'C-suite trust is built on three things: Do you understand what matters to them? Can you deliver? And will you tell them the truth even when it's uncomfortable?'",
    timeLimit: 180,
    isExecutive: true,
    companies: ["general", "microsoft", "apple"],
    roleLevel: ["director", "vp"],
    answerFrameworkHint: "Use Pyramid Principle: state your answer first ('Trust with C-suite is built through...'), then give 3 supporting mechanisms, each grounded in a real behavior.",
  },
  {
    id: "exec-8",
    title: "Tell Me About a Time You Failed as a Leader",
    context:
      "Amazon LP: 'Learn and Be Curious'. The interviewer asks: 'Tell me about your biggest leadership failure. What did you learn and how did you change?'",
    category: "Storytelling",
    difficulty: "advanced",
    framework: "star",
    prompt:
      "Tell a real failure story. Don't soften it or reframe it as a success. Demonstrate self-awareness, learning, and the concrete changes you made.",
    keyPoints: [
      "Choose a genuine failure — not a thinly veiled success story",
      "Be specific about what YOU did wrong, not what the situation was",
      "The learning and change you describe should be specific and verifiable",
    ],
    commonMistakes: [
      "'I worked too hard' — this is not a real failure",
      "Framing the failure as someone else's fault",
      "Vague learning: 'I learned to communicate better'",
    ],
    expertTip:
      "Amazon bar raisers specifically look for authentic failure stories. Candidates who struggle to name a genuine failure are flagged as lacking self-awareness — a disqualifier at Amazon.",
    timeLimit: 240,
    isExecutive: true,
    companies: ["amazon"],
    roleLevel: ["director", "vp"],
    leadershipPrinciple: "Amazon LP: Learn and Be Curious",
    answerFrameworkHint: "Use STAR. Spend 50%+ on Action (what you did wrong and why) and Result (what changed in you as a leader — specifically and verifiably).",
  },
  {
    id: "exec-9",
    title: "What Is Googleyness and How Do You Demonstrate It?",
    context:
      "Google screens hard for cultural fit under their 'Googleyness' dimension. An interviewer asks: 'How would you describe what Googleyness means to you, and how does it show up in your work?'",
    category: "Leadership Communication",
    difficulty: "advanced",
    framework: "prep",
    prompt:
      "Answer this without sounding like you Googled 'what is Googleyness.' Make it personal and grounded in a real story.",
    keyPoints: [
      "Google defines Googleyness as: comfort with ambiguity, intellectual humility, fun-loving nature, and drive to build for everyone",
      "Connect at least one dimension to a real story from your career",
      "Show genuine alignment — not performance of alignment",
    ],
    commonMistakes: [
      "Listing Google's stated values back at them without personalization",
      "Not having a story that proves one of the dimensions",
      "Sounding like you're trying to pass a test rather than sharing who you are",
    ],
    expertTip:
      "Google interviewers are excellent at detecting inauthenticity. The best answers pick one or two dimensions of Googleyness and go deep on a specific story — not a surface tour of all four.",
    timeLimit: 180,
    isExecutive: true,
    companies: ["google"],
    roleLevel: ["director", "vp"],
    answerFrameworkHint: "Use PREP: Point (your definition of Googleyness in your own words), Reason (why it resonates with you), Example (specific story), Point (how you'd bring it to this role).",
  },
  {
    id: "exec-10",
    title: "Walk Me Through Your P&L Management Experience",
    context:
      "For VP+ roles with financial accountability: 'Describe your experience owning a P&L. What were the biggest levers you managed and what was your biggest lesson?'",
    category: "Executive Communication",
    difficulty: "advanced",
    framework: "scr",
    prompt:
      "Walk through your P&L experience with specificity. Show you understand both the revenue and cost sides, and demonstrate financial literacy appropriate for a senior executive.",
    keyPoints: [
      "State the size and scope of the P&L you owned",
      "Identify the 2–3 biggest levers you actively managed",
      "Share a specific decision you made that had a measurable financial outcome",
    ],
    commonMistakes: [
      "Staying at a high level — 'I managed budget and drove revenue' — without specifics",
      "Only describing revenue without touching the cost/efficiency side",
      "Not quantifying the scale (what size P&L? what growth rate?)",
    ],
    expertTip:
      "Amazon and Meta interviewers probe hard on P&L ownership. 'Budget ownership' is not the same as P&L ownership — make sure your story reflects genuine accountability for the bottom line.",
    timeLimit: 240,
    isExecutive: true,
    companies: ["amazon", "meta", "general"],
    roleLevel: ["vp"],
    answerFrameworkHint: "Use SCR: Situation (P&L size and context), Complication (the business challenge you faced), Resolution (the decisions you made and the financial outcome).",
  },
  {
    id: "exec-11",
    title: "How Do You Drive Cultural Change at Scale?",
    context:
      "Microsoft Growth Mindset culture post-Nadella is the context. Interviewer: 'Tell me about a time you needed to change the culture of a team or organization. How did you do it?'",
    category: "Leadership Communication",
    difficulty: "advanced",
    framework: "scr",
    prompt:
      "Tell a story of real cultural transformation — not just team morale improvement. Show you understand culture as a strategic lever, not a soft topic.",
    keyPoints: [
      "Define what the existing culture was vs. what you were building toward",
      "Show the specific interventions you used — symbols, rituals, systems, incentives",
      "Acknowledge what was harder than expected and how you adapted",
    ],
    commonMistakes: [
      "Describing culture change as a communication campaign, not a systems change",
      "Underestimating resistance — not acknowledging the hard parts",
      "Vague outcomes: 'the team felt better' — culture change has business metrics",
    ],
    expertTip:
      "Microsoft's Growth Mindset transformation under Nadella required changes to performance management, incentive structures, and leadership behaviors — not just messaging. Show you understand culture change is systemic.",
    timeLimit: 240,
    isExecutive: true,
    companies: ["microsoft", "general"],
    roleLevel: ["vp"],
    answerFrameworkHint: "Use SCR: Situation (the culture that needed to change and why it was a business problem), Complication (resistance, systemic barriers), Resolution (your specific interventions and measurable outcomes).",
  },
  {
    id: "exec-12",
    title: "How Do You Approach Strategic Prioritization?",
    context:
      "Google and McKinsey-aligned companies test structured thinking. Interviewer: 'You have 10 potential initiatives and resources for 3. Walk me through how you'd decide.'",
    category: "Executive Communication",
    difficulty: "advanced",
    framework: "mece",
    prompt:
      "Answer with a structured framework for prioritization — not a generic answer. Show MECE thinking: your criteria should be exhaustive and non-overlapping.",
    keyPoints: [
      "Name your prioritization criteria before you apply them",
      "Show you consider both short-term impact and long-term strategic fit",
      "Address how you handle disagreement among stakeholders on priorities",
    ],
    commonMistakes: [
      "Not naming a framework — 'I look at impact and effort' is too vague",
      "Applying a rigid formula without acknowledging contextual judgment",
      "Not addressing the people and politics of prioritization",
    ],
    expertTip:
      "Google values MECE thinking. The best prioritization answers name a clear framework (e.g., impact × confidence × effort scoring), apply it with an example, and then acknowledge where judgment overrides the formula.",
    timeLimit: 180,
    isExecutive: true,
    companies: ["google", "general"],
    roleLevel: ["director", "vp"],
    answerFrameworkHint: "Use MECE: define your evaluation dimensions (mutually exclusive), ensure they collectively cover all considerations, then synthesize to a decision.",
  },
  {
    id: "exec-13",
    title: "How Do You Give Feedback to a Peer Executive?",
    context:
      "A cross-functional leadership competency question: 'Describe how you'd give critical feedback to a peer VP whose work is affecting your team.'",
    category: "Difficult Conversations",
    difficulty: "advanced",
    framework: "sbi",
    prompt:
      "Use the SBI framework to demonstrate how you'd deliver this feedback. Role-play the opening 60 seconds of the actual conversation.",
    keyPoints: [
      "Anchor in a specific situation and behavior — not a pattern or label",
      "Focus the impact on business/team outcomes, not personal feelings",
      "Show you'd do this directly with the peer, not through escalation",
    ],
    commonMistakes: [
      "Going to your mutual manager first — this signals conflict avoidance",
      "Being too diplomatic: softening until the message is lost",
      "Feedback focused on personality rather than observable behavior",
    ],
    expertTip:
      "Kim Scott (Radical Candor): 'The kindest thing you can do for a peer executive is give them direct, specific feedback in private before the problem becomes a board-level issue.'",
    timeLimit: 180,
    isExecutive: true,
    companies: ["general", "google", "microsoft"],
    roleLevel: ["director", "vp"],
    answerFrameworkHint: "Use SBI: 'In [specific situation], I observed [specific behavior], and the impact on my team was [specific, measurable impact].'",
  },
  {
    id: "exec-14",
    title: "What Is Your Vision for This Role in Year One?",
    context:
      "Meta 'Focus on Impact' and 'Move Fast' culture. Final round interview: 'If you got this role tomorrow, what would your first-year plan look like?'",
    category: "Executive Communication",
    difficulty: "advanced",
    framework: "pyramid",
    prompt:
      "Answer with a structured 3-horizon plan (first 30, 90, and 365 days). Use the Pyramid Principle: lead with your governing insight, then break into three phases.",
    keyPoints: [
      "Show that your year-one plan is grounded in research about the role, not generic management theory",
      "Distinguish between what you'd learn, what you'd change, and what you'd build",
      "Connect your plan explicitly to the company's stated priorities",
    ],
    commonMistakes: [
      "Generic 30-60-90 plans that could apply to any company or role",
      "Promising too much in year one — shows poor calibration",
      "Not anchoring the plan in what you've actually heard in the interview process",
    ],
    expertTip:
      "Meta values speed and impact. A year-one plan for Meta should include: one quick win in the first 30 days, a hypothesis you're testing by day 90, and a measurable bet you're placing by end of year.",
    timeLimit: 300,
    isExecutive: true,
    companies: ["meta"],
    roleLevel: ["vp"],
    answerFrameworkHint: "Use Pyramid Principle: lead with your governing thesis ('My year-one priority is X because...'), then structure the three phases as supporting pillars.",
  },
  {
    id: "exec-15",
    title: "How Have You Applied Amazon's Leadership Principles?",
    context:
      "Amazon specifically tests LP depth. Interviewer: 'Which of Amazon's Leadership Principles do you most closely identify with and can you give me an example of each of 3 LPs in action?'",
    category: "Leadership Communication",
    difficulty: "advanced",
    framework: "star",
    prompt:
      "Choose 3 Amazon Leadership Principles you genuinely connect with. For each, deliver a concise STAR story that demonstrates the LP in action. Total time: 5 minutes.",
    keyPoints: [
      "Choose LPs where you have authentic stories — not the ones that sound best",
      "Each STAR story should take 90 seconds — don't go longer",
      "The Result for each LP should tie back to business impact",
    ],
    commonMistakes: [
      "Choosing only the 'safe' LPs — bar raisers probe unusual or challenging ones",
      "Telling the same story for multiple LPs",
      "Not knowing all 16 LPs by name — this signals you didn't do your homework",
    ],
    expertTip:
      "Amazon interviews are LP-driven from start to finish. Build a story bank with one strong story for each of the 16 LPs before your interview. Use the STAR bank in your Story Bank view.",
    timeLimit: 300,
    isExecutive: true,
    companies: ["amazon"],
    roleLevel: ["director", "vp"],
    leadershipPrinciple: "All Amazon Leadership Principles",
    answerFrameworkHint: "Use STAR × 3. Choose Customer Obsession, Ownership, and one of: Invent & Simplify, Disagree & Commit, or Earn Trust — these are the most commonly probed.",
  },
];

// ─── Principles ────────────────────────────────────────────────────────────────
export const principles: Principle[] = [
  {
    id: "p1",
    title: "Manage Your Anxiety, Don't Eliminate It",
    description:
      "Nervousness is energy — the goal is to channel it, not suppress it. Reframing anxiety as excitement activates the same physiological state but with a positive mental orientation.",
    coach: "Matt Abrahams",
    category: "Mindset",
    actionItems: [
      "Before speaking, say 'I'm excited' instead of 'I'm nervous'",
      "Use diaphragmatic breathing: 4 counts in, hold 2, 6 counts out",
      "Focus on the audience's needs, not your own performance",
    ],
    quote:
      "\"The goal isn't to eliminate nervousness — it's to use it.\"",
  },
  {
    id: "p2",
    title: "Speak to Be Understood, Not to Impress",
    description:
      "Executive communicators strip out jargon and complexity. Clarity is a sign of intelligence. Complexity is often a mask for uncertainty.",
    coach: "Executive Coaching Principle",
    category: "Clarity",
    actionItems: [
      "Explain your idea as if to a smart 12-year-old",
      "Replace jargon with plain language — test with someone outside your field",
      "Use the 'So what?' test: after every key point, ask why it matters",
    ],
    quote:
      "\"If you can't explain it simply, you don't understand it well enough.\" — Einstein",
  },
  {
    id: "p3",
    title: "Silence Is a Tool, Not a Failure",
    description:
      "Pauses create emphasis, give audiences time to process, and signal confidence. Most speakers fear silence and fill it with filler words, which undermines their credibility.",
    coach: "Matt Abrahams",
    category: "Delivery",
    actionItems: [
      "Practice the 'dramatic pause' — pause for 2 seconds before key points",
      "Record yourself and count filler words (um, uh, like, you know)",
      "Replace filler words with breath",
    ],
    quote:
      "\"The pause is the most powerful punctuation in spoken communication.\"",
  },
  {
    id: "p4",
    title: "Structure Reduces Audience Cognitive Load",
    description:
      "People can't follow what they can't organize mentally. Signposting — flagging structure as you speak — dramatically increases comprehension and retention.",
    coach: "Think Fast, Talk Smart",
    category: "Structure",
    actionItems: [
      "Open with a roadmap: 'I'll cover three things: X, Y, and Z.'",
      "Use verbal signposts: 'First... Second... Finally...'",
      "Close with a summary: restate your three key points",
    ],
    quote:
      "\"Tell them what you'll say, say it, tell them what you said.\"",
  },
  {
    id: "p5",
    title: "Listen to Understand, Not to Respond",
    description:
      "The most underrated communication skill is listening. Leaders who listen fully ask better questions, build deeper trust, and make better decisions.",
    coach: "Executive Leadership Coaching",
    category: "Listening",
    actionItems: [
      "Put devices away during important conversations",
      "Paraphrase before responding: 'What I'm hearing is...'",
      "Ask one follow-up question before giving your view",
    ],
    quote:
      "\"We have two ears and one mouth. Use them proportionally.\"",
  },
  {
    id: "p6",
    title: "Stories Are More Persuasive Than Data",
    description:
      "The brain is wired for narrative. Data tells, but stories sell. The most effective communicators pair data with a human story that makes the data meaningful.",
    coach: "Matt Abrahams / Nancy Duarte",
    category: "Storytelling",
    actionItems: [
      "For every data point, find the human story behind it",
      "Build a story library of 5–7 personal experiences covering key leadership themes",
      "Use the ABT structure for every story you tell",
    ],
    quote:
      "\"Facts tell, stories sell. Data informs, narrative transforms.\"",
  },
  {
    id: "p7",
    title: "Presence Is a Skill, Not a Gift",
    description:
      "Executive presence — the ability to command a room — is built through deliberate practice: body language, vocal variety, eye contact, and intentional energy management.",
    coach: "Executive Coaching (Amy Cuddy / Sylvia Ann Hewlett)",
    category: "Presence",
    actionItems: [
      "Adopt expansive posture before high-stakes moments (power pose, 2 min)",
      "Slow down your speech rate by 20% when making key points",
      "Make sustained eye contact (3–5 seconds per person) across the room",
    ],
    quote:
      "\"Presence isn't about being the loudest in the room — it's about being the most grounded.\"",
  },
  {
    id: "p8",
    title: "Ask, Don't Tell — The Coaching Approach",
    description:
      "The best communicators and leaders ask more than they tell. Questions unlock insight, build buy-in, and position you as a thoughtful partner rather than a know-it-all.",
    coach: "Executive Coaching (Michael Bungay Stanier)",
    category: "Influence",
    actionItems: [
      "Replace 'Here's what I think' with 'What do you think?'",
      "Use the AWE question: 'And What Else?' to draw out more",
      "Before giving advice, ask: 'What would be most helpful right now?'",
    ],
    quote:
      "\"Stay curious a little longer. Rush to action a little more slowly.\" — Michael Bungay Stanier",
  },
];

// ─── Quizzes ──────────────────────────────────────────────────────────────────
export const quizzes: Quiz[] = [
  {
    id: "q1",
    question: "In the PREP framework, what does the first 'P' stand for?",
    options: ["Pause", "Point", "Purpose", "Presence"],
    correct: 1,
    explanation:
      "PREP stands for Point, Reason, Example, Point. You lead with your main point immediately, which signals confidence and respects the listener's time.",
    category: "Frameworks",
  },
  {
    id: "q2",
    question:
      "According to Matt Abrahams, what is the best way to handle communication anxiety?",
    options: [
      "Eliminate it through meditation",
      "Ignore it and push through",
      "Reframe it as excitement",
      "Take medication before speaking",
    ],
    correct: 2,
    explanation:
      "Abrahams teaches that anxiety and excitement share the same physiological state. Saying 'I'm excited' instead of 'I'm nervous' reframes the energy positively without suppressing it.",
    category: "Mindset",
  },
  {
    id: "q3",
    question: "What does the 'C' stand for in the SCR framework?",
    options: ["Context", "Complication", "Conclusion", "Competency"],
    correct: 1,
    explanation:
      "SCR = Situation, Complication, Resolution. The Complication is the tension or problem that makes your resolution necessary — it's the most important element to make compelling.",
    category: "Frameworks",
  },
  {
    id: "q4",
    question:
      "In the And-But-Therefore (ABT) framework, what is the most critical element?",
    options: [
      "The 'And' — establishing context",
      "The 'But' — introducing conflict",
      "The 'Therefore' — providing resolution",
      "All three are equally important",
    ],
    correct: 1,
    explanation:
      "The 'But' is the narrative engine. Without compelling conflict, the story lacks tension and the resolution feels unearned. Randy Olson developed ABT from screenwriting principles.",
    category: "Frameworks",
  },
  {
    id: "q5",
    question:
      "When giving difficult feedback, which opening approach is most effective?",
    options: [
      "'You always do this and it's a problem.'",
      "'I wanted to share some feedback — feel free to push back.'",
      "'I've noticed [specific behavior] and it's had [specific impact].'",
      "'Can I give you some advice?'",
    ],
    correct: 2,
    explanation:
      "Specific behavior + specific impact (without judgment) is the gold standard. It removes the emotional charge, grounds the feedback in observable facts, and makes it easier to hear.",
    category: "Difficult Conversations",
  },
  {
    id: "q6",
    question: "What percentage of communication is estimated to be non-verbal?",
    options: ["30%", "55%", "70%", "90%"],
    correct: 1,
    explanation:
      "Research (Mehrabian's study, often cited though contextual) suggests ~55% of communication impact comes from body language, 38% from vocal tone, and only 7% from words. Non-verbal presence matters enormously.",
    category: "Delivery",
  },
  {
    id: "q7",
    question:
      "In the STAR method, how much of your response time should the Action and Result occupy?",
    options: [
      "About 20–30%",
      "About 40–50%",
      "About 60–70%",
      "About 80–90%",
    ],
    correct: 2,
    explanation:
      "The Action and Result are what interviewers actually want to hear. Most candidates spend too long on Situation/Task. Aim for 60–70% of your response time on what you did and what happened.",
    category: "Frameworks",
  },
  {
    id: "q8",
    question:
      "What is the 'AWE question' used in executive coaching conversations?",
    options: [
      "'Are We Even aligned?'",
      "'And What Else?'",
      "'Aren't We Excited?'",
      "'Any Wider Examples?'",
    ],
    correct: 1,
    explanation:
      "Michael Bungay Stanier popularized 'And What Else?' as a simple, powerful coaching question that draws out deeper thinking and signals genuine curiosity without requiring the coach to do all the work.",
    category: "Coaching",
  },
];

// ─── Learning Path (12-Week Executive Roadmap) ─────────────────────────────────
export const learningPath: LearningPathWeek[] = [
  {
    week: 1,
    title: "Communication Foundations",
    theme: "Core Frameworks",
    description: "Master the three foundational frameworks every executive communicator needs: PREP for spontaneous moments, SCR for structured proposals, and STAR for behavioral storytelling.",
    objectives: [
      "Understand and apply the PREP, SCR, and STAR frameworks",
      "Complete at least 3 standard practice scenarios",
      "Identify your current communication baseline",
    ],
    resources: [
      { type: "read", title: "Framework Overview: PREP, SCR, STAR", description: "Study all three core frameworks in the Frameworks section — read the steps, examples, and tips for each.", estimatedMinutes: 20 },
      { type: "practice", title: "60-Second Elevator Pitch", description: "Complete the Elevator Pitch scenario (Beginner). Record yourself and review.", estimatedMinutes: 15 },
      { type: "practice", title: "Leadership Story in Interview", description: "Complete the STAR behavioral story scenario (Intermediate). Focus on spending 60% of time on Action/Result.", estimatedMinutes: 20 },
      { type: "reflect", title: "Communication Baseline Assessment", description: "Answer honestly: What is your #1 communication challenge right now? Write 3 sentences.", estimatedMinutes: 10 },
    ],
    practiceScenarioIds: ["s1", "s4", "s3"],
    frameworkIds: ["prep", "scr", "star"],
    principleIds: ["p4"],
    milestoneCheck: "Can I explain the PREP framework and apply it to an unexpected question without pausing to think about the steps?",
  },
  {
    week: 2,
    title: "Principles & Mindset",
    theme: "Executive Mindset",
    description: "Build the mental foundation for executive communication: managing anxiety, cultivating presence, and developing the listening skills that separate good communicators from great leaders.",
    objectives: [
      "Apply anxiety-reframing techniques before practice sessions",
      "Practice active listening using the LAR framework",
      "Complete the Knowledge Quiz to identify gaps",
    ],
    resources: [
      { type: "read", title: "All 8 Core Principles", description: "Read every principle in the Principles section. Note the 2 that resonate most and write one action item for each.", estimatedMinutes: 25 },
      { type: "practice", title: "Handle a Hostile Question", description: "Complete the Hostile Question scenario. Practice staying calm under pressure.", estimatedMinutes: 15 },
      { type: "practice", title: "Knowledge Quiz", description: "Complete the full quiz. Review every explanation, including the correct answers you got right.", estimatedMinutes: 15 },
      { type: "reflect", title: "Anxiety Inventory", description: "List the 3 communication situations that make you most anxious. These are your priority practice areas.", estimatedMinutes: 10 },
    ],
    practiceScenarioIds: ["s8", "s7", "s5"],
    frameworkIds: ["listen-ask-respond", "woops"],
    principleIds: ["p1", "p5", "p7"],
    milestoneCheck: "Can I name 3 specific actions I take to manage communication anxiety, and have I demonstrated them in a practice scenario?",
  },
  {
    week: 3,
    title: "Leadership Identity",
    theme: "Your Leadership Brand",
    description: "Develop a clear, compelling leadership narrative — who you are, what you stand for, and why you lead the way you do. This is the foundation of every executive interview.",
    objectives: [
      "Draft your leadership philosophy statement (2–3 sentences)",
      "Identify your 5 signature leadership strengths",
      "Practice the SOAR framework for leadership storytelling",
    ],
    resources: [
      { type: "read", title: "SOAR Framework", description: "Study the SOAR framework in detail. It's your primary tool for leadership philosophy questions.", estimatedMinutes: 15 },
      { type: "practice", title: "Describe Your Leadership Philosophy", description: "Complete the executive scenario on Leadership Philosophy (exec-1). Use SOAR.", estimatedMinutes: 20 },
      { type: "reflect", title: "Leadership Values Inventory", description: "List your top 5 leadership values. For each, write a one-sentence description of how it shows up in your work.", estimatedMinutes: 20 },
      { type: "reflect", title: "Draft Your Leadership Statement", description: "Write a 3-sentence leadership statement: what you believe, what you do, and what results it creates.", estimatedMinutes: 20 },
    ],
    practiceScenarioIds: ["exec-1", "s4"],
    frameworkIds: ["soar"],
    principleIds: ["p6", "p7"],
    milestoneCheck: "Can I deliver a clear, authentic 90-second leadership philosophy statement without reading from notes?",
  },
  {
    week: 4,
    title: "Authentic Communication Style",
    theme: "Finding Your Voice",
    description: "Develop your authentic communication style — vocal presence, storytelling instincts, and the ability to connect as well as command. Authenticity is the hallmark of leaders who last.",
    objectives: [
      "Identify 3 communication habits to upgrade",
      "Build your first 2 stories for your Story Bank",
      "Practice the ABT framework for narrative storytelling",
    ],
    resources: [
      { type: "practice", title: "Open a Team Meeting with Energy", description: "Complete the ABT meeting opener scenario. Focus on narrative tension and call-to-action.", estimatedMinutes: 15 },
      { type: "practice", title: "Add Stories to Your Story Bank", description: "Go to the Story Bank and add 2 stories using the STAR template. Focus on your most impactful Leadership and Impact stories first.", estimatedMinutes: 30 },
      { type: "reflect", title: "Vocal Habit Audit", description: "Record a 2-minute voice note of you explaining a recent work project. Play it back. Count filler words. Write 3 improvement actions.", estimatedMinutes: 20 },
      { type: "read", title: "Presence Is a Skill — Principle P7", description: "Re-read Principle P7 on Executive Presence. Identify the one behavior you'll practice this week.", estimatedMinutes: 10 },
    ],
    practiceScenarioIds: ["s7", "s4"],
    frameworkIds: ["and-but-therefore", "soar"],
    principleIds: ["p3", "p7"],
    milestoneCheck: "Do I have at least 2 strong stories in my Story Bank, each with a strength score above 60?",
  },
  {
    week: 5,
    title: "Executive Presence",
    theme: "Commanding the Room",
    description: "Develop the gravitas, communication crispness, and composure under pressure that executive interviewers and boards assess from the first 60 seconds of meeting you.",
    objectives: [
      "Study and practice the Executive Presence Model (EP Model)",
      "Practice recovering from mistakes with composure",
      "Develop your approach to high-stakes delivery",
    ],
    resources: [
      { type: "read", title: "Executive Presence Model Framework", description: "Study the EP Model framework: Gravitas (67%), Communication (28%), Appearance (5%). Assess yourself on each dimension.", estimatedMinutes: 20 },
      { type: "practice", title: "Recover from a Mistake in Presentation", description: "Complete the Presentation Recovery scenario. Practice acknowledging errors without losing composure.", estimatedMinutes: 15 },
      { type: "practice", title: "Handle a Hostile Question", description: "Repeat the Hostile Question scenario with a 3-second pause before responding. Notice the difference.", estimatedMinutes: 15 },
      { type: "reflect", title: "Gravitas Self-Assessment", description: "Rate yourself 1–10 on: composure under pressure, decisiveness, and ability to disagree confidently. Where's your biggest gap?", estimatedMinutes: 15 },
    ],
    practiceScenarioIds: ["s6", "s8", "s2"],
    frameworkIds: ["exec-presence", "woops"],
    principleIds: ["p7", "p3"],
    milestoneCheck: "Can I pause for 3 full seconds before answering a tough question, and does it feel like strength rather than hesitation?",
  },
  {
    week: 6,
    title: "Strategic Communication",
    theme: "Thinking at Board Level",
    description: "Master the communication tools of senior executives: Pyramid Principle for structured thinking, MECE for airtight analysis, and OGSM for strategic clarity.",
    objectives: [
      "Apply Pyramid Principle to a real work proposal",
      "Practice MECE-structured answers to strategy questions",
      "Develop your approach to board-level communication",
    ],
    resources: [
      { type: "read", title: "Pyramid Principle + MECE + OGSM Frameworks", description: "Study all three executive frameworks. These are the tools of board-level communication.", estimatedMinutes: 30 },
      { type: "practice", title: "Strategic Prioritization", description: "Complete the strategic prioritization scenario (exec-12). Use MECE to structure your answer.", estimatedMinutes: 20 },
      { type: "practice", title: "Propose a New Initiative", description: "Re-do the Initiative Proposal scenario (s3) using the Pyramid Principle instead of SCR. Notice the difference.", estimatedMinutes: 20 },
      { type: "reflect", title: "Pyramid Principle Practice", description: "Take a recent email or proposal you wrote. Rewrite the opening paragraph using Pyramid Principle: answer first.", estimatedMinutes: 20 },
    ],
    practiceScenarioIds: ["exec-12", "s3", "exec-7"],
    frameworkIds: ["pyramid", "mece", "ogsm"],
    principleIds: ["p2", "p4"],
    milestoneCheck: "Can I structure any answer to a strategy question using MECE within 30 seconds of hearing it?",
  },
  {
    week: 7,
    title: "Stakeholder & Influence Mastery",
    theme: "Leading Without Authority",
    description: "Master the executive communication skills of cross-functional influence: how to align stakeholders, give peer feedback, and build trust with the C-suite.",
    objectives: [
      "Practice influencing without authority in a scenario",
      "Develop your SBI feedback delivery approach",
      "Build your approach to C-suite trust",
    ],
    resources: [
      { type: "read", title: "SBI Feedback Model", description: "Study the SBI framework. This is the gold standard for executive feedback delivery.", estimatedMinutes: 15 },
      { type: "practice", title: "Influence Without Authority", description: "Complete the scenario on influencing without authority (exec-4). Name your approach explicitly.", estimatedMinutes: 20 },
      { type: "practice", title: "Give Feedback to a Peer Executive", description: "Complete the peer executive feedback scenario (exec-13). Use SBI for the opening.", estimatedMinutes: 20 },
      { type: "reflect", title: "Stakeholder Map", description: "Map your top 5 stakeholders. For each: what do they care about, what do they need from you, and where is there friction?", estimatedMinutes: 20 },
    ],
    practiceScenarioIds: ["exec-4", "exec-13", "s5"],
    frameworkIds: ["sbi", "listen-ask-respond"],
    principleIds: ["p5", "p8"],
    milestoneCheck: "Can I open a difficult feedback conversation using SBI in a way that feels direct but not aggressive?",
  },
  {
    week: 8,
    title: "Scaling Trust & Teams",
    theme: "Leadership at Scale",
    description: "Prepare for the most critical executive interview territory: scaling trust, building organizations, and driving cultural change — competencies only tested at Director/VP level.",
    objectives: [
      "Practice scaling trust scenarios",
      "Develop your org-building philosophy",
      "Build 2 more leadership stories in your Story Bank",
    ],
    resources: [
      { type: "practice", title: "Scaling Trust Across 500 Engineers", description: "Complete the trust-at-scale scenario (exec-2). Focus on specific mechanisms, not general principles.", estimatedMinutes: 20 },
      { type: "practice", title: "Drive Cultural Change at Scale", description: "Complete the cultural change scenario (exec-11). Show you understand culture change as systemic.", estimatedMinutes: 20 },
      { type: "practice", title: "Add 2 Stories to Story Bank", description: "Add 2 more stories: one on Leadership and one on Collaboration. Aim for strength scores above 70.", estimatedMinutes: 30 },
      { type: "reflect", title: "Org-Building Philosophy", description: "Write 5 sentences describing how you build teams: what you look for, what you do first, and how you know it's working.", estimatedMinutes: 15 },
    ],
    practiceScenarioIds: ["exec-2", "exec-11", "exec-6"],
    frameworkIds: ["scr", "exec-presence"],
    principleIds: ["p8", "p5"],
    milestoneCheck: "Can I describe 3 specific mechanisms I use to build trust at scale — not values or beliefs, but specific actions or systems?",
  },
  {
    week: 9,
    title: "FAANG Interview Mechanics",
    theme: "Interview Mastery",
    description: "Understand how FAANG interviews work, what bar raisers look for, and how to prepare systematically. Build your story bank for Amazon's 16 Leadership Principles.",
    objectives: [
      "Study the FAANG Interview Prep hub",
      "Complete 3 company-specific executive scenarios",
      "Add Amazon LP stories to your Story Bank",
    ],
    resources: [
      { type: "read", title: "FAANG Interview Prep Hub — Company Intel", description: "Go to Interview Prep and read the Company Intel for Google and Amazon. Study their values and interview style thoroughly.", estimatedMinutes: 30 },
      { type: "practice", title: "Amazon LP Scenarios", description: "Complete exec-3 (Ambiguity), exec-5 (Business Impact), and exec-8 (Failure). These are the hardest Amazon LP questions.", estimatedMinutes: 45 },
      { type: "practice", title: "Google Scenarios", description: "Complete exec-9 (Googleyness) and exec-12 (Strategic Prioritization). Google values MECE and authenticity.", estimatedMinutes: 30 },
      { type: "reflect", title: "Story Bank: Amazon LPs", description: "For each of Amazon's 16 LPs, write the ID of a story in your bank that addresses it. Identify the 3 LPs with no story — add those this week.", estimatedMinutes: 30 },
    ],
    practiceScenarioIds: ["exec-3", "exec-5", "exec-8", "exec-9"],
    frameworkIds: ["star", "xyz-method"],
    principleIds: ["p1", "p6"],
    milestoneCheck: "Do I have at least 5 stories in my Story Bank, covering Impact, Leadership, Failure, Innovation, and Collaboration categories?",
  },
  {
    week: 10,
    title: "Company-Specific Deep Dives",
    theme: "Tailored Preparation",
    description: "Deep-dive into the specific companies you're targeting. Understand their culture, values, interview format, and what they're uniquely looking for at the Director/VP level.",
    objectives: [
      "Complete all scenarios for your target company",
      "Study Company Intel for Microsoft and Meta",
      "Map your strongest stories to company values",
    ],
    resources: [
      { type: "read", title: "Microsoft + Meta Company Intel", description: "Read the Company Intel for Microsoft (Growth Mindset) and Meta (Move Fast, Impact Focus). Note the green flags and red flags.", estimatedMinutes: 25 },
      { type: "practice", title: "Microsoft: Cultural Change", description: "Complete exec-11 (Cultural Change at Scale) with Microsoft as the context. Show Growth Mindset alignment.", estimatedMinutes: 20 },
      { type: "practice", title: "Meta: Year One Vision", description: "Complete exec-14 (Year One Vision) with Meta as the context. Demonstrate urgency and impact.", estimatedMinutes: 20 },
      { type: "reflect", title: "Story-to-Company Mapping", description: "Go to Interview Prep → Story Mapping tab. Map each of your stories to the companies where they're most relevant. Find and fill any gaps.", estimatedMinutes: 20 },
    ],
    practiceScenarioIds: ["exec-11", "exec-14", "exec-10"],
    frameworkIds: ["scr", "pyramid"],
    principleIds: ["p6", "p2"],
    milestoneCheck: "For my primary target company, can I name their top 3 values and give a story from my bank that maps to each one?",
  },
  {
    week: 11,
    title: "Mock Interview Simulations",
    theme: "Full Practice Mode",
    description: "Run full simulated interviews: 5-question sets, timed, in sequence. This is the week to identify final gaps and build your most important story. No more studying — only doing.",
    objectives: [
      "Complete 3 full 5-question mock interview sets",
      "Time yourself to match real interview pacing",
      "Identify and close your top 3 remaining gaps",
    ],
    resources: [
      { type: "practice", title: "Mock Interview Set 1: Amazon", description: "Complete exec-3, exec-5, exec-8, exec-15, exec-4 in sequence. Time yourself at 2.5 minutes per answer.", estimatedMinutes: 60 },
      { type: "practice", title: "Mock Interview Set 2: Google", description: "Complete exec-9, exec-12, exec-1, exec-7, s8 in sequence. Focus on MECE structure and authenticity.", estimatedMinutes: 60 },
      { type: "practice", title: "Weak Spot Intensive", description: "Identify your 2 weakest scenarios from weeks 1–10. Do each 3 times. Do not move on until you're satisfied.", estimatedMinutes: 45 },
      { type: "reflect", title: "Gap Analysis", description: "List the 3 questions that still make you uncomfortable. Write out what a perfect answer looks like. Identify the story you need to strengthen.", estimatedMinutes: 20 },
    ],
    practiceScenarioIds: ["exec-3", "exec-5", "exec-8", "exec-9", "exec-12"],
    frameworkIds: ["star", "prep", "mece"],
    principleIds: ["p1", "p3"],
    milestoneCheck: "Can I complete a 5-question mock interview set without any answer feeling weak or unprepared?",
  },
  {
    week: 12,
    title: "Readiness & Final Polish",
    theme: "Interview Ready",
    description: "You're ready. This week is about confidence, calibration, and final refinement. Focus on your best stories, tighten your answers, and walk in knowing you've prepared more than anyone else in the room.",
    objectives: [
      "Achieve a FAANG Readiness Score above 80",
      "Do a final review of your Story Bank",
      "Complete the knowledge quiz with a score of 7+",
    ],
    resources: [
      { type: "practice", title: "Final Story Bank Review", description: "Review every story in your bank. Tighten each one: remove filler sentences, sharpen the result, confirm the impact number.", estimatedMinutes: 30 },
      { type: "practice", title: "Final Scenario Run", description: "Complete any 5 scenarios you haven't done recently. Focus on delivery quality, not just content.", estimatedMinutes: 45 },
      { type: "practice", title: "Retake the Quiz", description: "Retake the knowledge quiz. Target 8/8. Review any missed explanations.", estimatedMinutes: 15 },
      { type: "reflect", title: "Confidence Inventory", description: "Write the answer to: 'Why am I the right person for this role?' in 5 sentences. This is your internal anchor for interview day.", estimatedMinutes: 15 },
    ],
    practiceScenarioIds: ["exec-1", "exec-15", "exec-7"],
    frameworkIds: ["soar", "xyz-method"],
    principleIds: ["p1", "p7"],
    milestoneCheck: "Is my FAANG Readiness Score above 80? If not, what's the one thing I can do today to move it up?",
  },
];

// ─── Company Profiles ─────────────────────────────────────────────────────────
export const companyProfiles: CompanyProfile[] = [
  {
    id: "general",
    name: "General / Universal",
    initial: "All",
    color: "#818cf8",
    tagline: "Universal executive communication skills for any company.",
    interviewStyle: "General executive interviews focus on leadership behaviors, strategic thinking, communication clarity, and cultural alignment. Competency-based behavioral questions (STAR format) are the norm. Senior panels often include HR, business leaders, and future peers.",
    hiringBarNotes: "At any company, Director/VP candidates are assessed on: executive presence, quality of thinking, leadership track record, and cultural fit. The bar is always higher than you expect.",
    values: [
      { name: "Leadership Impact", description: "Demonstrable influence on people, culture, and business outcomes at scale.", exampleQuestion: "Tell me about the most significant impact you've had as a leader." },
      { name: "Strategic Clarity", description: "Ability to think long-term, prioritize ruthlessly, and communicate strategy simply.", exampleQuestion: "How do you set priorities when there are more opportunities than resources?" },
      { name: "Communication Excellence", description: "Clear, concise, compelling communication adapted to any audience.", exampleQuestion: "How do you communicate a difficult message to a skeptical audience?" },
    ],
    redFlags: [
      "Vague answers with no specific examples",
      "Inability to quantify impact",
      "No evidence of operating at the requested scope",
      "Over-reliance on 'we' — no personal accountability",
    ],
    greenFlags: [
      "Crisp, structured answers delivered with confidence",
      "Quantified results in every story",
      "Demonstrates self-awareness and learning from failure",
      "Asks insightful questions that show company research",
    ],
  },
  {
    id: "google",
    name: "Google",
    initial: "G",
    color: "#4285F4",
    tagline: "Do the right thing. Think big. Be Googley.",
    interviewStyle: "Google uses a structured, rubric-driven interview process. Typically 4–6 rounds including a 'Googleyness' interview, a leadership interview, and role-specific rounds. Bar raisers attend every loop. Expect follow-up questions that probe depth. MECE thinking and comfort with ambiguity are tested heavily.",
    hiringBarNotes: "Google's bar is exceptionally high. 'Good enough' never passes. They look for candidates who can operate at the next level, not just the current one. Intellectual humility, data-driven thinking, and collaborative problem-solving are non-negotiable at Director+.",
    values: [
      { name: "Googleyness", description: "Intellectual humility, comfort with ambiguity, a collaborative nature, and a passion for building for everyone.", exampleQuestion: "What does Googleyness mean to you and how does it show up in your work?" },
      { name: "Leadership", description: "Setting vision, developing talent, making sound decisions under uncertainty, and building high-performance teams.", exampleQuestion: "Tell me about a time you led a team through a significant organizational change." },
      { name: "Role-Related Knowledge", description: "Deep expertise in your domain combined with the ability to learn quickly in adjacent areas.", exampleQuestion: "What is the most complex technical or domain challenge you've navigated as a leader?" },
      { name: "Cognitive Ability", description: "Structured, analytical thinking — the ability to break down complex problems and communicate the solution clearly.", exampleQuestion: "How would you approach designing a measurement framework for a new product launch?" },
    ],
    redFlags: [
      "Ego and inability to admit mistakes — Google values humility above almost everything",
      "Answers that lack structure — Google interviewers are trained on MECE and notice when it's absent",
      "Not having done company research — Google expects candidates to know their products and business",
      "Discomfort with ambiguity — this surfaces in every answer",
    ],
    greenFlags: [
      "MECE-structured answers to ambiguous questions",
      "Genuine intellectual curiosity and excitement about hard problems",
      "Strong examples of cross-functional collaboration at scale",
      "Self-aware failure stories that demonstrate growth and learning",
    ],
  },
  {
    id: "amazon",
    name: "Amazon",
    initial: "A",
    color: "#FF9900",
    tagline: "Customer obsession. Long-term thinking. Deliver results.",
    interviewStyle: "Amazon's interview process is explicitly structured around their 16 Leadership Principles. Every behavioral question maps to one or more LPs. Bar Raisers attend every loop and can veto any hire. Candidates should prepare one strong STAR story for each LP. The process typically involves 5–7 rounds including a written component for senior roles.",
    hiringBarNotes: "Amazon raises the bar with every hire — they expect every new employee to be better than the median of current employees at that level. Day 1 thinking, ownership mentality, and customer obsession are non-negotiable. At VP+, expect deep dives on P&L ownership and business outcomes.",
    values: [
      { name: "Customer Obsession", description: "Leaders start with the customer and work backwards. They work vigorously to earn and keep customer trust.", exampleQuestion: "Tell me about a time you made a decision that prioritized customer needs over short-term business metrics." },
      { name: "Ownership", description: "Leaders act on behalf of the entire company, beyond just their own team. They never say 'that's not my job.'", exampleQuestion: "Tell me about a time you stepped outside your defined role to solve a problem that affected the broader business." },
      { name: "Invent and Simplify", description: "Leaders expect and require innovation and invention from their teams and always find ways to simplify.", exampleQuestion: "Tell me about a significant process, product, or system you simplified. What was the impact?" },
      { name: "Are Right, A Lot", description: "Leaders have strong judgment and good instincts. They seek diverse perspectives and work to disconfirm their own beliefs.", exampleQuestion: "Tell me about a time you made an important decision with incomplete information. How did you decide and what happened?" },
      { name: "Learn and Be Curious", description: "Leaders are never done learning and always seek to improve themselves. They are curious about new possibilities.", exampleQuestion: "Tell me about a time you went outside your area of expertise to solve a problem. What did you learn?" },
      { name: "Hire and Develop the Best", description: "Leaders raise the performance bar with every hire and promotion. They recognize exceptional talent and move it throughout the organization.", exampleQuestion: "Tell me about a hire you made that raised the bar significantly. How did you identify and recruit this person?" },
      { name: "Insist on the Highest Standards", description: "Leaders have relentlessly high standards — many people may think these standards are unreasonably high.", exampleQuestion: "Tell me about a time you refused to compromise on quality or standards despite pressure to do so." },
      { name: "Think Big", description: "Leaders create and communicate a bold direction that inspires results. They think differently and look around corners.", exampleQuestion: "Tell me about a time you proposed an idea that was much larger in scope than what others were thinking. How did you build support?" },
      { name: "Bias for Action", description: "Speed matters in business. Many decisions and actions are reversible and do not need extensive study.", exampleQuestion: "Tell me about a time you moved forward with a project despite significant uncertainty. What was the outcome?" },
      { name: "Frugality", description: "Accomplish more with less. Constraints breed resourcefulness, self-sufficiency, and invention.", exampleQuestion: "Tell me about a time you achieved significant results without significant budget or resources." },
      { name: "Earn Trust", description: "Leaders listen attentively, speak candidly, and treat others respectfully. They are vocally self-critical, even when it is painful to do so.", exampleQuestion: "Tell me about a time you had to tell a senior leader something they didn't want to hear. How did you do it?" },
      { name: "Dive Deep", description: "Leaders operate at all levels, stay connected to the details, audit frequently, and are skeptical when metrics and anecdotes differ.", exampleQuestion: "Tell me about a time you discovered a problem that wasn't visible in the metrics. How did you find it and what did you do?" },
      { name: "Have Backbone; Disagree and Commit", description: "Leaders are obligated to respectfully challenge decisions when they disagree, even when doing so is uncomfortable.", exampleQuestion: "Tell me about a time you strongly disagreed with a decision made by your leader. How did you handle it?" },
      { name: "Deliver Results", description: "Leaders focus on key inputs and deliver with the right quality and in a timely fashion. Despite setbacks, they rise to the occasion.", exampleQuestion: "Tell me about a time you were asked to deliver something significant and had to overcome major obstacles to do it." },
      { name: "Strive to be Earth's Best Employer", description: "Leaders work every day to create a safer, more productive, higher performing, more diverse, and more just work environment.", exampleQuestion: "Tell me about a specific initiative you led to improve your team's environment, inclusion, or wellbeing." },
      { name: "Success and Scale Bring Broad Responsibility", description: "Amazon's decisions and actions can have a far-reaching impact. Leaders create more than they take.", exampleQuestion: "Tell me about a decision you made that considered the broader community or societal impact, not just the business impact." },
    ],
    redFlags: [
      "Answers that start with 'we' without clarifying your specific role",
      "No data or metrics in results — Amazon expects quantification",
      "Avoiding the 'Failure' and 'Disagree and Commit' questions",
      "Not knowing all 16 Leadership Principles by name",
    ],
    greenFlags: [
      "Every STAR story ends with a quantified business result",
      "Genuine failure stories that demonstrate real learning and change",
      "Stories that show operating at or above the target level",
      "Clear customer-first reasoning in strategic decisions",
    ],
  },
  {
    id: "microsoft",
    name: "Microsoft",
    initial: "M",
    color: "#00A4EF",
    tagline: "Growth Mindset. Empower every person and organization on the planet.",
    interviewStyle: "Microsoft's interview culture shifted dramatically under Satya Nadella — from 'know-it-all' to 'learn-it-all.' Behavioral interviews are competency-based with a strong focus on Growth Mindset, collaboration, and cultural contribution. Expect 4–5 rounds with a senior leader and HR. Less structured than Google; more conversational than Amazon.",
    hiringBarNotes: "Microsoft specifically assesses Cultural Contribution — not just cultural fit. They want people who add something new to the culture, not people who already think exactly like everyone else. At Director+, expect questions about how you've evolved as a leader.",
    values: [
      { name: "Growth Mindset", description: "Belief that abilities and intelligence can be developed through hard work, good strategies, and input from others.", exampleQuestion: "Tell me about a time you changed your mind significantly on an important topic. What caused the change?" },
      { name: "Collaboration", description: "Ability to work across teams, drive alignment, and elevate the work of others — not just your own team.", exampleQuestion: "Describe a complex cross-functional initiative you drove. What were the biggest alignment challenges?" },
      { name: "Customer Focus", description: "Deep empathy for customers and users; decisions driven by customer needs and outcomes.", exampleQuestion: "Tell me about a time customer feedback changed the direction of a product or initiative you owned." },
      { name: "Diversity & Inclusion", description: "Actively creating inclusive environments and diverse teams — not just supporting D&I as a value.", exampleQuestion: "How have you actively built a more inclusive team or work environment? What was measurably different?" },
    ],
    redFlags: [
      "Arrogance or inability to acknowledge growth areas — antithetical to Growth Mindset",
      "Answers that show political maneuvering over genuine collaboration",
      "No evidence of learning from failure or changing your approach",
      "Treating D&I as a compliance topic rather than a leadership priority",
    ],
    greenFlags: [
      "Stories of genuine intellectual evolution — changing your mind based on new evidence",
      "Examples of empowering and developing others, not just driving your own results",
      "Deep customer empathy that shows up in strategic decisions",
      "Collaborative style that creates followership across functions",
    ],
  },
  {
    id: "meta",
    name: "Meta",
    initial: "Me",
    color: "#0082FB",
    tagline: "Move fast. Build awesome things. Focus on impact.",
    interviewStyle: "Meta interviews are focused on impact, speed, and scale. Executive candidates are assessed on: their ability to make decisions quickly with imperfect information, their ownership of outcomes (not activities), and their ability to build and inspire high-performing teams. Expect behavioral questions focused on impact and ambiguity, plus a deep dive on your leadership approach.",
    hiringBarNotes: "Meta values builders who move fast and own their outcomes. Leaders who are cautious, consensus-driven, or unable to operate in ambiguity struggle in the interview process. At VP level, expect deep probing on business impact, org design, and your approach to speed vs. quality tradeoffs.",
    values: [
      { name: "Move Fast", description: "Make decisions quickly, ship early, iterate based on data — bias heavily toward action.", exampleQuestion: "Tell me about a time you shipped something before it was perfect. What was the outcome?" },
      { name: "Focus on Long-Term Impact", description: "Optimize for outcomes and business impact, not activities or effort.", exampleQuestion: "How do you measure the impact of your work as a leader? What metrics matter most to you?" },
      { name: "Be Bold", description: "Take calculated risks, challenge conventional thinking, and pursue ambitious goals.", exampleQuestion: "Tell me about a decision you made that others thought was too risky. What happened?" },
      { name: "Build Awesome Things", description: "Relentless focus on craft, quality, and building products people love.", exampleQuestion: "What product or initiative are you most proud of and why? What made it excellent?" },
    ],
    redFlags: [
      "Over-engineering decisions — long deliberation without action",
      "Optimizing for activities and effort rather than business outcomes",
      "Risk-aversion that slows execution without commensurate benefit",
      "Inability to show quantified business impact in stories",
    ],
    greenFlags: [
      "Stories of driving significant impact with urgency and ownership",
      "Clear evidence of operating at scale with speed",
      "Honest engagement with what you'd do differently — Meta values learning from failure",
      "Ambitious thinking about what the role could accomplish",
    ],
  },
  {
    id: "apple",
    name: "Apple",
    initial: "Ap",
    color: "#888888",
    tagline: "Craftsmanship. Simplicity. Think different.",
    interviewStyle: "Apple's interview process is notoriously secretive and thorough. Expect 5–8 rounds across multiple teams, with a strong emphasis on: ownership, craftsmanship, and the ability to operate with a small ego. Apple values leaders who can make their team's work better without needing the spotlight. Interviews are highly contextual to the specific role.",
    hiringBarNotes: "Apple values deep ownership and relentless craftsmanship over star power or ego. Leaders who succeed at Apple can zoom in on details AND zoom out on strategy — often in the same conversation. At Director+, expect questions about how you've built a culture of excellence and simplicity.",
    values: [
      { name: "Craftsmanship", description: "Relentless pursuit of quality and excellence in everything — from products to presentations to decisions.", exampleQuestion: "Tell me about a time you demanded a higher standard of quality than what others thought was necessary. What drove that?" },
      { name: "Simplicity", description: "Eliminating complexity — in products, in decisions, and in communication. Simple is harder than complex.", exampleQuestion: "Tell me about a complex situation you simplified significantly. What did you remove and why?" },
      { name: "Ownership", description: "Deep, personal accountability for outcomes. 'Not my job' doesn't exist at Apple.", exampleQuestion: "Tell me about a time you took responsibility for something that went wrong outside your direct control." },
      { name: "Collaboration Without Ego", description: "Making great work happen through others without needing the spotlight or credit.", exampleQuestion: "Tell me about a significant win for which you deliberately shared credit with others. Why did you do that?" },
    ],
    redFlags: [
      "Ego and self-promotion — Apple is deeply allergic to leaders who make it about themselves",
      "Vague answers that lack craftsmanship or detail",
      "Complexity tolerance — if you can't simplify your own answer, you can't simplify product decisions",
      "Not knowing Apple's products deeply — this signals misalignment",
    ],
    greenFlags: [
      "Deeply specific answers that show obsession with quality and detail",
      "Ownership stories where you went beyond your defined role",
      "Simplification examples — where you made something significantly easier",
      "Genuine humility and curiosity about how to make things better",
    ],
  },
];

// ─── Role Level Profiles ──────────────────────────────────────────────────────
export const roleLevelProfiles: RoleLevelProfile[] = [
  {
    level: "director",
    title: "Director",
    scopeDescription: "Manages a team of managers (or large individual contributor team). Owns a specific product area, function, or geographic scope. P&L awareness but typically not full ownership. Org size: 20–100 people.",
    coreCompetencies: [
      "Building and developing a team of senior managers or leads",
      "Translating strategy to execution across multiple teams",
      "Managing stakeholders within and adjacent to your org",
      "Setting the cultural and operational norms for your team",
      "Data-driven decision making with clear accountability for outcomes",
      "Influencing cross-functionally without direct authority",
    ],
    signatureBehaviors: [
      "Makes decisions confidently with incomplete information",
      "Develops their managers — not just their direct reports",
      "Is known for delivering reliable, high-quality results",
      "Gives direct, specific, actionable feedback to all levels",
      "Communicates up crisply and proactively — no surprises",
    ],
    commonGaps: [
      "Still too involved in individual contributor work — not operating at team level",
      "Avoids conflict and difficult conversations with peers",
      "Communicates ambiguously — too much hedge, not enough clarity",
      "Does not think about the business impact of people decisions",
      "Under-develops their management team — bottleneck by default",
    ],
    typicalQuestions: [
      "Tell me about a time you had to restructure a team. How did you do it and what was the outcome?",
      "How do you develop managers who are high performers individually but weak at developing others?",
      "Tell me about a time you had to influence a decision made at a level above you.",
      "How do you balance delivering results in the short term while building for the long term?",
      "Tell me about a time you had to give difficult feedback to a high performer. What happened?",
    ],
  },
  {
    level: "vp",
    title: "Vice President",
    scopeDescription: "Owns a significant business function, product line, or geographic market. Full P&L ownership in many cases. Sets 2–3 year strategy. Represents function at executive staff. Org size: 100–500+ people.",
    coreCompetencies: [
      "Setting multi-year strategy and gaining organizational alignment",
      "Full P&L ownership and board-level financial communication",
      "Building a culture of high performance and inclusion at scale",
      "Driving cross-company influence on major strategic decisions",
      "CEO and board-level communication and trust-building",
      "Identifying, developing, and retaining executive-level talent",
    ],
    signatureBehaviors: [
      "Communicates vision compellingly to all levels of the organization",
      "Makes hard calls — including people decisions — with speed and fairness",
      "Builds trust with board, CEO, and peers through transparency and delivery",
      "Sets a cultural example that cascades through 500+ people",
      "Represents the company externally with credibility and authority",
    ],
    commonGaps: [
      "Focuses on operational execution rather than strategic positioning",
      "Does not yet think or communicate at the enterprise level",
      "Avoids saying 'I don't know' — lacks the confidence of intellectual humility",
      "Underprepares for board or CEO-level communication",
      "Does not understand P&L well enough to own it credibly",
    ],
    typicalQuestions: [
      "Describe the largest P&L you've owned and the biggest lever you managed.",
      "Tell me how you've built a culture that persists beyond you.",
      "How do you manage the tension between short-term results and long-term investment?",
      "Tell me about a time you had to reallocate significant resources. How did you build alignment?",
      "How do you know when to escalate and when to make the call yourself?",
    ],
  },
];
