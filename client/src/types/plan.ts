export interface Plan {
  id: number;
  name: string;
  price: string;
  duration_days: number;
  created_at?: string;
  updated_at?: string;
}

export interface PlanFormData {
  name: string;
  price: string;
  duration_days: string;
}

export const emptyPlanForm = (): PlanFormData => ({
  name: '',
  price: '',
  duration_days: '',
});

export const planToForm = (plan: Plan): PlanFormData => ({
  name: plan.name,
  price: String(plan.price),
  duration_days: String(plan.duration_days),
});
