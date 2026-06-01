const axios = require("axios");

const services = [
  {
    key: "AC Repair",
    category: "Appliance Services",
    description: "Air conditioner repair and maintenance",
    price: 800,
    keywords: ["ac", "air conditioner", "cooling", "gas", "leak", "split", "inverter", "not cooling", "cooler"],
  },
  {
    key: "Deep Cleaning",
    category: "Cleaning Services",
    description: "Complete home deep cleaning service",
    price: 1200,
    keywords: ["cleaning", "deep cleaning", "house clean", "festival", "sanitize", "deep clean", "home cleaning", "dust", "clean"],
  },
  {
    key: "Painter",
    category: "Home Renovation",
    description: "Wall painting and polishing services",
    price: 1500,
    keywords: ["paint", "painter", "painting", "walls", "wall", "polish", "fresh look", "colour", "color", "renovation"],
  },
  {
    key: "Washing Machine Repair",
    category: "Appliance Services",
    description: "Repair and servicing of washing machines",
    price: 650,
    keywords: ["washing machine", "washer", "spin", "not spinning", "drum", "wash machine", "machine repair", "washing", "water leak", "strange noises"],
  },
  {
    key: "Pest Control",
    category: "Cleaning Services",
    description: "Cockroach, termite, and insect pest control service",
    price: 1000,
    keywords: ["pest", "cockroach", "termite", "insect", "bugs", "pest control", "cockroaches", "termites", "rodent"],
  },
];

const normalize = (text = "") => text.toLowerCase().replace(/[\W_]+/g, " ");

const recommendLocalService = (message) => {
  const text = normalize(message);
  const scores = services.map((service) => {
    const score = service.keywords.reduce((sum, keyword) => {
      return sum + (text.includes(keyword) ? 1 : 0);
    }, 0);
    return { service, score };
  });

  const topMatch = scores.reduce((best, current) => {
    if (current.score > best.score) return current;
    return best;
  }, { service: null, score: 0 });

  return topMatch.score > 0 ? topMatch.service : null;
};

const formatRecommendation = (service, message) => {
  if (!service) {
    return `Thank you for contacting ServifyX.\n\nI apologize for the inconvenience, but I can currently assist only with services available on the ServifyX platform such as AC Repair, Deep Cleaning, Painter, Washing Machine Repair, and Pest Control.\n\nPlease describe a home service issue and I'll be happy to help you find the right service.`;
  }

  return `It sounds like your issue matches ${service.description.toLowerCase()}.\n\nRecommended Service: ${service.key}\nStarting Price: ₹${service.price}\n\n${service.description}.\n\nWould you like to book this service now?`;
};

const callGemini = async (message) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-1.5";
  if (!apiKey) return null;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta2/models/${model}:generateText?key=${apiKey}`;
  const prompt = `You are ServifyX AI Assistant. Available services: AC Repair, Deep Cleaning, Painter, Washing Machine Repair, Pest Control. Use these exact rules: understand the user's home service problem and recommend the most relevant service. Explain briefly why it is recommended, mention approximate starting price, and end with \"Would you like to book this service now?\". If the user asks something outside these services, reply with the out-of-scope message: \"Thank you for contacting ServifyX. I apologize for the inconvenience, but I can currently assist only with services available on the ServifyX platform such as AC Repair, Deep Cleaning, Painter, Washing Machine Repair, and Pest Control. Please describe a home service issue and I'll be happy to help you find the right service.\".`;

  const body = {
    prompt: { text: `${prompt}\n\nUser: ${message}` },
    temperature: 0.2,
    maxOutputTokens: 256,
  };

  const response = await axios.post(endpoint, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = response.data;
  const output = json?.candidates?.[0]?.output?.[0]?.content || json?.candidates?.[0]?.content || json?.output?.[0]?.content;
  return output?.trim() || null;
};

const handleAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "Message is required" });
    }

    let assistantReply = null;
    if (process.env.GEMINI_API_KEY) {
      try {
        assistantReply = await callGemini(message);
      } catch (err) {
        console.error("Gemini assistant error:", err.message);
      }
    }

    if (!assistantReply) {
      const service = recommendLocalService(message);
      assistantReply = formatRecommendation(service, message);
    }

    res.status(200).json({ reply: assistantReply });
  } catch (error) {
    console.error("Assistant controller error:", error.message);
    res.status(500).json({ message: "Failed to get assistant reply" });
  }
};

module.exports = { handleAssistant };
