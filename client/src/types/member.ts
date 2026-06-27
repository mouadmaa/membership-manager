import type { User } from 'src/types/auth/auth';

export interface Subscription {
  id: number;
  member_id: number;
  plan_id: number;
  start_date: string;
  end_date: string;
}

export interface Payment {
  id: number;
  member_id: number;
  subscription_id: number;
  amount: string;
  payment_date: string;
  subscription?: Subscription;
}

export interface Checkin {
  id: number;
  member_id: number;
  checked_in_at: string;
}

export interface Member {
  id: number;
  user_id: number;
  national_id: string;
  phone: string | null;
  user: User;
  subscriptions?: Subscription[];
  payments?: Payment[];
  checkins?: Checkin[];
}

export interface MemberFormData {
  name: string;
  email: string;
  password: string;
  national_id: string;
  phone: string;
}

export const emptyMemberForm = (): MemberFormData => ({
  name: '',
  email: '',
  password: '',
  national_id: '',
  phone: '',
});

export const memberToForm = (member: Member): MemberFormData => ({
  name: member.user.name,
  email: member.user.email,
  password: '',
  national_id: member.national_id,
  phone: member.phone || '',
});

export function getMemberStatus(member: Member): 'active' | 'expired' {
  if (!member.subscriptions?.length) {
    return 'expired';
  }

  const latest = member.subscriptions.reduce((current, item) =>
    item.end_date > current.end_date ? item : current,
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(
    latest.end_date.includes('T') ? latest.end_date : `${latest.end_date}T00:00:00`,
  );
  endDate.setHours(0, 0, 0, 0);

  return endDate >= today ? 'active' : 'expired';
}

export function buildMembersPath(search: string, status: string): string {
  const params = new URLSearchParams();
  if (search.trim()) {
    params.set('search', search.trim());
  }
  if (status) {
    params.set('status', status);
  }
  const query = params.toString();
  return query ? `/members?${query}` : '/members';
}
