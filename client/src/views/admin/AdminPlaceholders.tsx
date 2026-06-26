import { Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard';

const PlaceholderPage = ({ title }: { title: string }) => (
  <PageContainer title={title} description={title}>
    <DashboardCard title={title}>
      <Typography color="textSecondary">Coming in a later prompt.</Typography>
    </DashboardCard>
  </PageContainer>
);

export const AdminPlans = () => <PlaceholderPage title="Plans" />;
export const AdminMembers = () => <PlaceholderPage title="Members" />;
export const AdminPayments = () => <PlaceholderPage title="Payments" />;
export const AdminCheckins = () => <PlaceholderPage title="Check-ins" />;
