import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { anthropic } from "@/lib/anthropic";
import { ValidationError, validateBody } from "@/lib/validate";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let validated: Record<string, unknown>;
  try {
    validated = validateBody(rawBody, {
      moduleId:     { type: "string", minLength: 1, maxLength: 100 },
      exerciseType: { type: "string", minLength: 1, maxLength: 50 },
      userContext:  { type: "string", maxLength: 2000, optional: true },
      userResponse: { type: "string", maxLength: 10000, optional: true },
    });
  } catch (e) {
    if (e instanceof ValidationError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    throw e;
  }

  const { moduleId, exerciseType, userContext, userResponse } = validated as {
    moduleId: string;
    exerciseType: string;
    userContext?: string;
    userResponse?: string;
  };

  const validExerciseTypes = ["generate_prompt", "evaluate_response"];
  if (!validExerciseTypes.includes(exerciseType)) {
    return NextResponse.json({ error: "Invalid exerciseType" }, { status: 400 });
  }

  if (exerciseType === "generate_prompt") {
    const contextHint = userContext
      ? `\nUser context: ${userContext}`
      : "";

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 512,
      system:
        "You are an executive communication coach specializing in storytelling. Generate a single, specific practice prompt for the given storytelling module. The prompt should be challenging but achievable, relevant to FAANG Director/VP roles. Return only the prompt text, no extra commentary.",
      messages: [
        {
          role: "user",
          content: `Module: ${moduleId}${contextHint}\n\nGenerate one practice prompt.`,
        },
      ],
    });

    const prompt =
      message.content[0].type === "text" ? message.content[0].text.trim() : "";
    return NextResponse.json({ prompt });
  }

  // evaluate_response
  if (!userResponse || userResponse.trim().length < 10) {
    return NextResponse.json({ error: "userResponse is required for evaluation" }, { status: 400 });
  }

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system:
      "You are an executive communication coach. Evaluate the storytelling response and provide concise, actionable feedback. Return ONLY valid JSON: { \"feedback\": \"2-3 sentence coaching feedback\", \"exampleAnswer\": \"one sentence showing an improved version of the opening\" }",
    messages: [
      {
        role: "user",
        content: `Module: ${moduleId}\n\nResponse:\n${userResponse}`,
      },
    ],
  });

  const raw =
    message.content[0].type === "text" ? message.content[0].text.trim() : "{}";
  let result: { feedback?: string; exampleAnswer?: string };
  try {
    result = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Could not parse AI response", raw }, { status: 422 });
  }

  return NextResponse.json(result);
}
