import mongoose, { Schema } from 'mongoose';

const postSchema = mongoose.Schema({
    postId: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    htmlCode: {
        type: String,
        required: true
    },
    cssCode: {
        type: String,
    },
    category: {
        type: String,
        required: true
    },
    tags: {
        type: [String], // Added by admin after review
        default: []
    },
    theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
    },
    status: {
        type: String,
        enum: ['draft', 'under review', 'published', 'rejected'],
        default: 'draft'
    },
    saved: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    reports: [
        {
            user: { type: Schema.Types.ObjectId, ref: 'users' }, // Reference to the user who reported
            message: { type: String, required: true }, // Report reason/message
            createdAt: { type: Date, default: Date.now }
        }
    ],
    user_saved: {
        type: [Schema.Types.ObjectId],
        ref: 'users',
        default: [],
        unique: true
    },
},
    {
        timestamps: {
            createdAt: 'publishedAt'
        }

    });

export default mongoose.model('posts', postSchema)
