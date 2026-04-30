import mongoose, { Document } from "mongoose";

export interface IEvent extends Document {

    title: string
    description: string
    date: Date
    venue: string
    totalSeats: number
    availableSeats: number
    price: number
    organizer: mongoose.Types.ObjectId
    createdAt: Date

}

const EventSchema = new mongoose.Schema<IEvent>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    price: { type: Number, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }

})

export default mongoose.model<IEvent>('Event', EventSchema)