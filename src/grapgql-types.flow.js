/* @flow */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserMutationMutationVariables = {|
  name: string,
  email: string,
|};

export type CreateUserMutationMutation = {|
  user: ? {|
    createUser: ? {|
      id: ?string,
      name: ?string,
      email: ?string,
      __typename: string,
    |},
  |},
|};

export type HelloQueryVariables = {|
  who: string,
|};

export type HelloQuery = {|
  hello: ?string,
|};

export type ListUsersQuery = {|
  user: ? {|
    list: ? Array<? {|
      id: ?string,
      name: ?string,
      email: ?string,
      __typename: string,
    |} >,
  |},
|};

export type UsersSubscriptionSubscription = {|
  userAdded: ? {|
    id: ?string,
    name: ?string,
    email: ?string,
  |},
|};