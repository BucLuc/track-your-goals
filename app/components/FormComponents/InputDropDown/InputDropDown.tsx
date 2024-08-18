'use client'
import styles from './InputDropDown.module.css'

import { useState, useEffect, useRef } from 'react';

interface Props {
    valuesParam?: string[];
    valueParam?: string;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
}

const InputDropDown: React.FC<Props> = ({ valueParam, valuesParam, onChange, onSubmit }) => {
    const [values, setValues] = useState<string[]>()
    const [currentValue, setCurrentValue] = useState('')
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setValues(valuesParam)
        setCurrentValue(valueParam ?? '')
    }, [valueParam, valuesParam])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setCurrentValue(value)
        if (onChange) onChange(value);

        setValues(value === '' ? valuesParam : valuesParam?.filter((v) => v.toLowerCase().startsWith(value.toLowerCase())))
    }

    const handleDropdownChange = (index: number) => {
        if (values) {
            setCurrentValue(values[index])
        }
    }

    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTimeout(() => {
            setDropdownVisible(false);
            if (onSubmit) onSubmit(e.target.value)
            if (onChange) onChange(e.target.value)
            
        }, 100);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setDropdownVisible(false);
            if (onSubmit) onSubmit(currentValue);
            if (inputRef.current) {
                inputRef.current.blur();
            }
        }
        if (e.key === 'Escape') {
            setDropdownVisible(false);
            if (inputRef.current) {
                inputRef.current.blur();
            }
        }
    }

    return (
        <div className={styles.container}>
            <input value={currentValue} placeholder='Eingeben..'
            ref={inputRef}
            className={styles.input} 
            onChange={(e) => handleInputChange(e)}
            onFocus={() => setDropdownVisible(true)}
            onBlur={(e) => handleBlur(e)}
            onKeyDown={handleKeyDown}    
           />
            {isDropdownVisible && values && values.length > 0 && (
                <div className={styles.values}>
                    {values?.map((value, index) => (
                        <p key={index} onClick={() => handleDropdownChange(index)} className={styles.value}>{value}</p>
                    ))}
                </div>
            )}

        </div>
    )
}

export default InputDropDown;