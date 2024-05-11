'use client'
import styles from './dashboard.module.css'

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/app/services/firebaseService'
import { useRouter } from 'next/navigation'
import { getUserName } from '@services/helperService'
import { getDocument } from '@services/firebaseService'
import Navbar from '@components/Navbar/Navbar';

export default function Dashboard() {
    const [user, loading, error] = useAuthState(auth);
    const [userDoc, setUserDoc] = useState<any>({})
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            getDocument('users', user.uid)
                .then(doc => {
                    setUserDoc(doc)
                })
                .catch(err => {
                    console.error(err)
                })
        }

    }, [user, loading, router]);

    return (
        <div>
            <Navbar activeLink='HOME' user={user} />

            <div className={styles['body-container']}>
                {loading && <div>..Loading</div>}
                {!loading && user && <div>
                    <h1>Wilkommen zurück, {getUserName(user)}</h1>
                    <h2>Deine Wochen</h2>
                    <div className={styles.weeks}>
                        <div className={`${styles.week} ${styles['add-week']}`}>
                            <a href={`dashboard/${userDoc?.weeks ? userDoc.weeks.length + 1 : 1}`}><img src='/img/add-icon.png' alt='add-icon' /></a>
                        </div>
                        {userDoc.weeks && [...userDoc.weeks].reverse().map((week: any, index: any) => (
                            <div key={userDoc.weeks.indexOf(week)} className={`${styles.week} ${week.finished ? styles.finished : ''}`}>
                                <a href={`dashboard/${userDoc.weeks.indexOf(week) + 1}`}>{userDoc.weeks.indexOf(week) + 1}</a>
                            </div>
                        ))}
                    </div>
                </div> }
            </div>
        </div>
    )
}