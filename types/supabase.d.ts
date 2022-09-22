import { supabase } from "./lib/supabase";

declare global {
  var supabase: supabase; // This must be a `var` and not a `let / const`
}
