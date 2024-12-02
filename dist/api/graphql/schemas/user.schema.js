"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = schema;
