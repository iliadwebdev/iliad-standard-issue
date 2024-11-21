import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export function useRouterReady() {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsReady(router.isReady);
  }, [router.isReady]);

  return isReady;
}

export default useRouterReady;
