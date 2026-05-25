import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Faltan variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Reports ──────────────────────────────────────────────────────────────────

export async function fetchReports() {
  const { data, error } = await supabase
    .from("reports")
    .select("id, tipo, finca, semana, year, closed, created_at, closed_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchReport(id) {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createReport(report) {
  const { data, error } = await supabase
    .from("reports")
    .insert({
      tipo:   report.tipo   || "cultivo",
      finca:  report.finca,
      semana: report.semana,
      year:   report.year,
      closed: false,
      areas:  report.areas,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function saveReport(id, areas) {
  const { data, error } = await supabase
    .from("reports")
    .update({ areas })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function closeReport(id, areas) {
  const { data, error } = await supabase
    .from("reports")
    .update({ areas, closed: true, closed_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteReport(id) {
  const { error } = await supabase.from("reports").delete().eq("id", id);
  if (error) throw error;
}
