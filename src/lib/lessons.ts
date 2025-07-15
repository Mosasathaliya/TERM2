
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
    title: "Unit 1: Auxiliary verbs (do, be, have)",
    explanation: "Auxiliary verbs are helping verbs. 'do' is for questions and negatives in simple tenses. 'be' is for continuous tenses and the passive voice. 'have' is for perfect tenses.",
    examples: [
      { english: "Where do you work?", arabic: "أين تعمل؟" },
      { english: "She isn't coming today.", arabic: "هي لن تأتي اليوم." },
      { english: "Have you seen that movie?", arabic: "هل شاهدت ذلك الفيلم؟" }
    ],
    mcqs: [
      { question: "Which auxiliary verb is used for Present Simple questions?", options: ["be", "have", "do", "will"], answer: "do" },
      { question: "Complete: He ___ watching TV.", options: ["is", "does", "has", "do"], answer: "is" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 1: Tenses (Present, Past, Present Perfect)",
    explanation: "Tenses tell you when an action happens. Present for now, Past for before now, and Present Perfect for past actions connected to the present.",
    examples: [
      { english: "She works in a bank. (Present)", arabic: "هي تعمل في بنك." },
      { english: "He visited Paris last year. (Past)", arabic: "هو زار باريس العام الماضي." },
      { english: "I have finished my homework. (Present Perfect)", arabic: "لقد أنهيت واجبي." }
    ],
    mcqs: [
      { question: "What tense is 'I have finished'?", options: ["Past Simple", "Present Perfect", "Present Continuous", "Past Perfect"], answer: "Present Perfect" },
      { question: "The sentence 'She arrived yesterday' is in the...", options: ["Past Simple", "Present Perfect", "Past Continuous", "Future Simple"], answer: "Past Simple" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 1: Short Answers",
    explanation: "In conversation, replying with just 'yes' or 'no' can sound impolite. Use short answers with an auxiliary verb (e.g., Yes, I do. / No, he isn't.).",
    examples: [
      { english: "Do you like tea? - Yes, I do.", arabic: "هل تحب الشاي؟ - نعم." },
      { english: "Is he from Canada? - No, he isn't.", arabic: "هل هو من كندا؟ - لا." }
    ],
    mcqs: [
        { question: "How do you answer 'Are you tired?' affirmatively?", options: ["Yes.", "Yes, I am.", "Yes, I'm.", "I am."], answer: "Yes, I am." },
        { question: "How do you answer 'Did he call?' negatively?", options: ["No.", "No, he didn't.", "No, he didn't call.", "He didn't."], answer: "No, he didn't." }
    ]
  },
  // Unit 2
  {
    type: 'lesson',
    title: "Unit 2: Present Tenses (Simple vs Continuous)",
    explanation: "Present Simple is for habits and facts (I work every day). Present Continuous is for actions happening now or around now (I am working now).",
    examples: [
      { english: "She usually drives, but today she's walking.", arabic: "هي عادة تقود، لكنها اليوم تمشي." },
      { english: "Water boils at 100 degrees Celsius.", arabic: "الماء يغلي عند 100 درجة مئوية." }
    ],
    mcqs: [
      { question: "Water ___ at 100 degrees Celsius.", options: ["is boiling", "boil", "boils", "boilt"], answer: "boils" },
      { question: "Please be quiet. I ___ to the radio.", options: ["listen", "am listening", "listens", "listened"], answer: "am listening" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 2: Present Passive",
    explanation: "The passive voice is used when the focus is on the action, not the person who does it. Present Simple Passive: is/are + past participle. Present Continuous Passive: is/are being + past participle.",
    examples: [
      { english: "My car is being repaired today.", arabic: "سيارتي تصلح اليوم." },
      { english: "English is spoken all over the world.", arabic: "اللغة الإنجليزية يتم التحدث بها في جميع أنحاء العالم." }
    ],
    mcqs: [
      { question: "How do you say 'They make cars in Germany' in passive?", options: ["Cars are make in Germany.", "Cars are made in Germany.", "Cars make in Germany.", "Cars are being made in Germany."], answer: "Cars are made in Germany." },
      { question: "The bridge ___ at the moment.", options: ["is repaired", "is being repaired", "repairs", "repaired"], answer: "is being repaired" }
    ]
  },
  // Unit 3
  {
    type: 'lesson',
    title: "Unit 3: Past Tenses (Simple and Continuous)",
    explanation: "Past Simple is for completed actions in the past. Past Continuous is for an action in progress at a specific time in the past.",
    examples: [
      { english: "He was laughing when he saw the baby.", arabic: "كان يضحك عندما رأى الطفل." },
      { english: "I watched a film last night.", arabic: "شاهدت فيلما الليلة الماضية." }
    ],
    mcqs: [
      { question: "When I arrived, they ___ dinner.", options: ["had", "was having", "were having", "have"], answer: "were having" },
      { question: "She ___ to school when she saw the accident.", options: ["walked", "was walking", "walks", "is walking"], answer: "was walking" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 3: Past Simple vs Past Perfect",
    explanation: "Use the Past Perfect (had + past participle) for an action that happened before another past action (which is in the Past Simple).",
    examples: [
      { english: "I didn't laugh because I had heard the joke before.", arabic: "لم أضحك لأنني سمعت النكتة من قبل." },
      { english: "The train had left when I arrived at the station.", arabic: "كان القطار قد غادر عندما وصلت إلى المحطة." }
    ],
    mcqs: [
      { question: "When she arrived, the party ___.", options: ["started", "had started", "was starting", "start"], answer: "had started" },
      { question: "He knew London so well because he ___ there many times.", options: ["visited", "had visited", "was visiting", "visit"], answer: "had visited" }
    ]
  },
  // Unit 4
  {
    type: 'lesson',
    title: "Unit 4: Modals 1 (have to, can, be allowed to)",
    explanation: "'have to' expresses strong obligation. 'can' and 'be allowed to' express permission. The negative 'don't have to' means there is no obligation.",
    examples: [
      { english: "Children have to go to school.", arabic: "يجب على الأطفال الذهاب إلى المدرسة." },
      { english: "You don't have to pay, it's free.", arabic: "لا يجب عليك الدفع، إنه مجاني." },
      { english: "You are not allowed to smoke here.", arabic: "غير مسموح لك بالتدخين هنا." }
    ],
    mcqs: [
      { question: "You ___ buy a ticket before getting on the train.", options: ["can", "have to", "are allowed to", "don't have to"], answer: "have to" },
      { question: "It's a free museum. You ___ pay.", options: ["have to", "must", "don't have to", "can't"], answer: "don't have to" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 4: Modals 1 (should, must)",
    explanation: "'should' is for advice. 'must' is for strong obligation. 'mustn't' is for prohibition (something you are not allowed to do).",
    examples: [
      { english: "You should see a doctor.", arabic: "يجب أن تذهب إلى الطبيب." },
      { english: "You must finish your homework.", arabic: "يجب عليك إنهاء واجبك." },
      { english: "You mustn't touch that.", arabic: "يجب ألا تلمس ذلك." }
    ],
    mcqs: [
      { question: "You look tired. You ___ get some rest.", options: ["must", "should", "have to", "can"], answer: "should" },
      { question: "You ___ touch that! It's dangerous.", options: ["shouldn't", "mustn't", "don't have to", "can't"], answer: "mustn't" }
    ]
  },
  // Unit 5
  {
    type: 'lesson',
    title: "Unit 5: Future Forms (going to, will)",
    explanation: "Use 'going to' for plans and intentions. Use 'will' for spontaneous decisions, offers, and predictions.",
    examples: [
      { english: "I'm going to visit my aunt next week.", arabic: "سأزور عمتي الأسبوع القادم." },
      { english: "The phone's ringing, I'll get it.", arabic: "الهاتف يرن، سأرد عليه." }
    ],
    mcqs: [
      { question: "I have decided. I ___ a new job.", options: ["will look for", "am looking for", "am going to look for", "look for"], answer: "am going to look for" },
      { question: "I think our team ___ win the match.", options: ["is going to", "will", "is winning", "wins"], answer: "will" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 5: Questions with 'like'",
    explanation: "What's he like? (personality). What does he look like? (appearance). What does he like? (hobbies/interests).",
    examples: [
      { english: "What's your new boss like? - He's very friendly.", arabic: "كيف هو مديرك الجديد؟ - هو ودود جدا." },
      { english: "What does she look like? - She's tall with dark hair.", arabic: "كيف تبدو؟ - هي طويلة وذات شعر داكن." }
    ],
    mcqs: [
      { question: "To ask about someone's personality, you say:", options: ["What does he look like?", "How is he?", "What's he like?", "What does he like?"], answer: "What's he like?" },
      { question: "A: What does your brother look like? B: ___", options: ["He's a doctor.", "He's very intelligent.", "He's short and has red hair.", "He likes watching football."], answer: "He's short and has red hair." }
    ]
  },
  // Unit 6
  {
    type: 'lesson',
    title: "Unit 6: Verb Patterns (verb + -ing / infinitive)",
    explanation: "Some verbs are followed by the '-ing' form (e.g., enjoy, mind, finish). Others are followed by 'to' + infinitive (e.g., want, decide, hope).",
    examples: [
      { english: "I enjoy playing tennis.", arabic: "أستمتع بلعب التنس." },
      { english: "He decided to sell his car.", arabic: "قرر بيع سيارته." }
    ],
    mcqs: [
      { question: "I can't imagine ___ in another country.", options: ["to live", "living", "live", "to living"], answer: "living" },
      { question: "He refused ___ the question.", options: ["to answer", "answering", "answer", "to answering"], answer: "to answer" }
    ]
  },
  // Unit 7
  {
    type: 'lesson',
    title: "Unit 7: Present Perfect vs Past Simple",
    explanation: "Past Simple is for finished actions in the past with a specific time. Present Perfect is for past actions with a result in the present, or actions in an unfinished time period.",
    examples: [
      { english: "I saw the film yesterday.", arabic: "شاهدت الفيلم أمس." },
      { english: "I have seen that film. I don't want to see it again.", arabic: "لقد شاهدت ذلك الفيلم. لا أريد أن أراه مرة أخرى." }
    ],
    mcqs: [
      { question: "I ___ to Paris in 2010.", options: ["have been", "went", "was", "have gone"], answer: "went" },
      { question: "She ___ here for three years.", options: ["has lived", "lived", "was living", "lives"], answer: "has lived" }
    ]
  },
  {
    type: 'lesson',
    title: "Unit 7: Phrasal Verbs",
    explanation: "Phrasal verbs combine a verb with a particle (preposition or adverb). Their meaning can be literal or idiomatic.",
    examples: [
      { english: "She looked out of the window. (literal)", arabic: "نظرت من النافذة." },
      { "english": "Look out! There's a car coming. (idiomatic)", "arabic": "انتبه! هناك سيارة قادمة." }
    ],
    mcqs: [
      { "question": "What does 'put off' mean?", "options": ["cancel", "wear", "postpone", "place"], "answer": "postpone" },
      { "question": "The opposite of 'turn on' is...", "options": ["turn in", "turn off", "turn up", "turn down"], "answer": "turn off" }
    ]
  },
  // Unit 8
  {
    type: 'lesson',
    title: "Unit 8: Conditionals (First and Second)",
    explanation: "First Conditional (if + present, will + infinitive) is for real future possibilities. Second Conditional (if + past, would + infinitive) is for unreal or imaginary situations.",
    examples: [
      { english: "If it rains, I will stay home.", arabic: "إذا أمطرت، سأبقى في المنزل." },
      { english: "If I had a million dollars, I would buy a big house.", arabic: "لو كان لدي مليون دولار، لاشتريت منزلا كبيرا." }
    ],
    mcqs: [
      { question: "If I ___ you, I would study more.", options: ["am", "was", "were", "be"], answer: "were" },
      { question: "What will you do if you ___ the train?", options: ["miss", "will miss", "missed", "would miss"], answer: "miss" }
    ]
  },
  // Unit 9
  {
    type: 'lesson',
    title: "Unit 9: Modals 2 (must, could, might, can't)",
    explanation: "These modals express probability. 'must' = almost certain. 'might'/'could' = possible. 'can't' = almost impossible.",
    examples: [
      { english: "He's not answering. He must be busy.", arabic: "إنه لا يرد. لابد أنه مشغول." },
      { english: "It might rain later.", arabic: "قد تمطر لاحقًا." },
      { english: "That can't be true!", arabic: "لا يمكن أن يكون هذا صحيحًا!" }
    ],
    mcqs: [
      { question: "Someone's at the door. It ___ be the postman.", options: ["must", "can't", "might", "should"], answer: "might" },
      { question: "She drives a Ferrari. She ___ be poor.", options: ["must", "can't", "might not", "shouldn't"], answer: "can't" }
    ]
  },
  // Unit 10
  {
    type: 'lesson',
    title: "Unit 10: Present Perfect Continuous",
    explanation: "Use Present Perfect Continuous (have/has been + -ing) to talk about an action that started in the past and is still continuing, or has recently stopped and has a present result.",
    examples: [
      { english: "I've been learning English for three years.", arabic: "أنا أتعلم الإنجليزية منذ ثلاث سنوات." },
      { english: "Your eyes are red. Have you been crying?", arabic: "عيناك حمراوان. هل كنت تبكي؟" }
    ],
    mcqs: [
      { question: "How long ___ you been waiting?", options: ["do", "are", "have", "did"], answer: "have" },
      { question: "It ___ all day. The streets are wet.", options: ["rains", "is raining", "has been raining", "rained"], answer: "has been raining" }
    ]
  },
  // Unit 11
  {
    type: 'lesson',
    title: "Unit 11: Indirect Questions",
    explanation: "Indirect questions are more polite. They start with phrases like 'Could you tell me...' and use statement word order (no inversion).",
    examples: [
      { english: "Direct: What time is it? Indirect: Could you tell me what time it is?", arabic: "مباشر: كم الساعة؟ غير مباشر: هل يمكنك إخباري كم الساعة؟" },
      { english: "Direct: Does he live here? Indirect: Do you know if he lives here?", arabic: "مباشر: هل يعيش هنا؟ غير مباشر: هل تعرف ما إذا كان يعيش هنا؟" }
    ],
    mcqs: [
      { question: "Change to an indirect question: Where is the station?", options: ["Can you tell me where is the station?", "Can you tell me where the station is?", "Can you tell me where the station?", "Can you tell me is where the station?"], answer: "Can you tell me where the station is?" },
      { question: "Change to an indirect question: Did she pass the exam?", options: ["I wonder if she passed the exam.", "I wonder did she pass the exam.", "I wonder if did she pass the exam.", "I wonder she passed the exam."], answer: "I wonder if she passed the exam." }
    ]
  },
  // Unit 12
  {
    type: 'lesson',
    title: "Unit 12: Reported Speech",
    explanation: "When we report what someone said, we usually move the tense 'back' one step. E.g., Present Simple becomes Past Simple.",
    examples: [
      { english: "Direct: 'I am tired.' Reported: He said he was tired.", arabic: "مباشر: 'أنا متعب.' منقول: قال إنه كان متعبًا." },
      { english: "Direct: 'I will call you.' Reported: She said she would call me.", arabic: "مباشر: 'سأتصل بك.' منقول: قالت إنها ستتصل بي." }
    ],
    mcqs: [
      { question: "Report this sentence: 'I work in a bank.'", options: ["He said he works in a bank.", "He said he worked in a bank.", "He said I work in a bank.", "He said I worked in a bank."], answer: "He said he worked in a bank." },
      { question: "Report this sentence: 'We have finished.'", options: ["They said they have finished.", "They said we had finished.", "They said they had finished.", "They said we have finish."], answer: "They said they had finished." }
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
    }
];

const allLessons = [...lessons];

// This is a placeholder to simulate a much larger library.
// In a real app, this would come from a database.
const placeholderLesson: Lesson = {
    type: 'lesson',
    title: "Placeholder Lesson",
    explanation: "This is a placeholder for a future lesson. Content will be added soon.",
    examples: [{ english: "This is a placeholder example.", arabic: "هذا مثال مؤقت." }],
    mcqs: [{ question: "This is a placeholder question.", options: ["A", "B"], answer: "A" }]
};

// Fill up to 80 lessons
while (allLessons.length < 80) {
    const newLesson = { ...placeholderLesson, title: `درس قيد الإعداد ${allLessons.length + 1}` };
    allLessons.push(newLesson);
}


const combinedItems: LearningItem[] = [];
let lessonIndex = 0;
let storyIndex = 0;

// Interleave stories with lessons
while (lessonIndex < allLessons.length || storyIndex < stories.length) {
    // Add up to 3 lessons
    for (let i = 0; i < 3 && lessonIndex < allLessons.length; i++) {
        combinedItems.push(allLessons[lessonIndex]);
        lessonIndex++;
    }
    // Add 1 story if available
    if (storyIndex < stories.length) {
        combinedItems.push(stories[storyIndex]);
        storyIndex++;
    }
}


export const learningItems: LearningItem[] = combinedItems;
