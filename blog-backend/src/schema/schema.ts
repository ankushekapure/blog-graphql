import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { Schema } from "mongoose";
import Blog from "../models/Blog";
import Comment from "../models/Comment";
import User from "../models/User";

export const userType = new GraphQLObjectType({
  name: "userType",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    //  relation using populate
    blogs: {
      type: new GraphQLList(blogType),
      async resolve(parent) {
        return await Blog.find({ user: parent.id });
      },
    },
    comments: {
      type: new GraphQLList(commentType),
      async resolve(parent) {
        return await Comment.find({ user: parent.id });
      },
    },
  }),
});

export const blogType = new GraphQLObjectType({
  name: "blogType",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    date: { type: new GraphQLNonNull(GraphQLString) },
    user: {
      type: userType,
      async resolve(parent) {
        return await User.findById(parent.user);
      },
    },
    comments: {
      type: new GraphQLList(commentType),
      async resolve(parent) {
        return await Comment.find({ blog: parent.id });
      },
    },
  }),
});

export const commentType = new GraphQLObjectType({
  name: "commentType",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: new GraphQLNonNull(GraphQLString) },
    date: { type: new GraphQLNonNull(GraphQLString) },
    user: {
      type: userType,
      async resolve(parent) {
        console.log(parent.user);

        return await User.findById(parent.user);
      },
    },
    blog: {
      type: blogType,
      async resolve(parent) {
        return await Blog.findById(parent.blog);
      },
    },
  }),
});
