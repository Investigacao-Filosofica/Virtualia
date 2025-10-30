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

export async function createOrUpdateUser(req, res, next) {
  try {
    const { walletAddress, certificates } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ message: 'walletAddress is required' });
    }

    const profilePayload = buildProfilePayload(req.body);
    if (Array.isArray(certificates)) {
      profilePayload.certificates = normalizeCertificates(certificates);
    }

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { walletAddress: walletAddress.trim() },
      { $set: profilePayload },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    res.status(200).json(updatedProfile);
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

    res.json(userProfile);
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

    res.status(201).json(updatedProfile);
  } catch (error) {
    next(error);
  }
}
