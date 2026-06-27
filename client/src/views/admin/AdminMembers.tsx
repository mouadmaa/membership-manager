import { FormEvent, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
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
import { IconEdit, IconTrash, IconX } from '@tabler/icons-react';
import { mutate } from 'swr';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { deleteFetcher, postFetcher, putFetcher } from 'src/api/fetcher';
import { getAuthErrorMessage } from 'src/context/AuthContext';
import { useApi } from 'src/hooks/useApi';
import type { Member, MemberFormData } from 'src/types/member';
import MemberDetailDrawer from 'src/components/members/MemberDetailDrawer';
import { buildMembersPath, emptyMemberForm, getMemberStatus, memberToForm } from 'src/types/member';

const drawerWidth = 420;

const AdminMembers = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const membersPath = useMemo(() => buildMembersPath(search, statusFilter), [search, statusFilter]);

  const { data: members, error, isLoading } = useApi<Member[]>(membersPath);

  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const detailPath = selectedMemberId ? `/members/${selectedMemberId}` : null;
  const { data: memberDetail, isLoading: detailLoading } = useApi<Member>(detailPath);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);
  const [form, setForm] = useState<MemberFormData>(emptyMemberForm());
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const refreshMembers = async () => {
    await mutate(membersPath);
    if (selectedMemberId) {
      await mutate(`/members/${selectedMemberId}`);
    }
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    setSearch(searchInput);
  };

  const openCreateDialog = () => {
    setEditingMember(null);
    setForm(emptyMemberForm());
    setFormError('');
    setDialogOpen(true);
  };

  const openEditDialog = (member: Member, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingMember(member);
    setForm(memberToForm(member));
    setFormError('');
    setDialogOpen(true);
  };

  const openDeleteDialog = (member: Member, event: React.MouseEvent) => {
    event.stopPropagation();
    setDeletingMember(member);
    setDeleteDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingMember(null);
    setFormError('');
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletingMember(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      if (editingMember) {
        await putFetcher(`/members/${editingMember.id}`, {
          name: form.name,
          email: form.email,
          national_id: form.national_id,
          phone: form.phone || null,
        });
      } else {
        await postFetcher('/members', {
          name: form.name,
          email: form.email,
          password: form.password,
          national_id: form.national_id,
          phone: form.phone || null,
        });
      }
      await refreshMembers();
      closeDialog();
    } catch (err) {
      setFormError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingMember) {
      return;
    }

    setSubmitting(true);
    try {
      await deleteFetcher(`/members/${deletingMember.id}`);
      if (selectedMemberId === deletingMember.id) {
        setSelectedMemberId(null);
      }
      await refreshMembers();
      closeDeleteDialog();
    } catch (err) {
      setFormError(getAuthErrorMessage(err));
      closeDeleteDialog();
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatusChip = (member: Member) => {
    const status = getMemberStatus(member);
    return (
      <Chip
        label={status === 'active' ? 'Active' : 'Expired'}
        color={status === 'active' ? 'success' : 'error'}
        size="small"
      />
    );
  };

  return (
    <PageContainer title="Members" description="Manage members">
      <ParentCard
        title="Members"
        action={
          <Button variant="contained" color="primary" onClick={openCreateDialog}>
            Add member
          </Button>
        }
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          mb={3}
          component="form"
          onSubmit={handleSearch}
        >
          <CustomTextField
            placeholder="Search..."
            fullWidth
            size="small"
            value={searchInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
          />
          <CustomTextField
            select
            label="Subscription status"
            value={statusFilter}
            size="small"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="expired">Expired</MenuItem>
          </CustomTextField>
          <Button type="submit" variant="outlined" size="small" sx={{ minWidth: 120 }}>
            Search
          </Button>
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
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>National ID</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Subscription</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members?.length ? (
                  members.map((member) => (
                    <TableRow
                      key={member.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => setSelectedMemberId(member.id)}
                      selected={selectedMemberId === member.id}
                    >
                      <TableCell>{member.user.name}</TableCell>
                      <TableCell>{member.user.email}</TableCell>
                      <TableCell>{member.national_id}</TableCell>
                      <TableCell>{member.phone || '—'}</TableCell>
                      <TableCell>{renderStatusChip(member)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          aria-label="edit member"
                          onClick={(e) => openEditDialog(member, e)}
                        >
                          <IconEdit size={18} />
                        </IconButton>
                        <IconButton
                          color="error"
                          aria-label="delete member"
                          onClick={(e) => openDeleteDialog(member, e)}
                        >
                          <IconTrash size={18} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography color="textSecondary" align="center" py={2}>
                        No members found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </ParentCard>

      <Drawer
        anchor="right"
        open={Boolean(selectedMemberId)}
        onClose={() => setSelectedMemberId(null)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: drawerWidth },
            p: 0,
          },
        }}
      >
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
            px: 3,
            py: 2,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight={600}>
              Member details
            </Typography>
            <IconButton onClick={() => setSelectedMemberId(null)}>
              <IconX size={20} />
            </IconButton>
          </Stack>
        </Box>

        <Box sx={{ p: 3, overflowY: 'auto' }}>
          {detailLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : memberDetail ? (
            <MemberDetailDrawer member={memberDetail} />
          ) : null}
        </Box>
      </Drawer>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingMember ? 'Edit member' : 'Add member'}</DialogTitle>
          <DialogContent>
            <Stack spacing={0}>
              {formError ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formError}
                </Alert>
              ) : null}
              <CustomFormLabel htmlFor="member-name">Name</CustomFormLabel>
              <CustomTextField
                id="member-name"
                fullWidth
                required
                value={form.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
              <CustomFormLabel htmlFor="member-email">Email</CustomFormLabel>
              <CustomTextField
                id="member-email"
                type="email"
                fullWidth
                required
                value={form.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
              {!editingMember ? (
                <>
                  <CustomFormLabel htmlFor="member-password">Password</CustomFormLabel>
                  <CustomTextField
                    id="member-password"
                    type="password"
                    fullWidth
                    required
                    inputProps={{ minLength: 8 }}
                    value={form.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                </>
              ) : null}
              <CustomFormLabel htmlFor="member-national-id">National ID</CustomFormLabel>
              <CustomTextField
                id="member-national-id"
                fullWidth
                required
                value={form.national_id}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, national_id: e.target.value })
                }
              />
              <CustomFormLabel htmlFor="member-phone">Phone (optional)</CustomFormLabel>
              <CustomTextField
                id="member-phone"
                fullWidth
                value={form.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={closeDialog} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {editingMember ? 'Save' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete member</DialogTitle>
        <DialogContent>
          <Typography>
            Delete <strong>{deletingMember?.user.name}</strong>? This cannot be undone.
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

export default AdminMembers;
