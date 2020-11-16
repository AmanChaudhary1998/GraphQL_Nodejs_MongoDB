const Event = require('../../models/event');
const User = require('../../models/user');

const { dateToString } = require('../helpers/date');

const events = async (eventsIds)=>{
    try{
        const events = await Event.find({_id:{$in: eventsIds}})
    return events.map((output)=>{
            return transformEvent(output);
        });
    }catch(err){
        throw err;
    }
}

const singleEvent = async (eventId)=>{
    try {
        const event = await Event.findById(eventId)
        return transformEvent(event);
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

const transformBooking = (booking) =>{
    return {
        ...booking._doc, _id:booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this,booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    };
};

const transformEvent = (output) =>{
    return {...output._doc,_id:output.id,
        date: dateToString(output._doc.date),
        creator:user.bind(this,output.creator)
    };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;

// exports.user = user;
// exports.singleEvent = singleEvent;
// exports.events = events;