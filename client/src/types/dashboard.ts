export interface DashboardMonthRevenue {
  month: string;
  total: number;
}

export interface DashboardDayCheckins {
  day: string;
  total: number;
}

export interface DashboardRecentPayment {
  id: number;
  member_name: string | null;
  amount: number;
  payment_date: string;
  updated_at: string;
}

export interface DashboardRecentCheckin {
  id: number;
  member_name: string | null;
  checked_in_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_members: number;
  active_members: number;
  expired_members: number;
  revenue_this_month: number;
  checkins_today: number;
  revenue_by_month: DashboardMonthRevenue[];
  checkins_by_day: DashboardDayCheckins[];
  recent_payments: DashboardRecentPayment[];
  recent_checkins: DashboardRecentCheckin[];
}
