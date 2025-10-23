import { useState } from "react";

export default function useDirty(initial = false) {
  const [dirty, setDirty] = useState(initial);
  const mark = () => setDirty(true);
  const reset = () => setDirty(false);
  return { dirty, mark, reset };
}
