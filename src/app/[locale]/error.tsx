'use client'
export default function RootError({ error, reset }: any) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <img
        src="/error500.png"
        alt="error 500"
        className="w-full max-w-[400px] h-auto mb-4"
      />
      <h1 className="text-xl font-bold">Oops! Something went wrong.</h1>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-primary text-white rounded mt-4"
      >
        Retry
      </button>
    </div>
  );
}
