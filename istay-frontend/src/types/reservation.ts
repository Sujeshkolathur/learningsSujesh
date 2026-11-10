export type ReservationResponse = {
  reservationId: string
  propertyId: string
  roomTypeId: string
  checkIn: string
  checkOut: string
  nights: number
  guestName: string
  guestEmail: string
  status: string
  nightlyRate: number
  totalRate: number
  createdAt: string
}

export type ReservationListResponse = {
  reservations: ReservationResponse[]
  count: number
}

export type ReservationStatusFilter = 'ALL' | 'CONFIRMED' | 'CANCELLED'
