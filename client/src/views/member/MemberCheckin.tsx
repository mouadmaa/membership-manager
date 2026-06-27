import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { IconCalendarCheck, IconLogin } from '@tabler/icons-react';
import { mutate } from 'swr';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import BlankCard from 'src/components/shared/BlankCard';
import { postFetcher } from 'src/api/fetcher';
import { getAuthErrorMessage } from 'src/context/AuthContext';
import { useApi } from 'src/hooks/useApi';
import type { Checkin } from 'src/types/member';
import { formatDateTime } from 'src/utils/formatDate';

const MemberCheckin = () => {
  const { data: checkins, error, isLoading } = useApi<Checkin[]>('/checkins');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCheckIn = async () => {
    setFormError('');
    setSuccessMessage('');
    setSubmitting(true);

    try {
      await postFetcher('/checkins', {});
      await mutate('/checkins');
      setSuccessMessage('You are checked in. Have a great session!');
    } catch (err) {
      setFormError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer title="Check in" description="Member check-in">
      <Stack spacing={3}>
        <ParentCard title="Check in">
          <Stack spacing={2} alignItems="flex-start">
            <Typography color="textSecondary">
              Tap the button below when you arrive. You need an active subscription to check in.
            </Typography>
            {formError ? <Alert severity="error">{formError}</Alert> : null}
            {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
            <Button
              variant="contained"
              color="primary"
              startIcon={<IconLogin size={20} />}
              disabled={submitting}
              onClick={handleCheckIn}
            >
              Check in now
            </Button>
          </Stack>
        </ParentCard>

        <BlankCard>
          <Box p={2.5}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <IconCalendarCheck size={20} />
              <Typography variant="h6" fontWeight={600}>
                Your check-in history
              </Typography>
            </Stack>

            {isLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{getAuthErrorMessage(error)}</Alert>
            ) : checkins?.length ? (
              <Stack spacing={0} divider={<Divider flexItem />}>
                {checkins.map((checkin) => (
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
    </PageContainer>
  );
};

export default MemberCheckin;
