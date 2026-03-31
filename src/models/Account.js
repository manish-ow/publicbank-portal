import mongoose, { Schema } from 'mongoose';

const AccountSchema = new Schema(
    {
        accountNumber: { type: String, required: true, unique: true },
        accountType: { type: String, enum: ['savings', 'checking', 'business'], default: 'savings' },
        balance: { type: Number, default: 0, min: 0 },
        currency: { type: String, default: 'MYR' },
        status: { type: String, enum: ['active', 'frozen', 'closed'], default: 'active' },
        fullName: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Account || mongoose.model('Account', AccountSchema);
