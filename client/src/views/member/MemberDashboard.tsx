import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { IconCalendar, IconCreditCard, IconTicket } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import BlankCard from 'src/components/shared/BlankCard';
import ParentCard from 'src/components/shared/ParentCard';
import { getAuthErrorMessage } from 'src/context/AuthContext';
import { useApi } from 'src/hooks/useApi';
import type { Member } from 'src/types/member';
import { getMemberStatus } from 'src/types/member';
import type { Plan } from 'src/types/plan';
import { formatDate, formatDateTime } from 'src/utils/formatDate';
import { formatMoney } from 'src/utils/formatMoney';

const MemberDashboard = () => {
  const { data: member, error, isLoading } = useApi<Member>('/me/member');
  const { data: plans } = useApi<Plan[]>('/plans');

  const status = member ? getMemberStatus(member) : 'expired';
  const latestSubscription = member?.subscriptions?.length
    ? member.subscriptions.reduce((current, item) =>
        item.end_date > current.end_date ? item : current,
      )
    : null;
  const planName =
    plans?.find((plan) => plan.id === latestSubscription?.plan_id)?.name || '—';

  const sortedPayments = [...(member?.payments || [])].sort(
    (a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime(),
  );
  const sortedCheckins = [...(member?.checkins || [])].sort(
    (a, b) => new Date(b.checked_in_at).getTime() - new Date(a.checked_in_at).getTime(),
  );

  return (
    <PageContainer title="Dashboard" description="Your membership overview">
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{getAuthErrorMessage(error)}</Alert>
      ) : member ? (
        <Stack spacing={3}>
          <ParentCard title="Current subscription">
            <Stack spacing={2}>
              <Chip
                label={status === 'active' ? 'Active' : 'Expired'}
                size="small"
                sx={{
                  alignSelf: 'flex-start',
                  fontWeight: 600,
                  bgcolor: status === 'active' ? 'success.main' : 'error.main',
                  color: 'common.white',
                }}
              />
              {latestSubscription ? (
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconTicket size={18} />
                    <Typography variant="body1" fontWeight={600}>
                      {planName}
                    </Typography>
                  </Stack>
                  <Typography color="textSecondary">
                    Valid until {formatDate(latestSubscription.end_date)}
                  </Typography>
                </Stack>
              ) : (
                <Typography color="textSecondary">No subscription on record.</Typography>
              )}
            </Stack>
          </ParentCard>

          <BlankCard>
            <Box p={2.5}>
              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <IconCreditCard size={20} />
                <Typography variant="h6" fontWeight={600}>
                  Payment history
                </Typography>
              </Stack>
              {sortedPayments.length ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Amount</TableCell>
                        <TableCell>Payment date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedPayments.map((payment) => (
                        <TableRow key={payment.id} hover>
                          <TableCell>{formatMoney(payment.amount)}</TableCell>
                          <TableCell>{formatDate(payment.payment_date)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="textSecondary">No payments yet.</Typography>
              )}
            </Box>
          </BlankCard>

          <BlankCard>
            <Box p={2.5}>
              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <IconCalendar size={20} />
                <Typography variant="h6" fontWeight={600}>
                  Check-in history
                </Typography>
              </Stack>
              {sortedCheckins.length ? (
                <Stack spacing={0} divider={<Divider flexItem />}>
                  {sortedCheckins.map((checkin) => (
                    <Box key={checkin.id} py={1.5}>
                      <Typography variant="body1" fontWeight={500}>
                        {formatDateTime(checkin.checked_in_at)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography color="textSecondary">No check-ins yet.</Typography>
              )}
            </Box>
          </BlankCard>
        </Stack>
      ) : null}
    </PageContainer>
  );
};

export default MemberDashboard;
