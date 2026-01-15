
export type ViewState = 'dashboard' | 'campaigns' | 'contacts' | 'templates' | 'settings';

export interface Campaign {
  id: string;
  name: string;
  status: 'Draft' | 'Scheduled' | 'Sent';
  sent: number;
  total: number;
  date: string;
  message?: string;
  image?: string | null;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  tags: string[];
  status: 'valid' | 'invalid';
}

export interface Template {
  id: string;
  name: string;
  category: string;
  language: string;
  status: 'approved' | 'pending' | 'rejected';
  body: string;
}
