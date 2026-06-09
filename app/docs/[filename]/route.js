import fs from "fs";
import path from "path";

export async function GET(request, { params }) {
  try {
    const { filename } = params;
    
    // Prevent directory traversal attacks by extracting just the basename
    const safeFilename = path.basename(filename);
    const filePath = path.join(process.cwd(), "docs", safeFilename);
    
    if (!fs.existsSync(filePath)) {
      return new Response("Not found", { status: 404 });
    }

    const content = fs.readFileSync(filePath);
    
    // Determine the content type based on the file extension
    let contentType = "application/octet-stream";
    const ext = path.extname(safeFilename).toLowerCase();
    if (ext === ".png") {
      contentType = "image/png";
    } else if (ext === ".jpg" || ext === ".jpeg") {
      contentType = "image/jpeg";
    } else if (ext === ".gif") {
      contentType = "image/gif";
    } else if (ext === ".svg") {
      contentType = "image/svg+xml";
    } else if (ext === ".md") {
      contentType = "text/markdown";
    }

    return new Response(content, {
      headers: { 
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable"
      },
    });
  } catch (error) {
    return new Response("Error loading file", { status: 500 });
  }
}
