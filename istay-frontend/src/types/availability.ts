export type AvailabilityOffer = {
  roomTypeId: string
  roomTypeName: string
  availableRooms: number
  nightlyRate: number
  totalRate: number
}

export type AvailabilityResult = {
  propertyId: string
  propertyName: string
  checkIn: string
  checkOut: string
  nights: number
  offers: AvailabilityOffer[]
}

export type ApiError = {
  message: string
  status?: number
}
