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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Путь к файлу leaderboard.json
    const filePath = path.join(process.cwd(), 'leaderboard.json');
    
    // Чтение данных
    let leaderboardData = { leaderboard: [] };
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      leaderboardData = JSON.parse(fileContent);
    } catch (error) {
      // Если файла нет, возвращаем пустой массив
      console.log('Leaderboard file not found, returning empty leaderboard');
    }

    // Сортировка по балансу (по убыванию) и возврат топ-10
    const sortedLeaderboard = leaderboardData.leaderboard
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 10);

    res.status(200).json({ leaderboard: sortedLeaderboard });

  } catch (error) {
    console.error('Error reading leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
