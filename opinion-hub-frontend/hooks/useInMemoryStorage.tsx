"use client";

import { useState, useCallback } from "react";

export interface InMemoryStorage {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
  remove: (key: string) => void;
  clear: () => void;
}

export function useInMemoryStorage(): { storage: InMemoryStorage } {
  const [data, setData] = useState<Map<string, any>>(new Map());

  const storage: InMemoryStorage = {
    get: useCallback((key: string) => {
      return data.get(key);
    }, [data]),

    set: useCallback((key: string, value: any) => {
      setData(prev => new Map(prev.set(key, value)));
    }, []),

    remove: useCallback((key: string) => {
      setData(prev => {
        const newMap = new Map(prev);
        newMap.delete(key);
        return newMap;
      });
    }, []),

    clear: useCallback(() => {
      setData(new Map());
    }, []),
  };

  return { storage };
}
