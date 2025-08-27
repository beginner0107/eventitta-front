'use client';

import { useGetMeetings } from '@/api/eventitta';
import { useState } from 'react';

export default function MeetingsPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, error, refetch, isFetching } = useGetMeetings({
    page,
    size: 10,
  });

  if (isLoading) {
    return (
      <div className="grid gap-3 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse bg-gray-200 rounded" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        에러 발생{' '}
        <button
          onClick={() => refetch()}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          재시도
        </button>
      </div>
    );
  }

  const items = data?.content ?? [];

  if (!items.length) {
    return <div className="p-6 text-gray-600">표시할 모임이 없습니다.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">모임 목록</h1>
      <ul className="grid gap-3 md:grid-cols-2">
        {items.map((m) => (
          <li key={m.id} className="border rounded-lg p-4">
            <div className="font-medium">{m.title}</div>
            <div className="text-sm text-gray-500">{m.address}</div>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center gap-2">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0 || isFetching}
        >
          이전
        </button>
        <span className="text-sm">페이지 {page + 1}</span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => p + 1)}
          disabled={isFetching}
        >
          다음
        </button>
      </div>
    </div>
  );
}
