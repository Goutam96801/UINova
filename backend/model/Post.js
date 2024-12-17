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

    activity:{
        
    total_saves: {
        type: Number,
        default: 0
    },
    total_views: {
        type: Number,
        default: 0
    },
    total_comments:{
        type: Number,
        default: 0
    },
    total_parent_comments:{
        type: Number,
        default: 0
    }
    },
    
    reports: [
        {
            user: { type: Schema.Types.ObjectId, ref: 'users' }, // Reference to the user who reported
            message: { type: String, required: true }, // Report reason/message
            additionalMessage:{type: String},
            createdAt: { type: Date, default: Date.now }
        }
    ],
    user_saved: {
        type: [Schema.Types.ObjectId],
        ref: 'users',
        default: [],
        unique: true
    },

    comments: {
        type: [Schema.Types.ObjectId],
        ref: 'comments'
    },
},
    {
        timestamps: {
            createdAt: 'publishedAt'
        }

    });

export default mongoose.model('posts', postSchema)
