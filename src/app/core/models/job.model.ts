export interface Job {
    id: string;
    uuid?: string;
    name: string;
    description?: string;
    eventId?: string;
    maxVolunteers?: number;
    status?: 'ACTIVE' | 'INACTIVE';
    createdAt?: Date;
    updatedAt?: Date;
    shortKey?: string;
    printTicketJob?: string;
}
