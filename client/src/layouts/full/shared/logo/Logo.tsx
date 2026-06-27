import { FC, useContext } from 'react';
import { Link } from 'react-router';
import { Box, Typography, useTheme } from '@mui/material';
import { IconTicket } from '@tabler/icons-react';
import config from 'src/context/config';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { APP_NAME } from 'src/config/app';

const Logo: FC = () => {
  const theme = useTheme();
  const { isCollapse, isSidebarHover, activeMode } = useContext(CustomizerContext);
  const collapsed = isCollapse === 'mini-sidebar' && !isSidebarHover;

  return (
    <Box
      component={Link}
      to="/"
      sx={{
        height: config.topbarHeight,
        width: collapsed ? '40px' : '180px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: activeMode === 'dark' ? 'common.white' : 'text.primary',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconTicket size={collapsed ? 28 : 32} stroke={1.75} color={theme.palette.primary.main} />
        {!collapsed ? (
          <Typography variant="h5" fontWeight={700} lineHeight={1.1} color="inherit">
            {APP_NAME}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
};

export default Logo;
