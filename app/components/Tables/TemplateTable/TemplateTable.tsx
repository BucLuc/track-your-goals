import styles from './TemplateTable.module.css'
import { units, ITemplate, weekDays, Activity } from '@config/config'
import { useState, useEffect } from 'react';
import { updateField } from '@services/firebaseService'

interface TableProps {
    templateParam: ITemplate;
    activities?: Activity[];
    userID?: string;
}


const TemplateTable: React.FC<TableProps> = ({ templateParam, activities, userID }) => {
    const [template, setTemplate] = useState<ITemplate>();
    const [currentDay, setCurrentDay] = useState(weekDays[0])

    useEffect(() => {
        if (templateParam) {
            setTemplate(templateParam);
        }
    }, [templateParam]);
    

    function handleDropDown(index: number, value: string, amount: any) {
        if (!activities || !template) return

        const newActivity = activities.find(activity => activity.name === value)
        if (!newActivity) return

        newActivity.amount = amount
        const updatedActivities = template[currentDay].map((activity, idx) => {
            if (idx === index) {
                return newActivity;
            }
            return activity;
        });
        setTemplate({ ...template, [currentDay]: updatedActivities });
        saveToDB(updatedActivities)
    }

    const handleAdd = () => {
        if (!activities) return

        const newActivity = activities[0]
        newActivity.amount = 0
        
        setTemplate((prevTemplate = {}) => ({
            ...prevTemplate,
            [currentDay]: [
                ...(prevTemplate[currentDay] ?? []), newActivity
            ]
        }))
    }

    const handleDelete = (index: number) => {
        if (!template) return
        const updatedActivities = template[currentDay].filter((_, idx) => idx !== index)

        setTemplate((prevTemplate = {}) => ({
            ...prevTemplate,
            [currentDay]: updatedActivities
        }))

        saveToDB(updatedActivities)
    }

    const handleInputSubmit = (index: number, newValue: string) => {
        const newActivities = handleChange(index, 'amount', newValue);
        if (newActivities){
            saveToDB(newActivities)
        }
    }

    function handleChange(index: number, key: string, newValue: string) {
        if (template) {
            const updatedActivities = template[currentDay].map((activity, idx) => {
                if (idx === index) {
                    return { ...activity, [key]: newValue };
                }
                return activity;
            });
            setTemplate({ ...template, [currentDay]: updatedActivities });
            return updatedActivities
        }
    }

    const saveToDB = async(newActivities: Activity[]) => {
        updateField(`users/${userID}`, `template.${currentDay}`, newActivities)
    }

    return (
        <div className={styles.container}>
            <div className={styles['week-days']}>
                {weekDays.map((day: any, index: any) => (
                    <div key={index} className={`${styles.day} ${day === currentDay ? styles['current-day'] : ''}`} onClick={() => setCurrentDay(day)}>
                        {day.slice(0, 2)}
                    </div>
                ))}
            </div>
            <div className={styles.table}>
                <div className={styles['table-header']}>
                    <p>Aktivität</p>
                    <p>Menge</p>
                </div>
                <div className={styles['table-body']}>
                    {template && template[currentDay] && template[currentDay].map((activity: Activity, index: number) => (
                        <div key={index} className={styles['table-row']}>
                            <select value={activity.name} className={styles['dropdown']} onChange={(e) => handleDropDown(index, e.target.value, activity.amount)}>
                                {activities?.map((act, index) => (
                                    <option key={index} value={act.name}>
                                        {act.name}
                                    </option>
                                ))}
                            </select>
                            <div className={styles['input-container']}>
                                <input type="number" placeholder='0' value={activity.amount} className={styles['input']} onChange={(e) => handleChange(index, 'amount', e.target.value)} onBlur={(e) => handleInputSubmit(index, e.target.value)} />
                                <p> {activity.unit ? units[activity.unit].abbreviation : ""}</p>
                            </div>
                            <span className={styles['delete-button']} onClick={() => handleDelete(index)}><img alt='delete-icon' src='img/eraser-icon.png' width={25} /></span>
                        </div>
                    ))}
                    <div className={`${styles['table-row']} ${styles['add-element']}`} onClick={() => handleAdd()}>
                        <p>Aktivität hinzufügen</p>
                        <p>{units[""].displayName}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TemplateTable