// resources/js/types/auth.ts
export interface User {
    id: number;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
}

export interface AuthData {
    user: User | null;
}

export interface PageProps {
    auth: AuthData;
    // Add other shared props from your middleware here
    name: string;
    quote: {
        message: string;
        author: string;
    };
    flash: {
        success: string | null;
        error: string | null;
    };
    ziggy: {
        location: string;
        [key: string]: any;
    };
    sidebarOpen: boolean;
}
