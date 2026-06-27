import { Alert, Box, CircularProgress } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardTopCards from 'src/components/dashboards/DashboardTopCards';
import { getAuthErrorMessage } from 'src/context/AuthContext';
import { useApi } from 'src/hooks/useApi';
import type { DashboardStats } from 'src/types/dashboard';

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
        <DashboardTopCards stats={stats} />
      ) : null}
    </PageContainer>
  );
};

export default AdminDashboard;
