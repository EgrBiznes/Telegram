let leaderboard = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, username, firstName, balance } = req.body;
    
    const existingIndex = leaderboard.findIndex(user => user.userId === userId);
    
    if (existingIndex !== -1) {
      leaderboard[existingIndex] = { userId, username, firstName, balance };
    } else {
      leaderboard.push({ userId, username, firstName, balance });
    }
    
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
