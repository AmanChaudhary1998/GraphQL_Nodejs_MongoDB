const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');

const events = async (eventsIds)=>{
    try{
        const events = await Event.find({_id:{$in: eventsIds}})
    events.map((output)=>{
            return {...output._doc,_id:output.id,
                date: new Date(output._doc.date).toISOString(),
                creator:user.bind(this,output.creator)
            };
        });
        return events;
    }catch(err){
        throw err;
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
    }
}