import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';

import logo from './logo.svg';
import './App.css';

import UsersList from './Users';
import Hello  from './Hello';

const wsLink = new WebSocketLink({
  uri: `ws://localhost:3030/subscriptions`,
  options: {
    reconnect: true
  }
});

const httpLink = new HttpLink({ uri: 'http://localhost:3030/graphql' });

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <Hello who="Alex" />
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <UsersList/>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
