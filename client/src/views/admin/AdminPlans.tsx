import { FormEvent, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { mutate } from 'swr';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { deleteFetcher, postFetcher, putFetcher } from 'src/api/fetcher';
import { getAuthErrorMessage } from 'src/context/AuthContext';
import { useApi } from 'src/hooks/useApi';
import type { Plan, PlanFormData } from 'src/types/plan';
import { emptyPlanForm, planToForm } from 'src/types/plan';
import { formatMoney } from 'src/utils/formatMoney';

const AdminPlans = () => {
  const { data: plans, error, isLoading } = useApi<Plan[]>('/plans');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState<PlanFormData>(emptyPlanForm());
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const openCreateDialog = () => {
    setEditingPlan(null);
    setForm(emptyPlanForm());
    setFormError('');
    setDialogOpen(true);
  };

  const openEditDialog = (plan: Plan) => {
    setEditingPlan(plan);
    setForm(planToForm(plan));
    setFormError('');
    setDialogOpen(true);
  };

  const openDeleteDialog = (plan: Plan) => {
    setDeletingPlan(plan);
    setDeleteDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingPlan(null);
    setFormError('');
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletingPlan(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError('');
    setSubmitting(true);

    const payload = {
      name: form.name,
      price: Number(form.price),
      duration_days: Number(form.duration_days),
    };

    try {
      if (editingPlan) {
        await putFetcher(`/plans/${editingPlan.id}`, payload);
      } else {
        await postFetcher('/plans', payload);
      }
      await mutate('/plans');
      closeDialog();
    } catch (err) {
      setFormError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPlan) {
      return;
    }

    setSubmitting(true);
    try {
      await deleteFetcher(`/plans/${deletingPlan.id}`);
      await mutate('/plans');
      closeDeleteDialog();
    } catch (err) {
      setFormError(getAuthErrorMessage(err));
      closeDeleteDialog();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer title="Plans" description="Manage membership plans">
      <ParentCard
        title="Plans"
        action={
          <Button variant="contained" color="primary" onClick={openCreateDialog}>
            Add plan
          </Button>
        }
      >
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
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Duration (days)</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plans?.length ? (
                  plans.map((plan) => (
                    <TableRow key={plan.id} hover>
                      <TableCell>{plan.name}</TableCell>
                      <TableCell align="right">{formatMoney(plan.price)}</TableCell>
                      <TableCell align="right">{plan.duration_days}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          aria-label="edit plan"
                          onClick={() => openEditDialog(plan)}
                        >
                          <IconEdit size={18} />
                        </IconButton>
                        <IconButton
                          color="error"
                          aria-label="delete plan"
                          onClick={() => openDeleteDialog(plan)}
                        >
                          <IconTrash size={18} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography color="textSecondary" align="center" py={2}>
                        No plans yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </ParentCard>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingPlan ? 'Edit plan' : 'Add plan'}</DialogTitle>
          <DialogContent>
            <Stack spacing={0}>
              {formError ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formError}
                </Alert>
              ) : null}
              <CustomFormLabel htmlFor="plan-name">Name</CustomFormLabel>
              <CustomTextField
                id="plan-name"
                fullWidth
                required
                value={form.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
              <CustomFormLabel htmlFor="plan-price">Price</CustomFormLabel>
              <CustomTextField
                id="plan-price"
                type="number"
                fullWidth
                required
                inputProps={{ min: 0, step: '0.01' }}
                value={form.price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, price: e.target.value })
                }
              />
              <CustomFormLabel htmlFor="plan-duration">Duration (days)</CustomFormLabel>
              <CustomTextField
                id="plan-duration"
                type="number"
                fullWidth
                required
                inputProps={{ min: 1 }}
                value={form.duration_days}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, duration_days: e.target.value })
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={closeDialog} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {editingPlan ? 'Save' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete plan</DialogTitle>
        <DialogContent>
          <Typography>
            Delete <strong>{deletingPlan?.name}</strong>? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDeleteDialog} disabled={submitting}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={submitting}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default AdminPlans;
