// app/api/posts/[id]/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { PostInputSchema } from "@/lib/zodSchemas";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

interface Params {
  id: string;
}

/**
 * GET /api/posts/:id
 */
export async function GET(_request: Request, { params }: { params: Params }) {
  try {
    const { id } = params;
    const snap = await getDoc(doc(db, "posts", id));
    if (!snap.exists()) {
      return NextResponse.json({ message: "Пост не знайден" }, { status: 404 });
    }
    const { title, content } = snap.data() as {
      title: string;
      content: string;
    };
    return NextResponse.json({ id: snap.id, title, content });
  } catch (error) {
    console.error(`GET /api/posts/${params.id} error:`, error);
    return NextResponse.json(
      { message: "Помилка при завантажені поста" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/posts/:id
 */
export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const body = await request.json();
    const parsed = PostInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.format(), { status: 400 });
    }
    const ref = doc(db, "posts", params.id);
    await updateDoc(ref, parsed.data);
    return NextResponse.json({ id: params.id, ...parsed.data });
  } catch (error) {
    console.error(`PUT /api/posts/${params.id} error:`, error);
    return NextResponse.json(
      { message: "Не вділося обновити пост" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/posts/:id
 */
export async function DELETE(_req: Request, { params }: { params: Params }) {
  try {
    await deleteDoc(doc(db, "posts", params.id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/posts/${params.id} error:`, error);
    return NextResponse.json(
      { message: "Не вдалося видалити пост" },
      { status: 500 }
    );
  }
}
