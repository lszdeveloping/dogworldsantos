import { createClient, type User as SupabaseUser } from "@supabase/supabase-js";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

type SupabaseSessionUser = Pick<SupabaseUser, "id" | "email" | "user_metadata">;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// The app maps several typed collections through a dynamic table config.
// Keeping the Supabase client loose here avoids generated-schema coupling.
let client: ReturnType<typeof createClient<any>> | null = null;

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
  }

  client ??= createClient<any>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return client;
}

export function toSessionUser(user: SupabaseSessionUser): SessionUser {
  const metadata = user.user_metadata ?? {};
  const metadataName =
    typeof metadata.name === "string"
      ? metadata.name
      : typeof metadata.full_name === "string"
        ? metadata.full_name
        : "";
  const email = user.email ?? "";
  const fallbackName = email.split("@")[0] || "Usuario";

  return {
    id: user.id,
    name: metadataName.trim() || fallbackName,
    email,
  };
}

export async function getCurrentSessionUser(): Promise<SessionUser | null> {
  const { data, error } = await getSupabaseClient().auth.getSession();

  if (error) throw error;
  return data.session?.user ? toSessionUser(data.session.user) : null;
}

export function onSessionChange(callback: (user: SessionUser | null) => void) {
  const { data } = getSupabaseClient().auth.onAuthStateChange((_event, session) => {
    callback(session?.user ? toSessionUser(session.user) : null);
  });

  return () => data.subscription.unsubscribe();
}

export async function loginWithPassword(email: string, password: string) {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({
    email: email.toLowerCase().trim(),
    password,
  });

  if (error) {
    return { user: null, error: mapAuthError(error.message) };
  }

  return {
    user: data.user ? toSessionUser(data.user) : null,
    error: null,
  };
}

export async function registerWithPassword(
  name: string,
  email: string,
  password: string
) {
  const { data, error } = await getSupabaseClient().auth.signUp({
    email: email.toLowerCase().trim(),
    password,
    options: {
      data: {
        name: name.trim(),
      },
    },
  });

  if (error) {
    return { user: null, error: mapAuthError(error.message) };
  }

  if (!data.session) {
    return {
      user: null,
      error: "Cadastro criado. Confira seu email para confirmar a conta.",
    };
  }

  return {
    user: data.user ? toSessionUser(data.user) : null,
    error: null,
  };
}

export async function signOut() {
  await getSupabaseClient().auth.signOut();
}

function mapAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Email ou senha incorretos.";
  }

  if (normalized.includes("already registered") || normalized.includes("already exists")) {
    return "Este email ja esta cadastrado.";
  }

  if (normalized.includes("password")) {
    return "A senha deve ter pelo menos 6 caracteres.";
  }

  return "Nao foi possivel autenticar. Tente novamente.";
}
