import {connect} from 'mongoose'
export const connectToDatabase = async () => {
    try {
        
        await connect(
            `mongodb+srv://learn-GQL:${process.env.MONGODB_PASSWORD}@learn-graphql.nilpc.mongodb.net/?retryWrites=true&w=majority&appName=Learn-graphql`
        );
        console.log("Connected to the database successfully");
    } catch (error) {
        console.error("Failed to connect to the database:", error.message);
        throw error; // Rethrow the error after logging
    }
};

    

