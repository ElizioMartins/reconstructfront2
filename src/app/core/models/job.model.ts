export interface Job {
    id: string;
    name: string;
    description?: string;
    eventId: string;
    maxVolunteers?: number;
    status?: 'ACTIVE' | 'INACTIVE';
    createdAt?: Date;
    updatedAt?: Date;
}
