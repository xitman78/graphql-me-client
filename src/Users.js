// @flow

import React from 'react';
import {PropTypes} from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';

import CreateUser from './CreateUser';

import type { OperationComponent, QueryProps, ChildProps } from "react-apollo";
import type { ListUsersQuery } from "./grapgql-types.flow";

const UserItem = ({name, email}: {name: ?string, email: ?string}) => (
  <div>
    <span>{name}</span>&nbsp;<span>{email}</span>
  </div>
);


type MergedPropType = ListUsersQuery & QueryProps;

type Props = {
  usersQuery: MergedPropType,
};

class UsersList extends React.Component<Props> {

  subscribeToNewUsers: () => void;


  componentWillMount() {
     this.subscribeToNewUsers.call(this);
  }

  subscribeToNewUsers() {
    this.props.usersQuery.subscribeToMore({
      document: USERS_SUBSCRIPTION,
      // variables: {
      //     repoName: params.repoFullName,
      // },
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) {
            return prev;
        }
        const newUser = subscriptionData.data.userAdded;
        return update(prev, {
          user: {
            list: {
              $unshift: [newUser],
            },
          },
        });
      },
    });
  }


  // onUserCreated(user) {
  //   // this.props.usersQuery.refetch();
  // }

  render() {

    if (this.props.usersQuery.loading) {
      return (
        <div>Loading ...</div>
      )
    }

    if (!this.props.usersQuery.user || !this.props.usersQuery.user.list) return null;

    let list = this.props.usersQuery.user.list;

    return (
      <div>
        Hello Users!
        <hr/>
        {
          list.map(user => (user ? <UserItem key={user.id} {...user} /> : null))
        }
        <hr />
        <CreateUser />
      </div>
    );
  }
}

const FEED_QUERY = gql`
  query ListUsers {
    user {
      list {
        id
        name
        email
        __typename
      }
    }
  }
`
const USERS_SUBSCRIPTION = gql`
subscription UsersSubscription {
  userAdded {
    id
    name
    email
  }
}
`;



const withData: OperationComponent<ListUsersQuery, Props> = graphql(FEED_QUERY, {
  name: 'usersQuery', // name of the injected prop: this.props.feedQuery...
});

export default withData(UsersList);

export {FEED_QUERY as usersQuery};