import type { Plan } from 'src/types/plan';
import type { Member } from 'src/types/member';

export interface PaymentRecord {
  id: number;
  member_id: number;
  subscription_id: number;
  amount: string;
  payment_date: string;
  subscription?: {
    id: number;
    member_id: number;
    plan_id: number;
    start_date: string;
    end_date: string;
    plan?: Plan;
  };
  member?: Member;
}

export function buildPaymentsPath(memberId: string): string {
  if (!memberId) {
    return '/payments';
  }
  return `/payments?member_id=${memberId}`;
}
