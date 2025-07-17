
export interface AiLesson {
  id: string;
  title: string;
  image: string;
  image_hint: string;
  content: string;
  questions: {
    question: string;
    options: string[];
    answer: string;
  }[];
}

export const aiLessons: AiLesson[] = [
  {
    id: 'llm',
    title: "What is an LLM?",
    image: "https://placehold.co/600x400.png",
    image_hint: "abstract neural network",
    content: "A Large Language Model (LLM) is a type of artificial intelligence that is trained on a massive amount of text data. This training allows it to understand, generate, and respond to human language in a coherent and contextually relevant way. Think of it like a very advanced autocomplete that can write essays, answer questions, translate languages, and even write code. They learn patterns, grammar, and facts from the data they are trained on.",
    questions: [
      {
        question: "What is the primary function of an LLM?",
        options: ["To create images", "To understand and generate human language", "To play games", "To control robots"],
        answer: "To understand and generate human language"
      },
      {
        question: "How do LLMs learn?",
        options: ["By watching videos", "From a small set of rules", "By being trained on massive amounts of text data", "By talking to people"],
        answer: "By being trained on massive amounts of text data"
      },
      {
        question: "Which of these is a task an LLM can perform?",
        options: ["Drive a car", "Perform surgery", "Write a poem", "Cook dinner"],
        answer: "Write a poem"
      }
    ]
  },
  {
    id: 'generative-ai',
    title: "What is Generative AI?",
    image: "https://placehold.co/600x400.png",
    image_hint: "ai art creation",
    content: "Generative AI is a broad category of artificial intelligence that can create new, original content, rather than just analyzing or acting on existing data. This content can include text, images, music, and code. Large Language Models (LLMs) are a type of Generative AI that focuses on text. Other types of generative models can create realistic images from a text description or compose a new piece of music in a certain style. The key idea is 'generation' or 'creation' of something new.",
    questions: [
      {
        question: "What is the main capability of Generative AI?",
        options: ["Analyzing data", "Categorizing information", "Creating new content", "Following instructions"],
        answer: "Creating new content"
      },
      {
        question: "Is an LLM a type of Generative AI?",
        options: ["Yes", "No", "Only for images", "Only for music"],
        answer: "Yes"
      },
      {
        question: "Which of the following can Generative AI create?",
        options: ["Only text", "Only images", "Only music", "Text, images, music, and more"],
        answer: "Text, images, music, and more"
      }
    ]
  },
  {
    id: 'data-science',
    title: "What is Data Science?",
    image: "https://placehold.co/600x400.png",
    image_hint: "graphs charts data",
    content: "Data Science is a field that uses scientific methods, processes, algorithms, and systems to extract knowledge and insights from structured and unstructured data. It's about finding patterns. Data scientists clean, prepare, and analyze large sets of data to discover trends. These insights can then be used to make better decisions, predict future events, or understand customer behavior. It combines statistics, computer science, and business knowledge.",
    questions: [
      {
        question: "What is the main goal of Data Science?",
        options: ["To write code", "To create websites", "To extract knowledge and insights from data", "To store data securely"],
        answer: "To extract knowledge and insights from data"
      },
      {
        question: "Which field is NOT typically a part of data science?",
        options: ["Statistics", "Computer Science", "Business Knowledge", "Marine Biology"],
        answer: "Marine Biology"
      },
      {
        question: "What is a common task for a data scientist?",
        options: ["Designing logos", "Finding patterns in data", "Writing news articles", "Repairing computers"],
        answer: "Finding patterns in data"
      }
    ]
  },
  {
    id: 'reasoning',
    title: "What is AI Reasoning?",
    image: "https://placehold.co/600x400.png",
    image_hint: "ai robot thinking",
    content: "AI Reasoning is the ability of an artificial intelligence system to think logically, make connections, and draw conclusions from information it has. It's about going beyond just pattern matching. For example, an AI with reasoning can solve multi-step problems, understand cause and effect, or plan a series of actions to achieve a goal. It involves using facts and rules to make inferences about the world, much like how humans solve puzzles or make plans.",
    questions: [
      {
        question: "AI Reasoning is about...",
        options: ["Memorizing facts", "Thinking logically to draw conclusions", "Recognizing images", "Generating text"],
        answer: "Thinking logically to draw conclusions"
      },
      {
        question: "Which task requires AI reasoning?",
        options: ["Translating a word", "Identifying a cat in a photo", "Planning a holiday itinerary", "Repeating a sentence"],
        answer: "Planning a holiday itinerary"
      },
      {
        question: "Reasoning goes beyond simple...",
        options: ["logic", "planning", "pattern matching", "thinking"],
        answer: "pattern matching"
      }
    ]
  },
  {
    id: 'quantum-computing',
    title: "What is Quantum Computing?",
    image: "https://placehold.co/600x400.png",
    image_hint: "quantum computer atom",
    content: "Quantum Computing is a revolutionary type of computing that uses the principles of quantum mechanics to process information. Unlike classical computers that use 'bits' (either a 0 or a 1), quantum computers use 'qubits'. A qubit can be a 0, a 1, or both at the same time (a state called superposition). This allows quantum computers to perform many calculations at once, making them incredibly powerful for solving specific, complex problems that are impossible for classical computers, such as drug discovery or creating new materials.",
    questions: [
      {
        question: "What does a classical computer use to store information?",
        options: ["Qubits", "Quantums", "Bits", "Atoms"],
        answer: "Bits"
      },
      {
        question: "A qubit can be a 0, a 1, or...",
        options: ["A 2", "Both at the same time", "Neither 0 nor 1", "Only a 0"],
        answer: "Both at the same time"
      },
      {
        question: "Quantum computers are especially good for solving what kind of problems?",
        options: ["Simple, everyday tasks", "Sending emails", "Complex problems like drug discovery", "Browsing the internet"],
        answer: "Complex problems like drug discovery"
      }
    ]
  }
];
