import { Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard';

const MemberDashboard = () => (
  <PageContainer title="Dashboard" description="Member dashboard">
    <DashboardCard title="Member Dashboard">
      <Typography color="textSecondary">
        Member profile and history will be added in Prompt 7.
      </Typography>
    </DashboardCard>
  </PageContainer>
);

export default MemberDashboard;
