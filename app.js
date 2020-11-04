const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const mongoose  = require('mongoose');

const graphQLSchema = require('./graphql/schema/schema');
const graphQLResolver = require('./graphql/resolver/resolver');

const app = express();

app.use(bodyParser.json())

app.use('/graphql',graphqlHttp({
    schema: graphQLSchema,
    rootValue: graphQLResolver,
    graphiql:true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@amanmern.o3hq5.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
.then(()=>{
    const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
})
})
.catch((err)=>{
    console.log(err);
})
