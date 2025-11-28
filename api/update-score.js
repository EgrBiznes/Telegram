import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'leaderboard.json');

// Вспомогательная функция для чтения файла
function readData() {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Ошибка чтения leaderboard.json:', err);
  }
  return { leaderboard: [] };
}

// Вспомогательная функция для записи
function writeData(data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Ошибка записи leaderboard.json:', err);
  }
}

export default function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, username, firstName, balance } = req.body;

  if (!userId || balance === undefined) {
    return res.status(400).json({ error: 'Missing userId or balance' });
  }

  const data = readData();

  // Проверяем, есть ли пользователь уже в таблице
  const existingIndex = data.leaderboard.findIndex(u => u.userId === userId);

  if (existingIndex >= 0) {
    // Обновляем баланс, если он выше
    if (balance > data.leaderboard[existingIndex].balance) {
      data.leaderboard[existingIndex].balance = balance;
    } else {
      data.leaderboard[existingIndex].balance = balance; // просто обновляем
    }
  } else {
    // Добавляем нового пользователя
    data.leaderboard.push({
      userId,
      username,
      firstName,
      balance
    });
  }

  // Сортируем по балансу (по убыванию)
  data.leaderboard.sort((a, b) => b.balance - a.balance);

  // Сохраняем изменения
  writeData(data);

  return res.status(200).json({
    success: true,
    leaderboard: data.leaderboard
  });
}
