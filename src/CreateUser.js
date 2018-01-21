import React from 'react';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class CreateUser extends React.Component {

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
    }).then(res => {
      console.log("User created", res);
      this.setState({name: '', email: ''});
      if (this.props.onUserCreated) {
        this.props.onUserCreated(res.data.user.createUser);
      }
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
      }
    }
  }
`

export default graphql(CREATE_USER_MUTATION, {
  name: 'createUserMutation', // name of the injected prop: this.props.createDraftMutation...
})(CreateUser)


