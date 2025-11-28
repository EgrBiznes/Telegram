let leaderboard = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Возвращаем топ-10 игроков
    const sorted = [...leaderboard].sort((a, b) => b.balance - a.balance);
    res.status(200).json({ leaderboard: sorted.slice(0, 10) });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
