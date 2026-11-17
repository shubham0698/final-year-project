import { useEffect, useState } from 'react'
import { Check, Shield, UserCheck, Users, X } from 'lucide-react'
import api from '../api/axiosInstance'
import Button from '../components/Button.jsx'
import EmptyState from '../components/EmptyState.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import './UserManagement.css'

const ROLES = [
  'Admin',
  'Principal Investigator',
  'Study Coordinator',
  'Clinical Monitor',
  'Ethics Committee',
  'Pharmacovigilance Officer',
  'Leadership',
  'Regulator'
]

const fallbackUsers = [
  {
    id: 1,
    fullName: 'Dr. Anand Sharma',
    email: 'admin@aiia.gov.in',
    phone: 9876543210,
    role: 'Admin',
    status: 'Active',
    designation: 'Director / Principal Administrator',
    dateCreated: '2026-05-15'
  },
  {
    id: 2,
    fullName: 'Prof. Rajeshwari Nair',
    email: 'pi@aiia.gov.in',
    phone: 9811223344,
    role: 'Principal Investigator',
    status: 'Active',
    designation: 'Head of Kayachikitsa',
    dateCreated: '2026-07-20'
  },
  {
    id: 3,
    fullName: 'Dr. Sunita Kulkarni',
    email: 'ethics@aiia.gov.in',
    phone: 9833445566,
    role: 'Ethics Committee',
    status: 'Active',
    designation: 'Member Secretary, IEC',
    dateCreated: '2026-08-10'
  }
]

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setLoading(true)
    try {
      const res = await api.get('/api/users')
      if (res.data && res.data.length > 0) {
        setUsers(res.data)
      } else {
        setUsers(fallbackUsers)
      }
    } catch {
      setUsers(fallbackUsers)
    } finally {
      setLoading(false)
    }
  }

  async function handleRoleChange(userId, newRole) {
    try {
      await api.patch(`/api/users/${userId}/role`, { role: newRole })
    } catch {}
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, role: newRole } : u))
    )
  }

  async function handleStatusToggle(userId, currentStatus) {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active'
    try {
      await api.patch(`/api/users/${userId}/status`, { status: nextStatus })
    } catch {}
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, status: nextStatus } : u))
    )
  }

  return (
    <div className="users-page">
      <PageHeader
        eyebrow="Access Control & Administration"
        title="User & Role Management"
        description="Enforce Role-Based Access Control (RBAC) across 8 clinical stakeholder roles in compliance with GCP guidelines."
      />

      <div className="users-table-container">
        {users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description="No users are registered in the system."
          />
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Contact</th>
                <th>Designation</th>
                <th>Role (RBAC)</th>
                <th>Status</th>
                <th>Registered Date</th>
                <th>Account Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.fullName}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.email}</div>
                  </td>
                  <td>{u.phone || '—'}</td>
                  <td>{u.designation || 'Staff / Clinician'}</td>
                  <td>
                    <select
                      className="users-role-select"
                      value={u.role || 'Principal Investigator'}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                    >
                      {ROLES.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <StatusBadge
                      status={u.status === 'Active' ? 'approved' : 'rejected'}
                      label={u.status || 'Active'}
                    />
                  </td>
                  <td>{u.dateCreated || '—'}</td>
                  <td>
                    <Button
                      size="small"
                      variant={u.status === 'Active' ? 'outline' : 'primary'}
                      onClick={() => handleStatusToggle(u.id, u.status)}
                    >
                      {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

