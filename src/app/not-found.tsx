'use client';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10">
      <h1 className="text-center font-serif text-4xl font-bold">このページはご利用いただけません</h1>
      <p className="pt-9 text-center font-serif text-sm font-semibold leading-7">
        リンクに問題があるか、ページが削除された可能性があります。
      </p>
    </main>
  );
}
