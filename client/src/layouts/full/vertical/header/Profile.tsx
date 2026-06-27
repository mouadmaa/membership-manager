import React, { useState } from 'react';
import { Box, Menu, Avatar, Typography, Divider, Button, IconButton, Stack } from '@mui/material';
import { IconMail } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import { useAuth } from 'src/context/AuthContext';
import ProfileImg from 'src/assets/images/profile/user-1.jpg';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate('/auth/login');
  };

  return (
    <Box>
      <IconButton
        size="large"
        color="inherit"
        aria-controls="profile-menu"
        aria-haspopup="true"
        sx={{
          ...(Boolean(anchorEl) && {
            color: 'primary.main',
          }),
        }}
        onClick={handleOpen}
      >
        <Avatar
          src={ProfileImg}
          alt={user?.name || 'User'}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '300px',
            p: 3,
          },
        }}
      >
        <Typography variant="h6">User Profile</Typography>
        <Stack direction="row" py={2} spacing={2} alignItems="center">
          <Avatar src={ProfileImg} alt={user?.name || 'User'} sx={{ width: 56, height: 56 }} />
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
              {user?.role}
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              {user?.name}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <IconMail width={14} height={14} />
              {user?.email}
            </Typography>
          </Box>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Button variant="outlined" color="primary" fullWidth onClick={handleLogout}>
          Logout
        </Button>
      </Menu>
    </Box>
  );
};

export default Profile;
