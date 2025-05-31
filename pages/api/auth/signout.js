import { serialize } from 'cookie';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: "failed", message: "روش درخواست مجاز نیست" });
  }

  const serialized = serialize('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  res.status(200).setHeader('Set-Cookie', serialized)
    .json({ status: 'success', message: 'خروج با موفقیت انجام شد' });
}

export default handler;
