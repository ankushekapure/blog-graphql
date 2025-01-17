import { model, Schema } from "mongoose";

const commentSchema: Schema = new Schema({
    text: {
        type: String,
        required: true,
    },
    date: { type: Date, required: true },
    user:{type:Schema.Types.ObjectId, ref:'user'},
    blog:{type:Schema.Types.ObjectId, ref:'blog'},

})

export default model("comment", commentSchema)