import { DashboardOutlined, ApartmentOutlined } from '@ant-design/icons';
import { GrOrganization } from 'react-icons/gr';
import { GoPeople } from "react-icons/go";

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
      id: 'Company',
      title: 'Company',
      type: 'item',
      url: '/company',
      icon: GrOrganization
    },
    {
      id: 'Organization',
      title: 'Organization',
      type: 'item',
      url: '/organization',
      icon: ApartmentOutlined
    },
    {
      id: 'Customers',
      title: 'Customers',
      type: 'item',
      url: '/customers',
      icon: GoPeople
    }
  ]
};

export default mainmenu;
