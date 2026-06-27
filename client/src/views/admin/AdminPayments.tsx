import { FormEvent, useMemo, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
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
import type { Plan } from 'src/types/plan';
import type { PaymentRecord } from 'src/types/payment';
import { buildPaymentsPath } from 'src/types/payment';
import { formatDate } from 'src/utils/formatDate';
import { formatMoney } from 'src/utils/formatMoney';

const compactLabel = { mt: 0, mb: 0.75 };

const AdminPayments = () => {
  const { data: members } = useApi<Member[]>('/members');
  const { data: plans } = useApi<Plan[]>('/plans');

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [planId, setPlanId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState<Dayjs | null>(dayjs());
  const [filterMemberId, setFilterMemberId] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const paymentsPath = useMemo(() => buildPaymentsPath(filterMemberId), [filterMemberId]);
  const { data: payments, error, isLoading } = useApi<PaymentRecord[]>(paymentsPath);

  const handlePlanChange = (value: string) => {
    setPlanId(value);
    const plan = plans?.find((item) => String(item.id) === value);
    if (plan) {
      setAmount(String(plan.price));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      await postFetcher('/payments', {
        member_id: selectedMember?.id,
        plan_id: Number(planId),
        amount: Number(amount),
        payment_date: paymentDate?.format('YYYY-MM-DD'),
      });
      await mutate(paymentsPath);
      await mutate('/members');
      setSelectedMember(null);
      setPlanId('');
      setAmount('');
      setPaymentDate(dayjs());
    } catch (err) {
      setFormError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <PageContainer title="Payments" description="Record member payments">
        <Stack spacing={3}>
          <ParentCard title="Record payment">
            <Box component="form" onSubmit={handleSubmit} sx={{ pt: 0.5 }}>
              {formError ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formError}
                </Alert>
              ) : null}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomFormLabel htmlFor="payment-member" sx={compactLabel}>
                    Member
                  </CustomFormLabel>
                  <Autocomplete
                    id="payment-member"
                    size="small"
                    options={members || []}
                    value={selectedMember}
                    onChange={(_, value) => setSelectedMember(value)}
                    getOptionLabel={(member) => `${member.user.name} (${member.national_id})`}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        size="small"
                        required
                        placeholder="Search member..."
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomFormLabel htmlFor="payment-plan" sx={compactLabel}>
                    Plan
                  </CustomFormLabel>
                  <CustomTextField
                    id="payment-plan"
                    select
                    size="small"
                    fullWidth
                    required
                    value={planId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handlePlanChange(e.target.value)
                    }
                  >
                    <MenuItem value="">Select plan</MenuItem>
                    {plans?.map((plan) => (
                      <MenuItem key={plan.id} value={String(plan.id)}>
                        {plan.name} — {formatMoney(plan.price)}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <CustomFormLabel htmlFor="payment-amount" sx={compactLabel}>
                    Amount
                  </CustomFormLabel>
                  <CustomTextField
                    id="payment-amount"
                    type="number"
                    size="small"
                    fullWidth
                    required
                    inputProps={{ min: 0, step: '0.01' }}
                    value={amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <CustomFormLabel sx={compactLabel}>Payment date</CustomFormLabel>
                  <DatePicker
                    value={paymentDate}
                    onChange={(value) => setPaymentDate(value)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        size: 'small',
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} display="flex" alignItems="flex-end">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="small"
                    fullWidth
                    disabled={submitting}
                  >
                    Record payment
                  </Button>
                </Grid>
              </Grid>
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
                  Payment history
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
                        <TableCell>Plan</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Start</TableCell>
                        <TableCell>End</TableCell>
                        <TableCell>Payment date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {payments?.length ? (
                        payments.map((payment) => (
                          <TableRow key={payment.id} hover>
                            <TableCell>
                              {payment.member?.user.name ||
                                members?.find((m) => m.id === payment.member_id)?.user.name ||
                                `#${payment.member_id}`}
                            </TableCell>
                            <TableCell>
                              {payment.subscription?.plan?.name ||
                                `Plan #${payment.subscription?.plan_id}`}
                            </TableCell>
                            <TableCell align="right">{formatMoney(payment.amount)}</TableCell>
                            <TableCell>{formatDate(payment.subscription?.start_date)}</TableCell>
                            <TableCell>{formatDate(payment.subscription?.end_date)}</TableCell>
                            <TableCell>{formatDate(payment.payment_date)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <Typography color="textSecondary" align="center" py={2}>
                              No payments found.
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
    </LocalizationProvider>
  );
};

export default AdminPayments;
