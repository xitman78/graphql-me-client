import React from 'react';
import {PropTypes} from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import CreateUser from './CreateUser';

const UserItem = ({id, name, email}) => (
  <div>
    <span>{name}</span>&nbsp;<span>{email}</span>
  </div>
);

class UsersList extends React.Component {

  componentWillReceiveProps(nextProps) {
    console.log("Users props", nextProps);

    this.onUserCreated = this.onUserCreated.bind(this);
  }

  onUserCreated(user) {
    this.props.usersQuery.refetch();
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

export default graphql(FEED_QUERY, {
  name: 'usersQuery', // name of the injected prop: this.props.feedQuery...
  options: {
    fetchPolicy: 'network-only',
  },
})(UsersList)


// export default UsersList;