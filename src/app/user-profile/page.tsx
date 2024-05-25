'use client'
import React, { useEffect, useState } from 'react';
import { userContext } from "../contexts/AuthContext";
import { useRouter } from "next/navigation"; 
import { IoPersonCircleOutline } from "react-icons/io5";
import {Cloudinary} from "@cloudinary/url-gen";
import UploadWidget from '../components/UploadWidget';
import {AdvancedImage} from '@cloudinary/react';
import CloudinaryUploadWidget from '../components/UploadWidget';
import { thumbnail } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import Chunked from '../components/Chunked';


type UserProps = {
    nama: string;
    email: string;
    noTelp: string;
    foto: string;
    jenisKelamin: string;
    tanggalLahir: Date;
    bio: string;
}

const UserProfile: React.FC = () => {
    const [userData, setUserData] = useState<UserProps | null>(null);
    const { state } = userContext();
    const [publicId, setPublicId] = useState("");

    const [cloudName] = useState("dzjfu0tcd");
    const [uploadPreset] = useState("ml_default");
    const [uploadedFileUrl, setUploadedFileUrl] = useState('');

    const router = useRouter();

    const [isLoaded, setIsLoaded] = useState(false);
    const [isSelected, setIsSelected] = useState('MyInfo');
    const [isEdit, setIsEdit] = useState(true);

    const fetchUser = async () => {
        setIsLoaded(true);
        try {
            const response = await fetch(`http://localhost:8080/get-user-details?uid=${state.email}`, {
                headers: { 'Authorization': `Bearer ${state.authenticated}` }
            });
            if (response.ok) {
                const fetchedUser = await response.json();
                setUserData(fetchedUser as UserProps);
            } else {
                throw new Error('Failed to fetch user data: ' + response.statusText);
            }
        } catch (error) {
            console.error("Failed to retrieve user data: ", error);
        } finally {
            setIsLoaded(false);
        }
    }

    const handleInputChange = <K extends keyof UserProps>(key: K, value: UserProps[K]) => {
        setUserData(prev => ({
            ...prev,
            [key]: value,
        } as UserProps));
    };

    const handleUploadComplete = (url: React.SetStateAction<string>) => {
        setUploadedFileUrl(url);
        console.log('Uploaded file URL:', url);
    };
    

    useEffect(() => {
        fetchUser();
    }, [state.authenticated]);

    const cld = new Cloudinary({
        cloud: {
            cloudName
        }
    });

    const [uwConfig] = useState({
        cloudName,
        uploadPreset
    });

    const myImage = cld.image(publicId).resize(thumbnail().width(300).height(300));

    const renderMyInfo = () => {
        return (
            <div className='bg-white p-6 shadow-lg rounded-lg'>
                <div className='grid grid-cols-2'>
                    <div className='col-span-1 row-span-full'>
                        {publicId ? 
                            (<AdvancedImage cldImg={myImage} />
                        ) : (
                            <div>
                                <img src="https://static.vecteezy.com/system/resources/thumbnails/027/842/188/small_2x/user-ecommerce-icon-fill-style-png.png"/>
                                <label className='block text-sm font-medium text-gray-800'>Upload Profile</label>
                            </div>     
                        )}

                        <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPublicId} />
                    </div>
                    <div className='col-span-1 space-y-2'>
                        <label className='block text-sm font-medium text-gray-800'>Nama Lengkap</label>
                        <input
                            type="text"
                            placeholder={userData?.nama || 'Nama Lengkap'}
                            value={userData?.nama || ''}
                            onChange={e => handleInputChange('nama', e.target.value)}
                            className='input input-bordered w-full max-w-md'
                            disabled={isEdit}
                        />
                        <label className='block text-sm font-medium text-gray-800'>Email</label>
                        <input
                            type="email"
                            placeholder={userData?.email || 'Email'}
                            value={userData?.email || ''}
                            onChange={e => handleInputChange('email', e.target.value)}
                            className='input input-bordered w-full max-w-md'
                            disabled={isEdit}
                        />
                        <label className='block text-sm font-medium text-gray-800'>Gender</label>
                        <select
                            value={userData?.jenisKelamin || ''}
                            onChange={e => handleInputChange('jenisKelamin', e.target.value)}
                            className='input input-bordered w-full max-w-md'
                            disabled={isEdit}
                        >
                            <option value="Laki-Laki">Laki-Laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                        <label className='block text-sm font-medium text-gray-800'>Tanggal Lahir</label>
                        <input
                            type="date"
                            value={userData?.tanggalLahir?.toISOString().slice(0, 10) || ''}
                            onChange={e => handleInputChange('tanggalLahir', new Date(e.target.value))}
                            className='input input-bordered w-full max-w-md'
                            disabled={isEdit}
                        />
                        <label className='block text-sm font-medium text-gray-800'>No. Telp</label>
                        <input
                            type="tel"
                            placeholder={userData?.noTelp || 'Nomor Telepon'}
                            value={userData?.noTelp || ''}
                            onChange={e => handleInputChange('noTelp', e.target.value)}
                            className='input input-bordered w-full max-w-md'
                            disabled={isEdit}
                        />
                        <label className='block text-sm font-medium text-gray-800'>Bio</label>
                        <input
                            type="text"
                            placeholder={userData?.bio || 'Bio'}
                            value={userData?.bio || ''}
                            onChange={e => handleInputChange('bio', e.target.value)}
                            className='input input-bordered w-full max-w-md'
                            disabled={isEdit}
                        />
                        {!isEdit ? (
                        <div className='flex flex-rows space-x-2'>
                            <button className="btn btn-square mt-2" onClick={()=>setIsEdit(true)}>
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Check"> <path id="Vector" d="M6 12L10.2426 16.2426L18.727 7.75732" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                            </button>
                            <button className="btn btn-square mt-2" onClick={()=>setIsEdit(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        ):('')}
                    </div>
                </div>
                <div className='flex flex-rows justify-center items-center h-full space-x-5 mt-8'>
                        <button onClick={()=>setIsEdit(false)}>
                            Edit Profile
                        </button>
                        <button onClick={()=>router.push('')}>
                            Change Password
                        </button>
                </div>
            </div>
        );
    }

    const renderMyOrder = () => {
        return (
            <>
            </>
        )
    }

    if(!state.authenticated)
        () => router.push('/auth')
    
    return (
        <div className='flex min-h-screen bg-gray-100 pt-32'>
            <div className='w-64 p-5 bg-white'>
                {/* Sidebar */}
                <ul>
                    <li className='mb-2'>
                        <button className="text-lg w-full text-left py-2 px-4 hover:bg-gray-200 focus:outline-none focus:bg-gray-300 rounded-md" onClick={() => setIsSelected('MyOrder')}>
                            Pesanan Saya
                        </button>
                    </li>
                    <li className='mb-2'>
                        <button className="text-lg w-full text-left py-2 px-4 hover:bg-gray-200 focus:outline-none focus:bg-gray-300 rounded-md" onClick={() => setIsSelected('MyInfo')}>
                            Akun Saya
                        </button>
                    </li>
                    <li className='mb-2'>
                        <button className="text-lg w-full text-left py-2 px-4 hover:bg-gray-200 focus:outline-none focus:bg-gray-300 rounded-md" onClick={() => router.push('/logout')}>
                            Keluar
                        </button>
                    </li>
                </ul>
            </div>

            {isSelected === 'MyInfo' ? (
                    <div className='flex-grow p-10'>
                        {renderMyInfo()}
                    </div>
                ) : (
                    <div className='flex-grow p-10'>
                        {renderMyOrder()}
                    </div>
                )}
            </div>

    );
}

export default UserProfile;