import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import User from '../models/Users';
import { Thoughts, Reaction } from '../models/Thoughts';  // Import Thoughts correctly


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogDB')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Seed function
async function seedDatabase() {
    try {
        // Clear existing data
        await User.deleteMany();
        await Thoughts.deleteMany();
        await Reaction.deleteMany();

        // Create fake Users
        const users = [];
        for (let i = 0; i < 5; i++) {
            const user = new User({
                username: faker.internet.userName(),
                email: faker.internet.email(),
                thoughts: [],
                friends: [],
            });
            users.push(user);
            await user.save(); // Save user to the database
        }

        // Create fake Thoughts and Reactions
        for (let i = 0; i < 10; i++) {
            const user = faker.helpers.arrayElement(users);
            const thought = new Thoughts({
                thoughtText: faker.lorem.sentence(),
                username: user.username,
            });

            await thought.save(); // Save thought to the database
            user.thoughts.push(thought._id as mongoose.Schema.Types.ObjectId);
            await user.save();

            const numReactions = faker.number.int({ min: 0, max: 5 });
            for (let j = 0; j < numReactions; j++) {
                const reaction = new Reaction({
                    reactionId: faker.string.uuid(),
                    reactionBody: faker.lorem.sentence(),
                    username: faker.helpers.arrayElement(users).username,
                });

                await reaction.save();
                thought.reactions.push(new mongoose.Types.ObjectId(reaction._id));
                await thought.save();
            }
        }

        // Create fake Friendships
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const numberOfFriends = faker.number.int({ min: 1, max: 3 });
            const friends = faker.helpers.arrayElements(users, numberOfFriends);

            for (const friend of friends) {
                // Ensure we're not adding the user to themselves
                if (!friend._id.equals(user._id)) {
                    // Check if the user is not already friends with the friend
                    if (!user.friends.some(f => new mongoose.Types.ObjectId(f).equals(friend._id ))) {
                        user.friends.push(friend._id as mongoose.Schema.Types.ObjectId);
                        await user.save(); // Save the user after modifying friends
                    }

                    // Check if the friend is not already friends with the user
                    if (!friend.friends.some(f => new mongoose.Types.ObjectId(f).equals(user._id))) {
                        friend.friends.push(user._id as mongoose.Schema.Types.ObjectId);
                        await friend.save(); // Save the friend after modifying friends
                    }
                }
            }
        }

        console.log('Database seeded successfully!');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding the database:', err);
    }
}

// Call the seed function
seedDatabase();
