// components/PostList.tsx
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchPosts } from "../store/postsSlice";

export function PostList() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">Загрузка постов…</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">Ошибка: {error}</div>
    );
  }

  return (
    <ul className="space-y-6">
      {items.map((post) => (
        <li key={post.id}>
          <Link
            href={`/posts/${post.id}`}
            className="block bg-white dark:bg-gray-800 shadow hover:shadow-lg transition rounded-lg overflow-hidden"
          >
            <header className="px-6 py-4 border-b dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {post.title}
              </h2>
            </header>
            <p className="px-6 py-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              {post.content.length > 200
                ? post.content.slice(0, 200) + "…"
                : post.content}
            </p>
            <div className="px-6 pb-4">
              <span className="text-blue-600 hover:underline">
                Читать пост →
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
