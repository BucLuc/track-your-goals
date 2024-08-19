'use client'
import { useAuthState, useUpdateProfile, useSignInWithGoogle, useSignInWithGithub } from 'react-firebase-hooks/auth'
import styles from './AuthForm.module.css'

import Button from '@components/FormComponents/Buttons/Button';
import Input from '@components/FormComponents/Inputs/Input';
import AuthSocialButton from '@components/FormComponents/SocialButtons/AuthSocialButton';


import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { auth, checkForUserDetailOrCreate } from '@services/firebaseService'
import { sendEmailVerification, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import VerifyEmail from '@components/VerifyEmail/VerifyEmail';
import ForgorPassword from '../../forgorEmail/ForgorPassword';

type Variant = 'LOGIN' | 'REGISTER';

export default function AuthForm() {
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            if (user.emailVerified) {
                router.push('/dashboard')
            }
        }
    }, [user, loading, router]);

    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [formData, setFormData] = useState({ name: '', email: '', password: '' })
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [forgorPassword, setForgorPassword] = useState(false)

    const [signInUserWithGoogleAccount] = useSignInWithGoogle(auth);
    const [signInUserWithGithubAccount] = useSignInWithGithub(auth);
    const [updateProfile] = useUpdateProfile(auth);

    const toggleVariant = () => {
        setVariant(variant === 'LOGIN' ? 'REGISTER' : 'LOGIN')
    };

    const handleSocialAction = async (socialType: string) => {
        try {
            let res;
            if (socialType === 'Google') {
                res = await signInUserWithGoogleAccount()
            } else {
                res = await signInUserWithGithubAccount()
            }

            if (res) {
                checkForUserDetailOrCreate(res)
            }

        } catch (e) {
            console.error(e)
        }
    }

    const onSubmit = async (event: any) => {
        event.preventDefault();
        const foundErrors = validateForm()
        if (!foundErrors.email && !foundErrors.password){
            try {
                let res;
                if (variant === 'REGISTER') {
                    res = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
                    if (formData.name) {
                        const newRes = await updateProfile({ displayName: formData.name })
                    }
                    if (res) sendEmailVerification(res.user)
    
                } else {
                    res = await signInWithEmailAndPassword(auth, formData.email, formData.password)
                }
                if (res) {
                    checkForUserDetailOrCreate(res)
                }
                setFormData({ name: '', email: '', password: '' })
            } catch (e: any) {
                handleError(e);
            }
        }
    }

    const handleError = (error: any) => {
        setErrors({email: '', password: ''})
        console.log(error.code)
        switch (error.code) {
            case 'auth/email-already-in-use':
                setErrors(prevErrors => ({ ...prevErrors, email: 'Email wird bereits verwendet' }));
                break;
            case 'auth/invalid-email':
                setErrors(prevErrors => ({ ...prevErrors, email: 'Ungültiges Format' }));
                break;
            case 'auth/user-not-found':
                setErrors(prevErrors => ({ ...prevErrors, email: 'Benutzer gibt es nicht' }));
                break;
            case 'auth/wrong-password':
                setErrors(prevErrors => ({ ...prevErrors, password: 'Falsches Passwort' }));
                break;
            case 'auth/weak-password':
                setErrors(prevErrors => ({ ...prevErrors, password: 'Passwort muss mindestens 6 Zeichen haben' }));
                break;
            case 'auth/invalid-credential':
                setErrors(prevErrors => ({ ...prevErrors, email: 'Falsches Email oder Passwort' }));
                break;
            default:
                setErrors(prevErrors => ({ ...prevErrors, email: 'An unknown error occurred' }));
        }
    };
 
    const validateForm = () => {
        setErrors({email: '', password: ''})
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let validated = { ...errors };

        validated.email = emailRegex.test(formData.email) ? '' : 'Ungültiges Format';
        validated.password = formData.password.length < 6 ? 'Passwort muss mindestens 6 Zeichen haben' : '';

        setErrors(validated)
        return validated
    }

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    return (
        <div className={styles['form-container']}>
            <div className={styles['form-content']}>
                {!user && !forgorPassword &&
                    <form onSubmit={onSubmit}>

                        <div className={styles['input-fields']}>
                            {variant === 'REGISTER' && <Input id='name' label='Name' value={formData.name} onChange={(e: void) => handleInputChange(e)} />}
                            <Input type='email' id='email' label='Email' value={formData.email} onChange={(e: void) => handleInputChange(e)} errorMessage={errors.email}/>
                            <Input type='password' id='password' label='Passwort' value={formData.password} onChange={(e: void) => handleInputChange(e)} errorMessage={errors.password}/>
                        </div>
                        <Button type='submit' fullwidth>{variant === 'LOGIN' ? 'Anmelden' : 'Registrieren'}</Button>
                        <span className={styles.seperator}>
                            or
                        </span>
                        <div className={styles['social-buttons']}>
                            <AuthSocialButton onClick={() => handleSocialAction('Google')} icon={'/img/google-icon.png'} text='Continue with Google' />
                            <AuthSocialButton onClick={() => handleSocialAction('Github')} icon={'/img/github-icon.png'} text='Continue with Github' style='black' />
                        </div>
                        <div className={styles['account-options']}>
                            <div className={styles['toggle-section']}>
                                <div>
                                    {variant === 'LOGIN' ? 'Du hast noch keinen Account?' : 'Du hast bereits einen Account?'}
                                </div>
                                <a href='#' onClick={toggleVariant}>
                                    {variant === 'LOGIN' ? ' Erstelle einen' : ' Login'}
                                </a>
                            </div>
                            <a href='#' onClick={(e) => setForgorPassword(true)}>Passwort vergessen?</a>
                        </div>
                    </form>
                }
                {user && !user.emailVerified && <VerifyEmail user={user} />}
                {forgorPassword && <ForgorPassword emailParam={formData.email} onBack={() => setForgorPassword(false)}/>}
            </div>
        </div>
    )
}