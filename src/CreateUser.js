// @flow

import * as React from 'react';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import type { OperationComponent, QueryProps, MutationFunc, MutationOpts } from "react-apollo";

import { usersQuery } from './Users'

import type {CreateUserMutationMutation, CreateUserMutationMutationVariables} from './grapgql-types.flow.js'

type State = {
  name: string,
  email: string,
}

type Props = {
  createUserMutation: MutationFunc<CreateUserMutationMutation>
};

class CreateUser extends React.Component<Props, State> {

  onInputChange: (event: SyntheticInputEvent<HTMLInputElement>) => void;
  submitForm: (event: SyntheticEvent<HTMLButtonElement>) => void;

  constructor() {
    super();
    this.state = {name: '', email: ''};

    this.onInputChange = this.onInputChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.submitForm}>
          Name: <input type='text' name='name' value={this.state.name} onChange={this.onInputChange} /><br />
          E-mail: <input type='text' name='email' value={this.state.email} onChange={this.onInputChange} /><br />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }

  onInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  submitForm(event) {
    event.preventDefault();
    console.log("Submit user create");
    this.props.createUserMutation({
      variables: { name: this.state.name, email: this.state.email },
      optimisticResponse: {
        user: {
          createUser: {
            id: -1, // A temporary id. The server decides the real id.
            name: this.state.name,
            email: (this.state.email),
            __typename: 'User',
          },
          __typename:"UserMutation",
        },
      },
      update: (proxy, {data: {user: {createUser}}}) => {
        console.log("Mutation update");

        // Read the data from our cache for this query.
        const data = proxy.readQuery({ query: usersQuery });

        // Add our todo from the mutation to the end.
        data.user.list.push(createUser);

        // Write our data back to the cache.
        proxy.writeQuery({ query: usersQuery, data });
      },
    }).then(res => {
      console.log("User created", res);
      this.setState({name: '', email: ''});
      // if (this.props.onUserCreated) {
      //   this.props.onUserCreated(res.data.user.createUser);
      // }
    }).catch(e => {
      console.error("-------", e);
    });
  }
}

const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($name: String!, $email: String!) {
    user {
      createUser(name: $name, email: $email) {
        id
        name
        email
        __typename
      }
    }
  }
`

type PropsTypes = CreateUserMutationMutationVariables & QueryProps

export default graphql(CREATE_USER_MUTATION, {
  name: 'createUserMutation', // name of the injected prop: this.props.createDraftMutation...
})(CreateUser)


