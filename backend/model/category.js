import mongoose, { Schema } from 'mongoose';

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    post: {
        type: [Schema.Types.ObjectId],
        ref: 'posts',
    }
},
    {
        timestamps: {
            createdAt: 'publishedAt'
        }

    });

export default mongoose.model('posts', postSchema)
