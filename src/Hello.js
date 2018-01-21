import React from 'react';
import {PropTypes} from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


class Hello extends React.Component {

  render() {

    if (this.props.helloQuery.loading) {
      return (
        <div>Loading ...</div>
      )
    }

    let hello = this.props.helloQuery.hello;

    return (
      <div>
        {hello}
      </div>
    );
  }
}

Hello.propTypes = {
  helloQuery: PropTypes.object.isRequired,
};

const FEED_QUERY = gql`
  query Hello($who: String!) {
    hello(who: $who)
  }
`;

export default graphql(FEED_QUERY, {
  name: 'helloQuery', // name of the injected prop: this.props.feedQuery...
  options: {
    fetchPolicy: 'network-only',
  },
})(Hello);


// export default UsersList;