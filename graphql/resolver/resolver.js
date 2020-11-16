const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

const events = async (eventsIds)=>{
    try{
        const events = await Event.find({_id:{$in: eventsIds}})
    return events.map((output)=>{
            return {...output._doc,_id:output.id,
                date: new Date(output._doc.date).toISOString(),
                creator:user.bind(this,output.creator)
            };
        });
    }catch(err){
        throw err;
    }
}

const singleEvent = async (eventId)=>{
    try {
        const event = await Event.findById(eventId)
        return {
            ...event._doc, _id: event.id, creator:user.bind(this,event.creator)
        }
    } catch (error) {
        throw error
    }
}

const user = async (userId)=>{
    try {
        const user = await User.findById(userId)
        return {...user._doc,
            id: user.id,
            createEvent:events.bind(this,user._doc.createdEvents)
        };
    } catch (error) {
        throw error;   
    }
}

module.exports = {
    events : async ()=>{
        try {
            const events = await Event.find()
            console.log(events)
                return events.map((output)=>{
                    return { ...output._doc,
                        date: new Date(output._doc.date).toISOString(),
                        creator: user.bind(this, output._doc.creator)
                    };
                });
        } catch (error) {
            throw error;
        }
    },
    booking: async ()=>{
        try {
            const bookings = await Booking.find()
            return bookings.map((booking)=>{
                return {...booking._doc, _id:booking.id,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this,booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
            };
            });
        } catch (error) {
            throw error
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
            createdEvent =  {...result._doc,
                date: new Date(result._doc.date).toISOString(),
                 creator: user.bind(this, result._doc.creator)
            };
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
    createUser: async (args)=>{
        try {
            const existingUser = await User.findOne({email: args.userInput.email})
            if(existingUser)
            {
                throw new Error('User already exists');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password,12)

            const user = new User({
                email: args.userInput.email,
                password:hashedPassword
            })
            const result = await user.save();   
        
            return {...result._doc, password:null, _id:result.id }   
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
        return {...result._doc, 
            _id: result.id,
            user: user.bind(this, booking._doc.user),
            event: singleEvent.bind(this,booking._doc.event),
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString()
        };   
        } catch (error) {
            throw error
        }
    },
    cancelBooking: async (args) => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = {
                ...booking.event._doc,
                _id: booking.event.id,
                creator: user.bind(this,booking.event._doc.creator)
            };
            console.log(event);
            await Booking.deleteOne({_id:args.bookingId});
            return event;
        } catch (error) {
            throw error;
        }
    }
}