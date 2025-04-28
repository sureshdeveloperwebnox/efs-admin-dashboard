// material-ui

import { useTheme } from '@mui/material/styles';
import Image from 'next/image';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * const logoIconDark = '/assets/images/logo-icon-dark.svg';
 * const logoIcon = '/assets/images/logo-icon.svg';
 * import { ThemeMode } from 'config';
 */
import efs_logo_svg from '../../assets/images/icons/efsfavicon.png'

// ==============================|| LOGO ICON SVG ||============================== //

export default function LogoIcon() {
  // const theme = useTheme();

  return (
    <Image 
    src={efs_logo_svg} 
    alt="EFS Logo" 
    width={40}
    height={40}
    priority
  />
  );
}
