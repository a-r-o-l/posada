import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey =
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    flowType: "implicit",
    storage: {
      getItem: (key: string) => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(key);
      },
      setItem: (key: string, value: string) => {
        if (typeof window === "undefined") return;
        localStorage.setItem(key, value);
      },
      removeItem: (key: string) => {
        if (typeof window === "undefined") return;
        localStorage.removeItem(key);
      },
    },
  },
});

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
