const Booking = require('../../models/booking');
const Event = require('../../models/event');
const {transformBooking,transformEvent} = require('./merge');

module.exports = {
    booking: async ()=>{
        try {
            const bookings = await Booking.find()
            return bookings.map((booking)=>{
                return transformBooking(booking);
            });
        } catch (error) {
            throw error
        }
    },
    bookEvent: async (args)=>{
        try {
            const fetchedEvent = await Event.findOne({_id:args.eventId})
        const booking = new Booking({
            user: '5f9bb14f87d206436c08c512',
            event: fetchedEvent
        });
        const result = await booking.save();
        return transformBooking(result);   
        } catch (error) {
            throw error
        }
    },
    cancelBooking: async (args) => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            console.log(event);
            await Booking.deleteOne({_id:args.bookingId});
            return event;
        } catch (error) {
            throw error;
        }
    }
}