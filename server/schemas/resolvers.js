const { User, Message } = require("../models");
const { AuthenticationError } = require("graphql-tag");
const { signToken } = require("../utils/auth");
const { PubSub } =  require('graphql-subscriptions');
const pubsub = new PubSub();

// Resolvers Function Start//
const resolvers = {
  Query: {
    ///Connects to me query in typeDef//
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password");
         
        // .populate('friends');
        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
    //Gets All Users//
    users: async () => {
      return User.find().select("-__v -password");
      // .populate('friends');
    },
    //Gets Single User//
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password");
      // .populate('thoughts');
    },
    usersByRole: async (parent, { role }) => {
      return User.find({role}).select("-__v -password");
      // .populate('friends');
    },
    usersById: async (parent,  args ) => {
      const stringifiedArgs = JSON.stringify(args._id);
      return User.find({ '_id': { $in: args._id } }).select("-__v -password");
    },
    messages: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Message.find(params).sort({ createdAt: -1 });
    },
    // messagesByUsername: async (parent, { username }) => {
    //   const params = username? { username } : {};
    //   return Message.find(params).sort({ createdAt: -1 });
    // },
    // messagesByRecipient: async (parent, { recipient }) => {
    //   const params = recipient? { recipient } : {};
    //   return Message.find(params).sort({ createdAt: -1 });
    // },
    messagesToRecipient: async (parent, { username, recipient }, context) => {
      // if(context.user) {
        return Message.find({ username: username, recipient: recipient }).sort({ createdAt: -1 });
      // }
      // throw new AuthenticationError("Not logged in");
    },
    //Get All Movies//
    // movies: async (parent, { username }) => {
    //   const params = username ? { username } : {};
    //   return Movie.find(params).sort({ createdAt: -1 });
    // },
    //Gets Movie By ID//
    // movie: async (parent, { _id }) => {
    //   return Movie.findOne({ _id });
    // },
  },
  /// --- Mutation Start --- ///
  Mutation: {
    //Creates New User//
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    editUser: async (parent, args, context) => {
      // const user = await User.create(args);
      // const token = signToken(user);

      // return { token, user };
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          args,
          { new: true }
        )
        const token = signToken(user);

    
        return { token, user };
      }
      //Error if not logged in//
      throw new AuthenticationError('You need to be logged in!');
    },
    //Mutation for login//
    login: async (parent, { email, password }) => {
      /// ---- Const searches for email ---///
      const user = await User.findOne({ email });
      /// ---- if email not found it throws error ---///
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }
      /// ---- Const searches for correct password ---///
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    
    addUserInterests: async (parent, args, context) => { // this is how we can control interest addtions
      if (context.user) { // if logged in
        let combined = []
        const oldUserData = await User.findById( // first find the whole user data by ID
          { _id: context.user._id }
        )
        if(oldUserData.interests.length) {
          const previousStrings = oldUserData.interests; // grab their old interest/strings
          const passedArgs = args; // save the arguements its an object with an array inside...
          combined = [...previousStrings, ...passedArgs.interests] // combine them, notice
          combined = combined.filter((item, index) => combined.indexOf(item) === index); // this will remove duplicate values for us
        } else {
          
          const passedArgs = args; // save the arguements its an object with an array inside...
          combined = [...passedArgs.interests] // combine them, notice
          combined = combined.filter((item, index) => combined.indexOf(item) === index); // this will remove duplicate values for us
        }
       
        // console.log('combined array: ', combined) // checking the values in the terminal console
        
        const user = await User.findByIdAndUpdate( // and finally add the new combined array
          { _id: context.user._id },
          { $set: { interests: combined } }, // use $set to replace the contents instead of making/adding new stuff
          { new: true }
        );
        const token = signToken(user);

        return {user, token};
      }

      throw new AuthenticationError("Not logged in");
    },
    deleteUserInterests: async (parent, args, context) => {
      if (context.user) {
        // console.log(args.interests)
        const user = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { interests: { $in: args.interests }  } }, //sauce
          { new: true }
        );
        const token = signToken(user);

        return {user, token}
      }
      throw new AuthenticationError("Not logged in");

    },
    editUser: async (parent, args, context) => {
      // const user = await User.create(args);
      // const token = signToken(user);

      // return { token, user };
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          args,
          { new: true }
        )
        const token = signToken(user);

    
        return { token, user };
      }
      //Error if not logged in//
      throw new AuthenticationError('You need to be logged in!');
    },
    //Add A New Movie///
    // addMovie: async (parent, args, context) => {
    //   if (context.user) {
    //     const movie = await Movie.create({
    //       ...args,
    //       username: context.user.username,
    //     });
    //     //Finds User By ID & Adds Movie//
    //     await User.findByIdAndUpdate(
    //       { _id: context.user._id },
    //       { $push: { savedMovie: movie } },
    //       { new: true }
    //     );

    //     return movie;
    //   }
    //   //Error If Not Logged In//
    //   throw new AuthenticationError("You need to be logged in!");
    // },
    //Add friend by friendId, then added to friends array//
    addFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { friends: friendId } },
          { new: true }
        ).populate('friends');
    
        return updatedUser;
      }
    //Error if not logged in//
      throw new AuthenticationError('You need to be logged in!');
    },
    removeFriend: async (parent, {friendId}, context) => {
      if(context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { friends: friendId }},
          { new: true }
        ).populate('friends')

        return updatedUser;
      }
      //Error if not logged in//
      throw new AuthenticationError('You need to be logged in!');
    },
    // postMessage: async (parent, {text, recipient}, context) => {
    //   if (context.user) {
    //     const message = await Message.create({ username: context.user.username, text: text, recipient: recipient });
    
    //     await User.findByIdAndUpdate(
    //       { _id: context.user._id },
    //       { $push: { messages: message } },
    //       { new: true }
    //     );
    //     pubsub.publish('MESSAGE_POSTED', { postCreated: message }); 
    //     return message;
    //   }
    
    //   throw new AuthenticationError('You need to be logged in!');
    // }, 
    postMessage: async (parent, {username, text, recipient}, context) => {
      if (context.user) {
        const message = await Message.create({ username: username, text: text, recipient: recipient });
    
        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { messages: message } },
          { new: true }
        );
        pubsub.publish('MESSAGE_POSTED', { postCreated: message }); 
        return message;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },  
  },
  Subscription: {
    messagePosted: {
      resolve: (payload) => payload.postCreated,
      subscribe: () => pubsub.asyncIterator('MESSAGE_POSTED'),
             
    },
  },
};
/// ---- Resolvers Function End ---- ////

module.exports = resolvers;
