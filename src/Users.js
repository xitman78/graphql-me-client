import React from 'react';
import {PropTypes} from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';

import CreateUser from './CreateUser';

const UserItem = ({id, name, email}) => (
  <div>
    <span>{name}</span>&nbsp;<span>{email}</span>
  </div>
);

class UsersList extends React.Component {

  constructor() {
    super();

    this.onUserCreated = this.onUserCreated.bind(this);
  }

  componentWillMount() {
    this.props.subscribeToNewUsers();
  }


  onUserCreated(user) {
    // this.props.usersQuery.refetch();
  }

  render() {

    if (this.props.usersQuery.loading) {
      return (
        <div>Loading ...</div>
      )
    }

    let list = this.props.usersQuery.user.list;

    return (
      <div>
        Hello Users!
        <hr/>
        {
          list.map(user => <UserItem key={user.id} {...user} />)
        }
        <hr />
        <CreateUser onUserCreated={this.onUserCreated} />
      </div>
    );
  }
}

UsersList.propTypes = {
  usersQuery: PropTypes.object.isRequired,
};

const FEED_QUERY = gql`
  query ListUsers {
    user {
      list {
        id
        name
        email
      }
    }
  }
`
const USERS_SUBSCRIPTION = gql`
subscription {
  userAdded {
    id
    name
    email
  }
}
`;

const withData = graphql(FEED_QUERY, {
  name: 'usersQuery', // name of the injected prop: this.props.feedQuery...
  options: {
    fetchPolicy: 'network-only',
  },
  props: props => {
    console.log(props);
    return {
        ...props,
        subscribeToNewUsers: params => {
          console.log('Subscribe to new users');
          return props.usersQuery.subscribeToMore({
              document: USERS_SUBSCRIPTION,
              // variables: {
              //     repoName: params.repoFullName,
              // },
              updateQuery: (prev, {subscriptionData}) => {
                if (!subscriptionData.data) {
                    return prev;
                }

                console.log('subscriptionData', subscriptionData);
                console.log('prev', prev);

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
          },
        };
      },
    });

export default withData(UsersList);