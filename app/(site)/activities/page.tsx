'use client'

import styles from './activities.module.css'

import { useEffect, useState } from 'react';
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '@/app/services/firebaseService'
import { useRouter } from 'next/navigation'
import {getDocument} from '@services/firebaseService'
import Navbar from '@components/Navbar/Navbar';
import ActivityTable from '@components/Tables/ActivityTable/ActivityTable';

export default function Activities() {
    const [user, loading, error] = useAuthState(auth);
    const [userDoc, setUserDoc] = useState<any>({})
    const [loadingDoc, setLoadingDoc] = useState(true)
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
          router.push('/login');
        } else if (user) {
            getDocument('users', user.uid)
                .then(doc => {
                    setUserDoc(doc)
                    setLoadingDoc(false)
                })
                .catch(err => {
                    console.error(err)
                })
        }
    }, [user, loading, router]);

    return(
        <div>
            <Navbar activeLink='ACTIVITIES' user={user}/>
            <div className={styles['body-container']}>
                <h1>Deine Aktivitäten</h1>
                <ActivityTable activitiesParam={userDoc.activities} userID={user?.uid} isLoading={loadingDoc}/>
            </div>
        </div>
    )
}