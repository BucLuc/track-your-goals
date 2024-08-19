'use client'

import styles from './week.module.css'

import { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, updateField, getDocument } from '@services/firebaseService'
import { GetActivitySummary } from '@services/helperService'
import { useRouter } from 'next/navigation'
import Navbar from '@components/Navbar/Navbar';
import WeekTable from '@components/Tables/WeekTable/WeekTable';
import Loading from '@components/Loading/Loading';
import { Activity } from '@config/config';
import Button from '@components/FormComponents/Buttons/Button';
import TextArea from '@components/FormComponents/TextArea/TextArea';

export default function Week({ params, }: { params: { id: string } }) {
    const [user, loading, error] = useAuthState(auth);
    const [userDoc, setUserDoc] = useState<any>()
    const [totalActivities, setTotalActivities] = useState<any>([])
    const [planning, setPlanning] = useState(true)
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [id, setID] = useState(0)
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(1)
    const [notes, setNotes] = useState('')

    const dateRef = useRef<HTMLInputElement>(null);

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
                        updatedWeeks[id].startDate = new Date().toISOString().split('T')[0].split('-').reverse().join('.');
                        doc.weeks = updatedWeeks

                        updateField(`users/${user.uid}`, 'weeks', updatedWeeks)
                    } else {
                        setPlanning(false)
                        if (doc.weeks[id].startDate) {
                            setStartDate(doc.weeks[id].startDate.split('.').reverse().join('-') ?? new Date().toISOString().split('T')[0])
                        }
                        setNotes(doc.weeks[id].notes ?? '')
                    }
                    setUserDoc(doc)
                    onTotalChange(doc)
                })
                .catch(err => {
                    console.error(err)
                })
        }
    }, [user, loading]);

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== startDate) {
            setStartDate(event.target.value);
            const updatedWeeks = [...userDoc.weeks];
            updatedWeeks[id].startDate = event.target.value.split('-').reverse().join('.');

            updateField(`users/${user?.uid}`, 'weeks', updatedWeeks)
        }
    };

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

    const saveNotes = () => {
        const updatedWeeks = [...userDoc.weeks];
        updatedWeeks[id].notes = notes
        updateField(`users/${user?.uid}`, 'weeks', updatedWeeks)
    }

    return (
        <div>
            <Navbar user={user} photoURL={userDoc?.photoURL} />
            <div className={styles['body-container']}>
                <div className={styles.title}>
                    <h1>Woche {id + 1} {userDoc && <span className={styles.date}> -
                        <input
                            type="date"
                            ref={dateRef}
                            value={startDate}
                            onChange={handleDateChange}
                            onClick={() => dateRef.current?.showPicker()}
                            className={styles['date-input']}
                        />
                    </span>}</h1>
                </div>
                {!userDoc ? <Loading centered size='100px' /> :
                    <div>
                        <div className={styles.tabs}>
                            {!planning && <h2 className={`${activeTab === 0 ? styles.active : ''}`} onClick={() => setActiveTab(0)}>Total</h2>}
                            <h2 className={`${activeTab === 1 && !planning ? styles.active : ''}`} onClick={() => setActiveTab(1)}>{!planning ? 'Tages-Ansicht' : 'Woche Planen'}</h2>
                            {!planning && <h2 className={`${activeTab === 2 ? styles.active : ''}`} onClick={() => setActiveTab(2)}>Journal</h2>}
                        </div>
                        {activeTab === 1 &&
                            <div className={styles.weektable}>
                                <WeekTable weekParam={userDoc.weeks[id]} userID={user?.uid} activitiesParam={userDoc.activities} dbFieldName='weeks' onSave={onSave} isPlanning={planning} />
                            </div>
                        }
                        {totalActivities && activeTab === 0 &&
                            <div>
                                <div className={styles['total-activities']}>
                                    {Object.keys(totalActivities).map((name: any) => (
                                        <p key={name}>
                                            <span className={styles['activity-name']}>{name}</span>: <span className={Number(totalActivities[name].actualAmount) >= Number(totalActivities[name].plannedAmount) ? styles.good : styles.bad}>{totalActivities[name].actualAmount}</span>/{totalActivities[name].plannedAmount}{totalActivities[name].unit}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        }
                        {activeTab === 2 &&
                            <div className={styles.journal}>
                                <TextArea value={notes} onChange={setNotes} onSubmit={saveNotes} placeholder='Notizen zu dieser Woche..'/>
                            </div>
                        }
                    </div>
                }
                <div className={styles['edit-button']}>
                    {activeTab === 1 && <Button green={planning} fullwidth onClick={() => setPlanning(!planning)}>{planning ? 'Woche starten' : 'Planung Ändern'}</Button>}
                </div>
            </div>
        </div>
    );
};
