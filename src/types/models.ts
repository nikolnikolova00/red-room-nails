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

export type PlanCategory = 'personal' | 'errand' | 'health' | 'family' | 'other';

export interface PersonalPlan {
  id: string;
  title: string;
  notes: string | null;
  date: string;
  time: string | null;
  category: PlanCategory;
  done: boolean;
  reminderEnabled: boolean;
  notificationId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type GroceryCategory =
  | 'produce'
  | 'dairy'
  | 'meat'
  | 'bakery'
  | 'pantry'
  | 'frozen'
  | 'household'
  | 'other';

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string | null;
  category: GroceryCategory;
  checked: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type CalendarEntry =
  | {
      kind: 'plan';
      id: string;
      title: string;
      date: string;
      time: string | null;
      done: boolean;
      category: PlanCategory;
    }
  | {
      kind: 'appointment';
      id: string;
      title: string;
      startsAt: string;
      durationMin: number;
      status: AppointmentStatus;
    };
