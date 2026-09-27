import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onEmail(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const result =
        mode === "up"
          ? await authClient.signUp.email({
              name: name.trim() || email.trim(),
              email: email.trim(),
              password,
              callbackURL: "/team",
            })
          : await authClient.signIn.email({
              email: email.trim(),
              password,
              callbackURL: "/team",
            });
      if (result.error) {
        setError(result.error.message ?? "Could not sign in");
        return;
      }
      await navigate({ to: "/team" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-ink/10 bg-card p-6 shadow-sm sm:p-8">
        <a href="/" className="inline-block">
          <img src="/brand/logo.jpg" alt="Mirhaj Chemicals" className="h-12 w-auto" />
        </a>
        <h1 className="mt-6 font-display text-3xl text-ink">Team desk</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">
          Staff sign in here. This is the internal desk, not a public mailbox. A real
          @mirhajchemicals.com inbox still needs the domain and a mail host such as Google
          Workspace or Zoho.
        </p>

        {authEnabled ? (
          <>
            <div className="mt-6 flex flex-col gap-2">
              {GROK_PROVIDERS.map((provider) => (
                <button
                  key={provider.providerId}
                  type="button"
                  className="min-h-11 rounded-full border border-ink/15 bg-paper px-4 text-sm font-semibold text-ink hover:border-teal"
                  onClick={() => void signIn(provider.providerId, { callbackURL: "/team" })}
                >
                  Continue with {provider.label}
                </button>
              ))}
            </div>

            <p className="my-5 text-center text-xs font-semibold uppercase tracking-wider text-ink/50">
              or email and password
            </p>

            <form className="flex flex-col gap-3" onSubmit={onEmail}>
              {mode === "up" ? (
                <label className="text-sm font-medium text-ink">
                  Name
                  <input
                    className="mt-1 min-h-11 w-full rounded-xl border border-ink/15 bg-paper px-3"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    required
                  />
                </label>
              ) : null}
              <label className="text-sm font-medium text-ink">
                Email
                <input
                  className="mt-1 min-h-11 w-full rounded-xl border border-ink/15 bg-paper px-3"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </label>
              <label className="text-sm font-medium text-ink">
                Password
                <input
                  className="mt-1 min-h-11 w-full rounded-xl border border-ink/15 bg-paper px-3"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={mode === "up" ? "new-password" : "current-password"}
                  minLength={8}
                  required
                />
              </label>
              {error ? <p className="text-sm text-ink">{error}</p> : null}
              <button
                type="submit"
                disabled={pending}
                className="min-h-11 rounded-full bg-teal px-4 text-sm font-semibold text-paper disabled:opacity-60"
              >
                {pending ? "Please wait…" : mode === "up" ? "Create staff login" : "Sign in"}
              </button>
            </form>
            <button
              type="button"
              className="mt-4 text-sm font-medium text-teal"
              onClick={() => {
                setMode(mode === "in" ? "up" : "in");
                setError("");
              }}
            >
              {mode === "in" ? "New staff member? Create a login" : "Already have a login? Sign in"}
            </button>
          </>
        ) : (
          <p className="mt-6 text-sm text-ink/70">Sign-in is not switched on yet.</p>
        )}
      </div>
    </main>
  );
}
