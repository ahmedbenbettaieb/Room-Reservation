import { Participant } from "./participantType"
import { RoomType } from "./roomType"

export interface ReservationEvent {
  id: number
  title: string
  start_date: string
  end_date: string
  estimated_duration: number
  description: string
  room_id: number
  user_id: number
  status: string
  created_at: string
  updated_at: string
  room: RoomType
  participants?: Participant[]
}
