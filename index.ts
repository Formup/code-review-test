import { getUserById } from './src/database';
import { addEvent } from './src/eventflow';
import { Admin, User } from './types';

export function formatDate(date: Date | string | number): string {
    const formattable = new Date(date);
    return `${formattable.getFullYear()}-${formattable.getMonth()}-${formattable.getDay()}`;
}

export async function createUser(actor: Admin, name: string, email: string, role: 'admin' | 'user') {
    const now = new Date();
    const candidateUser = {
        id: randomHexString(16),
        name,
        email,
        isAdmin: role === 'admin' ? true : false,
        expiresAt: formatDate(now.setFullYear(now.getFullYear() + 1)),
        createdAt: formatDate(now),
    };
  
    try {
        validateEmail(email);
        if (!actor.permissions.includes('create')) {
            throw new Error('User creation error');
        }
    } catch (error) {
        console.error(`User could not be created: ${error instanceof Error ? error.message : error}`);
    }

    await addEvent('UserCreated', candidateUser);
}

export async function updateUser(actor: Admin, userId: string, updateData: Partial<User>) {
    const now = new Date();
    const savedUser = await getUserById(userId);
    const updatedUser = { ...savedUser, ...updateData };
    if (savedUser === updatedUser ) {
        return;
    }

    try {
        validateEmail(updatedUser.email);
        if (!actor.permissions.includes('create')) {
            throw new Error('User update error');
        }
    } catch (error) {
        console.error(`User could not be updated: ${error instanceof Error ? error.message : error}`);
    }

    await addEvent('UserUpdated', updatedUser);
}

function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error(`Invalid email format: ${email}`);
    }
}

function randomHexString(length: number): string {
    const validHexChars = '1234567890aAbBcCdDeEfF';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomChar = validHexChars[Math.round(Math.random() * validHexChars.length)];
        randomString += randomChar;
    }
    return randomString.toLowerCase();
}

export function groupUsersByRole(users: User[]): Record<string, User[]> {
    return users.reduce((result, user) => {
        if (user.isAdmin) {
            result.admin.push(user);
        } else {
            result.user.push(user);
        }
        return result;
    }, { admin: [] as User[], user: [] as User[] });
}
