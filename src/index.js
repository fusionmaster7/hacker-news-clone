const { GraphQLServer } = require("graphql-yoga");

let links = [
  {
    id: "link-0",
    url: "https://google.com",
    description: "The most popular search engine",
  },
];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `Hacker News clone API`,
    feed: () => links,
    link: (parent, args) => {
      const id = args.id;
      return links[id[id.length - 1]];
    },
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        url: args.url,
        description: args.description,
      };
      links.push(link);
      return link;
    },
    delete: (parent, args) => {
      let newLinks = links.filter((e) => e.id !== args.id);
      const deletedLink = links.find((e) => e.id == args.id);
      links = newLinks;
      return deletedLink;
    },
    update: (parent, args) => {
      const index = links.findIndex((e) => e.id == args.id);
      const updatedLink = {
        id: args.id,
        url: args.url || links[index].url,
        description: args.description || links[index].description,
      };
      links[index] = updatedLink;
      return updatedLink;
    },
  },
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
});

server.start(() => {
  console.log("Listening");
});
