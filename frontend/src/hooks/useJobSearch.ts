// hooks/useJobSearch.ts
// Fresh JSearch consumption hook for the frontend, matching the normalized
// backend response shape from job_aggregator.py

import { useState, useCallback } from "react";

export interface JSearchResult {
  title: string;
  company: string;
  location: string;
  apply_link: string;
  posted_at: string | null;
  employment_type: string | null;
  source: "jsearch";
}

interface SearchState {
  loading: boolean;
  results: JSearchResult[];
  error: string | null;
  hasSearched: boolean;
}

export function useJobSearch() {
  const [state, setState] = useState<SearchState>({
    loading: false,
    results: [],
    error: null,
    hasSearched: false,
  });

  const search = useCallback(async (query: string, location: string = "", page: number = 1) => {
    if (!query.trim()) {
      setState((prev) => ({ ...prev, error: "Please enter a search term." }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const params = new URLSearchParams({ query, location, page: String(page) });
      const response = await fetch(`/api/jobs/search_realtime/?${params.toString()}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        setState({
          loading: false,
          results: [],
          error: data.error || "Something went wrong while searching for jobs.",
          hasSearched: true,
        });
        return;
      }

      setState({
        loading: false,
        results: data.results,
        error: null,
        hasSearched: true,
      });
    } catch (err) {
      setState({
        loading: false,
        results: [],
        error: "Could not reach the server. Check your connection.",
        hasSearched: true,
      });
    }
  }, []);

  return { ...state, search };
}
