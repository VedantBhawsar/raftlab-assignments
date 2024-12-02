const schema = `#graphql
  input CreateUserInput {
    username: String!
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    username: String!
    password: String!
  }
`;

export default schema;
