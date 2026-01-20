// assets
import {
  DashboardOutlined,
  SwapOutlined,
  WalletOutlined,
  BookOutlined,
  FileTextOutlined,
  CustomerServiceOutlined,
  SettingOutlined
} from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  SwapOutlined,
  WalletOutlined,
  BookOutlined,
  FileTextOutlined,
  CustomerServiceOutlined,
  SettingOutlined
};

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false,
      roles: ['admin', 'user']
    },
     {
      id: 'merchant',
      title: 'Merchant',
      type: 'item',
      url: '/merchant',
      icon: icons.DashboardOutlined,
      breadcrumbs: false,
      roles: ['admin']
    },
    {
      id: 'util-transaction',
      title: 'Transaction',
      type: 'item',
      url: '/transaction',
      icon: icons.SwapOutlined,
       roles: ['admin', 'user']
    },
    {
      id: 'virtual_accounts',
      title: 'Virtual Accounts',
      type: 'item',
      url: '/virtual_accounts',
      icon: icons.WalletOutlined,
       roles: ['admin', 'user']
    },
    {
      id: 'ledger',
      title: 'Ledger',
      type: 'item',
      url: '/ledger',
      icon: icons.BookOutlined,
       roles: ['user']
    },
    {
      id: 'vanlog',
      title: 'Van Logs',
      type: 'item',
      url: '/vanlog',
      icon: icons.FileTextOutlined,
       roles: ['admin', 'user']
    },
    {
      id: 'support',
      title: 'Support',
      type: 'item',
      url: '/support',
      icon: icons.CustomerServiceOutlined,
       roles: ['user']
    },
    {
      id: 'setting',
      title: 'Setting',
      type: 'item',
      url: '/setting',
      icon: icons.SettingOutlined,
       roles: ['user']
    },
    {
      id: 'service',
      title: 'Service',
      type: 'item',
      url: '/service',
      icon: icons.SettingOutlined,
      roles: ['admin']
    },
    {
      id: 'api_manager',
      title: 'Api Manager',
      type: 'item',
      url: '/apimanager',
      icon: icons.SettingOutlined,
      roles: ['admin']
    },
    {
      id: 'order',
      title: 'Order',
      type: 'item',
      url: '/order',
      icon: icons.SettingOutlined,
      roles: ['admin']
    }
  ]
};

export default dashboard;
