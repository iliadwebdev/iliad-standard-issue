import { useState, useEffect } from 'react';

export function useInitialRender(): boolean {
  const [hasRendered, setHasRendered] = useState(false);

  useEffect(() => {
    setHasRendered(true);
  }, []);

  return hasRendered;
}
