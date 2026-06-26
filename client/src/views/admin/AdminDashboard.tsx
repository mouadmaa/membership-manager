import { Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard';

const AdminDashboard = () => (
  <PageContainer title="Dashboard" description="Admin dashboard">
    <DashboardCard title="Admin Dashboard">
      <Typography color="textSecondary">
        Dashboard stats will be added in Prompt 6.
      </Typography>
    </DashboardCard>
  </PageContainer>
);

export default AdminDashboard;
