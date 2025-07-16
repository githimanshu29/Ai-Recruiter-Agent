import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

// ✅ Type for the expected request body
interface InterviewRequestBody {
  type: string;
  role: string;
  level: string;
  techstack: string;
  amount: number | string;
  userid: string;
}

export async function GET() {
  return Response.json({ success: true, data: "THANK YOU!" }, { status: 200 });
}

export async function POST(request: Request) {
  let body: InterviewRequestBody;

  // 🛡️ Safely parse the JSON body
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Invalid or empty JSON body" },
      { status: 400 }
    );
  }

  const { type, role, level, techstack, amount, userid } = body;

  // 🧱 Validate required fields
  if (!type || !role || !level || !techstack || !amount || !userid) {
    return Response.json(
      { success: false, error: "Missing one or more required fields" },
      { status: 400 }
    );
  }

  try {
    // 🤖 Generate interview questions using AI
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
The job role is ${role}.
The job experience level is ${level}.
The tech stack used in the job is: ${techstack}.
The focus between behavioural and technical questions should lean towards: ${type}.
The amount of questions required is: ${amount}.
Please return only the questions, without any additional text.
The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
Return the questions formatted like this:
["Question 1", "Question 2", "Question 3"]
Thank you! <3`
    });

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(",").map((tech: string) => tech.trim()),
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString()
    };

    // 📥 Save to Firestore
    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    // 🛠️ Narrow the error to show message safely
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";

    console.error("Interview generation failed:", error);

    return Response.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
