import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";

type Note = { id: number; title: string };

async function loadNotes(): Promise<{ notes: Note[] } | { error: string }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notes")
      .select("id, title")
      .order("id");
    if (error) return { error: error.message };
    return { notes: data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Unknown error" };
  }
}

async function Notes() {
  const result = await loadNotes();

  if ("error" in result) {
    return (
      <p role="alert" className="mt-4 text-red-600">
        Could not load notes: {result.error}
      </p>
    );
  }

  if (result.notes.length === 0) {
    return (
      <p className="mt-4 text-zinc-500">
        No notes yet. The &quot;notes&quot; table is empty.
      </p>
    );
  }

  return (
    <ul className="mt-4 list-disc pl-5">
      {result.notes.map((note) => (
        <li key={note.id}>{note.title}</li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Notes</h1>
      <Suspense fallback={<p className="mt-4 text-zinc-500">Loading notes…</p>}>
        <Notes />
      </Suspense>
    </main>
  );
}
