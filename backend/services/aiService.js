const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are MindMate AI, a compassionate mental wellness assistant for students. Provide emotional support, practical stress and study tips, relaxation techniques, motivation, and healthy-habit guidance. Never diagnose medical or psychological conditions. Encourage professional help in serious situations. Be warm and conversational. If a student mentions self-harm, urge immediate help and share: iCall 9152987821, Vandrevala Foundation 1860-2662-345, NIMHANS 080-46110007.`;

const requestCompletion = async (messages, options = {}) => {
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY is not configured');
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, messages, temperature: options.temperature ?? 0.8, max_completion_tokens: 500 }),
    signal: AbortSignal.timeout(30000)
  });
  if (!response.ok) throw new Error(`Groq request failed (${response.status}): ${await response.text()}`);
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Groq returned an empty response');
  return content.trim();
};

const generateChatResponse = async (chatHistory, userMessage) => {
  try {
    return await requestCompletion([
      { role: 'system', content: SYSTEM_PROMPT },
      ...chatHistory.map(message => ({ role: message.role === 'model' ? 'assistant' : 'user', content: message.content })),
      { role: 'user', content: userMessage }
    ]);
  } catch (error) {
    console.error('AI Chat Error:', error.message);
    return 'MindMate is having a technical moment. Please try again, or reach out to your college counselor if you need immediate support.';
  }
};

const generateMoodInsight = async (mood, stressLevel, note) => {
  try {
    const prompt = `A student logged mood ${mood} with stress ${stressLevel}/10. Note: ${note || 'No note provided'}. Give a warm 2-3 sentence insight with one actionable tip and no bullets.`;
    return await requestCompletion([{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: prompt }]);
  } catch (error) {
    console.error('AI Mood Insight Error:', error.message);
    return 'Thank you for checking in with yourself. Acknowledging your feelings is the first step to wellness. Take a deep breath - you have got this!';
  }
};

const analyzeJournalSentiment = async content => {
  try {
    const prompt = `Analyze this student journal entry: ${content}. Return only JSON with sentiment (1-2 sentence summary), score (positive, neutral, or negative), primaryEmotion (one word), and suggestion (one actionable wellness suggestion).`;
    const result = await requestCompletion([{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: prompt }], { temperature: 0.3 });
    return JSON.parse(result.replace(/```json|```/g, '').trim());
  } catch (error) {
    console.error('AI Journal Analysis Error:', error.message);
    return { sentiment: 'Thank you for journaling today.', score: 'neutral', primaryEmotion: 'reflective', suggestion: 'Keep writing - journaling supports emotional clarity.' };
  }
};

module.exports = { generateChatResponse, generateMoodInsight, analyzeJournalSentiment };
