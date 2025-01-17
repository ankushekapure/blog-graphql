import express from 'express'
import { config } from 'dotenv'
import { connectToDatabase } from './utils/connection';
import { graphqlHTTP } from 'express-graphql';
import handlers from './handlers/handlers';
// Dot Env Config
config();


const app = express();

app.use('/learn',graphqlHTTP({schema:handlers ,graphiql:true}));

connectToDatabase().then(
    () =>
        app.listen(process.env.PORT, () => console.log('Server Running On Port 3000')
        )

).catch((e) => console.log(e));
 