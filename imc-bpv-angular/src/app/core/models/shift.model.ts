export interface Shift {
    id: string;
    name: string;
    startTime: Date;
    endTime: Date;
    jobId: string;
    maxVolunteers?: number;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: Date;
    updatedAt: Date;
}
