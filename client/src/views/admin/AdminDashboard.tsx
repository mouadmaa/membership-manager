import { Alert, Box, CircularProgress, Stack } from '@mui/material';
import { lazy, Suspense } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import DashboardTopCards from 'src/components/dashboards/DashboardTopCards';
import { getAuthErrorMessage } from 'src/context/AuthContext';
import { useApi } from 'src/hooks/useApi';
import type { DashboardStats } from 'src/types/dashboard';

const DashboardCharts = lazy(() => import('src/components/dashboards/DashboardCharts'));

const AdminDashboard = () => {
  const { data: stats, error, isLoading } = useApi<DashboardStats>('/dashboard');

  return (
    <PageContainer title="Dashboard" description="Admin dashboard overview">
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{getAuthErrorMessage(error)}</Alert>
      ) : stats ? (
        <Stack spacing={0}>
          <DashboardTopCards stats={stats} />
          <Suspense
            fallback={
              <Box display="flex" justifyContent="center" py={6}>
                <CircularProgress />
              </Box>
            }
          >
            <DashboardCharts stats={stats} />
          </Suspense>
        </Stack>
      ) : null}
    </PageContainer>
  );
};

export default AdminDashboard;
