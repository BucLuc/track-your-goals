import styles from './WeekTable.module.css'
import { units, IWeek, weekDays, Activity } from '@config/config'
import { useState, useEffect, useRef } from 'react';
import { updateField } from '@services/firebaseService'
import Loading from '@components/Loading/Loading'
import IconButton from '@components/IconButton/IconButton';

interface TableProps {
    weekParam: IWeek;
    activities?: Activity[];
    userID?: string;
    dbFieldName: string;
    isLoading?: boolean;
    onSave?: (activities: Activity[], day: string) => void;
    isPlanning?: boolean;
    showTotal?: boolean;
}


const WeekTable: React.FC<TableProps> = ({ weekParam, activities, userID, dbFieldName, isLoading, onSave, isPlanning, showTotal }) => {
    const [week, setWeek] = useState<IWeek>();
    const [currentDay, setCurrentDay] = useState(weekDays[0])
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (weekParam) {
            setWeek(weekParam);
        }
    }, [weekParam]);

    function handleDropDown(index: number, value: string, plannedAmount: any, actualAmount: any) {
        if (!activities || !week) return

        const newActivity = activities.find(activity => activity.name === value)
        if (!newActivity) return

        newActivity.plannedAmount = plannedAmount
        newActivity.actualAmount = actualAmount
        const updatedActivities = week[currentDay].map((activity, idx) => {
            if (idx === index) {
                return newActivity;
            }
            return activity;
        });
        setWeek({ ...week, [currentDay]: updatedActivities });
        saveToDB(updatedActivities)
    }

    const handleAdd = () => {
        if (!activities || activities.length === 0) {
            alert('Du hast noch keine Aktivitäten hinterlegt')
            return
        }

        const newActivity = activities[0]
        newActivity.plannedAmount = 0
        newActivity.actualAmount = 0

        setWeek((prevTemplate = {}) => ({
            ...prevTemplate,
            [currentDay]: [
                ...(prevTemplate[currentDay] ?? []), newActivity
            ]
        }))
    }

    const handleDelete = (index: number) => {
        if (!week) return
        const updatedActivities = week[currentDay].filter((_, idx) => idx !== index)

        setWeek((prevTemplate = {}) => ({
            ...prevTemplate,
            [currentDay]: updatedActivities
        }))

        saveToDB(updatedActivities)
    }

    const handleInputSubmit = (index: number, newValue: string) => {
        const newActivities = handleChange(index, isPlanning ? 'plannedAmount' : 'actualAmount', newValue);
        if (newActivities) {
            saveToDB(newActivities)
        }
    }

    function handleChange(index: number, key: string, newValue: string) {
        if (week) {
            const updatedActivities = week[currentDay].map((activity, idx) => {
                if (idx === index) {
                    return { ...activity, [key]: newValue };
                }
                return activity;
            });
            setWeek({ ...week, [currentDay]: updatedActivities });
            return updatedActivities
        }
    }

    const saveToDB = async (newActivities: Activity[]) => {
        if (onSave) {
            onSave(newActivities, currentDay)
        } else updateField(`users/${userID}`, `${dbFieldName}.${currentDay}`, newActivities)
    }

    const onInputFocus = (event: any) => {
        const target = event.currentTarget;

        target.type = 'text';
        target.setSelectionRange(0, target.value.length);
        target.type = 'number';
    }

    return (
        <div className={styles.container}>
            <div className={styles['week-days']}>
                {weekDays.map((day: any, index: any) => (
                    <div key={index} className={`${styles.day} ${day === currentDay ? styles['current-day'] : ''}`} onClick={() => setCurrentDay(day)}>
                        {day.slice(0, 2)}
                    </div>
                ))}
                {showTotal &&
                    <div className={`${styles.day} ${'Total' === currentDay ? styles['current-day'] : ''}`} onClick={() => setCurrentDay('Total')}>
                        To
                    </div>}
            </div>
            <div className={styles.table}>
                <div className={styles['table-header']}>
                    <p>Aktivität</p>
                    <p>Menge</p>
                </div>
                <div className={styles['table-body']}>
                    {isLoading ? <Loading centered /> : <div>
                        {week && week[currentDay] && week[currentDay].map((activity: Activity, index: number) => (
                            <div key={index} className={styles['table-row']}>
                                <select value={activity.name} className={styles['dropdown']} onChange={(e) => handleDropDown(index, e.target.value, activity.plannedAmount, activity.actualAmount)}>
                                    {activities?.map((act, index) => (
                                        <option key={index} value={act.name}>
                                            {act.name}
                                        </option>
                                    ))}
                                </select>
                                <div className={styles['input-container']}>
                                    <input type="number" placeholder='0' onFocus={onInputFocus} ref={el => inputRefs.current[index] = el} value={isPlanning ? activity.plannedAmount : activity.actualAmount} className={`${styles['input']} ${!isPlanning ? activity.actualAmount && activity.plannedAmount && Number(activity.actualAmount) >= Number(activity.plannedAmount) ? styles.good : styles.bad : ''}`} onChange={(e) => handleChange(index, isPlanning ? 'plannedAmount' : 'actualAmount', e.target.value)} onBlur={(e) => handleInputSubmit(index, e.target.value)} />
                                    <p onClick={() => inputRefs.current[index]?.focus()}>{!isPlanning ? '/' + activity.plannedAmount : ''}{activity.unit ? units[activity.unit].abbreviation : ""}</p>
                                </div>
                                <span className={styles['delete-button']}><IconButton onClick={() => handleDelete(index)} icon='/img/eraser-icon.png' height={20} padding='5px' danger /></span>
                            </div>
                        ))}
                        {isPlanning &&
                            <div className={`${styles['table-row']} ${styles['add-element']}`} onClick={() => handleAdd()}>
                                <p>Aktivität hinzufügen</p>
                                <p>{units[""].displayName}</p>
                            </div>
                        }
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default WeekTable