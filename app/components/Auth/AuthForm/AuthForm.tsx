'use client'
import styles from './AuthForm.module.css'

import { useState } from "react";

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

    const onSubmit = (event: any) => {
        event.preventDefault();
        if (variant === 'REGISTER') {

        } else {

        }
        console.log(formData)
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
                    {variant === 'REGISTER' && <input id="name" placeholder="Name" name="name" value={formData.name} onChange={handleInputChange} />}
                    <input type='email' id="email" placeholder="Email" name="email" value={formData.email} onChange={handleInputChange} />
                    <input type='password' id="password" placeholder="Passwort" name="password" value={formData.password} onChange={handleInputChange} />
                    <button type='submit'>Submit</button>
                    <div onClick={toggleVariant}>
                        {variant === 'LOGIN' ? 'Create an Account' : 'Login'}
                    </div>
                </form>
            </div>
        </div>
    )
}