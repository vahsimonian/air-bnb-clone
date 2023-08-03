import React, { useContext, useState } from 'react'
import { UserContext } from './UserContext'
import { Link, Navigate, useParams } from 'react-router-dom'
import axios from 'axios'
import AccountNav from './AccountNav'
import PlacesPage from './PlacesPage'

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null)
  const { ready, user, setUser } = useContext(UserContext)
  let { subpage } = useParams()
  if (subpage === undefined) {
    subpage = 'profile'
  }

  async function logout() {
    await axios.post('/logout')
    setRedirect('/')
    setUser(null)
  }

  if (!ready) {
    return 'Loading'
  }

  if (ready && !user && !redirect) {
    return <Navigate to={'/login'} />
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <div>
      <AccountNav />
      {subpage === 'profile' && (
        <div className='text-center mt-8 max-w-lg mx-auto'>
          Looged in {user.name} ({user.email}) <br />
          <button onClick={logout} className='primary max-w-sm mt-2'>
            Logout
          </button>
        </div>
      )}
      {subpage === 'places' && <PlacesPage />}
    </div>
  )
}
