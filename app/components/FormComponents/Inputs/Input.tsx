'use client'
import styles from './Input.module.css'

import { useState } from 'react';

interface InputProps {
    label?: string;
    id: string;
    value?: string;
    errorMessage?: string;
    onChange: () => void;
    onBlur?: () => void;
    type?: string;
    required?: boolean;
    disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
    label,
    id,
    value,
    onChange,
    type,
    required,
    disabled,
    errorMessage,
    onBlur
}) => {
    const [showPassword, setShowPassword] = useState(false)
    
    return (
        <div className={styles['input-container']}>
            <label htmlFor={id}>{label}</label>
            <input id={id} name={id} value={value} required={required} onChange={onChange} onBlur={onBlur} type={type === 'password' ? showPassword ? 'text' : 'password' : type} autoComplete={id} disabled={disabled} placeholder={label} />
            <p className={styles.error}>{errorMessage ?? ''}</p>
            {type === 'password' && <img alt='show password' src={`/img/eye-${showPassword ? 'open' : 'closed'}.png`} onClick={() => setShowPassword(!showPassword)} className={styles['show-password']} />}
        </div>
    )
}

export default Input;