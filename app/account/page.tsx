'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth';

export default function AccountPage() {
    const { user, updateProfile, logout } = useAuth();
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        console.log('User:', user);
        setName(user?.displayName || '');
        setEmail(user?.email || '');
    }, [user, router]);

    const handleUpdateProfile = async () => {
        try {
            await updateProfile({ displayName: name });
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                    <h1 className="text-2xl font-bold">Account Settings</h1>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex justify-end">
                        <button 
                            onClick={() => {
                                logout();
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                ) : (
                                    <p className="px-4 py-2 bg-gray-50 rounded-lg">{name || 'Not set'}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <p className="px-4 py-2 bg-gray-50 rounded-lg">{email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateProfile}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}