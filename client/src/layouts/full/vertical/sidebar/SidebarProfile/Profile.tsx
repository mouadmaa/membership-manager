import { Box, Avatar, Typography, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { IconPower } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import { useContext } from 'react';
import img1 from 'src/assets/images/profile/user-1.jpg';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { useAuth } from 'src/context/AuthContext';

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isSidebarHover, isCollapse } = useContext(CustomizerContext);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? isCollapse == 'mini-sidebar' && !isSidebarHover : '';

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: 'secondary.light' }}
    >
      {!hideMenu ? (
        <>
          <Avatar alt={user?.name || 'User'} src={img1} />

          <Box>
            <Typography variant="h6">{user?.name}</Typography>
            <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
              {user?.role}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top">
              <IconButton
                color="primary"
                onClick={handleLogout}
                aria-label="logout"
                size="small"
              >
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        ''
      )}
    </Box>
  );
};
