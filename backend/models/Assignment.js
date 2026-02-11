const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    courseId: {
        type: Number,
        required: [true, 'Course ID is required'],
        index: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxLength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    type: {
        type: String,
        enum: ['quiz', 'homework', 'project', 'exam'],
        required: [true, 'Assignment type is required']
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required']
    },
    maxScore: {
        type: Number,
        required: [true, 'Maximum score is required'],
        min: [1, 'Maximum score must be at least 1']
    },
    rubric: [{
        criterion: String,
        maxPoints: Number,
        description: String
    }],
    isPublished: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: Number,
        required: [true, 'Creator ID is required']
    }
}, {
    timestamps: true
});

// Indexes for better query performance
assignmentSchema.index({ courseId: 1, dueDate: 1 });
assignmentSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);
