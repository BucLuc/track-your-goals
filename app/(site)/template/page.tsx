'use client'

import styles from './template.module.css'

import { useEffect, useState } from 'react';
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from '@/app/services/firebaseService'
import { useRouter } from 'next/navigation'
import {getDocument} from '@services/firebaseService'
import Navbar from '@components/Navbar/Navbar';
import WeekTable from '@/app/components/Tables/WeekTable/WeekTable';

export default function Template() {
    const [user, loading, error] = useAuthState(auth);
    const [loadingDoc, setLoadingDoc] = useState(true)
    const [userDoc, setUserDoc] = useState<any>({})
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
            <Navbar activeLink='TEMPLATE' user={user} photoURL={userDoc?.photoURL}/>
            <div className={styles['body-container']}>
                <h1>Deine Wochenvorlage</h1>
                <WeekTable weekParam={userDoc.template} userID={user?.uid} activities={userDoc.activities} dbFieldName='template' isLoading={loadingDoc} isPlanning/>
            </div>
        </div>
    )
}