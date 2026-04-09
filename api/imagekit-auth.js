const crypto = require('crypto');

module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey  = process.env.IMAGEKIT_PUBLIC_KEY;

  if (!privateKey || !publicKey) {
    console.error('Missing ImageKit env vars');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const token     = crypto.randomBytes(16).toString('hex');
  const expire    = Math.floor(Date.now() / 1000) + 1800; // válido 30 min
  const signature = crypto
    .createHmac('sha1', privateKey)
    .update(token + expire)
    .digest('hex');

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ token, expire, signature, publicKey });
};
