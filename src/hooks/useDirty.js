import { useState, useCallback } from "react";

export default function useDirty(initial = false) {
  const [dirty, setDirty] = useState(initial);
  const mark = useCallback(() => setDirty(true), []);
  const reset = useCallback(() => setDirty(false), []);
  return { dirty, mark, reset, setDirty };
}
