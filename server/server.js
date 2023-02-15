require("dotenv").config();
const express = require("express");
// import ApolloServer
const { ApolloServer } =  require('@apollo/server');
const { expressMiddleware } =  require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } =  require('@apollo/server/plugin/drainHttpServer');
const http =  require('http');
const cors =  require('cors');
const { json } =  require('body-parser');
// Import Middleware Function From Auth //
const { authMiddleware } = require("./utils/auth");
const { makeExecutableSchema } =  require('@graphql-tools/schema');
const { WebSocketServer } =  require('ws');
const { useServer } =  require('graphql-ws/lib/use/ws');
const path = require("path");

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");
const schema = makeExecutableSchema({ typeDefs, resolvers });

const db = require("./config/connection");
const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3001;
// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  // typeDefs,
  // resolvers,
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
  // ensures that every request performs an authentication check //
  context: authMiddleware, //old from Apollo 3, new context to pass auth middleware is inside app.use 
});

const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if app.use
  // serves expressMiddleware at a different path
  path: '/graphql',
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDef, resolvers) => {
  await server.start();
  // integrate our Apollo server with the Express application as middleware
  // server.applyMiddleware({ app });
  app.use(
    '/graphql',
    cors(),
    json(),
    expressMiddleware(server, {
      // context: async ({ req }) => ({ token: req.headers.token }),
      context: authMiddleware,
    }),
  );
  

  // Serve up static assets
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
  }

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });

  db.once("open", () => {
    // app.listen(PORT, () => {
    httpServer.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      // log where we can go to test our GQL API
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
