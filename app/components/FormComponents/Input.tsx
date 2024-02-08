'use client'
import styles from './Input.module.css'

interface InputProps {
    label: string;
    id: string;
    value?: string;
    onChange: () => void;
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
    disabled
}) => {
    return (
        <div className={styles.input}>
            <label htmlFor={id}>{label}</label>
            <input id={id} name={id} value={value} required={required} onChange={onChange} type={type} autoComplete={id} disabled={disabled} placeholder={label} />
        </div>
    )
}

export default Input;