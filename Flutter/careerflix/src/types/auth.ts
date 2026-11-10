export type UserRole = 'candidate' | 'hiring_manager' | 'admin'

export type CareerUser = {
  uid: string
  email: string
  displayName: string
  role: UserRole
  createdAt: string
}

export function isStaff(role: UserRole) {
  return role === 'hiring_manager' || role === 'admin'
}

export function roleLabel(role: UserRole) {
  switch (role) {
    case 'admin':
      return 'Admin'
    case 'hiring_manager':
      return 'Hiring manager'
    default:
      return 'Candidate'
  }
}
