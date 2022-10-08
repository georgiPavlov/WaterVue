import {
  mdiAccountCircle,
  mdiDesktopMac,
  mdiTable
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
      label: 'Status Logs',
      icon: mdiTable
    },
    {
      to: '/photos',
      label: 'Photos',
      icon: mdiTable
    },
    {
      to: '/profile',
      label: 'Profile',
      icon: mdiAccountCircle
    }
  ]
]
