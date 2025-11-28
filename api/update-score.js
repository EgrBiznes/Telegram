const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Настройка CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обработка предварительного запроса OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, username, firstName, balance } = req.body;

    if (!userId || balance === undefined) {
      return res.status(400).json({ error: 'Missing required fields: userId and balance' });
    }

    // Путь к файлу leaderboard.json
    const filePath = path.join(process.cwd(), 'leaderboard.json');
    
    // Чтение существующих данных
    let leaderboardData = { leaderboard: [] };
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      leaderboardData = JSON.parse(fileContent);
    } catch (error) {
      // Если файла нет, создаем новый
      console.log('Creating new leaderboard file...');
    }

    // Поиск существующего пользователя
    const existingUserIndex = leaderboardData.leaderboard.findIndex(user => user.userId === userId);

    if (existingUserIndex !== -1) {
      // Обновление существующего пользователя
      leaderboardData.leaderboard[existingUserIndex].balance = balance;
      leaderboardData.leaderboard[existingUserIndex].username = username || leaderboardData.leaderboard[existingUserIndex].username;
      leaderboardData.leaderboard[existingUserIndex].firstName = firstName || leaderboardData.leaderboard[existingUserIndex].firstName;
    } else {
      // Добавление нового пользователя
      leaderboardData.leaderboard.push({
        userId,
        username: username || `user_${userId}`,
        firstName: firstName || 'Пользователь',
        balance
      });
    }

    // Сортировка по балансу (по убыванию)
    leaderboardData.leaderboard.sort((a, b) => b.balance - a.balance);

    // Сохранение обновленных данных
    fs.writeFileSync(filePath, JSON.stringify(leaderboardData, null, 2));

    // Возврат топ-10 пользователей
    const top10 = leaderboardData.leaderboard.slice(0, 10);
    res.status(200).json({ leaderboard: top10, success: true });

  } catch (error) {
    console.error('Error updating score:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
