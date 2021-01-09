const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User  = require('../../models/user');
const Booking = require('../../models/booking');

const events = async (eventId)=>{
    try {
        const events = await Event.findById({_id: {$in: eventId}});
        console.log('events',events);
        return events.map(event => {
            return {...event._doc, date: new Date(event.date).toISOString(), creator: user.bind(this, event.creator)}
        })
    } catch (error) {
        throw error;
    }
}

const user = async (userId)=>{
    try {
        const user = await User.findById(userId)
        console.log('user detail ', user)
        return {...user._doc, createdEvents: events.bind(this, user.createdEvents)}    
    } catch (error) {
        throw error
    }
}

const singleEvent = async (eventId)=>{
    try {
        const event = await Event.findById(eventId)
        return {
            ...event._doc,
            creator: user.bind(this, event.creator)
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    events: async () =>{
        try {
            const events = await Event.find().populate('creator')
            return events.map((event)=>{
                console.log('event',event);
                return {...event._doc, date: new Date(event.date).toISOString(),
                    creator: user.bind(this,event.creator)
                };
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    bookings: async ()=>{
        try {
            const bookings = await Booking.find();
            return bookings.map((booking)=>{
                return {...booking._doc,
                        user: user.bind(this, booking.user),
                        event: singleEvent.bind(this,booking._doc.event),
                        createdAt: new Date(booking._doc.createdAt).toISOString(),
                        updatedAt: new Date(booking._doc.updatedAt).toISOString()
                    };
            });
        } catch (error) {
            throw error
        }
    },
    createEvent: async (args)=>{
        // const event = {
        //     _id: Math.random().toString(),
        //     title: args.eventInput.title,
        //     description: args.eventInput.description,
        //     price: +args.eventInput.price,
        //     date: args.eventInput.date
        // }
        // console.log(event);
        // events.push(event);
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "5ff8a06817d2ef408c4b6042"
        });
        let createdEvents;
        try {
            const result = await event.save()
            createdEvents = {...result._doc,date: new Date(event.date).toISOString(), creator: user.bind(this,result.creator)};
            console.log('result ',result._doc);   
            const creator = await User.findById("5ff8a06817d2ef408c4b6042");
            if(!creator)
                {
                    throw new Error('User not exists');
                }
            creator.createdEvents.push(event);
            await creator.save()
            return createdEvents; 
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    createUser: async (args)=>{
        try {
            const existingUser = await User.findOne({email:args.userInput.email})
            if(existingUser)
            {
                throw new Error('User already exists');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password,12)

            const user = new User({
                email:args.userInput.email,
                password:hashedPassword
            });
            const result = await user.save()
            console.log('result ',result);
            return {...result._doc}
        } catch (error) {
            throw error;
        }
    },
    bookEvent: async(args)=>{
        const fetchedEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking({
            user: "5ff8a06817d2ef408c4b6042",
            event: fetchedEvent
        });
        const result = await booking.save()
        return {...result._doc,
            user: user.bind(this,result._doc.user),
            event: singleEvent.bind(this, result._doc.event),
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString()}
    },
    cancelBooking: async(args)=>{
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            console.log(booking)
            const event = {
                ...booking.event._doc,
                //_id: booking.event.id,
                creator: user.bind(this, booking.event.creator)
            };
            console.log(event);
            await Booking.deleteOne({_id: args.bookingId});
            return event;
        } catch (error) {
            throw error;
        }
    }
}