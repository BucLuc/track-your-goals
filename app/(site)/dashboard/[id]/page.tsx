'use client'

import styles from './week.module.css'

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, updateField, getDocument } from '@services/firebaseService'
import { GetActivitySummary } from '@services/helperService'
import { useRouter } from 'next/navigation'
import Navbar from '@components/Navbar/Navbar';
import WeekTable from '@components/Tables/WeekTable/WeekTable';
import Loading from '@components/Loading/Loading';
import { Activity } from '@config/config';
import Button from '@components/FormComponents/Buttons/Button';
import IconButton from '@components/IconButton/IconButton';


export default function Week({ params, }: { params: { id: string } }) {
    const [user, loading, error] = useAuthState(auth);
    const [userDoc, setUserDoc] = useState<any>()
    const [showTotal, setShowTotal] = useState(false)
    const [totalActivities, setTotalActivities] = useState<any>([])
    const [planning, setPlanning] = useState(true)
    const [id, setID] = useState(0)
    const router = useRouter();

    useEffect(() => {
        if (params.id) {
            const weekIndex = parseInt(params.id) - 1

            if (isNaN(weekIndex) || weekIndex < 0) router.push('/dashboard');

            setID(weekIndex)
        }
    }, [params.id])

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            getDocument('users', user.uid)
                .then(doc => {
                    if (!doc.weeks || !doc.weeks[id]) {
                        setPlanning(true)

                        const updatedWeeks = doc.weeks ? [...doc.weeks] : [];
                        updatedWeeks[id] = doc.template ?? {};
                        doc.weeks = updatedWeeks

                        updateField(`users/${user.uid}`, 'weeks', updatedWeeks)
                    } else setPlanning(false)
                    setUserDoc(doc)
                    onTotalChange(doc)
                })
                .catch(err => {
                    console.error(err)
                })
        }
    }, [user, loading]);

    const onTotalChange = (doc: any) => {
        setTotalActivities(GetActivitySummary(doc.weeks[id]))
    }

    const onSave = (data: Activity[], day: string) => {
        const updatedWeeks = [...userDoc.weeks];
        updatedWeeks[id][day] = data;

        updateField(`users/${user?.uid}`, 'weeks', updatedWeeks)

        const updDoc = userDoc
        updDoc.weeks = updatedWeeks
        onTotalChange(updDoc)
    }

    const finishWeek = () => {
        const updatedWeeks = [...userDoc.weeks];
        updatedWeeks[id].finished = true;

        updateField(`users/${user?.uid}`, 'weeks', updatedWeeks)

        router.push('/dashboard')
    }

    return (
        <div>
            <Navbar user={user} photoURL={userDoc?.photoURL} />
            <div className={styles['body-container']}>
                <div className={styles.title}>
                    {!loading && <IconButton toolTip='Zurück' href='/dashboard' icon='/img/close-icon.png' height={30} />}
                    <h1>Woche {id + 1}</h1>
                    {!loading && <IconButton toolTip={planning ? 'Tracking Modus' : 'Bearbeiten'} onClick={() => setPlanning(!planning)} icon={`/img/${planning ? 'ok' : 'edit'}-icon.png`} height={30} />}
                </div>
                {!userDoc ? <Loading centered size='100px' /> :
                    <div>
                        <h2>Tages-Ansicht</h2>
                        <WeekTable weekParam={userDoc.weeks[id]} userID={user?.uid} activities={userDoc.activities} dbFieldName='weeks' onSave={onSave} isPlanning={planning} />
                        <h2 className={styles.h2} onClick={() => setShowTotal(!showTotal)}>
                            Total <img height={25} src={!showTotal ? '/img/expander-down.png' : '/img/expander-right.png'}/>
                        </h2>

                        {totalActivities && showTotal &&
                            <div>
                                <div className={styles['total-activities']}>
                                    {Object.keys(totalActivities).map((name: any) => (
                                        <p key={name}>
                                            {name}: <span className={Number(totalActivities[name].actualAmount) >= Number(totalActivities[name].plannedAmount) ? styles.good : styles.bad}>{totalActivities[name].actualAmount}</span>/{totalActivities[name].plannedAmount}{totalActivities[name].unit}
                                        </p>
                                    ))}
                                </div>
                                {!userDoc?.weeks[id]?.finished &&
                                    <div className={styles['finish-button']}>
                                        <Button onClick={() => finishWeek()} big green>Woche abschliessen</Button>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                }

            </div>
        </div>
    );
};
