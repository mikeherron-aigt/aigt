"use client";

import { useEffect, useRef, useState } from "react";
import {
  getArtworks,
  getCollections,
  type Artwork,
  type ArtworkFilters,
  type Collection,
} from "@/app/lib/api";

interface UseArtworksResult {
  artworks: Artwork[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useArtworks(filters?: ArtworkFilters): UseArtworksResult {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const filtersRef = useRef<string>("");
  const currentFilters = JSON.stringify(filters || {});

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getArtworks(filters);
      setArtworks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load artworks");
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filtersRef.current !== currentFilters) {
      filtersRef.current = currentFilters;
      fetchArtworks();
    }
  }, [currentFilters]);

  return {
    artworks,
    loading,
    error,
    refetch: fetchArtworks,
  };
}

interface UseCollectionsResult {
  collections: Collection[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCollections(): UseCollectionsResult {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCollections();
      setCollections(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load collections");
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return {
    collections,
    loading,
    error,
    refetch: fetchCollections,
  };
}
