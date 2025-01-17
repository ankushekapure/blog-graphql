import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { blogType, commentType, userType } from "../schema/schema";
import User from "../models/User";
import Blog from "../models/Blog";
import Comment from "../models/Comment";
import mongoose, {
  Document,
  isValidObjectId,
  startSession,
  Types,
} from "mongoose";
import { compareSync, hashSync } from "bcryptjs";

type DocumentType = Document<any, any, any>;

const rootQuery = new GraphQLObjectType({
  name: "rootQuery",
  fields: {
    // GET ALL USERS
    allUsers: {
      type: new GraphQLList(userType),
      async resolve() {
        return await User.find();
      },
    },
    // GET ALL BLOG POSTS
    allBlogs: {
      type: new GraphQLList(blogType),
      async resolve() {
        return await Blog.find();
      },
    },
    // GET ALL COMMENTS
    allComments: {
      type: new GraphQLList(commentType),
      async resolve() {
        return await Comment.find();
      },
    },
  },
});

const mutations = new GraphQLObjectType({
  name: "mutations",
  fields: {
    // ADD NEW USER ACCOUNT
    userSignUp: {
      type: userType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, { name, email, password }) {
        let isUserExist: Document<any, any, any>;
        try {
          isUserExist = await User.findOne({ email: email });
          if (isUserExist) {
            return new Error("User Already Exists");
          }
          const encryptedPassword = hashSync(password);
          const user = new User({
            name: name,
            email: email,
            password: encryptedPassword,
          });
          return await user.save();
        } catch (error) {
          console.error(error, "Sign up failed ");
        }
      },
    },

    // LOGIN TO USER ACCOUNT
    userLogin: {
      type: userType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, { email, password }) {
        try {
          let isUserExist: Document<any, any, any>;
          isUserExist = await User.findOne({ email: email });
          if (!isUserExist) {
            return new Error("No User Exists");
          }
          const decrptedPassword = compareSync(
            password,
            // @ts-ignore
            isUserExist?.password
          );
          if (!decrptedPassword) return new Error("Incorrect Password");
          return isUserExist;
        } catch (error) {
          return new Error(error);
        }
      },
    },

    // ADD NEW BLOG POST
    addBlogPost: {
      type: blogType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        // Accept User ID For Ref
        user: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, { title, content, user }) {
        let blog: DocumentType;
        const session = await startSession();
        session.startTransaction({ session });
        try {
          blog = new Blog({ title, content, date: Date.now(), user });
          let existingUser;
          existingUser = await User.findById(user);
          if (!existingUser) return new Error("User Not Found");
          existingUser.blogs.push(blog);
          await existingUser.save({ session });
          return await blog.save({ session });
        } catch (error) {
          return new Error(error);
        } finally {
          await session.commitTransaction();
        }
      },
    },

    // UPDATE BLOG POST
    updateBlogPost: {
      type: blogType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, { id, title, content }) {
        let blogPostExist: Document<any, any, any>;
        blogPostExist = await Blog.findById(id);
        if (!blogPostExist) return new Error("Blog post is not available");
        return await Blog.findByIdAndUpdate(
          id,
          {
            title,
            content,
          },
          { new: true } // CREATE NEW INSTANCE TO RETURN NEW UPDATED DATA TO GRAPHQL
        );
      },
    },

    // DELETE BLOG POST
    deleteBlogPost: {
      type: blogType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, { id }) {
        const session = await startSession();
        session.startTransaction({ session });
        try {
          let blogPostExist: Document<any, any, any>;
          // Populate user field of blog as well which contains user data
          blogPostExist = await Blog.findById(id).populate("user");
          //@ts-ignore
          const existingUser = blogPostExist.user;
          if (!existingUser)
            return new Error("no user is linked to this blog post");
          if (!blogPostExist) return new Error("Blog post is not available");

          existingUser.blogs.pull(blogPostExist);
          await existingUser.save({ session });
          return await blogPostExist.deleteOne({ session });
        } catch (error) {
        } finally {
          session.commitTransaction();
        }
      },
    },

    // ADD A COMMENT
    addComment: {
      type: commentType,
      args: {
        text: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
        blogPostId: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, { text, userId, blogPostId }) {
        // let existingUser = ;
        const session = await startSession();
        session.startTransaction({ session });
        try {
          const comment = new Comment({
            text,
            date: Date.now(),
            user: userId,
            blog: blogPostId,
          });
          let existingUser: DocumentType;
          let existingBlog: DocumentType;
          existingUser = await User.findById(userId);
          existingBlog = await Blog.findById(blogPostId);
          if (!existingUser) return new Error("No such a user exist");
          if (!existingBlog) return new Error("No such a blog post exist");
          //@ts-ignore
          existingUser.comments.push(comment);
          //@ts-ignore
          existingBlog.comments.push(comment);
          await existingUser.save({ session });
          await existingBlog.save({ session });

          return await comment.save({ session });
        } catch (error) {
        } finally {
          session.commitTransaction();
        }
      },
    },

    // DELETE A COMMENT
    deleteComment: {
      type: commentType,
      args: {
        commentId: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, { commentId }) {
        const session = await startSession();
        session.startTransaction({ session });
        try {
          let existingComment;
          existingComment = await Comment.findById(commentId);
          if (!existingComment) return new Error("Comment Does not Exist");
          return await existingComment.deleteOne();
        } catch (error) {
        } finally {
          session.commitTransaction();
        }
      },
    },
  },
});

export default new GraphQLSchema({ query: rootQuery, mutation: mutations });
