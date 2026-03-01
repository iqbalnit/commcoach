export type PrepPackCompanyKey = "google" | "amazon" | "microsoft" | "meta" | "apple";

export interface PrepPackExtension {
  prepQuestions: string[];
  insiderTips: string[];
  cultureNotes: string;
  linkedFrameworkIds: string[];
}

export const prepPackExtensions: Record<PrepPackCompanyKey, PrepPackExtension> = {
  google: {
    prepQuestions: [
      "Tell me about a time you had to make a decision with incomplete data.",
      "How do you approach a problem you've never seen before?",
      "Tell me about a time you disagreed with your manager and how you handled it.",
      "Describe a time you influenced a team without direct authority.",
      "Tell me about your biggest failure as a leader and what you learned.",
      "How do you prioritize when you have more ideas than time?",
      "Tell me about a cross-functional project you drove that faced organizational resistance.",
      "How do you build trust with engineers who are more technical than you?",
      "Give an example of when you made a tradeoff between speed and quality.",
      "Tell me about a time you had to advocate for your team to senior leadership.",
    ],
    insiderTips: [
      "Google uses a structured scorecard — every answer is rated on a 1–4 scale by each interviewer. Structure your answers for scorability.",
      "The 'Googleyness' dimension is often the most predictive. Prepare a story about intellectual humility and one about working on something with no clear answer.",
      "Bar Raisers look specifically for signals you can operate at the next level, not just your current level.",
      "Google interviewers compare notes after each round — consistency of your stories across rounds matters significantly.",
      "Use MECE thinking explicitly. Google rewards structured, non-overlapping analysis with no gaps.",
      "Data and metrics are table stakes. Every result must include a specific number, percentage, or measurable outcome.",
    ],
    cultureNotes:
      "Google rewards intellectual curiosity and collaborative problem-solving over individual heroism. Leaders who succeed long-term are comfortable being the least informed person in the room and asking great questions. The culture rewards people who make others better, not just themselves. 'Googleyness' — a combination of humility, ambition, and enjoyment of the work — is a genuine differentiator in hiring decisions.",
    linkedFrameworkIds: ["mece", "pyramid", "star"],
  },

  amazon: {
    prepQuestions: [
      "Tell me about a time you made a decision that prioritized customer needs over short-term metrics.",
      "Give an example of when you owned a problem that wasn't technically your responsibility.",
      "Tell me about a significant process you simplified. What was the business impact?",
      "Describe a time you made an important decision with incomplete information.",
      "Tell me about a time you strongly disagreed with a direction and had to commit anyway.",
      "How have you raised the bar in hiring or developing your team?",
      "Tell me about a time you delivered results despite having fewer resources than needed.",
      "Describe a time customer feedback significantly changed your direction.",
      "Tell me about a time you dove deep into data and found something the metrics weren't showing.",
      "Give an example of thinking big — a time you proposed something much larger than what others expected.",
    ],
    insiderTips: [
      "Prepare exactly one strong STAR story per Leadership Principle. Interviewers explicitly map each question to an LP on their scorecards.",
      "The 'failure' question is not a trap — Amazon wants genuine self-awareness and course correction. Generic answers score poorly.",
      "Bar Raisers are experienced and will probe your Situation and Results aggressively for specifics. Have your numbers memorized.",
      "Amazon cares deeply about the 'Action' section — they want to hear what YOU specifically did, not the team. Use 'I' not 'we'.",
      "At VP level, be prepared to walk through a full P&L or business case in a 'deep dive' format.",
      "Amazon's 'Day 1' philosophy means they distrust complacency. Show evidence of continuous reinvention in your stories.",
    ],
    cultureNotes:
      "Amazon is the most Leadership Principle-driven culture in tech. Every promotion, review, and interview is structured around the 16 LPs. The best preparation is to genuinely assess your past decisions through their lens — not to memorize answers, but to authentically identify which principles you've embodied. The 'Dive Deep' and 'Earn Trust' principles are the most commonly underestimated by candidates.",
    linkedFrameworkIds: ["star", "prep"],
  },

  microsoft: {
    prepQuestions: [
      "Tell me about a time you significantly changed your mind on an important topic.",
      "Describe a complex cross-functional initiative you drove from ambiguity to completion.",
      "How have you actively built a more inclusive team environment?",
      "Tell me about a time customer feedback changed the direction of a product you owned.",
      "How do you develop managers who are technically strong but people-weak?",
      "Tell me about a time you had to drive alignment across teams with conflicting priorities.",
      "Describe your approach to building a culture of psychological safety.",
      "Tell me about a time you empowered your team to lead something you could have led yourself.",
      "How do you ensure your team maintains a growth mindset during sustained difficulty?",
      "Tell me about an experience where you learned something that fundamentally changed how you lead.",
    ],
    insiderTips: [
      "Microsoft specifically screens for Growth Mindset — prepare stories where you visibly changed your approach based on new information.",
      "The 'Cultural Contribution' question is often asked directly: what will you add to Microsoft's culture that isn't already there?",
      "Microsoft interviews are more conversational than Google or Amazon. Two-way dialogue is expected and genuinely valued.",
      "Satya Nadella's 'Hit Refresh' is required reading for senior roles — expect questions about organizational transformation.",
      "At Director+, expect a deep discussion about how you develop your managers, not just your individual contributors.",
    ],
    cultureNotes:
      "Microsoft under Satya Nadella is a genuinely different company than the pre-2014 version. The shift from 'know-it-all' to 'learn-it-all' is real and embedded in how people are promoted and evaluated. Leaders who succeed long-term make others better, create safety for their teams to fail, and visibly model learning. The 'empathy' dimension is weighed far more heavily than at other FAANG companies.",
    linkedFrameworkIds: ["star", "scr"],
  },

  meta: {
    prepQuestions: [
      "Tell me about a time you shipped something before it was perfect. What was the outcome?",
      "How do you measure the impact of your work as a leader?",
      "Tell me about a decision you made that others thought was too risky. What happened?",
      "Describe a time you drove an initiative at scale with high ambiguity.",
      "Tell me about your most significant business impact as a leader — what changed because of you?",
      "How do you balance speed and quality when the stakes are high?",
      "Tell me about a time you had to make a tough people decision quickly.",
      "Describe an initiative you led where you had to rapidly reprioritize mid-execution.",
      "Tell me about a time you created clarity for your team when leadership's direction was ambiguous.",
      "What would you do in your first 90 days in this role?",
    ],
    insiderTips: [
      "Meta is obsessed with impact — every answer should explicitly name the business outcome. 'It went well' is not an acceptable result.",
      "The 'Move Fast' value is real. In interviews, meta-signals about your speed-vs-deliberation ratio are evaluated closely.",
      "Prepare a crisp 30-60-90 day plan for the specific role — this is almost always asked at senior levels at Meta.",
      "Meta values leaders who own outcomes, not activities. Use outcome-first framing in every STAR answer.",
      "Be prepared for a 'counter' round where interviewers challenge your decisions to test your conviction vs. flexibility ratio.",
    ],
    cultureNotes:
      "Meta is a high-intensity, outcome-obsessed culture that rewards people who move fast and take ownership. The culture has matured since the early 'move fast and break things' era, but the bias for action and speed remains defining. Leaders who succeed at Meta are comfortable with ambiguity, unafraid of imperfect launches, and relentless about impact measurement. The 30-60-90 day plan question is nearly universal at senior levels.",
    linkedFrameworkIds: ["star", "prep", "pyramid"],
  },

  apple: {
    prepQuestions: [
      "Tell me about a time you demanded a higher standard of quality than others thought was necessary.",
      "Describe a complex situation you simplified significantly. What did you remove?",
      "Tell me about a time you took responsibility for something that went wrong outside your direct control.",
      "How do you build a culture of craftsmanship in your team?",
      "Tell me about a significant win where you deliberately shared credit with others.",
      "Describe your approach to product or process decisions when data and instinct conflict.",
      "Tell me about a time you pushed back on an approach because it was too complex.",
      "How do you maintain attention to detail at scale as your organization grows?",
      "Tell me about an initiative you killed that others were excited about. Why?",
      "How do you ensure your team's work reflects the highest quality standards?",
    ],
    insiderTips: [
      "Apple interview processes are long and slow — 5 to 8 rounds is common. Patience and consistent energy across all rounds signals the right work ethic.",
      "Apple is allergic to self-promotion. The more you make your answer about the team and the outcome, the better you will land.",
      "Know Apple's products deeply. At senior levels, not knowing recent launches or the product roadmap signals poor cultural fit.",
      "Simplicity is a leadership value, not just a design value. Demonstrate it in how you answer questions — concise, clear, no jargon.",
      "Apple's culture is more secretive and compartmentalized than other FAANG companies. Demonstrate comfort operating with limited information sharing.",
    ],
    cultureNotes:
      "Apple's culture is built around craftsmanship, ownership, and collaboration without ego. Leaders at Apple succeed by making their team's work better, not by being visibly brilliant themselves. The culture demands deep domain knowledge, relentless quality standards, and the ability to make complex things simple — in products, in decisions, and in communication. Candidates who come in with strong opinions delivered humbly consistently outperform those who are either tentative or arrogant.",
    linkedFrameworkIds: ["star", "listen-ask-respond"],
  },
};
