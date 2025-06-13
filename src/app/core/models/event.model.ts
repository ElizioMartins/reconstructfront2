export interface JobDetails {
  uuid: string;
  createdAt: string;
  name: string;
  description: string;
  shortKey: string;
  printTicketJob: any | null;
}

export interface CelebrationJobLocation {
  uuid: string;
  createdAt: string;
  job: JobDetails;
  staffMin: number;
  staffMax: number;
  staffMid: number;
  priority: number;
  defaultJobTimeInMinutes: number;
}

export interface LocationItem {
  uuid: string;
  createdAt: string;
  name: string;
  description: string;
  shortKey: string;
  celebrationJobLocationList?: CelebrationJobLocation[];
  geoLocation: any | null;
  printTicketLocation: string;
}

export interface Event {
    id: string; // Mapeado de 'uuid' da API
    name: string;
    code: string; // Mapeado de 'shortKey' da API
    startDate: Date; // Mapeado de 'startAt' da API
    endDate: Date; // Mapeado de 'endAt' da API
    status?: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'FINISHED';
    description?: string;
    location?: string;
    maxVolunteers?: number;
    observation?: string;
    locationList?: LocationItem[];
    celebrationJobLocationList?: CelebrationJobLocation[];
    printTicketCelebration?: string;
    createdAt: Date;
    updatedAt: Date;
}
