import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'leaderboard.json');

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let leaderboardData = { leaderboard: [] };

  try {
    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath, 'utf-8');
      leaderboardData = JSON.parse(file);
    }
  } catch (err) {
    console.error('Ошибка чтения leaderboard.json:', err);
  }

  return res.status(200).json(leaderboardData);
}
