import { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import styles from './VerifyEmail.module.css'
import { sendEmailVerification, User } from 'firebase/auth';

interface Props {
    user: User;
}

const VerifyEmail: React.FC<Props> = ({ user }) => {

    const router = useRouter();

    const handleSendAgain = async () => {
        try {
            await sendEmailVerification(user);
            alert('Eine Bestätigungs-E-Mail wurde erneut gesendet.');
        } catch (error) {
            console.error('Fehler beim Senden der Bestätigungs-E-Mail:', error);
            alert('Fehler beim erneuten Senden der Bestätigungs-E-Mail.');
        }
    };

    const checkIfEmailVerified = async () => {
        await user.reload();
        if (user.emailVerified) {
            router.push('/dashboard')
        }
    };

    useEffect(() => {
        const intervalId = setInterval(checkIfEmailVerified, 2000);

        return () => clearInterval(intervalId);
    }, [user]);

    return (
        <div className={styles.container}>
            <img alt='verify Email Icon' src='/img/verify-email-icon.png' />
            <h3>Email Adresse Bestätigen</h3>
            <p>Wir haben dir gerade eine Bestätigungs-E-Mail an die Adresse <strong>{user.email ?? ''}</strong> gesendet. Bitte klicken Sie auf den Link in der E-Mail und laden Sie anschließend diese Seite neu.</p>
            <div className={styles.links}>
                <a className={styles.sendagain} onClick={handleSendAgain} href='#'>Erneut senden</a>
                <a className={styles.logout} onClick={() => router.push('/dashboard')} href='/dashboard'>Später</a>
            </div>
        </div>
    )
}

export default VerifyEmail;