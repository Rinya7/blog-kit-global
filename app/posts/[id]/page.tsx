// app/posts/[id]/page.tsx
import { Metadata } from "next";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

interface AsyncParams {
  params: Promise<{ id: string }>;
}

// Генерируем metadata, дожидаясь params
export async function generateMetadata({
  params,
}: AsyncParams): Promise<Metadata> {
  const { id } = await params; // ← здесь ждём params
  try {
    const snap = await getDoc(doc(db, "posts", id));
    if (!snap.exists()) {
      return { title: "Пост не найден" };
    }
    const data = snap.data();
    return { title: data.title as string };
  } catch {
    return { title: "Ошибка загрузки" };
  }
}

export default async function PostPage({ params }: AsyncParams) {
  const { id } = await params; // ← и здесь ждём params
  // Инициализируем переменные сразу, чтобы TS не ругался
  let title = "";
  let content = "";
  let loadError: string | null = null;
  try {
    const snap = await getDoc(doc(db, "posts", id));
    if (!snap.exists()) {
      loadError = "Пост не найден или был удалён";
    } else {
      const data = snap.data() as { title: string; content: string };
      title = data.title;
      content = data.content;
    }
  } catch (err) {
    console.error(`Error loading post ${id}:`, err);
    loadError = "Не удалось загрузить пост";
  }

  if (loadError) {
    return (
      <main className="container mx-auto p-6">
        <p className="text-red-600 text-center">{loadError}</p>
        <div className="text-center mt-4">
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded"
          >
            На главную
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-6">
      <article className="prose lg:prose-xl space-y-6">
        <h1>{title}</h1>
        <div>{content}</div>
        <Link
          href="/"
          className="inline-block mt-6 px-4 py-2 bg-blue-600 text-white rounded"
        >
          На главную
        </Link>
      </article>
    </main>
  );
}
