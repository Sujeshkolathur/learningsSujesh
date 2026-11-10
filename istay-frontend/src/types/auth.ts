export type LoginResponse = {
  accessToken: string
  tokenType: string
  username: string
  propertyId: string
  roles: string[]
}

export type AuthSession = LoginResponse
