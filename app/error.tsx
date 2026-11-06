"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="content" className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 py-16 sm:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">This page could not be loaded</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
        No demand score, growth rate, or pay figure has been filled in. The site serves a completed
        capture, and this view did not render it.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 inline-flex min-h-11 w-fit items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
      >
        Try again
      </button>
    </main>
  );
}
