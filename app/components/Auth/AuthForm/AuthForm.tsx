'use client'
import { BsGithub, BsGoogle } from 'react-icons/bs';
import Button from '../../FormComponents/Button';
import Input from '../../FormComponents/Input';
import AuthSocialButton from '../AuthSocialButton/AuthSocialButton';
import styles from './AuthForm.module.css'

import { useState } from "react";
import { registerWithEmailPassword, loginWithEmailPassword, loginWithGoogle, loginWithGitHub } from '@/app/services/firebaseService';

type Variant = 'LOGIN' | 'REGISTER';

export default function AuthForm() {
    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const toggleVariant = () => {
        setVariant(variant === 'LOGIN' ? 'REGISTER' : 'LOGIN')
    };

    const handleSocialAction = (socialType: string) => {
        if (socialType === 'Google'){
            loginWithGoogle()
        }

        if (socialType === 'Github'){
            loginWithGitHub()
        }
    }

    const onSubmit = (event: any) => {
        event.preventDefault();
        if (variant === 'REGISTER') {
            registerWithEmailPassword(formData.name, formData.email, formData.password)
        } else {
            loginWithEmailPassword(formData.email, formData.password)
        }
        setFormData({name: '', email: '', password: ''})
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
                    {variant === 'REGISTER' && <Input id='name' label='Name' value={formData.name} onChange={(e:void) => handleInputChange(e)} />}
                    <Input type='email' id='email' label='Email' onChange={(e:void) => handleInputChange(e)} />
                    <Input type='password' id='password' label='Passwort' onChange={(e:void) => handleInputChange(e)} />
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