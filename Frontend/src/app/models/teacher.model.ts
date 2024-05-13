import { Schedule } from "./schedule.model";

export interface Teacher {
    id: number;
    name: string;
    lastName1: string;
    lastName2: string;
    email: string;
    majorId: number;
    courseId: number;
    role: string;
    profilePicture: string;
}

