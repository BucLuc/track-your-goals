import styles from './TextArea.module.css'

interface Props {
    value?: string;
    placeholder?: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
}

const TextArea: React.FC<Props> = ({
    value,
    placeholder,
    onChange,
    onSubmit
}) => {

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const handleBlur = () => {
        onSubmit();
    };

    return (
        <div className={styles['notes-container']}>
            <textarea
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                className={styles['notes-textarea']}
            />
        </div>
    )
}

export default TextArea;