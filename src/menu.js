import {
  mdiAccountCircle,
  mdiDesktopMac,
  mdiTable,
  mdiResponsive
} from '@mdi/js'

export default [
  'General',
  [
    {
      to: '/dashboard',
      icon: mdiDesktopMac,
      label: 'Dashboard'
    }
  ],
  'Menu',
  [
    {
      to: '/devices',
      label: 'Devices',
      icon: mdiTable
    },
    {
      to: '/plans',
      label: 'Plans',
      icon: mdiTable
    },
    {
      to: '/status',
      label: 'StatusLogs',
      icon: mdiTable
    },
    {
      to: '/photos',
      label: 'Photos',
      icon: mdiTable
    },
    {
      to: '/responsive',
      label: 'Responsive',
      icon: mdiResponsive
    },
    {
      to: '/profile',
      label: 'Profile',
      icon: mdiAccountCircle
    }
  ]
]
