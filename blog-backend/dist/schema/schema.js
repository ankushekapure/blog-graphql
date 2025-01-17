"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentType = exports.blogType = exports.userType = void 0;
const graphql_1 = require("graphql");
const Blog_1 = __importDefault(require("../models/Blog"));
const Comment_1 = __importDefault(require("../models/Comment"));
const User_1 = __importDefault(require("../models/User"));
exports.userType = new graphql_1.GraphQLObjectType({
    name: "userType",
    fields: () => ({
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        //  relation using populate
        blogs: {
            type: new graphql_1.GraphQLList(exports.blogType),
            async resolve(parent) {
                return await Blog_1.default.find({ user: parent.id });
            },
        },
        comments: {
            type: new graphql_1.GraphQLList(exports.commentType),
            async resolve(parent) {
                return await Comment_1.default.find({ user: parent.id });
            },
        },
    }),
});
exports.blogType = new graphql_1.GraphQLObjectType({
    name: "blogType",
    fields: () => ({
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        title: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        content: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        date: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        user: {
            type: exports.userType,
            async resolve(parent) {
                return await User_1.default.findById(parent.user);
            },
        },
        comments: {
            type: new graphql_1.GraphQLList(exports.commentType),
            async resolve(parent) {
                return await Comment_1.default.find({ blog: parent.id });
            },
        },
    }),
});
exports.commentType = new graphql_1.GraphQLObjectType({
    name: "commentType",
    fields: () => ({
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        text: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        date: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        user: {
            type: exports.userType,
            async resolve(parent) {
                return await User_1.default.findById(parent.user);
            },
        },
        blog: {
            type: exports.blogType,
            async resolve(parent) {
                return await Blog_1.default.findById(parent.blog);
            },
        },
    }),
});
//# sourceMappingURL=schema.js.map