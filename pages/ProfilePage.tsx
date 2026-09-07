import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <div>Loading user profile...</div>;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold font-serif mb-6 border-b pb-4">My Profile</h1>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">First Name</label>
                        <p className="mt-1 text-lg text-gray-900">{user.firstName}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Last Name</label>
                        <p className="mt-1 text-lg text-gray-900">{user.lastName}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Email Address</label>
                        <p className="mt-1 text-lg text-gray-900">{user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
