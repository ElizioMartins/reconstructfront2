export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  skills: string[];
  availability: Availability[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Availability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface VolunteerFilter {
  skills?: string[];
  availability?: Availability[];
  searchTerm?: string;
}
