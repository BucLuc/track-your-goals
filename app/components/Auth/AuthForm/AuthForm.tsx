'use client'
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { useAuthState, useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword, useUpdateProfile, useSignInWithGoogle, useSignInWithGithub } from 'react-firebase-hooks/auth'
import styles from './AuthForm.module.css'

import Button from '@components/FormComponents/Buttons/Button';
import Input from '@components/FormComponents/Inputs/Input';
import AuthSocialButton from '@components/FormComponents/SocialButtons/AuthSocialButton';


import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { auth, getDocument, setDocument, checkForUserDetailOrCreate } from '@services/firebaseService'

type Variant = 'LOGIN' | 'REGISTER';

export default function AuthForm() {
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
    const [signInUserWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
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
        try {
            let res;
            if (variant === 'REGISTER'){
                res = await createUserWithEmailAndPassword(formData.email, formData.password)
                if (formData.name) {
                    const newRes = await updateProfile({displayName: formData.name})
                    console.log(newRes)
                }
            } else {
                res = await signInUserWithEmailAndPassword(formData.email, formData.password)
            }
            if (res) {
                checkForUserDetailOrCreate(res)
            }
            setFormData({ name: '', email: '', password: '' })
        } catch (e) {
            console.error(e)
        }
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
                <form onSubmit={onSubmit}>
                    <div className={styles['input-fields']}>
                        {variant === 'REGISTER' && <Input id='name' label='Name' value={formData.name} onChange={(e: void) => handleInputChange(e)} />}
                        <Input type='email' id='email' label='Email' value={formData.email} onChange={(e: void) => handleInputChange(e)} />
                        <Input type='password' id='password' label='Passwort' value={formData.password} onChange={(e: void) => handleInputChange(e)} />
                    </div>
                    <Button type='submit' fullwidth>{variant === 'LOGIN' ? 'Login' : 'Sign in'}</Button>
                    <span className={styles.seperator}>
                        or
                    </span>
                    <div className={styles['social-buttons']}>
                        <AuthSocialButton onClick={() => handleSocialAction('Google')} icon={BsGoogle} />
                        <AuthSocialButton onClick={() => handleSocialAction('Github')} icon={BsGithub} />
                    </div>
                    <div className={styles['toggle-section']}>
                        <div>
                            {variant === 'LOGIN' ? 'Dont have an account?' : 'Already have an account?'}
                        </div>
                        <div className={styles.clickable} onClick={toggleVariant}>
                            {variant === 'LOGIN' ? ' create one!' : ' login'}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}