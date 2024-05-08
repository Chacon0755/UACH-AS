export interface Post {
    id: number;
    author: string | null;
    role: string;
    content: string;
    createdAt: Date;
    responses?: Response[];
}

export interface Response {
    id: number;
    author: string;
    role: string;
    content: string;
    createdAt: Date;
}