interface GeoLocation {
  x: number;
  y: number;
}

interface Job {
  uuid: string;
  createdAt: string;
  name: string;
  description: string;
  shortKey: string;
  printTicketJob: string;
}

interface CelebrationJobLocation {
  uuid: string;
  createdAt: string;
  celebration: string;
  location: string;
  job: Job;
  staffMin: number;
  staffMax: number;
  staffMid: number;
  priority: number;
  defaultJobTimeInMinutes: number;
}

interface Location {
  uuid: string;
  createdAt: string;
  name: string;
  description: string;
  shortKey: string;
  celebrationLocation: string;
  celebrationJobLocationList: CelebrationJobLocation[];
  geoLocation: GeoLocation;
  printTicketLocation: string;
}

export interface Event {
  uuid: string;
  createdAt: string;
  name: string;
  observation: string;
  shortKey: string;
  startAt: string;
  endAt: string;
  locationList: Location[];
  celebrationJobLocationList: CelebrationJobLocation[];
  printTicketCelebration: string;
}
