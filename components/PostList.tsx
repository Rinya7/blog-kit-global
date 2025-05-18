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

  if (loading) return <p>Загрузка…</p>;
  if (error) return <p className="text-red-600">Ошибка: {error}</p>;

  return (
    <ul className="space-y-4">
      {items.map((post) => (
        <li key={post.id} className="p-4 ">
          <p className="mb-4">{post.title}</p>
          <Link
            href={`/posts/${post.id}`}
            className="w-full p-4 border rounded hover:shadow text-xl font-medium"
          >
            {post.content}
          </Link>
        </li>
      ))}
    </ul>
  );
}
