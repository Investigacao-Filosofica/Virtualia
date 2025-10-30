import bcrypt from 'bcryptjs';
import { UserProfile } from '../models/UserProfile.js';

function buildProfilePayload(body) {
  const { name, email, bio, avatarUrl, socialLinks, customAttributes } = body;
  const payload = {};

  if (name !== undefined) payload.name = name;
  if (email !== undefined) payload.email = email;
  if (bio !== undefined) payload.bio = bio;
  if (avatarUrl !== undefined) payload.avatarUrl = avatarUrl;
  if (socialLinks !== undefined) payload.socialLinks = socialLinks;
  if (customAttributes !== undefined) payload.customAttributes = customAttributes;

  return payload;
}

function normalizeCertificates(certificates = []) {
  if (!Array.isArray(certificates)) {
    return [];
  }

  return certificates
    .filter((certificate) => Boolean(certificate && certificate.title && certificate.issuer))
    .map((certificate) => ({
      title: certificate.title,
      issuer: certificate.issuer,
      issueDate: certificate.issueDate,
      credentialId: certificate.credentialId,
      credentialUrl: certificate.credentialUrl,
      metadata: certificate.metadata,
    }));
}

function sanitizeProfile(profile) {
  if (!profile) return profile;

  const sanitized = { ...profile };
  delete sanitized.passwordHash;
  return sanitized;
}

export async function createOrUpdateUser(req, res, next) {
  try {
    const { walletAddress, certificates, password } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ message: 'walletAddress is required' });
    }

    const profilePayload = buildProfilePayload(req.body);
    if (Array.isArray(certificates)) {
      profilePayload.certificates = normalizeCertificates(certificates);
    }

    if (password !== undefined) {
      if (typeof password !== 'string' || password.length < 8) {
        return res
          .status(400)
          .json({ message: 'password must be a string with at least 8 characters' });
      }

      profilePayload.passwordHash = await bcrypt.hash(password, 12);
    }

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { walletAddress: walletAddress.trim() },
      { $set: profilePayload },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    res.status(200).json(sanitizeProfile(updatedProfile));
  } catch (error) {
    next(error);
  }
}

export async function getUserByWallet(req, res, next) {
  try {
    const { walletAddress } = req.params;
    const userProfile = await UserProfile.findOne({ walletAddress }).lean();

    if (!userProfile) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(sanitizeProfile(userProfile));
  } catch (error) {
    next(error);
  }
}

export async function addCertificate(req, res, next) {
  try {
    const { walletAddress } = req.params;
    const certificates = normalizeCertificates([req.body]);

    if (certificates.length === 0) {
      return res.status(400).json({ message: 'Certificate title and issuer are required' });
    }

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { walletAddress },
      { $push: { certificates: certificates[0] } },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProfile) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(201).json(sanitizeProfile(updatedProfile));
  } catch (error) {
    next(error);
  }
}

export async function loginWithEmail(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'email is required' });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ message: 'password is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userProfile = await UserProfile.findOne({ email: normalizedEmail })
      .select('+passwordHash')
      .lean();

    if (!userProfile || !userProfile.passwordHash) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, userProfile.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const sanitizedProfile = sanitizeProfile(userProfile);

    res.status(200).json(sanitizedProfile);
  } catch (error) {
    next(error);
  }
}
