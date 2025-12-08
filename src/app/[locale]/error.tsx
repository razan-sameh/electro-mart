"use client";

export default function RootError({ error, reset }: any) {
  return (
    <div className="p-10 text-center">
      <h1 className="text-xl font-bold">Oops! Something went wrong.</h1>
      <button onClick={() => reset()} className="px-4 py-2 bg-black text-white rounded mt-4">
        Retry
      </button>
    </div>
  );
}
