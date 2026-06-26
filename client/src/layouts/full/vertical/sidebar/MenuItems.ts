import { uniqueId } from 'lodash';
import {
  IconCalendarCheck,
  IconCreditCard,
  IconLayoutDashboard,
  IconTicket,
  IconUsers,
} from '@tabler/icons-react';

interface MenuitemsType {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
}

const adminMenuItems: MenuitemsType[] = [
  {
    navlabel: true,
    subheader: 'Admin',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/admin/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Plans',
    icon: IconTicket,
    href: '/admin/plans',
  },
  {
    id: uniqueId(),
    title: 'Members',
    icon: IconUsers,
    href: '/admin/members',
  },
  {
    id: uniqueId(),
    title: 'Payments',
    icon: IconCreditCard,
    href: '/admin/payments',
  },
  {
    id: uniqueId(),
    title: 'Check-ins',
    icon: IconCalendarCheck,
    href: '/admin/checkins',
  },
];

const memberMenuItems: MenuitemsType[] = [
  {
    navlabel: true,
    subheader: 'Member',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/member/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Check in',
    icon: IconCalendarCheck,
    href: '/member/checkin',
  },
];

export function getMenuItems(role?: string): MenuitemsType[] {
  return role === 'admin' ? adminMenuItems : memberMenuItems;
}

export default adminMenuItems;
