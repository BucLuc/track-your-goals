import styles from './ActivityTable.module.css'
import { units, Activity } from '@config/config'
import { useState, useEffect, useRef } from 'react';
import { updateField } from '@services/firebaseService'
import Loading from '@components/Loading/Loading'
import IconButton from '@components/IconButton/IconButton';
import DropDown from '@/app/components/FormComponents/InputDropDown/InputDropDown';

interface TableProps {
    activitiesParam?: Activity[];
    userID?: string;
    isLoading?: boolean;
}

const ActivityTable: React.FC<TableProps> = ({ activitiesParam, userID, isLoading }) => {

    const [activities, setActivities] = useState<Activity[]>([]);
    const [isNewRowAdded, setIsNewRowAdded] = useState<boolean>(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (activitiesParam) {
            setActivities(activitiesParam);
        }
    }, [activitiesParam]);

    useEffect(() => {
        if (isNewRowAdded) {
            const lastIndex = activities.length - 1;
            if (inputRefs.current[lastIndex]) {
                inputRefs.current[lastIndex]?.focus();
            }
            setIsNewRowAdded(false);
        }
    }, [isNewRowAdded, activities]);

    const handleInputSubmit = (index: number, newValue: string) => {
        if (!activities.find(activity => activity.name === newValue && activities.indexOf(activity) !== index) || newValue === "") {
            const newActivities = handleChange(index, 'name', newValue);
            saveToDB(newActivities)
        } else alert(`Die Aktivität ${newValue} existiert bereits`)
    }

    const handleDropdownChange = (index: number, newValue: string) => {
        if (!activities.find(activity => activity.name === activities[index].name && activities.indexOf(activity) !== index)){
            const newActivities = handleChange(index, 'unit', newValue);
            if (activities[index].name !== '') saveToDB(newActivities)
        } else alert(`Die Aktivität ${activities[index].name} existiert bereits`)
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
        const newActivities = activities?.filter((_, i) => i !== index);
        setActivities(newActivities)
        saveToDB(newActivities)
    }

    const saveToDB = async (newActivities: Activity[]) => {
        updateField(`users/${userID}`, 'activities', newActivities)
    }

    const handleAddActivity = () => {
        setActivities(prevActivities => [...prevActivities, { name: "", unit: "" }]);
        setIsNewRowAdded(true);
    };

    return (
        <div className={styles.table}>
            <div className={styles['table-header']}>
                <p>Name</p>
                <p>Einheit</p>
            </div>
            <div className={styles['table-body']}>
                {isLoading ? <Loading centered/> : <div>
                    {activities && activities.map((activity: Activity, index: number) => (
                         <div key={index} className={styles['table-row']}>
                            <input
                                ref={(el) => inputRefs.current[index] = el}
                                type="text"
                                placeholder='Eingeben..'
                                value={activity.name}
                                className={styles['input']}
                                onChange={(e) => handleChange(index, 'name', e.target.value)}
                                onBlur={(e) => handleInputSubmit(index, e.target.value)}
                            />
                            <select value={activity.unit} className={styles['dropdown']} onChange={(e) => handleDropdownChange(index, e.target.value)}>
                                {Object.keys(units).map((unitKey) => (
                                    <option key={unitKey} value={unitKey}>
                                        {units[unitKey].displayName}
                                    </option>
                                ))}
                            </select>
                            <span className={styles['delete-button']}><IconButton onClick={() => handleRemoveActivity(index)} icon='/img/eraser-icon.png' height={20} padding='5px' danger/></span>
                        </div>
                    ))}
                    <div className={`${styles['table-row']} ${styles['add-element']}`} onClick={handleAddActivity}>
                        <p>Aktivität hinzufügen</p>
                        <p>{units[""].displayName}</p>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default ActivityTable
