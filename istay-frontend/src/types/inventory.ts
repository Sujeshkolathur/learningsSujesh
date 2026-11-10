export type Property = {
  propertyId: string
  name: string
}

export type RoomType = {
  roomTypeId: string
  propertyId: string
  name: string
  totalRooms: number
  nightlyRate: number
}

export type PropertyInventory = {
  property: Property
  roomTypes: RoomType[]
}
