import { Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard';

const MemberCheckin = () => (
  <PageContainer title="Check in" description="Member check-in">
    <DashboardCard title="Check in">
      <Typography color="textSecondary">
        Check-in feature will be added in Prompt 5.
      </Typography>
    </DashboardCard>
  </PageContainer>
);

export default MemberCheckin;
