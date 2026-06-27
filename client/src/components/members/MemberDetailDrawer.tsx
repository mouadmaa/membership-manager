import type { ReactNode } from 'react';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  IconCalendar,
  IconCreditCard,
  IconId,
  IconMail,
  IconPhone,
  IconTicket,
} from '@tabler/icons-react';
import BlankCard from 'src/components/shared/BlankCard';
import type { Member } from 'src/types/member';
import { getMemberStatus } from 'src/types/member';
import { formatDate, formatDateTime } from 'src/utils/formatDate';
import { formatMoney } from 'src/utils/formatMoney';
import ProfileImg from 'src/assets/images/profile/user-1.jpg';

interface MemberDetailDrawerProps {
  member: Member;
}

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    <Box color="primary.main" display="flex">
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" color="textSecondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value}
      </Typography>
    </Box>
  </Stack>
);

const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <BlankCard>
    <Box p={2.5}>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        {title}
      </Typography>
      {children}
    </Box>
  </BlankCard>
);

const MemberDetailDrawer = ({ member }: MemberDetailDrawerProps) => {
  const status = getMemberStatus(member);
  const sortedSubscriptions = [...(member.subscriptions || [])].sort(
    (a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime(),
  );
  const sortedPayments = [...(member.payments || [])].sort(
    (a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime(),
  );
  const sortedCheckins = [...(member.checkins || [])].sort(
    (a, b) => new Date(b.checked_in_at).getTime() - new Date(a.checked_in_at).getTime(),
  );

  return (
    <Stack spacing={3}>
      <BlankCard>
        <Box
          sx={{
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'primary.contrastText',
            p: 3,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={ProfileImg} alt={member.user.name} sx={{ width: 64, height: 64 }} />
            <Box>
              <Typography variant="h5" fontWeight={600}>
                {member.user.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {member.user.email}
              </Typography>
              <Box mt={1}>
                <Chip
                  label={status === 'active' ? 'Active' : 'Expired'}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    bgcolor: status === 'active' ? 'success.main' : 'error.main',
                    color: 'common.white',
                  }}
                />
              </Box>
            </Box>
          </Stack>
        </Box>
        <Box p={2.5}>
          <Stack spacing={2}>
            <InfoRow icon={<IconId size={18} />} label="National ID" value={member.national_id} />
            <InfoRow
              icon={<IconPhone size={18} />}
              label="Phone"
              value={member.phone || '—'}
            />
            <InfoRow icon={<IconMail size={18} />} label="Email" value={member.user.email} />
          </Stack>
        </Box>
      </BlankCard>

      <SectionCard title="Subscriptions">
        {sortedSubscriptions.length ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Start date</TableCell>
                <TableCell>End date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedSubscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>{formatDate(sub.start_date)}</TableCell>
                  <TableCell>{formatDate(sub.end_date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No subscriptions yet.
          </Typography>
        )}
      </SectionCard>

      <SectionCard title="Payments">
        {sortedPayments.length ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <IconCreditCard size={16} />
                      <span>{formatMoney(payment.amount)}</span>
                    </Stack>
                  </TableCell>
                  <TableCell>{formatDate(payment.payment_date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No payments yet.
          </Typography>
        )}
      </SectionCard>

      <SectionCard title="Check-ins">
        {sortedCheckins.length ? (
          <Stack spacing={1.5} divider={<Divider flexItem />}>
            {sortedCheckins.map((checkin) => (
              <Stack key={checkin.id} direction="row" spacing={1} alignItems="center">
                <IconCalendar size={16} />
                <Typography variant="body2">{formatDateTime(checkin.checked_in_at)}</Typography>
              </Stack>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No check-ins yet.
          </Typography>
        )}
      </SectionCard>

      {sortedSubscriptions[0] ? (
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'primary.light',
            color: 'primary.main',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
            <IconTicket size={18} />
            <Typography variant="subtitle2" fontWeight={600}>
              Latest membership
            </Typography>
          </Stack>
          <Typography variant="body2">
            Valid until {formatDate(sortedSubscriptions[0].end_date)}
          </Typography>
        </Box>
      ) : null}
    </Stack>
  );
};

export default MemberDetailDrawer;
