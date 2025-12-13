const processLatex = async (req, res) => {
  try {
    const { latex } = req.body;

    if (!latex || latex.trim() === '') {
      return res.status(400).json({ message: 'LaTeX expression is required' });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${latex}`,
            },
          ],
        },
      ],
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.log(response.statusText);
      throw new Error(`Gemini API error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ message: 'Error processing LaTeX', error: error.message });
  }
};

module.exports = {
  processLatex
};