"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const mongoose_1 = require("mongoose");
const connectToDatabase = async () => {
    try {
        await (0, mongoose_1.connect)(`mongodb+srv://learn-GQL:${process.env.MONGODB_PASSWORD}@learn-graphql.nilpc.mongodb.net/?retryWrites=true&w=majority&appName=Learn-graphql`);
        console.log("Connected to the database successfully");
    }
    catch (error) {
        console.error("Failed to connect to the database:", error.message);
        throw error; // Rethrow the error after logging
    }
};
exports.connectToDatabase = connectToDatabase;
//# sourceMappingURL=connection.js.map