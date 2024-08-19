'use client'
import styles from './dashboard.module.css'

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@services/firebaseService'
import { useRouter } from 'next/navigation'
import { GetActivitySummary, getUserName, successfulWeek } from '@services/helperService'
import { getDocument } from '@services/firebaseService'
import Navbar from '@components/Navbar/Navbar';
import Loading from '@components/Loading/Loading';

export default function Dashboard() {
    const [user, loading, error] = useAuthState(auth);
    const [userDoc, setUserDoc] = useState<any>({})
    const [weekSummaries, setWeekSummaries] = useState<any>([])
    const [showFirstSteps, setShowFirstSteps] = useState(false)

    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            getDocument('users', user.uid)
                .then(doc => {
                    setUserDoc(doc)
                    setShowFirstSteps((!doc.template || !doc.activities || !doc.weeks))
                })
                .catch(err => {
                    console.error(err)
                })
        }
    }, [user, loading, router]);

    const loadSummary = (index: number) => {
        if (!weekSummaries[index]) {
            const summary = GetActivitySummary(userDoc.weeks[index]);
            setWeekSummaries((prevSummaries: any) => {
                const updatedSummaries = [...prevSummaries];
                updatedSummaries[index] = summary;
                return updatedSummaries;
            });
        }
    }

    return (
        <div>
            <Navbar activeLink='DASHBOARD' user={user} photoURL={userDoc?.photoURL} />

            <div className={styles['body-container']}>
                {loading && <Loading centered size='128px' />}
                {!loading && user && 
                <div>
                    <h1>Wilkommen zurück, {getUserName(user)}</h1>
                    {userDoc && showFirstSteps &&
                        <div className={styles['first-steps']}>
                            <h2>Erste Schritte</h2>
                            <div className={styles.links}>
                                <a href='/activities' className={userDoc.activities && styles.done}>Aktivitäten erfassen</a>
                                <a href='/template' className={userDoc.template && styles.done}>Wochenvorlage erstellen</a>
                                <a href={`dashboard/${userDoc.weeks ? userDoc.weeks.length + 1 : 1}`} className={userDoc.weeks && styles.done}>Woche erstellen</a>
                            </div>
                        </div>
                    }
                    {!showFirstSteps &&
                        <div>
                            <h2>Deine Wochen</h2>
                            <div className={styles.weeks}>
                                <a href={`dashboard/${userDoc?.weeks ? userDoc.weeks.length + 1 : 1}`} className={`${styles.week} ${styles['add-week']}`}>
                                    <img src='/img/add-icon.png' alt='add-icon' />
                                </a>
                                {userDoc?.weeks && [...userDoc.weeks].reverse().map((week: any, index: any) => (
                                    <a key={userDoc.weeks.indexOf(week)} className={`${styles.week} ${successfulWeek(week) ? styles.finished : ''} ${weekSummaries && weekSummaries[userDoc.weeks.indexOf(week)] && Object.keys(weekSummaries[userDoc.weeks.indexOf(week)]).length ? '' : styles['dont-show']}`} href={`dashboard/${userDoc.weeks.indexOf(week) + 1}`} onMouseEnter={() => loadSummary(userDoc.weeks.indexOf(week))}>
                                        {userDoc.weeks.indexOf(week) + 1}
                                        <div className={`${styles['hover-box']}`} id={index}>
                                            {weekSummaries[userDoc.weeks.indexOf(week)] ?
                                                <div className={styles['total-activities']}>
                                                    {week.startDate && <span className={styles.date}>{week.startDate}</span>}
                                                    {Object.keys(weekSummaries[userDoc.weeks.indexOf(week)]).map((name: any) => (
                                                        <p key={name}>
                                                            {name}: <span className={Number(weekSummaries[userDoc.weeks.indexOf(week)][name].actualAmount) >= Number(weekSummaries[userDoc.weeks.indexOf(week)][name].plannedAmount) ? styles.good : styles.bad}>{weekSummaries[userDoc.weeks.indexOf(week)][name].actualAmount}</span>/{weekSummaries[userDoc.weeks.indexOf(week)][name].plannedAmount}{weekSummaries[userDoc.weeks.indexOf(week)][name].unit}
                                                        </p>
                                                    ))}
                                                </div> : <Loading />}
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>}
                </div>}
            </div>
        </div>
    )
}