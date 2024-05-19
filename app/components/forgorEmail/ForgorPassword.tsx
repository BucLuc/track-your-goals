import styles from './ForgorPassword.module.css'
import { auth } from '@services/firebaseService';
import { useState, useEffect } from 'react';
import Input from '@components/FormComponents/Inputs/Input';
import {sendPasswordResetEmail} from 'firebase/auth'

interface Props {
    emailParam?: string;
    onBack?: () => void;
}

const ForgorPassword: React.FC<Props>  = ({emailParam, onBack}) => {
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (emailParam) {
            setEmail(emailParam)
        }
    }, [emailParam])

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setEmail(value)
    };

    const onReset = () => {
        sendPasswordResetEmail(auth, email)
        if (onBack) onBack()
    }

    return (
        <div className={styles.container}>
            <h3>Passwort vergessen?</h3>
            <Input id='email' label='Email' value={email} onChange={(e: void) => handleInputChange(e)} />
            <div className={styles.links}>
                <a className={styles.back} href='#' onClick={onBack}>Zurück</a>
                <a className={styles.reset} href='#' onClick={onReset}>Passwort zurücksetzen</a>
            </div>
        </div>
    )
}

export default ForgorPassword;