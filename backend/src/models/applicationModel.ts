import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Pet',
    },
    status: {
        type: String,
        required: true,
        default: 'Pending', // 'Pending', 'Approved', 'Rejected'
        enum: ['Pending', 'Approved', 'Rejected'],
    },
    message: { // Optional message from applicant
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;
