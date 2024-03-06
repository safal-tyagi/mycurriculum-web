import { model } from 'mongoose';
import bcrypt from 'bcrypt';
import { 
    CITIES, 
    EDUCATION_LEVEL, 
    WORK_EXPERIENCE, 
    COURSE_STATUSES,
    CATEGORIES
} from '../../constants';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: Number,
    phoneNumber: String,
    profilePicture: String,
    location: { type: String, enum: CITIES },
    educationLevel: { type: String, enum: EDUCATION_LEVEL },
    workExperience: { type: String, enum: WORK_EXPERIENCE },
    interestedCategories: {type: String, enum: CATEGORIES},
    coursesTaking: [
        {
            courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
            progress: Number,
            status: { type: String, enum: COURSE_STATUSES },
        },
    ],
    coursesBookmarked: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    courseCollections: [
        {
            collectionName: String,
            courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
        },
    ],

    // Add other relevant attributes as needed
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

export default model('User', UserSchema);
