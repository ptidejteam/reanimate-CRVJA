import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "tutorial.md");
    const content = fs.readFileSync(filePath, "utf-8");
    return new Response(content, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    return new Response("Failed to load tutorial.", { status: 500 });
  }
}
