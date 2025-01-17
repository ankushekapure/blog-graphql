"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const schema_1 = require("../schema/schema");
const User_1 = __importDefault(require("../models/User"));
const Blog_1 = __importDefault(require("../models/Blog"));
const Comment_1 = __importDefault(require("../models/Comment"));
const mongoose_1 = require("mongoose");
const bcryptjs_1 = require("bcryptjs");
const rootQuery = new graphql_1.GraphQLObjectType({
    name: "rootQuery",
    fields: {
        // GET ALL USERS
        allUsers: {
            type: new graphql_1.GraphQLList(schema_1.userType),
            async resolve() {
                return await User_1.default.find();
            },
        },
        // GET ALL BLOG POSTS
        allBlogs: {
            type: new graphql_1.GraphQLList(schema_1.blogType),
            async resolve() {
                return await Blog_1.default.find();
            },
        },
        // GET ALL COMMENTS
        allComments: {
            type: new graphql_1.GraphQLList(schema_1.commentType),
            async resolve() {
                return await Comment_1.default.find();
            },
        },
    },
});
const mutations = new graphql_1.GraphQLObjectType({
    name: "mutations",
    fields: {
        // ADD NEW USER ACCOUNT
        userSignUp: {
            type: schema_1.userType,
            args: {
                name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            async resolve(parent, { name, email, password }) {
                let isUserExist;
                try {
                    isUserExist = await User_1.default.findOne({ email: email });
                    if (isUserExist) {
                        return new Error("User Already Exists");
                    }
                    const encryptedPassword = (0, bcryptjs_1.hashSync)(password);
                    const user = new User_1.default({
                        name: name,
                        email: email,
                        password: encryptedPassword,
                    });
                    return await user.save();
                }
                catch (error) {
                    console.error(error, "Sign up failed ");
                }
            },
        },
        // LOGIN TO USER ACCOUNT
        userLogin: {
            type: schema_1.userType,
            args: {
                email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            async resolve(parent, { email, password }) {
                try {
                    let isUserExist;
                    isUserExist = await User_1.default.findOne({ email: email });
                    if (!isUserExist) {
                        return new Error("No User Exists");
                    }
                    const decrptedPassword = (0, bcryptjs_1.compareSync)(password, 
                    // @ts-ignore
                    isUserExist?.password);
                    if (!decrptedPassword)
                        return new Error("Incorrect Password");
                    return isUserExist;
                }
                catch (error) {
                    return new Error(error);
                }
            },
        },
        // ADD NEW BLOG POST
        addBlogPost: {
            type: schema_1.blogType,
            args: {
                title: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                content: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                // Accept User ID For Ref
                user: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
            },
            async resolve(parent, { title, content, user }) {
                let blog;
                const session = await (0, mongoose_1.startSession)();
                session.startTransaction({ session });
                try {
                    blog = new Blog_1.default({ title, content, date: Date.now(), user });
                    let existingUser;
                    existingUser = await User_1.default.findById(user);
                    if (!existingUser)
                        return new Error("User Not Found");
                    existingUser.blogs.push(blog);
                    await existingUser.save({ session });
                    return await blog.save({ session });
                }
                catch (error) {
                    return new Error(error);
                }
                finally {
                    await session.commitTransaction();
                }
            },
        },
        // UPDATE BLOG POST
        updateBlogPost: {
            type: schema_1.blogType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                title: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                content: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            async resolve(parent, { id, title, content }) {
                let blogPostExist;
                blogPostExist = await Blog_1.default.findById(id);
                if (!blogPostExist)
                    return new Error("Blog post is not available");
                return await Blog_1.default.findByIdAndUpdate(id, {
                    title,
                    content,
                }, { new: true } // CREATE NEW INSTANCE TO RETURN NEW UPDATED DATA TO GRAPHQL
                );
            },
        },
        // DELETE BLOG POST
        deleteBlogPost: {
            type: schema_1.blogType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
            },
            async resolve(parent, { id }) {
                const session = await (0, mongoose_1.startSession)();
                session.startTransaction({ session });
                try {
                    let blogPostExist;
                    // Populate user field of blog as well which contains user data
                    blogPostExist = await Blog_1.default.findById(id).populate("user");
                    //@ts-ignore
                    const existingUser = blogPostExist.user;
                    if (!existingUser)
                        return new Error("no user is linked to this blog post");
                    if (!blogPostExist)
                        return new Error("Blog post is not available");
                    existingUser.blogs.pull(blogPostExist);
                    await existingUser.save({ session });
                    return await blogPostExist.deleteOne({ session });
                }
                catch (error) {
                }
                finally {
                    session.commitTransaction();
                }
            },
        },
        // ADD A COMMENT
        addComment: {
            type: schema_1.commentType,
            args: {
                text: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                userId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                blogPostId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
            },
            async resolve(parent, { text, userId, blogPostId }) {
                // let existingUser = ;
                const session = await (0, mongoose_1.startSession)();
                session.startTransaction({ session });
                try {
                    const comment = new Comment_1.default({
                        text,
                        date: Date.now(),
                        user: userId,
                        blog: blogPostId,
                    });
                    let existingUser;
                    let existingBlog;
                    existingUser = await User_1.default.findById(userId);
                    existingBlog = await Blog_1.default.findById(blogPostId);
                    if (!existingUser)
                        return new Error("No such a user exist");
                    if (!existingBlog)
                        return new Error("No such a blog post exist");
                    //@ts-ignore
                    existingUser.comments.push(comment);
                    //@ts-ignore
                    existingBlog.comments.push(comment);
                    await existingUser.save({ session });
                    await existingBlog.save({ session });
                    return await comment.save({ session });
                }
                catch (error) {
                }
                finally {
                    session.commitTransaction();
                }
            },
        },
        // DELETE A COMMENT
        deleteComment: {
            type: schema_1.commentType,
            args: {
                commentId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
            },
            async resolve(parent, { commentId }) {
                const session = await (0, mongoose_1.startSession)();
                session.startTransaction({ session });
                try {
                    let existingComment;
                    existingComment = await Comment_1.default.findById(commentId);
                    if (!existingComment)
                        return new Error("Comment Does not Exist");
                    return await existingComment.deleteOne();
                }
                catch (error) {
                }
                finally {
                    session.commitTransaction();
                }
            },
        },
    },
});
exports.default = new graphql_1.GraphQLSchema({ query: rootQuery, mutation: mutations });
//# sourceMappingURL=handlers.js.map