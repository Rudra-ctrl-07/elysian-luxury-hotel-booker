import bcrypt from 'bcryptjs';
import { User } from '../types';

const USERS_KEY = 'elysian_users';
const CURRENT_USER_KEY = 'elysian_current_user';

const getUsers = (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
};

const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const signup = async (firstName: string, lastName: string, email: string, pass: string): Promise<User> => {
    const users = getUsers();
    if (users.some(user => user.email === email)) {
        throw new Error('User with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(pass, 10);
    const newUser: User = {
        id: new Date().toISOString(),
        firstName,
        lastName,
        email,
        passwordHash,
    };

    users.push(newUser);
    saveUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
};

export const login = async (email: string, pass: string): Promise<User> => {
    const users = getUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
        throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
        throw new Error('Invalid email or password.');
    }
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
};

export const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
};
