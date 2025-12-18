import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    species: {
        type: String, // 'Dog', 'Cat', etc.
        required: true,
    },
    breed: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    adopted: {
        type: Boolean,
        required: true,
        default: false,
    },
    imageUrl: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

const Pet = mongoose.model('Pet', petSchema);

export default Pet;
