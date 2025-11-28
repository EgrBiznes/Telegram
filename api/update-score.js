// Храним данные в памяти (переменной)
let leaderboardData = { leaderboard: [] };

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, username, firstName, balance } = req.body;

    if (!userId || balance === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Находим существующего пользователя
    const existingUserIndex = leaderboardData.leaderboard.findIndex(user => user.userId === userId);

    if (existingUserIndex !== -1) {
      // Обновляем существующего
      leaderboardData.leaderboard[existingUserIndex].balance = balance;
      leaderboardData.leaderboard[existingUserIndex].username = username || leaderboardData.leaderboard[existingUserIndex].username;
      leaderboardData.leaderboard[existingUserIndex].firstName = firstName || leaderboardData.leaderboard[existingUserIndex].firstName;
    } else {
      // Добавляем нового
      leaderboardData.leaderboard.push({
        userId,
        username: username || `user_${userId}`,
        firstName: firstName || 'Пользователь',
        balance
      });
    }

    // Сортируем по убыванию баланса
    leaderboardData.leaderboard.sort((a, b) => b.balance - a.balance);

    // Возвращаем топ-10
    const top10 = leaderboardData.leaderboard.slice(0, 10);
    res.status(200).json({ leaderboard: top10, success: true });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
