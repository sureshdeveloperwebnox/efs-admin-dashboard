import { TfiSettings } from 'react-icons/tfi';

import { NavItemType } from 'types/menu';
import { ToolOutlined } from '@ant-design/icons';

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
        }
      ]
    }
  ]
};

export default settingsmenu;
