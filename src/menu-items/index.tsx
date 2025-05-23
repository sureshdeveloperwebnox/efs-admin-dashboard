// project imports
import samplePage from './sample-page';
import other from './other';
import pages from './pages';

// types
import { NavItemType } from 'types/menu';
import mainmenu from './main-menu';
import settingsmenu from './settings-menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [ mainmenu, settingsmenu ]
};

export default menuItems;
