import type { ElementType } from 'react';
import { Box, CardContent, Grid, Typography } from '@mui/material';
import {
  IconCalendarCheck,
  IconCash,
  IconUserCheck,
  IconUserOff,
  IconUsers,
} from '@tabler/icons-react';
import type { DashboardStats } from 'src/types/dashboard';
import { formatMoney } from 'src/utils/formatMoney';

type PaletteColor = 'primary' | 'success' | 'error' | 'warning' | 'info';

type StatKey =
  | 'total_members'
  | 'active_members'
  | 'expired_members'
  | 'revenue_this_month'
  | 'checkins_today';

interface StatCard {
  key: StatKey;
  title: string;
  icon: ElementType;
  bgcolor: PaletteColor;
  format?: (value: number) => string;
}

const statCards: StatCard[] = [
  {
    key: 'total_members',
    title: 'Total members',
    icon: IconUsers,
    bgcolor: 'primary',
  },
  {
    key: 'active_members',
    title: 'Active members',
    icon: IconUserCheck,
    bgcolor: 'success',
  },
  {
    key: 'expired_members',
    title: 'Expired members',
    icon: IconUserOff,
    bgcolor: 'error',
  },
  {
    key: 'revenue_this_month',
    title: 'Revenue this month',
    icon: IconCash,
    bgcolor: 'warning',
    format: (value) => formatMoney(value),
  },
  {
    key: 'checkins_today',
    title: 'Check-ins today',
    icon: IconCalendarCheck,
    bgcolor: 'info',
  },
];

interface DashboardTopCardsProps {
  stats: DashboardStats;
}

const DashboardTopCards = ({ stats }: DashboardTopCardsProps) => (
  <Grid container spacing={3}>
    {statCards.map((card) => {
      const Icon = card.icon;
      const value = stats[card.key];
      const display = card.format ? card.format(value) : String(value);

      return (
        <Grid key={card.key} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <Box bgcolor={`${card.bgcolor}.light`} textAlign="center" borderRadius={2}>
            <CardContent>
              <Box color={`${card.bgcolor}.main`} display="flex" justifyContent="center">
                <Icon size={40} stroke={1.5} />
              </Box>
              <Typography
                color={`${card.bgcolor}.main`}
                mt={1}
                variant="subtitle1"
                fontWeight={600}
              >
                {card.title}
              </Typography>
              <Typography color={`${card.bgcolor}.main`} variant="h4" fontWeight={600}>
                {display}
              </Typography>
            </CardContent>
          </Box>
        </Grid>
      );
    })}
  </Grid>
);

export default DashboardTopCards;
