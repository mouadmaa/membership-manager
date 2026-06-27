import type { Checkin, Member } from 'src/types/member';

export interface CheckinRecord extends Checkin {
  member?: Member;
}

export function buildCheckinsPath(memberId: string): string {
  if (!memberId) {
    return '/checkins';
  }
  return `/checkins?member_id=${memberId}`;
}
