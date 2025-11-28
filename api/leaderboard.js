let leaderboardData = { leaderboard: [] };

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Возвращаем отсортированный топ-10
    const sortedLeaderboard = leaderboardData.leaderboard
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 10);

    res.status(200).json({ leaderboard: sortedLeaderboard });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
