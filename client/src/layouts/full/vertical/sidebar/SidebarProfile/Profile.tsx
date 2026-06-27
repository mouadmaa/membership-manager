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
      sx={{ mx: 3, mt: 3, mb: 4, p: 2, bgcolor: 'secondary.light', borderRadius: 2 }}
    >
      {!hideMenu ? (
        <>
          <Avatar alt={user?.name || 'User'} src={img1} sx={{ width: 40, height: 40 }} />

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              {user?.name}
            </Typography>
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
