export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export interface Client {
  id: string;
  name: string;
  phone: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Appointment {
  id: string;
  clientId: string | null;
  title: string;
  startsAt: string;
  durationMin: number;
  price: number | null;
  notes: string | null;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
