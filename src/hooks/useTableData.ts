import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type TableName =
  | "expenses"
  | "beneficiaries"
  | "volunteers"
  | "assets"
  | "grants"
  | "documents"
  | "donors"
  | "donations"
  | "projects";

interface Options {
  orderBy?: string;
  ascending?: boolean;
}

/**
 * Loads real rows from the backend for a table, exposing
 * loading / error / refetch so pages can render consistent states.
 */
export function useTableData<T = Record<string, unknown>>(
  table: TableName,
  options: Options = {}
) {
  const { orderBy = "created_at", ascending = false } = options;
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data: rows, error: err } = await supabase
      .from(table)
      .select("*")
      .order(orderBy, { ascending });
    if (err) {
      setError(err.message);
      setData([]);
    } else {
      setData((rows ?? []) as T[]);
    }
    setLoading(false);
  }, [table, orderBy, ascending]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, setData, loading, error, refetch: load };
}
