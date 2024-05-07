'use client'

import { useEffect } from 'react';
import Button from '@components/FormComponents/Buttons/Button'
import {useAuthState} from 'react-firebase-hooks/auth'
import { signOut } from 'firebase/auth';
import {auth} from '@/app/services/firebaseService'
import { useRouter } from 'next/navigation'
import {getUserName} from '@services/helperService'

export default function Dashboard() {
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();
    
    useEffect(() => {
        if (!loading && !user) {
          router.push('/login');
        }
      }, [user, loading, router]);


    if (loading) {
        return (<div>..Loading</div>)
    }

    if (user){
        return (
            <div>
                <h1>Welcome back, {getUserName(user)}</h1>
                <Button type='button' onClick={() => signOut(auth)}>Sign out</Button>
            </div>
        )
    }
}