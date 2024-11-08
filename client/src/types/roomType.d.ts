import { ReservationEvent } from "./evenType";



export interface RoomType {
    id:          number;
    name:        string;
    status:      string;
    description: string;
    capacity:    number;
    amenities:   string;
    created_at:  Date;
    updated_at:  Date;
}


