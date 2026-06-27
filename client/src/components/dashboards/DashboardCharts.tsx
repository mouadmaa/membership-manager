import ApexChart from 'src/components/dashboards/ApexChart';
import type { ApexOptions } from 'apexcharts';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import BlankCard from 'src/components/shared/BlankCard';
import ParentCard from 'src/components/shared/ParentCard';
import type { DashboardStats } from 'src/types/dashboard';
import { formatDate, formatDateTime } from 'src/utils/formatDate';
import { formatMoney } from 'src/utils/formatMoney';

interface DashboardChartsProps {
  stats: DashboardStats;
}

const DashboardCharts = ({ stats }: DashboardChartsProps) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const success = theme.palette.success.main;
  const error = theme.palette.error.main;
  const info = theme.palette.info.main;

  const revenueOptions: ApexOptions = {
    chart: {
      type: 'bar',
      fontFamily: theme.typography.fontFamily,
      foreColor: theme.palette.text.secondary,
      toolbar: { show: false },
    },
    colors: [primary],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '45%',
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: stats.revenue_by_month.map((item) => item.month),
    },
    yaxis: {
      labels: {
        formatter: (value) => formatMoney(value, { currency: false }),
      },
    },
    grid: { strokeDashArray: 3 },
    tooltip: {
      y: {
        formatter: (value) => formatMoney(value),
      },
    },
  };

  const membershipOptions: ApexOptions = {
    chart: {
      type: 'donut',
      fontFamily: theme.typography.fontFamily,
      foreColor: theme.palette.text.secondary,
      toolbar: { show: false },
    },
    colors: [success, error],
    labels: ['Active', 'Expired'],
    legend: { position: 'bottom' },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: { size: '72%' },
      },
    },
  };

  const checkinsOptions: ApexOptions = {
    chart: {
      type: 'area',
      fontFamily: theme.typography.fontFamily,
      foreColor: theme.palette.text.secondary,
      toolbar: { show: false },
    },
    colors: [info],
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: stats.checkins_by_day.map((item) => item.day),
    },
    grid: { strokeDashArray: 3 },
  };

  return (
    <Stack spacing={3} mt={3}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <ParentCard title="Revenue (last 6 months)">
            <ApexChart
              options={revenueOptions}
              series={[{ name: 'Revenue', data: stats.revenue_by_month.map((item) => item.total) }]}
              type="bar"
              height={300}
            />
          </ParentCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <ParentCard title="Membership status">
            <ApexChart
              options={membershipOptions}
              series={[stats.active_members, stats.expired_members]}
              type="donut"
              height={315}
            />
          </ParentCard>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <ParentCard title="Check-ins (last 7 days)">
            <ApexChart
              options={checkinsOptions}
              series={[
                { name: 'Check-ins', data: stats.checkins_by_day.map((item) => item.total) },
              ]}
              type="area"
              height={260}
            />
          </ParentCard>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <BlankCard>
            <Stack p={2.5} spacing={2}>
              <Typography variant="h6" fontWeight={600}>
                Recent payments
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Member</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.recent_payments.length ? (
                    stats.recent_payments.map((payment) => (
                      <TableRow key={payment.id} hover>
                        <TableCell>{payment.member_name || '—'}</TableCell>
                        <TableCell align="right">{formatMoney(payment.amount)}</TableCell>
                        <TableCell>{formatDate(payment.payment_date)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography color="textSecondary" align="center">
                          No payments yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Stack>
          </BlankCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <BlankCard>
            <Stack p={2.5} spacing={2}>
              <Typography variant="h6" fontWeight={600}>
                Recent check-ins
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Member</TableCell>
                    <TableCell>Checked in</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.recent_checkins.length ? (
                    stats.recent_checkins.map((checkin) => (
                      <TableRow key={checkin.id} hover>
                        <TableCell>{checkin.member_name || '—'}</TableCell>
                        <TableCell>{formatDateTime(checkin.checked_in_at)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Typography color="textSecondary" align="center">
                          No check-ins yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Stack>
          </BlankCard>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default DashboardCharts;
