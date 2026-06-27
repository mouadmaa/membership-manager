import { useEffect, useState, type ComponentType } from 'react';
import type { Props } from 'react-apexcharts';
import { Box, CircularProgress } from '@mui/material';

const ApexChart = (props: Props) => {
  const [Chart, setChart] = useState<ComponentType<Props> | null>(null);

  useEffect(() => {
    let active = true;

    import('react-apexcharts')
      .then((module) => {
        if (active) {
          setChart(() => module.default);
        }
      })
      .catch(() => {
        if (active) {
          setChart(null);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (!Chart) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={props.height || 200}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return <Chart {...props} />;
};

export default ApexChart;
