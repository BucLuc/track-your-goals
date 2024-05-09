import styles from './ActivityTable.module.css'
import { units, Activity } from '@config/config'
import { useState, useEffect } from 'react';
import {updateField} from '@services/firebaseService'

interface TableProps {
    activitiesParam?: Activity[];
    userID?: string;
}

const ActivityTable: React.FC<TableProps> = ({ activitiesParam, userID }) => {

    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        if (activitiesParam) {
            setActivities(activitiesParam);
        }
    }, [activitiesParam]);

    const handleInputSubmit = (index: number, newValue: string) => {
        const newActivities = handleChange(index, 'name', newValue);
        saveToDB(newActivities)
    }

    const handleDropdownChange = (index: number, newValue: string) => {
        const newActivities = handleChange(index, 'unit', newValue);
        saveToDB(newActivities)
    };

    const handleChange = (index: number, key: string, newValue: string) => {
        const updatedActivities = activities?.map((activity, i) => {
            if (i === index) {
                return { ...activity, [key]: newValue };
            }
            return activity;
        });
        setActivities(updatedActivities);
        return updatedActivities
    };

    const handleRemoveActivity = (index: number) => {
        const newActivities = activities?.filter((_, i) => i!==index);
        setActivities(newActivities)
        saveToDB(newActivities)
    }

    const saveToDB = async(newActivities: Activity[]) => {
        updateField(`users/${userID}`, 'activities', newActivities)
    }

    return (
        <div className={styles.table}>
            <div className={styles['table-header']}>
                <p>Name</p>
                <p>Einheit</p>
            </div>
            <div className={styles['table-body']}>
                {activities && activities.map((activity: Activity, index: any) => (
                    <div key={index} className={styles['table-row']}>
                        <input type="text" placeholder='Eingeben..' value={activity.name} className={styles['input']} onChange={(e) => handleChange(index, 'name', e.target.value)} onBlur={(e) => handleInputSubmit(index, e.target.value)} />
                        <select value={activity.unit} className={styles['dropdown']} onChange={(e) => handleDropdownChange(index, e.target.value)}>
                            {Object.keys(units).map((unitKey) => (
                                <option key={unitKey} value={unitKey}>
                                    {units[unitKey].displayName}
                                </option>
                            ))}
                        </select>
                        <span className={styles['delete-button']} onClick={() => handleRemoveActivity(index)}><img alt='delete-icon' src='img/eraser-icon.png' width={25}/></span>
                    </div>
                ))}
                    <div className={`${styles['table-row']} ${styles['add-element']}`} onClick={() => setActivities(prevActivities => [...prevActivities, { name: "", unit: "" }])}>
                        <p>Aktivität hinzufügen</p>
                        <p>{units[""].displayName}</p>
                    </div>
            </div>
        </div>
    )
}

export default ActivityTable