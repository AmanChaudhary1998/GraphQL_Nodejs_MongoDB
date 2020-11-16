const Event = require('../../models/event');
const {transformBooking,transformEvent} = require('./merge');

module.exports = {
    events : async ()=>{
        try {
            const events = await Event.find()
            console.log(events)
                return events.map((output)=>{
                    return transformEvent(output);
                });
        } catch (error) {
            throw error;
        }
    },
    createEvent: async (args) =>{
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "5f9d3b87c418474110e0f719"
        });
        let createdEvent;
        try {
            const result = await event.save()
            createdEvent =  transformEvent(result);
            const createUser = await User.findById('5f9d3b87c418474110e0f719')
            if(!createUser)
            {
                throw new Error('User Not exists');
            }
            createUser.createdEvents.push(event);
            await createUser.save();

            console.log(result);
            return createdEvent;    
        } catch (error) {
            throw error;
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
    }
}