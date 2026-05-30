import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages, problem, code, language } = await req.json();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY not set" }, { status: 500 });
  }

  const systemPrompt = `You are an expert DSA (Data Structures & Algorithms) mentor on ThinkEra, an AI-powered coding prep platform for BCA, BTech, and MCA students targeting campus placements.

You are currently helping a student with the following problem:
- Title: ${problem?.title ?? "Unknown"}
- Difficulty: ${problem?.difficulty ?? "Unknown"}
- Category: ${Array.isArray(problem?.tags) ? problem.tags.join(", ") : (problem?.tags ?? "Unknown")}
- Description: ${problem?.description ?? "Not provided"}

The student is coding in: ${language ?? "unknown language"}

${code ? `Their current code:\n\`\`\`${language}\n${code}\n\`\`\`` : ""}

Your role:
- Give conceptual hints, NOT full solutions
- Be encouraging, concise, and pedagogical
- Use markdown for formatting (bold, code blocks, bullet points)
- Focus on guiding thinking, time/space complexity, and common patterns (sliding window, two pointer, hash map, recursion, DP, etc.)
- Keep responses under 150 words unless explaining a concept that genuinely needs more
- Never write the complete working solution for them`;

  const groqMessages = messages.map((m: { sender: string; text: string }) => ({
    role: m.sender === "user" ? "user" : "assistant",
    content: m.text,
  }));

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: systemPrompt }, ...groqMessages],
      max_tokens: 400,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

  return NextResponse.json({ reply });
}
