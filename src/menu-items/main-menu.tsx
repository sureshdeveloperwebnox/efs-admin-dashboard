import { DashboardOutlined, ApartmentOutlined  } from '@ant-design/icons';
import { NavItemType } from 'types/menu';

const mainmenu: NavItemType = {
  id: 'mainmenu',
  type: 'group',
  children: [
    {
      id: 'Dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: DashboardOutlined
    },
    {
        id: 'Organization',
        title: 'Organization',
        type: 'item',
        url: '/organization',
        icon: ApartmentOutlined 
      }
  ]
};

export default mainmenu;
