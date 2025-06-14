export interface Volunteer {
  id: string; // Mapeado de 'id' ou 'uuid' da API
  cpf: string;
  numeroSistema?: number;
  nomeColete?: string;
  name: string; // Mapeado de 'nomeCompleto' da API
  email?: string;
  phone: string; // Mapeado de 'telefoneCelular' da API
  comandoRegional?: string;
  regional?: string;
  divisao?: string;
  cargo?: string;
  erro?: string | null;
  address?: string;
  skills?: string[];
  availability?: any[]; // Manter como any[] por enquanto, se não for detalhado
  createdAt?: Date;
  updatedAt?: Date;
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
