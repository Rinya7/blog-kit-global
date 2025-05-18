// app/posts/[id]/loading.tsx

export default function PostLoading() {
  return (
    <main className="container mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden animate-pulse">
        {/* Заголовок */}
        <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-t-lg"></div>
        {/* Контент-скелетон */}
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    </main>
  );
}
