import { TfiSettings } from 'react-icons/tfi';

import { NavItemType } from 'types/menu';
import { ToolOutlined } from '@ant-design/icons';
import { GrUserSettings  } from "react-icons/gr";

const settingsmenu: NavItemType = {
  id: 'settingsmenu',
  type: 'group',
  children: [
    {
      id: 'Settings',
      title: 'Settings',
      type: 'collapse',
      icon: TfiSettings,
      children: [
        {
          id: 'Equipments',
          title: 'Equipments',
          type: 'item',
          url: '/equipment',
          icon: ToolOutlined
        },
         {
          id: 'Employer Roles',
          title: 'Employer Roles',
          type: 'item',
          url: '/employer-roles',
          icon: GrUserSettings
        }
      ]
    }
  ]
};

export default settingsmenu;
