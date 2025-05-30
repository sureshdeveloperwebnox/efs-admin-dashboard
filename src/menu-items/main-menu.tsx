import { DashboardOutlined, ApartmentOutlined } from '@ant-design/icons';
import { GrOrganization, GrGroup } from 'react-icons/gr';
import { GoPeople } from "react-icons/go";
import { BsCassette, BsClipboard2Check } from "react-icons/bs";
import { GrServices,  GrUserSettings  } from "react-icons/gr";
import { MdOutlinePerson4 } from "react-icons/md";
import { FaUserTie } from "react-icons/fa6";


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
    // {
    //   id: 'Organization',
    //   title: 'Organization',
    //   type: 'item',
    //   url: '/organization',
    //   icon: ApartmentOutlined
    // },
    {
      id: 'Customers',
      title: 'Customers',
      type: 'item',
      url: '/customers',
      icon: GoPeople
    },
    {
      id: 'Assets',
      title: 'Assets',
      type: 'item',
      url: '/assets',
      icon: BsCassette
    },
     {
      id: 'Services',
      title: 'Services',
      type: 'item',
      url: '/services',
      icon: GrServices
    },
     {
      id: 'Crew',
      title: 'Crew',
      type: 'item',
      url: '/crew',
      icon: GrGroup
    },
     {
      id: 'CrewMember',
      title: 'Crew Member',
      type: 'item',
      url: '/crew-member',
      icon: MdOutlinePerson4
    },
     {
      id: 'WorkOrders',
      title: 'Work Orders',
      type: 'item',
      url: '/work-orders',
      icon: BsClipboard2Check
    },
     {
      id: 'Employees',
      title: 'Employers',
      type: 'item',
      url: '/employees',
      icon: FaUserTie
    }
  ]
};

export default mainmenu;
