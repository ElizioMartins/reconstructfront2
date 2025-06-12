export interface Event {
    id: string;
    name: string;
    code: string;
    startDate: Date;
    endDate: Date;
    status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'FINISHED';
    description?: string;
    location?: string;
    maxVolunteers?: number;
    createdAt: Date;
    updatedAt: Date;
}
