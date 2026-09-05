import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { checkRateLimit, getClientIp, sanitizeText } from "@/lib/security";

const DEFAULT_COMMENTS: Record<string, any[]> = {
  "neuro-vision": [
    {
      id: "c-nv-1",
      project_id: "neuro-vision",
      author_name: "Alex Rivera",
      author_role: "AI Engineer",
      content:
        "Tested this pipeline with multi-stream RTSP on Jetson Orin Nano. TensorRT FP16 quantization keeps latency under 8ms. Incredible work on the zero-copy buffer!",
      likes: 14,
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
    {
      id: "c-nv-2",
      project_id: "neuro-vision",
      author_name: "Sarah Chen",
      author_role: "ML Researcher",
      content:
        "How does the custom YOLOv10 backbone handle low-light occlusions compared to standard ByteTrack? The 140+ FPS throughput is stunning.",
      likes: 9,
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: "c-nv-3",
      project_id: "neuro-vision",
      author_name: "Jaydeep Prajapati",
      author_role: "Author / Dev",
      content:
        "@Sarah Chen — We augmented the training dataset with synthetic low-lux noise and applied temporal smoothing across 5 consecutive bounding frames to eliminate occlusion flicker.",
      likes: 22,
      created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
  ],
  "omni-agent": [
    {
      id: "c-om-1",
      project_id: "omni-agent",
      author_name: "Marcus Vance",
      author_role: "Systems Architect",
      content:
        "The dynamic DAG reflection logic with recursive retry is top tier. Sub-second function dispatching makes human-in-the-loop agent swarms remarkably reliable.",
      likes: 11,
      created_at: new Date(Date.now() - 3600000 * 60).toISOString(),
    },
    {
      id: "c-om-2",
      project_id: "omni-agent",
      author_name: "Priya Sharma",
      author_role: "MLOps Lead",
      content:
        "pgvector + Redis hybrid memory cut retrieval latency down to <14ms. Exactly what we needed for multi-tenant state trees.",
      likes: 7,
      created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    },
  ],
  "tensor-flow-mesh": [
    {
      id: "c-tf-1",
      project_id: "tensor-flow-mesh",
      author_name: "David Miller",
      author_role: "Cloud Lead",
      content:
        "PagedAttention integration on Triton with slot-based cache eviction is top notch. Scaling across multi-node GPU clusters effortlessly.",
      likes: 12,
      created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    },
  ],
  "synth-craft": [
    {
      id: "c-sc-1",
      project_id: "synth-craft",
      author_name: "Elena Vasquez",
      author_role: "Frontend Architect",
      content:
        "In-browser WebContainer compilation under 850ms is incredible for live generative UI. Beautifully executed Next.js 16 App Router setup!",
      likes: 16,
      created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
    },
  ],
  "rag-vault": [
    {
      id: "c-rv-1",
      project_id: "rag-vault",
      author_name: "Kenji Sato",
      author_role: "Search Engineer",
      content:
        "Reciprocal Rank Fusion with ColBERT cross-encoder re-ranking gives crisp context windows. Zero hallucinations observed on legal PDFs.",
      likes: 8,
      created_at: new Date(Date.now() - 3600000 * 40).toISOString(),
    },
  ],
  "deep-audio": [
    {
      id: "c-da-1",
      project_id: "deep-audio",
      author_name: "Liam O'Connor",
      author_role: "Audio ML",
      content:
        "StyleTTS2 with expressive neural prosody at 185ms total turnaround over WebRTC is remarkable for real-time voice conversations!",
      likes: 15,
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("project_id");

  try {
    await initDb();
    const sql = getDb();

    if (projectId) {
      const rows = await sql`
        SELECT * FROM project_comments 
        WHERE project_id = ${projectId} 
        ORDER BY created_at ASC
      `;

      const defaults = DEFAULT_COMMENTS[projectId] || [];
      const rowIds = new Set((rows || []).map((r: any) => r.id));
      const combined = [
        ...defaults.filter((d) => !rowIds.has(d.id)),
        ...(rows || []),
      ];

      return NextResponse.json({ comments: combined });
    }

    const allRows = await sql`SELECT * FROM project_comments ORDER BY created_at DESC LIMIT 100`;
    const allDefaults = Object.values(DEFAULT_COMMENTS).flat();
    const existingIds = new Set((allRows || []).map((r: any) => r.id));
    const mergedAll = [...(allRows || []), ...allDefaults.filter((d) => !existingIds.has(d.id))];
    return NextResponse.json({ comments: mergedAll });
  } catch (error: any) {
    // Database connection fallback
    if (projectId) {
      const fallback = DEFAULT_COMMENTS[projectId] || [];
      return NextResponse.json({ comments: fallback, fallback: true });
    }
    const allDefaults = Object.values(DEFAULT_COMMENTS).flat();
    return NextResponse.json({ comments: allDefaults, fallback: true });
  }
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`comment:${clientIp}`, 10, 5 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Rate limit exceeded. Please wait ${rateCheck.resetInSec}s before posting again.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { project_id, author_name, author_role, content } = body;

    if (!project_id || !author_name?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Missing required fields: project_id, author_name, content" },
        { status: 400 }
      );
    }

    const newId = `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const role = sanitizeText(author_role?.trim() || "AI Engineer", 60);
    const author = sanitizeText(author_name.trim(), 80);
    const commentText = sanitizeText(content.trim(), 1200);

    if (author.length < 2 || commentText.length < 3) {
      return NextResponse.json(
        { error: "Comment or author name too short" },
        { status: 400 }
      );
    }

    try {
      await initDb();
      const sql = getDb();

      const inserted = await sql`
        INSERT INTO project_comments (id, project_id, author_name, author_role, content, likes)
        VALUES (${newId}, ${project_id}, ${author}, ${role}, ${commentText}, 0)
        RETURNING *
      `;

      return NextResponse.json({ comment: inserted[0] || { id: newId, project_id, author_name: author, author_role: role, content: commentText, likes: 0, created_at: new Date().toISOString() } });
    } catch {
      // Local fallback return
      return NextResponse.json({
        comment: {
          id: newId,
          project_id,
          author_name: author,
          author_role: role,
          content: commentText,
          likes: 0,
          created_at: new Date().toISOString(),
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing comment id" }, { status: 400 });
    }

    try {
      await initDb();
      const sql = getDb();

      if (action === "unlike") {
        const updated = await sql`
          UPDATE project_comments 
          SET likes = GREATEST(0, likes - 1)
          WHERE id = ${id}
          RETURNING *
        `;
        return NextResponse.json({ comment: updated[0] });
      } else {
        const updated = await sql`
          UPDATE project_comments 
          SET likes = likes + 1
          WHERE id = ${id}
          RETURNING *
        `;
        return NextResponse.json({ comment: updated[0] });
      }
    } catch {
      return NextResponse.json({ success: true, id, action });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
