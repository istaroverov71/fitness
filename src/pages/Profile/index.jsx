import { useState } from 'react'
import ProfileScreen from './ProfileScreen'
import EditProfileScreen from './EditProfileScreen'

export default function Profile({ onClose }) {
  const [view, setView] = useState('profile') // 'profile' | 'edit'

  if (view === 'edit') {
    return <EditProfileScreen onBack={() => setView('profile')} />
  }

  return <ProfileScreen onBack={onClose} onEdit={() => setView('edit')} />
}
