import { signOut } from 'firebase/auth';
import styles from './VerifyEmail.module.css'
import { auth } from '@services/firebaseService';

interface Props {
    email?: string;
}

const VerifyEmail: React.FC<Props>  = ({email}) => {
    return (
        <div className={styles.container}>
            <img alt='verify Email Icon' src='/img/verify-email-icon.png' />
            <h3>Email Adresse Bestätigen</h3>
            <p>Wir haben dir gerade eine Bestätigungs-E-Mail an die Adresse <strong>{email ?? ''}</strong> gesendet. Bitte klicken Sie auf den Link in der E-Mail und laden Sie anschließend diese Seite neu.</p>
            <div className={styles.links}>
            <a className={styles.sendagain} href='#'>Erneut senden</a>
            <a className={styles.logout} onClick={() => signOut(auth)} href='#'>Abmelden</a>
            </div>
        </div>
    )
}

export default VerifyEmail;