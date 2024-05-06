'use client'
import { BsGithub, BsGoogle } from 'react-icons/bs';
import {useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth'
import styles from './AuthForm.module.css'

import Button from '@components/FormComponents/Buttons/Button';
import Input from '@components/FormComponents/Inputs/Input';
import AuthSocialButton from '@components/FormComponents/SocialButtons/AuthSocialButton';


import { useState } from "react";
import {auth} from '@/app/services/firebaseService'

type Variant = 'LOGIN' | 'REGISTER';

export default function AuthForm() {
    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
    const [signInUserWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

    const toggleVariant = () => {
        setVariant(variant === 'LOGIN' ? 'REGISTER' : 'LOGIN')
    };

    const handleSocialAction = (socialType: string) => {
        if (socialType === 'Google'){
            
        }

        if (socialType === 'Github'){
            
        }
    }

    const onSubmit = async(event: any) => {
        event.preventDefault();
        if (variant === 'REGISTER') {
            try {
                const res = await createUserWithEmailAndPassword(formData.email, formData.password)
                console.log(res)

                setFormData({name: '', email: '', password: ''})
            } catch(e){
                console.error(e)
            }
        } else {
            try {
                const res = await signInUserWithEmailAndPassword(formData.email, formData.password)
                console.log(res)

                setFormData({name: '', email: '', password: ''})
            } catch(e){
                console.error(e)
            }
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
                    {variant === 'REGISTER' && <Input id='name' label='Name' value={formData.name} onChange={(e:void) => handleInputChange(e)} />}
                    <Input type='email' id='email' label='Email' value={formData.email} onChange={(e:void) => handleInputChange(e)} />
                    <Input type='password' id='password' label='Passwort' value={formData.password} onChange={(e:void) => handleInputChange(e)} />
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