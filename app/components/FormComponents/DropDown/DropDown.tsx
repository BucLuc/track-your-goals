'use client'
import styles from './DropDown.module.css'

import { useState, useEffect } from 'react';

interface ButtonProps {
    valuesParam?: string[];
    onChange?: (index: number) => void;

}

const DropDown: React.FC<ButtonProps> = ({ valuesParam, onChange }) => {
    const [values, setValues] = useState<string[]>()
    const [currentValue, setCurrentValue] = useState('')

    useEffect(() => {
        if (valuesParam) {
            setValues(valuesParam)
            setCurrentValue(valuesParam[0])
        }
    }, [valuesParam])

    const handleChange = (index: number) => {
        if (values){
            setCurrentValue(values[index])
            if (onChange) onChange(index)
        }
    }

    return (
        <div className={styles.container}>
            <p>{currentValue}</p>
            <div className={styles.values}>
                {values?.map((value, index) => (
                    <p key={index} onClick={() => handleChange(index)}>{value}</p>
                ))}
            </div>
        </div>
    ) 
}

export default DropDown;