import { useMemo, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { IconLogin } from '@tabler/icons-react';
import { mutate } from 'swr';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import BlankCard from 'src/components/shared/BlankCard';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { postFetcher } from 'src/api/fetcher';
import { getAuthErrorMessage } from 'src/context/AuthContext';
import { useApi } from 'src/hooks/useApi';
import type { Member } from 'src/types/member';
import type { CheckinRecord } from 'src/types/checkin';
import { buildCheckinsPath } from 'src/types/checkin';
import { formatDateTime } from 'src/utils/formatDate';

const compactLabel = { mt: 0, mb: 0.75 };

const AdminCheckins = () => {
  const { data: members } = useApi<Member[]>('/members');

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [filterMemberId, setFilterMemberId] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const checkinsPath = useMemo(() => buildCheckinsPath(filterMemberId), [filterMemberId]);
  const { data: checkins, error, isLoading } = useApi<CheckinRecord[]>(checkinsPath);

  const handleCheckIn = async () => {
    if (!selectedMember) {
      return;
    }

    setFormError('');
    setSuccessMessage('');
    setSubmitting(true);

    try {
      await postFetcher('/checkins', { member_id: selectedMember.id });
      await mutate(checkinsPath);
      setSuccessMessage(`${selectedMember.user.name} checked in successfully.`);
      setSelectedMember(null);
    } catch (err) {
      setFormError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const getMemberName = (checkin: CheckinRecord) =>
    checkin.member?.user.name ||
    members?.find((member) => member.id === checkin.member_id)?.user.name ||
    `#${checkin.member_id}`;

  return (
    <PageContainer title="Check-ins" description="Manage member check-ins">
      <Stack spacing={3}>
        <ParentCard title="Check in member">
          <Box sx={{ pt: 0.5 }}>
            {formError ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            ) : null}
            {successMessage ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            ) : null}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-end">
              <Box flex={1} width="100%">
                <CustomFormLabel htmlFor="checkin-member" sx={compactLabel}>
                  Member
                </CustomFormLabel>
                <Autocomplete
                  id="checkin-member"
                  size="small"
                  options={members || []}
                  value={selectedMember}
                  onChange={(_, value) => setSelectedMember(value)}
                  getOptionLabel={(member) => `${member.user.name} (${member.national_id})`}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <CustomTextField {...params} size="small" placeholder="Search member..." />
                  )}
                />
              </Box>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<IconLogin size={18} />}
                disabled={!selectedMember || submitting}
                onClick={handleCheckIn}
                sx={{ minWidth: { sm: 160 }, whiteSpace: 'nowrap' }}
              >
                Check in
              </Button>
            </Stack>
          </Box>
        </ParentCard>

        <BlankCard>
          <Box p={2.5}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', sm: 'center' }}
              spacing={2}
              mb={3}
            >
              <Typography variant="h6" fontWeight={600}>
                Recent check-ins
              </Typography>
              <CustomTextField
                select
                label="Filter by member"
                value={filterMemberId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFilterMemberId(e.target.value)
                }
                sx={{ minWidth: 220 }}
              >
                <MenuItem value="">All members</MenuItem>
                {members?.map((member) => (
                  <MenuItem key={member.id} value={String(member.id)}>
                    {member.user.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Stack>

            {isLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{getAuthErrorMessage(error)}</Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Member</TableCell>
                      <TableCell>Checked in at</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {checkins?.length ? (
                      checkins.map((checkin) => (
                        <TableRow key={checkin.id} hover>
                          <TableCell>{getMemberName(checkin)}</TableCell>
                          <TableCell>{formatDateTime(checkin.checked_in_at)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Typography color="textSecondary" align="center" py={2}>
                            No check-ins found.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </BlankCard>
      </Stack>
    </PageContainer>
  );
};

export default AdminCheckins;
