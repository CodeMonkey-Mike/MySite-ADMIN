import { Box } from 'theme-ui';
import { theme } from 'src/theme';

export const AdminLogo = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: `${theme.colors.white}`,
        fontSize: `${theme.fontSizes[2]}px`,
        p: `${theme.space[2]}px`,
        textTransform: 'uppercase',
      }}
    >
      MN ADMIN
    </Box>
  );
};
