import { ApolloServer, gql,  PubSub} from 'apollo-server';
import { PrismaClient, User } from '@prisma/client'
import startPomodoro from './actions/startPomodoro';
import stopPomodoro from './actions/stopPomodoro';
import pausePomodoro from './actions/pausePomodoro';
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient()

// Initialize PubSub subscription
const pubsub = new PubSub();
const POMODORO_STARTED = 'POMODORO_STARTED';


const typeDefs = gql`
  type Query {
    users: [User]!
  }

  type Mutation {
    createUser(input: UserInput!): User
    updatePomodoro(input: UserInput!): User
  }

  type Subscription {
    pomodoroStarted: User
  }

  input UserInput {
    name: String
    email: String!
    status: PomodoroStatus!
    webhookID: String
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
    status: PomodoroStatus!
    webhookID: String!
  }

  enum PomodoroStatus {
    STARTED
    PAUSE
    STOPPED
  }
`;

const resolvers = {
  Query: {
    users: async () => await prisma.user.findMany(),
  },
  Mutation: {
    createUser: async (root: any, args: any, context: any) => {
      const newUser: User = await prisma.user.create({
        data: {
          name: args.input.name,
          email: args.input.email,
          status: args.input.status,
          webhookID: args.input.webhookID
        },
      })
      return newUser
    },
    updatePomodoro: async (root: any, args: any, context: any) => {
      const newPomodoro: User = await prisma.user.update({
        data: { status: args.input.status },
        where: {
           email: args.input.email
        }
      })

      if(args.input.status === 'STARTED') {
        await startPomodoro()
      }

      if(args.input.status === 'STOPPED') {
        await stopPomodoro()
      }

      if(args.input.status === 'PAUSE') {
        await pausePomodoro()
      }

        pubsub.publish(POMODORO_STARTED, { pomodoroStarted: newPomodoro });
        return newPomodoro
    },
  },
  Subscription: {
    pomodoroStarted: {
      subscribe: () => pubsub.asyncIterator([POMODORO_STARTED])
    },
  },
};


const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
