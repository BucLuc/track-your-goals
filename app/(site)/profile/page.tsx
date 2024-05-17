'use client'

import styles from './profile.module.css'

import { useEffect, useState } from 'react';
import { useAuthState, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '@/app/services/firebaseService'
import { useRouter } from 'next/navigation'
import { getDocument, updateField } from '@services/firebaseService'
import { updateEmail, updateProfile, updatePassword, sendEmailVerification } from 'firebase/auth';

import Navbar from '@components/Navbar/Navbar';
import { AvatarToImageURL } from '@services/helperService'
import Input from '@components/FormComponents/Inputs/Input';
import Button from '@components/FormComponents/Buttons/Button';

export default function Profile() {
    const [user, loading, error] = useAuthState(auth);
    const [loadingDoc, setLoadingDoc] = useState(true)
    const [userDoc, setUserDoc] = useState<any>({})
    const router = useRouter();

    const avatars: string[] = ["default", "man", "woman", "bear", "cat", "dog", "panda"];
    const [currentAvatar, setCurrentAvatar] = useState('')

    const [sentEmail, setSentEmail] = useState(false)

    const [initialData, setInitialData] = useState({ name: '', email: '' })
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', oldPassword: '' })
    const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '', oldPassword: '' })
    const [canEdit, setCanEdit] = useState(false)
    const [validate, setValidate] = useState(false)

    const [signInUserWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            getDocument('users', user.uid)
                .then(doc => {
                    setUserDoc(doc)
                    setLoadingDoc(false)

                    if (doc.photoURL) {
                        avatars.forEach(avatar => {
                            if (doc.photoURL.includes(avatar)) {
                                setCurrentAvatar(avatar)
                            }
                        });
                    } else setCurrentAvatar(user.photoURL ?? 'default');

                    const fetchedFormData = { name: doc.name ?? user.displayName ?? '', email: doc.email ?? user.email, password: '', confirmPassword: '', oldPassword: '' }
                    setFormData(fetchedFormData)
                    setInitialData({ name: fetchedFormData.name, email: fetchedFormData.email })

                    setCanEdit(user.providerData[0].providerId === 'password')

                })
                .catch(err => {
                    console.error(err)
                })
        }
    }, [user, loading, router]);

    const setAvatar = (avatar: string) => {
        setCurrentAvatar(avatar)

        updateField(`/users/${user?.uid}`, 'photoURL', avatars.includes(avatar) ? AvatarToImageURL(avatar) : avatar)
    }

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
        validate && validateForm()
    };

    const validateForm = () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let validated = errors

        if (formData.email !== initialData.email && canEdit) {
            validated.email = emailRegex.test(formData.email) ? '' : 'ungültiges Format';
        }

        if (formData.name !== initialData.name) {
            validated.name = formData.name.length < 3 ? 'Name muss mindestens 3 Zeichen haben' : formData.name.length > 30 ? 'Name darf nicht mehr als 30 Zeichen haben' : ''
        }
        if (formData.password !== '') {
            validated.password = formData.password.length < 6 ? 'Passwort muss mindestens 6 Zeichen haben' : '';
        }
        if (formData.confirmPassword !== '') {
            validated.confirmPassword = formData.password === formData.confirmPassword ? '' : 'Passwörter stimmen nicht überein'
        }

        setErrors(validated)
    }

    const onSave = async () => {
        !validate && setValidate(true)
        validateForm()
        if (user) {
            try {
                if (!errors.name && canEdit && formData.email !== initialData.email) {
                    updateField(`/users/${user.uid}`, 'email', formData.email)
                    await updateEmail(user, formData.email)
                }
                if (!errors.email && formData.name !== initialData.name) {
                    updateField(`/users/${user.uid}`, 'displayName', formData.name)
                    await updateProfile(user, { displayName: formData.name })
                }
                if (!errors.password && formData.password.length > 0 && formData.password == formData.confirmPassword) {
                    try {
                        await signInUserWithEmailAndPassword(initialData.email, formData.oldPassword)
                        await updatePassword(user, formData.password)
                    } catch (e) {
                        let newErros = errors
                        newErros.oldPassword = 'Passwort stimmt nicht'
                    }
                }

            } catch (error) {
                console.error(error);
            }
        }
    }

    const sendVerificationEmail = async() => {
        if (user){
            try {
                sendEmailVerification(user)
                setSentEmail(true)
            } catch (e) {
                console.error(e)
            }
        } 
    }

    return (
        <div>
            <Navbar user={user} photoURL={avatars.includes(currentAvatar) ? AvatarToImageURL(currentAvatar) : currentAvatar} />
            <div className={styles['body-container']}>
                <h1>Dein Profil</h1>
                <div className={styles.avatars}>
                    {user && avatars.map((avatar, index) => (
                        <div key={index} onClick={() => setAvatar(avatar)} className={`${styles.avatar} ${avatar === currentAvatar ? styles.current : ''}`}>
                            <img alt={avatar} src={AvatarToImageURL(avatar)} />
                        </div>
                    ))}
                    {user?.photoURL &&
                        <div onClick={() => setAvatar(user?.photoURL ? user.photoURL : '')} className={`${styles.avatar} ${user?.photoURL === currentAvatar ? styles.current : ''}`}>
                            <img alt='user-img' src={user?.photoURL} />
                        </div>
                    }
                </div>
                <h2>Deine Angaben</h2>
                <div className={styles['email-verified']}>
                    {user && <h3 className={!user?.emailVerified && !sentEmail ? styles.bad : styles.good}>{sentEmail && <span>Bestätigungs-Mail gesendet</span>} {!sentEmail ? user?.emailVerified && !sentEmail ? 'Email-Adresse bestätigt' : 'Email-Adresse nicht bestätigt, ' : ''} {!user?.emailVerified && !sentEmail && <span className={styles.send} onClick={() => sendVerificationEmail()}>Bestätigungsmail senden </span>}</h3>}
                </div>
                <div className={styles['infos-container']}>
                    <div className={styles['name-email']}>
                        <Input type='email' id='email' label='Email' value={formData.email} onChange={(e: void) => handleInputChange(e)} errorMessage={errors.email} onBlur={(e: void) => handleInputChange(e)} disabled={!canEdit}/>
                        <Input type='text' id='name' label='Name' value={formData.name} onChange={(e: void) => handleInputChange(e)} errorMessage={errors.name} onBlur={(e: void) => handleInputChange(e)} />
                    </div>
                    <Input type='password' id='oldPassword' label='Altes Passwort' value={formData.oldPassword} onChange={(e: void) => handleInputChange(e)} errorMessage={errors.oldPassword} onBlur={(e: void) => handleInputChange(e)} disabled={!canEdit}/>
                    <div></div>
                    <Input type='password' id='password' label='Neues Passwort' value={formData.password} onChange={(e: void) => handleInputChange(e)} errorMessage={errors.password} onBlur={(e: void) => handleInputChange(e)} disabled={!canEdit}/>
                    <Input type='password' id='confirmPassword' label='Passwort Bestätigen' value={formData.confirmPassword} onChange={(e: void) => handleInputChange(e)} errorMessage={errors.confirmPassword} onBlur={(e: void) => handleInputChange(e)} disabled={!canEdit}/>
                </div>
                <div className={styles['button-container']}>
                    <Button green onClick={() => onSave()}>Speichern</Button>
                </div>
            </div>
        </div>
    )
}