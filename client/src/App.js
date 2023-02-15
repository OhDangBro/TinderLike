import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split
} from "@apollo/client";
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from "./components/Login";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import Home from "./pages/Home"
import SignInSide from "./pages/HomeTwo";
import EditProfile from "./components/EditProfile";
import NoMatch from "./components/NoMatch";
import Match from "./components/Match";
import FileUpload from "./components/FileUpload";
import Age from "./components/Age";
import Chat from "./components/Chat";
import Inbox from "./components/Inbox";
import LocateFilter from "./components/LocateFilter";

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

//establish a new link to the GraphQL server//
const httpLink = createHttpLink({
  uri: "/graphql",
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:3001/graphql',
  connectionParams: {
    authToken: authLink,
  }
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  // link: authLink.concat(httpLink),
  link: authLink.concat(splitLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          {/* <div className="container"> */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hometwo" element={<SignInSide />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/match" element={<Match />} />
              <Route path="/profile">
                <Route path=":username" element={<Profile />} />
                <Route path="" element={<Profile />} />
              </Route>
              <Route path="/editprofile" element={<EditProfile />} />
              <Route path="/fileupload" element={<FileUpload />} />
              <Route path="/age" element={<Age/>} />
              <Route path="/chat" element={<Chat/>} />
              <Route path="/inbox" element={<Inbox/>} />
              <Route path="/locate" element={<LocateFilter/>} />
              <Route path="*" element={<NoMatch />} />
            </Routes>
          {/* </div> */}
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;