'use client'

import { useEffect } from 'react';
import styles from "@/app/styles/page.module.css";
import Button from '@components/FormComponents/Buttons/Button'
import {useAuthState} from 'react-firebase-hooks/auth'
import { signOut } from 'firebase/auth';
import {auth} from '@/app/services/firebaseService'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    console.log(user)
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  return (
    <div>
      <h1>{user?.email}</h1>
      <Button type='button' onClick={() => signOut(auth)}>Sign out</Button>
    </div>
  );
}
