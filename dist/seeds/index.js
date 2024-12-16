import db from '../config/connections.js';
import { Users, Thoughts } from '../models/index.js';
import cleanDB from './cleanDB.js';
import { getRandomUser, getRandomThoughts } from './data.js';
try {
    await db();
    await cleanDB();
    // Create empty array to hold the students
    const users = [];
    // Loop 20 times -- add students to the students array
    for (let i = 0; i < 20; i++) {
        // Get some random assignment objects using a helper function that we imported from ./data
        const thoughts = getRandomThoughts(20);
        const fullName = getRandomUser();
        const first = fullName.split(' ')[0];
        const last = fullName.split(' ')[1];
        const email = `${first}${Math.floor(Math.random() * (99 - 18 + 1) + 18)}`;
        users.push({
            first,
            last,
            email,
            thoughts,
        });
    }
    // 
    const userData = await Users.create(users);
    // Add courses to the collection and await the results
    await Thoughts.create({
        name: 'UCLA',
        inPerson: false,
        students: [...userData.map(({ _id }) => _id)],
    });
    // Log out the seed data to indicate what should appear in the database
    console.table(users);
    console.info('Seeding complete! 🌱');
    process.exit(0);
}
catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
}
