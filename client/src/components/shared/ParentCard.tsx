import { useContext, type ReactNode } from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardHeader, CardContent, Divider } from '@mui/material';
import { CustomizerContext } from 'src/context/CustomizerContext';

type Props = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

const ParentCard = ({ title, children, action }: Props) => {
  const theme = useTheme();
  const borderColor = theme.palette.divider;
  const { isCardShadow } = useContext(CustomizerContext);

  return (
    <Card
      sx={{ padding: 0, border: !isCardShadow ? `1px solid ${borderColor}` : 'none' }}
      elevation={isCardShadow ? 9 : 0}
      variant={!isCardShadow ? 'outlined' : undefined}
    >
      <CardHeader title={title} action={action} />
      <Divider />
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default ParentCard;
