'use client';

// material-ui
import { useTheme } from '@mui/material/styles';

// project imports
import { ThemeMode } from 'config';
import Image from 'next/image';
import efs_logo from '../../assets/images/icons/efslogo.png';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * const logoDark = '/assets/images/logo-dark.svg';
 * const logo = '/assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

export default function LogoMain({ reverse }: { reverse?: boolean }) {
  // const theme = useTheme();

  return <> <Image src={efs_logo} alt="Easy Field Services" width={170}/> </>

}
