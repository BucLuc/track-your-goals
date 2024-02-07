'use client'
import Button from '../../FormComponents/Button';
import Input from '../../FormComponents/Input';
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
                    <div className={styles['input-fields']}>
                    {variant === 'REGISTER' && <Input id='name' label='Name' value={formData.name} onChange={(e:void) => handleInputChange(e)} />}
                    <Input type='email' id='email' label='Email' onChange={(e:void) => handleInputChange(e)} />
                    <Input type='password' id='password' label='Passwort' onChange={(e:void) => handleInputChange(e)} />
                    </div>
                    <Button type='submit' fullwidth>Submit</Button>
                    <div onClick={toggleVariant}>
                        {variant === 'LOGIN' ? 'Create an Account' : 'Login'}
                    </div>
                </form>
            </div>
        </div>
    )
}