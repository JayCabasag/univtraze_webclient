import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Social = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/social/login');
  }, []);

  return null;
};

export default Social;