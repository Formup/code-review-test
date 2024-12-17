export interface Admin extends User {
    permissions: ('create' | 'update' | 'read' | 'delete')[]; 
}

export interface User {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    createdAt: Date;
    expiresAt: Date;
}
