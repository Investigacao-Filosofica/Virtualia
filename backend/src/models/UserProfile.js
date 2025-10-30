import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    issuer: {
      type: String,
      required: true,
      trim: true,
    },
    issueDate: {
      type: Date,
      required: false,
    },
    credentialId: {
      type: String,
      required: false,
      trim: true,
    },
    credentialUrl: {
      type: String,
      required: false,
      trim: true,
    },
    metadata: {
      type: Map,
      of: String,
      required: false,
    },
  },
  {
    _id: false,
    timestamps: true,
  }
);

const UserProfileSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    bio: {
      type: String,
      required: false,
      trim: true,
    },
    avatarUrl: {
      type: String,
      required: false,
      trim: true,
    },
    socialLinks: {
      type: [String],
      default: [],
    },
    certificates: {
      type: [CertificateSchema],
      default: [],
    },
    customAttributes: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const UserProfile = mongoose.model('UserProfile', UserProfileSchema);
