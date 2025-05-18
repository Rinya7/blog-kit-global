// components/PostForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostInput, PostInputSchema } from "@/lib/zodSchemas";
import { useAppDispatch, useAppSelector } from "@/store";
import { createPost } from "@/store/postsSlice";

/** Приводит любой `unknown` к понятному сообщению */
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === "string") {
    return err;
  }
  try {
    // если это объект без message, или что-то ещё
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export function PostForm() {
  const dispatch = useAppDispatch();
  const { error: createError } = useAppSelector((s) => s.posts);

  const [localError, setLocalError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostInput>({
    resolver: zodResolver(PostInputSchema),
  });

  const onSubmit = async (data: PostInput) => {
    setLocalError(null);
    try {
      // unwrap() выбросит ошибку, если экшен отклонится
      await dispatch(createPost(data)).unwrap();
      reset();
    } catch (err: unknown) {
      // без any, только unknown + наш геттер
      const msg = getErrorMessage(err) || "Ошибка при отправке";
      setLocalError(msg);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto p-6 border rounded-lg space-y-4"
    >
      {/* Показываем ошибку из Redux или локальную */}
      {(createError || localError) && (
        <p className="text-red-600">{localError ?? createError}</p>
      )}

      <div>
        <input
          {...register("title")}
          placeholder="Заголовок"
          className="w-full p-2 border rounded"
        />
        {errors.title && <p className="text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <textarea
          {...register("content")}
          placeholder="Содержание"
          rows={6}
          className="w-full p-2 border rounded"
        />
        {errors.content && (
          <p className="text-red-600">{errors.content.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {isSubmitting ? "Сохраняю…" : "Создать пост"}
      </button>
    </form>
  );
}
