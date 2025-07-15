
/**
 * @fileoverview Defines the structure and content for all English lessons and stories.
 * Content is based on the "New Headway Intermediate Student's Book".
 */

export interface Lesson {
  type: 'lesson';
  title: string;
  explanation: string;
  examples: { english: string; arabic: string }[];
  mcqs: { question: string; options: string[]; answer: string }[];
}

export interface Story {
  type: 'story';
  title: string;
  content: string;
}

export type LearningItem = Lesson | Story;

const lessons: Lesson[] = [
  // Unit 1
  {
    type: 'lesson',
    title: "Unit 1: Auxiliary Verbs (do, be, have)",
    explanation: "Auxiliary verbs (or helping verbs) like 'do', 'be', and 'have' are used with main verbs to form questions, negatives, and different tenses. 'do' is for simple tenses, 'be' for continuous and passive, and 'have' for perfect tenses.",
    examples: [
      { english: "Where do you live?", arabic: "أين تعيش؟" },
      { english: "He is not studying; he is watching TV.", arabic: "هو لا يدرس؛ هو يشاهد التلفاز." },
      { english: "Have you finished your work?", arabic: "هل أنهيت عملك؟" },
      { english: "Cows don't eat meat.", arabic: "الأبقار لا تأكل اللحم." }
    ],
    mcqs: [
      { question: "Which auxiliary verb is used for Present Simple questions?", options: ["be", "have", "do", "will"], answer: "do" },
      { question: "Complete the sentence: She ___ seen this film before.", options: ["is", "does", "has", "did"], answer: "has" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 1: Questions and Negatives",
    explanation: "To make questions in simple tenses, use do/does/did before the subject. For negatives, use don't/doesn't/didn't before the main verb. For other tenses, invert the auxiliary verb (be/have) and the subject for questions, or add 'not' after the auxiliary for negatives.",
    examples: [
      { english: "What did you do last night?", arabic: "ماذا فعلت الليلة الماضية؟" },
      { english: "He doesn't work on Sundays.", arabic: "هو لا يعمل أيام الأحد." },
      { english: "Are you listening to me?", arabic: "هل تستمع إلي؟" },
      { english: "They haven't arrived yet.", arabic: "هم لم يصلوا بعد." }
    ],
    mcqs: [
      { question: "How do you make 'You like coffee' a question?", options: ["You do like coffee?", "Like you coffee?", "Do you like coffee?", "Coffee you like?"], answer: "Do you like coffee?" },
      { question: "How do you make 'She went home' negative?", options: ["She didn't went home.", "She didn't go home.", "She not went home.", "She not go home."], answer: "She didn't go home." }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 1: Short Answers",
    explanation: "In spoken English, it's polite to use short answers instead of just 'yes' or 'no'. A short answer uses the subject and the auxiliary verb. For example, 'Yes, I do' or 'No, he isn't'.",
    examples: [
      { english: "Did you have a nice time? - Yes, I did.", arabic: "هل قضيت وقتاً ممتعاً؟ - نعم، فعلت." },
      { english: "Is it raining? - No, it isn't.", arabic: "هل تمطر؟ - لا، ليست كذلك." },
      { english: "Have you had coffee? - Yes, I have.", arabic: "هل شربت القهوة؟ - نعم، فعلت." }
    ],
    mcqs: [
      { question: "A correct short answer for 'Do you live here?' is:", options: ["Yes, I live.", "Yes, I do.", "Yes, I am.", "Yes."], answer: "Yes, I do." },
      { question: "A correct negative short answer for 'Is she coming?' is:", options: ["No, she's not.", "No, she not coming.", "No, she doesn't.", "No, she isn't."], answer: "No, she isn't." }
    ]
  },
  // Unit 2
  {
    type: 'lesson',
    title: "Unit 2: Present Simple vs. Continuous",
    explanation: "The Present Simple describes habits, facts, and routines (e.g., 'He works in a bank'). The Present Continuous describes actions happening now or around the present time (e.g., 'He is working in France at the moment').",
    examples: [
      { english: "She usually drives to work, but today she's walking.", arabic: "هي عادة تقود السيارة إلى العمل، لكنها اليوم تمشي." },
      { english: "The sun rises in the east.", arabic: "الشمس تشرق من الشرق." },
      { english: "What are you working on these days?", arabic: "على ماذا تعمل هذه الأيام؟" }
    ],
    mcqs: [
      { question: "Which tense is for a general truth?", options: ["Present Continuous", "Present Perfect", "Present Simple", "Past Simple"], answer: "Present Simple" },
      { question: "Complete the sentence: 'Listen! The baby ___.'", options: ["cries", "cried", "is crying", "has cried"], answer: "is crying" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 2: Present Passive",
    explanation: "The passive voice is used when the action is more important than the person/thing doing it. Present Simple Passive: is/are + past participle (e.g., 'English is spoken here'). Present Continuous Passive: is/are being + past participle (e.g., 'The house is being built').",
    examples: [
      { english: "We are paid with the money people give.", arabic: "يُدفع لنا بالمال الذي يعطيه الناس." },
      { english: "Children are being treated with a new medicine.", arabic: "يُعالج الأطفال بدواء جديد." },
      { english: "The lions are fed once a day.", arabic: "تُطعم الأسود مرة واحدة في اليوم." }
    ],
    mcqs: [
      { question: "Change to passive: 'They deliver the newspapers in the morning.'", options: ["The newspapers are delivered in the morning.", "The newspapers are being delivered...", "The newspapers deliver in the morning.", "The newspapers were delivered..."], answer: "The newspapers are delivered in the morning." },
      { question: "Complete: 'Look! My car ___.'", options: ["is repaired", "is being repaired", "repairs", "repaired"], answer: "is being repaired" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 2: Sport and Leisure Vocabulary",
    explanation: "For sports and activities, we often use specific verbs: 'play' for team/ball sports (play football), 'go' for activities ending in -ing (go skiing), and 'do' for individual activities/martial arts (do aerobics, do yoga).",
    examples: [
      { english: "I play football on weekends.", arabic: "ألعب كرة القدم في عطلات نهاية الأسبوع." },
      { english: "She goes skiing every winter.", arabic: "تذهب للتزلج كل شتاء." },
      { english: "He does aerobics to stay fit.", arabic: "يمارس التمارين الهوائية ليحافظ على لياقته." }
    ],
    mcqs: [
      { question: "Which verb do you use with 'basketball'?", options: ["go", "do", "play", "make"], answer: "play" },
      { question: "Which verb do you use with 'jogging'?", options: ["go", "do", "play", "run"], answer: "go" }
    ]
  },
  // Unit 3
  {
    type: 'lesson',
    title: "Unit 3: Past Simple vs. Past Continuous",
    explanation: "Past Simple is for a completed action in the past (e.g., 'He danced'). Past Continuous is for an action in progress at a specific past time (e.g., 'He was laughing'). Often used together: a short action (Past Simple) interrupts a longer action (Past Continuous).",
    examples: [
      { english: "He was laughing when he saw the baby.", arabic: "كان يضحك عندما رأى الطفل." },
      { english: "While I was driving home, I saw an accident.", arabic: "بينما كنت أقود السيارة إلى المنزل، رأيت حادثًا." },
      { english: "She packed her suitcase and left.", arabic: "حزمت حقيبتها وغادرت." }
    ],
    mcqs: [
      { question: "Complete: 'When the phone rang, I ___ a shower.'", options: ["had", "was having", "have", "am having"], answer: "was having" },
      { question: "Complete: 'He ___ TV when I arrived.'", options: ["watched", "watches", "was watching", "has watched"], answer: "was watching" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 3: Past Simple vs. Past Perfect",
    explanation: "When describing two past actions, use the Past Perfect (had + past participle) for the action that happened first. Use the Past Simple for the action that happened second.",
    examples: [
      { english: "When I arrived, the film had started.", arabic: "عندما وصلت، كان الفيلم قد بدأ." },
      { english: "I didn't laugh at his joke because I had heard it before.", arabic: "لم أضحك على نكتته لأنني كنت قد سمعتها من قبل." },
      { english: "After she had finished her work, she went home.", arabic: "بعد أن أنهت عملها، ذهبت إلى المنزل." }
    ],
    mcqs: [
      { question: "Complete: 'The patient ___ by the time the doctor arrived.'", options: ["died", "was dying", "had died", "dies"], answer: "had died" },
      { question: "Complete: 'He told me he ___ my book.'", options: ["lost", "had lost", "was losing", "has lost"], answer: "had lost" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 3: Past Passive",
    explanation: "The passive voice in the past. Past Simple Passive: was/were + past participle. Past Perfect Passive: had been + past participle.",
    examples: [
      { english: "A Farewell to Arms was written by Ernest Hemingway.", arabic: "رواية 'وداعًا للسلاح' كُتبت بواسطة إرنست همنغواي." },
      { english: "The window was broken yesterday.", arabic: "كُسرت النافذة أمس." },
      { english: "The work had been finished before he arrived.", arabic: "كان العمل قد أُنجز قبل وصوله." }
    ],
    mcqs: [
      { question: "Change to passive: 'Shakespeare wrote Hamlet.'", options: ["Hamlet was wrote by Shakespeare.", "Hamlet was written by Shakespeare.", "Hamlet is written by Shakespeare.", "Hamlet had written by Shakespeare."], answer: "Hamlet was written by Shakespeare." },
      { question: "Complete: 'The Pyramids ___ by the ancient Egyptians.'", options: ["built", "were building", "are built", "were built"], answer: "were built" }
    ]
  },
  // Unit 4
  {
    type: 'lesson',
    title: "Unit 4: Modals of Obligation (have to, must)",
    explanation: "'have (got) to' and 'must' both express strong obligation. 'have to' is common for external rules (laws, work rules). 'must' is often for personal obligations or strong advice. 'don't have to' means no obligation. 'mustn't' means prohibition.",
    examples: [
      { english: "Children have to go to school.", arabic: "يجب على الأطفال الذهاب إلى المدرسة." },
      { english: "I must remember to call my mother.", arabic: "يجب أن أتذكر الاتصال بوالدتي." },
      { english: "You don't have to come if you're busy.", arabic: "ليس عليك أن تأتي إذا كنت مشغولاً." },
      { english: "You mustn't smoke in the hospital.", arabic: "يجب ألا تدخن في المستشفى." }
    ],
    mcqs: [
      { question: "Which means it is NOT necessary?", options: ["mustn't", "have to", "don't have to", "must"], answer: "don't have to" },
      { question: "Complete: 'At our school, we ___ wear a uniform.'", options: ["must", "should", "don't have to", "have to"], answer: "have to" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 4: Modals of Permission & Advice (can, should)",
    explanation: "'can' and 'be allowed to' are used to express permission (what is okay to do). 'should' is used to give advice or make a suggestion.",
    examples: [
      { english: "You can use my phone if you like.", arabic: "يمكنك استخدام هاتفي إذا أردت." },
      { english: "We're allowed to wear jeans on Fridays.", arabic: "يُسمح لنا بارتداء الجينز أيام الجمعة." },
      { english: "I think we should take traveller's cheques.", arabic: "أعتقد أنه يجب علينا أن نأخذ شيكات سياحية." },
      { english: "You look tired. You should get some sleep.", arabic: "تبدو متعبًا. يجب أن تحصل على قسط من النوم." }
    ],
    mcqs: [
      { question: "To give advice, you use...", options: ["can", "must", "should", "have to"], answer: "should" },
      { question: "Complete: 'You ___ park here. It's not allowed.'", options: ["can", "can't", "should", "shouldn't"], answer: "can't" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 4: Nationality Words",
    explanation: "Nationality adjectives (e.g., French, Spanish) can also refer to the people of that country (the French, the Spanish). Some words are different for the country, adjective, and people (e.g., Scotland, Scottish, the Scots).",
    examples: [
      { english: "She is from Italy. She's Italian.", arabic: "هي من إيطاليا. هي إيطالية." },
      { english: "The Japanese are known for their politeness.", arabic: "يشتهر اليابانيون بأدبهم." },
      { english: "He loves French food.", arabic: "يحب الطعام الفرنسي." }
    ],
    mcqs: [
      { question: "What is the adjective for Holland (the Netherlands)?", options: ["Hollandic", "Netherland", "Dutch", "Hollish"], answer: "Dutch" },
      { question: "What do you call people from Sweden?", options: ["Swedish", "The Swedishes", "The Swedes", "Swedens"], answer: "The Swedes" }
    ]
  },
  // Unit 5
  {
    type: 'lesson',
    title: "Unit 5: Future Forms (going to, will, Present Continuous)",
    explanation: "Use 'going to' for plans made before speaking. Use 'will' for instant decisions, offers, and predictions. Use Present Continuous for fixed arrangements in the near future.",
    examples: [
      { english: "I'm going to buy some milk. (It's on my list)", arabic: "سأشتري بعض الحليب. (هو على قائمتي)" },
      { english: "The phone is ringing. I'll get it! (Instant decision)", arabic: "الهاتف يرن. سأرد عليه! (قرار فوري)" },
      { english: "We're playing tennis this afternoon. (Arrangement)", arabic: "سنلعب التنس بعد ظهر هذا اليوم. (ترتيب)" }
    ],
    mcqs: [
      { question: "Complete: 'I've already decided. I ___ a new car.'", options: ["will buy", "am going to buy", "am buying", "buy"], answer: "am going to buy" },
      { question: "Complete: 'Don't worry, I ___ you with your bags.'", options: ["am helping", "am going to help", "will help", "help"], answer: "will help" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 5: Questions with 'like'",
    explanation: "'What's she like?' asks about personality. 'What does she look like?' asks about physical appearance. 'What does she like doing?' asks about hobbies and interests.",
    examples: [
      { english: "What's your teacher like? - She's very kind and patient.", arabic: "كيف هي معلمتك؟ - هي لطيفة جداً وصبورة." },
      { english: "What does she look like? - She's tall and has long, dark hair.", arabic: "كيف تبدو؟ - هي طويلة ولها شعر داكن طويل." },
      { english: "What does she like doing? - She likes dancing and music.", arabic: "ماذا تحب أن تفعل؟ - تحب الرقص والموسيقى." }
    ],
    mcqs: [
      { question: "Which question asks about appearance?", options: ["What's he like?", "How is he?", "What does he look like?", "What does he like?"], answer: "What does he look like?" },
      { question: "How would you answer 'What's London like?'", options: ["It's in England.", "It's a huge, exciting city.", "I like it.", "It looks big."], answer: "It's a huge, exciting city." }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 5: Vocabulary of Weather",
    explanation: "Learn to describe the weather using adjectives (sunny, windy, foggy), nouns (sunshine, wind, fog), and verbs (The sun is shining, It's raining).",
    examples: [
      { english: "It's a sunny day today.", arabic: "إنه يوم مشمس اليوم." },
      { english: "The wind is blowing hard.", arabic: "الرياح تهب بقوة." },
      { english: "The forecast is for heavy rain tomorrow.", arabic: "التوقعات تشير إلى أمطار غزيرة غداً." }
    ],
    mcqs: [
      { question: "The noun form of 'snowy' is:", options: ["snowing", "snow", "snowed", "snows"], answer: "snow" },
      { question: "What do you call rain and strong wind together?", options: ["A storm", "A fog", "A shine", "An ice"], answer: "A storm" }
    ]
  },
  // Unit 6
  {
    type: 'lesson',
    title: "Unit 6: Verb Patterns",
    explanation: "Different verbs are followed by different patterns. Verb + -ing (e.g., enjoy, finish, avoid). Verb + to-infinitive (e.g., want, decide, hope). Verb + object + to-infinitive (e.g., ask someone to do, tell someone to do). Verb + object + infinitive (no 'to') (e.g., make someone do, let someone do).",
    examples: [
      { english: "I enjoy meeting your friends.", arabic: "أستمتع بمقابلة أصدقائك." },
      { english: "I wanted to say thank you.", arabic: "أردت أن أقول شكراً لك." },
      { english: "You made me feel welcome.", arabic: "لقد جعلتني أشعر بالترحاب." },
      { english: "My aunt wanted me to stay longer.", arabic: "أرادت عمتي أن أبقى لفترة أطول." }
    ],
    mcqs: [
      { question: "Complete: 'He promised ___ me.'", options: ["calling", "call", "to call", "called"], answer: "to call" },
      { question: "Complete: 'She avoids ___ junk food.'", options: ["eating", "to eat", "eat", "eats"], answer: "eating" },
      { question: "Complete: 'My parents let me ___ out late.'", options: ["to stay", "staying", "stay", "to staying"], answer: "stay" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 6: Adjectives for Description",
    explanation: "Use a wide range of adjectives to describe food (fresh, tasteless), towns (polluted, historic), and people (sociable, sophisticated).",
    examples: [
      { english: "The food at that restaurant was delicious.", arabic: "كان الطعام في ذلك المطعم لذيذاً." },
      { english: "Venice is a historic and beautiful city.", arabic: "البندقية مدينة تاريخية وجميلة." },
      { english: "He's a very outgoing and sociable person.", arabic: "هو شخص منفتح واجتماعي جداً." }
    ],
    mcqs: [
      { question: "Which adjective does NOT describe food?", options: ["fresh", "delicious", "polluted", "tasteless"], answer: "polluted" },
      { question: "A synonym for 'friendly and enjoys company' is:", options: ["shy", "rude", "sociable", "bored"], answer: "sociable" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 6: Everyday English - Signs and Sounds",
    explanation: "Recognize common signs ('Dry clean only', 'Pay and Display') and understand common phrases you hear in public places ('Just looking, thanks.', 'We apologize for the delay...').",
    examples: [
      { english: "The sign says 'Do not iron trim.'", arabic: "تقول اللافتة 'لا تكوي الزخرفة'." },
      { english: "In a shop, an assistant asks 'Can I help you?' You can reply 'Just looking, thanks.'", arabic: "في متجر، يسأل المساعد 'هل يمكنني مساعدتك؟' يمكنك الرد 'أتصفح فقط، شكراً'." }
    ],
    mcqs: [
      { question: "Where would you see a 'Pay and Display' sign?", options: ["In a library", "In a car park", "In a restaurant", "On a motorway"], answer: "In a car park" },
      { question: "What does 'Coats left at owner's risk' mean?", options: ["The owner will look after your coat.", "The establishment is not responsible if your coat is stolen.", "You must leave your coat here.", "You can buy a coat at your own risk."], answer: "The establishment is not responsible if your coat is stolen." }
    ]
  },
  // Unit 7
  {
    type: 'lesson',
    title: "Unit 7: Present Perfect vs. Past Simple",
    explanation: "Use Past Simple for finished actions at a specific time in the past (e.g., 'I worked for the BBC'). Use Present Perfect for actions over a period of time up to now, or past actions with a present result (e.g., 'I've worked there for five years').",
    examples: [
      { english: "I have worked there for five years. (I still work there)", arabic: "لقد عملت هناك لمدة خمس سنوات. (ما زلت أعمل هناك)" },
      { english: "I worked for the BBC. (I don't work there now)", arabic: "عملت في بي بي سي. (أنا لا أعمل هناك الآن)" },
      { english: "I went to Spain in 2010.", arabic: "ذهبت إلى إسبانيا في عام 2010." },
      { english: "I have been to Spain three times.", arabic: "لقد زرت إسبانيا ثلاث مرات." }
    ],
    mcqs: [
      { question: "Complete: 'She ___ her leg, so she can't play tennis today.'", options: ["broke", "has broken", "had broken", "breaks"], answer: "has broken" },
      { question: "Complete: 'Mozart ___ more than 600 pieces of music.'", options: ["has written", "wrote", "was writing", "writes"], answer: "wrote" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 7: Present Perfect Passive",
    explanation: "The passive form of the Present Perfect is 'have/has been + past participle'. It's used when the action is more important than who did it, for experiences or recent events.",
    examples: [
      { english: "Two novelists have been awarded the prize.", arabic: "مُنح روائيان الجائزة." },
      { english: "My car has been stolen!", arabic: "لقد سُرقت سيارتي!" },
      { english: "Have you ever been bitten by a dog?", arabic: "هل عضك كلب من قبل؟" }
    ],
    mcqs: [
      { question: "Change to passive: 'They have built a new bridge.'", options: ["A new bridge was built.", "A new bridge has been building.", "A new bridge has been built.", "A new bridge is built."], answer: "A new bridge has been built." },
      { question: "Complete: 'This book ___ into fifty languages.'", options: ["is translated", "has translated", "has been translated", "was being translated"], answer: "has been translated" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 7: Phrasal Verbs",
    explanation: "A phrasal verb = verb + particle (e.g., look after, turn on). Some are separable (you can put the object in the middle: 'turn it on'). Some are inseparable ('look after the baby').",
    examples: [
      { english: "She looked out of the window. (Literal)", arabic: "نظرت من النافذة. (حرفي)" },
      { english: "Look out! A car is coming. (Idiomatic, means be careful)", arabic: "انتبه! سيارة قادمة. (اصطلاحي، يعني كن حذراً)" },
      { english: "Please turn the music down.", arabic: "من فضلك اخفض صوت الموسيقى." },
      { english: "I need to look after my little sister.", arabic: "أنا بحاجة إلى رعاية أختي الصغيرة." }
    ],
    mcqs: [
      { question: "Which phrasal verb means 'to postpone'?", options: ["put on", "put away", "put off", "put up"], answer: "put off" },
      { question: "Which sentence is correct?", options: ["Turn on it.", "Turn it on.", "On turn it.", "It turn on."], answer: "Turn it on." }
    ]
  },
  // Unit 8
  {
    type: 'lesson',
    title: "Unit 8: First Conditional",
    explanation: "The First Conditional is for real possibilities in the future. Structure: If + Present Simple, ... will/won't + verb. It talks about a possible future condition and its probable result.",
    examples: [
      { english: "If I see Anna, I'll tell her.", arabic: "إذا رأيت آنا، سأخبرها." },
      { english: "If you don't study, you won't pass the exam.", arabic: "إذا لم تدرس، فلن تنجح في الامتحان." },
      { english: "What will you do if it rains?", arabic: "ماذا ستفعل إذا أمطرت؟" }
    ],
    mcqs: [
      { question: "Complete: 'If you ___ hard, you will succeed.'", options: ["work", "will work", "worked", "would work"], answer: "work" },
      { question: "Complete: 'I'll call you when I ___.'", options: ["will arrive", "arrive", "am arriving", "arrived"], answer: "arrive" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 8: Second Conditional",
    explanation: "The Second Conditional is for hypothetical or unreal situations in the present or future. Structure: If + Past Simple, ... would/wouldn't + verb. We often use 'were' instead of 'was' for all persons.",
    examples: [
      { english: "If I had £5 million, I'd buy an island.", arabic: "لو كان لدي 5 ملايين جنيه، لاشتريت جزيرة." },
      { english: "If I were you, I would apologize.", arabic: "لو كنت مكانك، لاعتذرت." },
      { english: "What would you do if you saw a ghost?", arabic: "ماذا كنت ستفعل لو رأيت شبحًا؟" }
    ],
    mcqs: [
      { question: "Complete: 'If I ___ the president, I would change many things.'", options: ["am", "was", "will be", "were"], answer: "were" },
      { question: "Complete: 'She ___ travel more if she had more money.'", options: ["will", "would", "is going to", "can"], answer: "would" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 8: Base and Strong Adjectives",
    explanation: "Some adjectives are 'base' (e.g., good, tired) and can be modified with 'very'. 'Strong' adjectives already have 'very' in their meaning (e.g., wonderful, exhausted) and are modified with 'absolutely' or 'really'.",
    examples: [
      { english: "I was very tired after the long journey.", arabic: "كنت متعبًا جدًا بعد الرحلة الطويلة." },
      { english: "The film wasn't just good, it was absolutely wonderful.", arabic: "لم يكن الفيلم جيدًا فحسب، بل كان رائعًا للغاية." },
      { english: "She was absolutely exhausted, not just tired.", arabic: "كانت منهكة تمامًا، وليس مجرد متعبة." }
    ],
    mcqs: [
      { question: "Which is a strong adjective for 'bad'?", options: ["not good", "terrible", "very bad", "worse"], answer: "terrible" },
      { question: "Which adverb can you use with 'exhausted'?", options: ["very", "a bit", "absolutely", "fairly"], answer: "absolutely" }
    ]
  },
  // Unit 9
  {
    type: 'lesson',
    title: "Unit 9: Modals of Probability (must, could, might, can't)",
    explanation: "Used to make logical deductions. 'must' = I'm almost sure it's true. 'might/could' = It's possible. 'can't' = I'm almost sure it's impossible.",
    examples: [
      { english: "You haven't eaten all day. You must be hungry.", arabic: "لم تأكل طوال اليوم. لا بد أنك جائع." },
      { english: "She isn't at home. She might be at work.", arabic: "هي ليست في المنزل. قد تكون في العمل." },
      { english: "That can't be John's car. He sold his car last week.", arabic: "لا يمكن أن تكون تلك سيارة جون. لقد باع سيارته الأسبوع الماضي." }
    ],
    mcqs: [
      { question: "Complete: 'The lights are off. They ___ be at home.'", options: ["must", "might", "can't", "should"], answer: "can't" },
      { question: "Complete: 'I'm not sure where my keys are. I ___ have left them in the car.'", options: ["must", "can't", "could", "should"], answer: "could" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 9: Past Modals of Probability",
    explanation: "To make deductions about the past, use modal + have + past participle. 'must have' (I'm sure it happened). 'might/could have' (It possibly happened). 'can't have' (I'm sure it didn't happen).",
    examples: [
      { english: "The ground is wet. It must have rained last night.", arabic: "الأرض مبللة. لا بد أنها أمطرت الليلة الماضية." },
      { english: "He's late. He might have missed the bus.", arabic: "إنه متأخر. ربما فاته الحافلة." },
      { english: "She can't have finished the report already. It's too long.", arabic: "لا يمكن أن تكون قد أنهت التقرير بالفعل. إنه طويل جداً." }
    ],
    mcqs: [
      { question: "Complete: 'He failed the exam. He ___ studied very hard.'", options: ["must have", "can't have", "could have", "should have"], answer: "can't have" },
      { question: "Complete: 'I can't find my wallet. I ___ it at the restaurant.'", options: ["must leave", "can't have left", "might have left", "should leave"], answer: "might have left" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 9: Character Adjectives",
    explanation: "Adjectives used to describe a person's character and personality, such as reliable (someone you can trust), sociable (friendly), and easygoing (relaxed).",
    examples: [
      { english: "She is very reliable; if she says she'll do something, she'll do it.", arabic: "هي موثوقة جداً؛ إذا قالت إنها ستفعل شيئًا، فستفعله." },
      { english: "He's an easygoing person who never seems to worry.", arabic: "هو شخص هادئ لا يبدو أنه يقلق أبدًا." }
    ],
    mcqs: [
      { question: "What is the opposite of 'shy'?", options: ["Sociable", "Reliable", "Easygoing", "Rude"], answer: "Sociable" },
      { question: "A person who is calm and doesn't get angry easily is...", options: ["Reliable", "Sociable", "Easygoing", "Generous"], answer: "Easygoing" }
    ]
  },
  // Unit 10
  {
    type: 'lesson',
    title: "Unit 10: Present Perfect Continuous",
    explanation: "Focuses on the duration of an activity that started in the past and is still ongoing, or has just stopped. Form: have/has been + verb-ing.",
    examples: [
      { english: "I've been texting my friends all day long.", arabic: "كنت أراسل أصدقائي طوال اليوم." },
      { english: "How long have you been learning English?", arabic: "منذ متى وأنت تتعلم اللغة الإنجليزية؟" },
      { english: "She's been living in Paris since she got married.", arabic: "هي تعيش في باريس منذ أن تزوجت." }
    ],
    mcqs: [
      { question: "Complete: 'It ___ for hours.'", options: ["rains", "is raining", "has rained", "has been raining"], answer: "has been raining" },
      { question: "Complete: 'I'm tired because I ___.'", options: ["have worked", "have been working", "worked", "am working"], answer: "have been working" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 10: Present Perfect Simple vs. Continuous",
    explanation: "Use the Simple form to focus on the result or completion of an action, especially with numbers ('I've written three emails'). Use the Continuous form to focus on the duration of the activity ('I've been writing emails all morning').",
    examples: [
      { english: "She has received a huge phone bill. (Result)", arabic: "لقد استلمت فاتورة هاتف ضخمة. (نتيجة)" },
      { english: "She has been calling her friends all day. (Duration)", arabic: "كانت تتصل بأصدقائها طوال اليوم. (مدة)" }
    ],
    mcqs: [
      { question: "Complete: 'I ___ three books this month.'", options: ["have been reading", "have read", "read", "am reading"], answer: "have read" },
      { question: "Complete: 'My clothes are dirty because I ___ the garden.'", options: ["worked in", "have been working in", "have worked in", "work in"], answer: "have been working in" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 10: Expressing Quantity",
    explanation: "Learn phrases to talk about quantity: 'How much' for uncountable nouns (coffee, money), 'How many' for countable nouns (books, friends), and words like 'a lot of', 'too much', 'too many', 'enough'.",
    examples: [
      { english: "How much coffee do you drink?", arabic: "كم تشرب من القهوة؟" },
      { english: "That's too much sugar for me.", arabic: "هذا سكر أكثر من اللازم بالنسبة لي." },
      { english: "I have a lot of friends.", arabic: "لدي الكثير من الأصدقاء." }
    ],
    mcqs: [
      { question: "Which is correct?", options: ["How much people were there?", "How many people was there?", "How many people were there?", "How much people was there?"], answer: "How many people were there?" },
      { question: "Complete: 'There is ___ traffic on the roads today.'", options: ["too many", "too much", "enough", "many"], answer: "too much" }
    ]
  },
  // Unit 11
  {
    type: 'lesson',
    title: "Unit 11: Indirect Questions",
    explanation: "To be more polite, we often use indirect questions, which start with phrases like 'Could you tell me...' or 'I wonder...'. The word order is like a statement (subject + verb), not a question.",
    examples: [
      { english: "Direct: What time is it? -> Indirect: Could you tell me what time it is?", arabic: "مباشر: كم الساعة؟ -> غير مباشر: هل يمكنك أن تخبرني كم الساعة؟" },
      { english: "Direct: Does this bus go downtown? -> Indirect: Do you know if this bus goes downtown?", arabic: "مباشر: هل تذهب هذه الحافلة إلى وسط المدينة؟ -> غير مباشر: هل تعرف ما إذا كانت هذه الحافلة تذهب إلى وسط المدينة؟" }
    ],
    mcqs: [
      { question: "Make this question indirect: 'Where is the nearest bank?'", options: ["Can you tell me where is the nearest bank?", "Can you tell me where the nearest bank is?", "Can you tell me where the bank nearest is?", "Can you tell me is where the nearest bank?"], answer: "Can you tell me where the nearest bank is?" },
      { question: "Complete: 'I wonder ___.'", options: ["if she will come", "will she come", "if will she come", "she will come"], answer: "if she will come" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 11: Question Tags",
    explanation: "Question tags are short questions at the end of statements, used to confirm information or encourage a reply. The pattern is usually positive statement + negative tag, or negative statement + positive tag.",
    examples: [
      { english: "It's a beautiful day, isn't it?", arabic: "إنه يوم جميل، أليس كذلك؟" },
      { english: "You haven't seen my keys, have you?", arabic: "لم تر مفاتيحي، أليس كذلك؟" },
      { english: "She works here, doesn't she?", arabic: "هي تعمل هنا، أليس كذلك؟" }
    ],
    mcqs: [
      { question: "Add a question tag: 'He can swim,...'", options: ["can he?", "can't he?", "does he?", "doesn't he?"], answer: "can't he?" },
      { question: "Add a question tag: 'You didn't do it,...'", options: ["did you?", "didn't you?", "do you?", "don't you?"], answer: "did you?" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 11: Idioms",
    explanation: "Idioms are expressions where the meaning is not obvious from the individual words. For example, 'hit the roof' means to get very angry.",
    examples: [
      { english: "When he saw the broken vase, he hit the roof.", arabic: "عندما رأى المزهرية المكسورة، غضب بشدة." },
      { english: "The exam was a piece of cake.", arabic: "كان الامتحان سهلاً جداً." }
    ],
    mcqs: [
      { question: "What does 'to hold your breath' mean?", options: ["To breathe deeply", "To wait for something anxiously", "To be out of breath", "To stop breathing"], answer: "To wait for something anxiously" },
      { question: "If something costs 'an arm and a leg', it is very...", options: ["cheap", "heavy", "expensive", "useful"], answer: "expensive" }
    ]
  },
  // Unit 12
  {
    type: 'lesson',
    title: "Unit 12: Reported Statements",
    explanation: "To report what someone said, we often use a reporting verb (like 'said' or 'told') and change the original tense 'one step back' into the past (e.g., Present Simple -> Past Simple).",
    examples: [
      { english: "Direct speech: 'I am tired.' -> Reported speech: He said that he was tired.", arabic: "كلام مباشر: 'أنا متعب.' -> كلام منقول: قال إنه كان متعبًا." },
      { english: "Direct: 'I will be there.' -> Reported: She told me she would be there.", arabic: "مباشر: 'سأكون هناك.' -> منقول: أخبرتني أنها ستكون هناك." }
    ],
    mcqs: [
      { question: "Report this: 'I work in London.'", options: ["She said she works in London.", "She said she worked in London.", "She said I work in London.", "She told she worked in London."], answer: "She said she worked in London." },
      { question: "Report this: 'We have finished.'", options: ["They said they have finished.", "They said we had finished.", "They said they had finished.", "They told us we have finished."], answer: "They said they had finished." }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 12: Reported Questions",
    explanation: "To report questions, use a reporting verb like 'asked' and use statement word order. If there is no question word (who, what, where), use 'if' or 'whether'.",
    examples: [
      { english: "Direct: 'Where do you live?' -> Reported: He asked me where I lived.", arabic: "مباشر: 'أين تعيش؟' -> منقول: سألني أين أعيش." },
      { english: "Direct: 'Are you coming?' -> Reported: She asked if I was coming.", arabic: "مباشر: 'هل أنت قادم؟' -> منقول: سألت إذا كنت قادمًا." }
    ],
    mcqs: [
      { question: "Report this: 'What time is it?'", options: ["He asked what time is it.", "He asked what is the time.", "He asked what time it was.", "He asked what time it is."], answer: "He asked what time it was." },
      { question: "Report this: 'Did you see the film?'", options: ["She asked if I had seen the film.", "She asked did I see the film.", "She asked I had seen the film.", "She asked if had I seen the film."], answer: "She asked if I had seen the film." }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 12: Reported Commands/Requests",
    explanation: "To report commands and requests, use the pattern: reporting verb (told, asked) + object + (not) to + infinitive.",
    examples: [
      { english: "Direct: 'Stop making a noise!' -> Reported: He told them to stop making a noise.", arabic: "مباشر: 'توقفوا عن إحداث ضوضاء!' -> منقول: أخبرهم أن يتوقفوا عن إحداث ضوضاء." },
      { english: "Direct: 'Please help me.' -> Reported: I asked them to help me.", arabic: "مباشر: 'من فضلكم ساعدوني.' -> منقول: طلبت منهم مساعدتي." }
    ],
    mcqs: [
      { question: "Report this: 'Don't be late.'", options: ["He told me don't be late.", "He told me to not be late.", "He told me not to be late.", "He told to me not be late."], answer: "He told me not to be late." },
      { question: "Report this: 'Could you open the window?'", options: ["She asked me open the window.", "She asked me to open the window.", "She asked to me to open the window.", "She asked me could I open the window."], answer: "She asked me to open the window." }
    ]
  }
];

const stories: Story[] = [
    {
      type: 'story',
      title: "قصة: الثعلب والعنب",
      content: `One hot summer's day, a fox was strolling through an orchard. He saw a bunch of delicious-looking grapes hanging from a high branch. "Just the thing to quench my thirst," he thought. He backed up a few paces, took a run and a jump, but just missed the hanging grapes. Again and again he tried, but he could not reach them. At last, he gave up and walked away with his nose in the air, saying, "I am sure they are sour."`
    },
    {
      type: 'story',
      title: "قصة: الأسد والفأر",
      content: `A lion was sleeping in his lair. A little mouse began running up and down on him. This soon wakened the lion, who placed his huge paw on him and opened his big jaws to swallow him. "Pardon, O King!" cried the little mouse. "Forgive me this time. I shall never repeat it and I shall never forget your kindness. Who knows, I may be able to do you a good turn one of these days?" The lion was so tickled by the idea of the mouse being able to help him that he lifted his paw and let him go. Some time later, the lion was caught in a trap, and the hunters who desired to carry him alive to the King, tied him to a tree while they went in search of a wagon to carry him on. Just then the little mouse happened to pass by, and seeing the sad plight in which the lion was, went up to him and soon gnawed away the ropes that bound the King of the Beasts. "Was I not right?" said the little mouse, very happy to help the lion.`
    },
    {
      type: 'story',
      title: "قصة: السلحفاة والأرنب",
      content: `An hare was making fun of the tortoise one day for being so slow. "Do you ever get anywhere?" he asked with a mocking laugh. "Yes," replied the tortoise, "and I get there sooner than you think. I'll run you a race and prove it." The hare was much amused at the idea of running a race with the tortoise, but for the fun of the thing he agreed. So the fox, who had consented to act as judge, marked the distance and started the runners off. The hare was soon far out of sight, and to make the tortoise feel very deeply how ridiculous it was for him to try a race with a hare, he lay down beside the course to take a nap until the tortoise should catch up. The tortoise meanwhile kept going slowly but steadily, and, after a time, passed the place where the hare was sleeping. The hare slept on very peacefully; and when at last he did wake up, the tortoise was near the goal. The hare now ran his swiftest, but he could not overtake the tortoise in time.`
    },
     {
      type: 'story',
      title: "قصة: الغراب والإبريق",
      content: `A thirsty crow found a pitcher with a little water in it. But the pitcher was high and had a narrow neck, and no matter how he tried, he could not reach the water. The poor thing felt as if he must die of thirst. Then an idea came to him. He took a pebble and dropped it into the pitcher. Then he took another pebble and dropped it into the pitcher. He took another and another and dropped them in. At last, he saw the water rise, and after casting in a few more pebbles, he was able to quench his thirst and save his life.`
    },
    {
      type: 'story',
      title: "قصة: مدينة الفئران وريف الفئران",
      content: `A country mouse invited a town mouse to dinner. The town mouse came, but was not impressed with the simple food. He said, "You live a poor life, cousin. Come with me and I will show you how to live!" So they went to the town. The town mouse led him to a great dining hall. They feasted on cakes and jellies. Suddenly, they heard a great barking. Two huge dogs rushed in. The mice scampered away. "Goodbye, cousin," said the country mouse. "Better beans and bacon in peace than cakes and ale in fear."`
    },
    {
      type: 'story',
      title: "The Boy Who Cried Wolf",
      content: "There was once a young shepherd boy who tended his sheep at the foot of a mountain near a dark forest. It was rather lonely for him all day, so he thought upon a plan by which he could get a little company and some excitement. He rushed down towards the village calling out 'Wolf, Wolf,' and the villagers came out to meet him, and some of them stopped with him for a considerable time. This pleased the boy so much that a few days afterwards he tried the same trick, and again the villagers came to his help. But shortly after this a wolf actually did come out from the forest, and began to worry the sheep, and the boy of course cried out 'Wolf, Wolf,' still louder than before. But this time the villagers, who had been fooled twice before, thought the boy was again deceiving them, and nobody stirred to come to his help."
    },
    {
      type: 'story',
      title: "The Ant and the Grasshopper",
      content: "In a field one summer's day a Grasshopper was hopping about, chirping and singing to its heart's content. An Ant passed by, bearing along with great toil an ear of corn he was taking to the nest. 'Why not come and chat with me,' said the Grasshopper, 'instead of toiling and moiling in that way?' 'I am helping to lay up food for the winter,' said the Ant, 'and recommend you to do the same.' 'Why bother about winter?' said the Grasshopper; 'we have got plenty of food at present.' But the Ant went on its way and continued its toil. When the winter came the Grasshopper had no food and found itself dying of hunger, while it saw the ants distributing every day corn and grain from the stores they had collected in the summer."
    },
    {
      type: 'story',
      title: "The Goose with the Golden Eggs",
      content: "One day a countryman going to the nest of his Goose found there an egg all yellow and glittering. When he took it up it was as heavy as lead and he was going to throw it away, because he thought a trick had been played upon him. But he took it home on second thoughts, and soon found to his delight that it was an egg of pure gold. Every morning the same thing occurred, and he soon became rich by selling his eggs. As he grew rich he grew greedy; and thinking to get at once all the gold the Goose could give, he killed it and opened it only to find nothing."
    },
    {
      type: 'story',
      title: "The North Wind and the Sun",
      content: "The North Wind and the Sun had a quarrel about which of them was the stronger. While they were disputing with much heat and bluster, a Traveler passed along the road wrapped in a cloak. 'Let us agree,' said the Sun, 'that he is the stronger who can strip that Traveler of his cloak.' 'Very well,' growled the North Wind, and at once sent a cold, howling blast against the Traveler. With the first gust of wind the ends of the cloak whipped about the Traveler's body. But he immediately wrapped it closely around him, and the harder the Wind blew, the tighter he held it to him. The North Wind tore angrily at the cloak, but all his efforts were in vain. Then the Sun began to shine. At first his beams were gentle, and in the welcome warmth after the bitter cold of the North Wind, the Traveler unfastened his cloak and let it hang loosely from his shoulders. The Sun's rays grew warmer and warmer. The man took off his cap and mopped his brow. At last he became so heated that he pulled off his cloak, and, to escape the blazing sunshine, threw himself down in the welcome shade of a tree."
    }
];

// Combine lessons and stories, ensuring we have at least 80 items total.
// This creates a richer, more varied learning path for the user.
const fullLessonPlan: LearningItem[] = [];
let lessonIndex = 0;
let storyIndex = 0;

// This loop interleaves stories with lessons to create a varied learning path.
// It will add a story after approximately every 3-4 lessons.
while (fullLessonPlan.length < 80) {
    // Add a batch of lessons
    for (let i = 0; i < 3; i++) {
        if (lessonIndex < lessons.length) {
            fullLessonPlan.push(lessons[lessonIndex]);
            lessonIndex++;
        }
    }

    // Add a story
    if (storyIndex < stories.length) {
        fullLessonPlan.push(stories[storyIndex]);
        storyIndex++;
    }

    // If we've run out of unique lessons or stories, break to avoid duplicates
    // and just fill the rest with a generic lesson.
    if (lessonIndex >= lessons.length && storyIndex >= stories.length) {
        break;
    }
}


// If the plan is still under 80 items, fill the rest with placeholder lessons
// to ensure a consistent library size.
const placeholderLesson: Lesson = {
    type: 'lesson',
    title: "Future Lesson",
    explanation: "This is a placeholder for a future lesson. Content will be added soon based on advanced topics.",
    examples: [{ english: "This is a placeholder example.", arabic: "هذا مثال مؤقت." }],
    mcqs: [{ question: "This is a placeholder question.", options: ["A", "B"], answer: "A" }]
};

while (fullLessonPlan.length < 80) {
    const newLesson = { ...placeholderLesson, title: `درس متقدم قيد الإعداد ${fullLessonPlan.length + 1}` };
    fullLessonPlan.push(newLesson);
}


export const learningItems: LearningItem[] = fullLessonPlan;
