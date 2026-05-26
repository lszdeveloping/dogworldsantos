"use client";

import { useCallback, useEffect, useRef, useState, type SetStateAction } from "react";
import { getSupabaseClient } from "@/lib/auth";
import {
  collectionConfigs,
  fromSupabaseRow,
  getCollectionChanges,
  toSupabaseRow,
  type CollectionName,
} from "@/lib/supabase-data";

interface CollectionState {
  loading: boolean;
  error: string | null;
}

export function useSupabaseCollection<T extends { id: string }>(
  collectionName: CollectionName,
  initialValue: T[],
  enabled: boolean
) {
  const config = collectionConfigs[collectionName];
  const [items, setItems] = useState<T[]>(initialValue);
  const [state, setState] = useState<CollectionState>({
    loading: false,
    error: null,
  });
  const itemsRef = useRef<T[]>(initialValue);
  const queueRef = useRef(Promise.resolve());

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    if (!enabled) {
      itemsRef.current = initialValue;
      setItems(initialValue);
      setState({ loading: false, error: null });
      return;
    }

    let active = true;

    async function loadItems() {
      setState({ loading: true, error: null });

      try {
        const query = getSupabaseClient()
          .from(config.table)
          .select("*")
          .order(config.orderBy ?? "created_at", {
            ascending: config.ascending ?? true,
          });
        const { data, error } = await query;

        if (error) throw error;
        if (!active) return;

        let nextItems = (data ?? []).map((row) =>
          fromSupabaseRow<T>(config, row as Record<string, unknown>)
        );

        if (nextItems.length === 0) {
          const legacyItems = readLegacyLocalStorage<T>(config.legacyLocalStorageKey);

          if (legacyItems.length > 0) {
            const { error: migrationError } = await getSupabaseClient()
              .from(config.table)
              .upsert(
                legacyItems.map((item) => toSupabaseRow(config, item)),
                { onConflict: "id" }
              );

            if (migrationError) throw migrationError;

            nextItems = legacyItems;
            if (config.legacyLocalStorageKey) {
              localStorage.removeItem(config.legacyLocalStorageKey);
            }
          }
        }

        itemsRef.current = nextItems;
        setItems(nextItems);
        setState({ loading: false, error: null });
      } catch (error) {
        if (!active) return;

        const message = error instanceof Error ? error.message : "Erro desconhecido.";
        setState({ loading: false, error: message });
      }
    }

    void loadItems();

    return () => {
      active = false;
    };
  }, [collectionName, config, enabled, initialValue]);

  const persistChanges = useCallback(
    async (previousItems: T[], nextItems: T[]) => {
      const { changedRows, removedIds } = getCollectionChanges(
        config,
        previousItems,
        nextItems
      );

      if (changedRows.length > 0) {
        const { error } = await getSupabaseClient()
          .from(config.table)
          .upsert(changedRows, { onConflict: "id" });
        if (error) throw error;
      }

      if (removedIds.length > 0) {
        const { error } = await getSupabaseClient()
          .from(config.table)
          .delete()
          .in("id", removedIds);
        if (error) throw error;
      }
    },
    [config]
  );

  const setCollection = useCallback(
    (action: SetStateAction<T[]>) => {
      const previousItems = itemsRef.current;
      const nextItems =
        typeof action === "function"
          ? (action as (previous: T[]) => T[])(previousItems)
          : action;

      itemsRef.current = nextItems;
      setItems(nextItems);

      if (!enabled) return;

      queueRef.current = queueRef.current
        .then(() => persistChanges(previousItems, nextItems))
        .catch((error) => {
          const message = error instanceof Error ? error.message : "Erro desconhecido.";
          setState((current) => ({ ...current, error: message }));
        });
    },
    [enabled, persistChanges]
  );

  return [items, setCollection, state] as const;
}

function readLegacyLocalStorage<T>(key?: string) {
  if (!key) return [];

  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T[]) : [];
  } catch {
    return [];
  }
}
