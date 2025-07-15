/**
 * @fileoverview Defines the structure and content for all English lessons and stories.
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
  {
    type: 'lesson',
    title: "أزمنة الأفعال المساعدة (do, be, have)",
    explanation: `الأفعال المساعدة (Auxiliary Verbs) 'do', 'be', و 'have' هي حجر الأساس في بناء الجمل الإنجليزية. هي لا تحمل معنى بمفردها غالبًا، بل تساعد الفعل الرئيسي في الجملة.

- 'do'/'does'/'did': تُستخدم لتكوين الأسئلة والجمل المنفية في المضارع البسيط والماضي البسيط.
- 'be' (am/is/are/was/were): تُستخدم لتكوين الأزمنة المستمرة (مثل المضارع المستمر) والمبني للمجهول.
- 'have'/'has'/'had': تُستخدم لتكوين الأزمنة التامة (مثل المضارع التام).

إتقان استخدام هذه الأفعال ضروري لفهم بنية الجملة والتعبير عن الزمن بشكل صحيح.`,
    examples: [
      { english: "Where do you come from?", arabic: "من أين أنت؟" },
      { english: "She doesn't work on weekends.", arabic: "هي لا تعمل في عطلات نهاية الأسبوع." },
      { english: "Are you listening to me?", arabic: "هل تستمع إلي؟" },
      { english: "He is not sleeping now.", arabic: "هو ليس نائماً الآن." },
      { english: "Have you finished your homework?", arabic: "هل أنهيت واجبك المنزلي؟" },
      { english: "I have never been to Japan.", arabic: "لم أذهب إلى اليابان من قبل." },
      { english: "What did they say?", arabic: "ماذا قالوا؟" },
      { english: "He was not happy with the result.", arabic: "لم يكن سعيداً بالنتيجة." },
      { english: "Why were you running?", arabic: "لماذا كنت تركض؟" },
      { english: "Had she left before you arrived?", arabic: "هل كانت قد غادرت قبل وصولك؟" },
    ],
    mcqs: [
      { question: "Which auxiliary verb is used for Present Simple questions?", options: ["be", "have", "do", "will"], answer: "do" },
      { question: "Complete the sentence: He ___ watching TV.", options: ["is", "does", "has", "do"], answer: "is" },
      { question: "Which sentence is correct?", options: ["I no like coffee.", "I don't like coffee.", "I not like coffee.", "I doesn't like coffee."], answer: "I don't like coffee." },
      { question: "___ you ever seen a ghost?", options: ["Do", "Are", "Have", "Did"], answer: "Have" },
      { question: "What is the negative of 'She went to the party'?", options: ["She didn't went...", "She not go...", "She didn't go...", "She was not go..."], answer: "She didn't go..." },
    ],
  },
  {
    type: 'lesson',
    title: "تسمية الأزمنة (Present, Past, Present Perfect)",
    explanation: `معرفة أسماء الأزمنة (Tenses) يساعد في فهم كيفية عمل القواعد وتطبيقها. كل زمن له استخدام محدد للإشارة إلى وقت وقوع الفعل وعلاقته باللحظة الحالية.
- المضارع (Present): للأحداث الحالية، العادات، والحقائق العامة.
- الماضي (Past): للأحداث التي بدأت وانتهت في الماضي.
- المضارع التام (Present Perfect): للأحداث التي وقعت في الماضي ولكن لها صلة أو تأثير على الحاضر.`,
    examples: [
        { english: "Cows don't eat meat. (Present Simple)", arabic: "الأبقار لا تأكل اللحم. (مضارع بسيط)" },
        { english: "What was Neil Armstrong doing? (Past Continuous)", arabic: "ماذا كان يفعل نيل أرمسترونغ؟ (ماضي مستمر)" },
        { english: "How many times has Brazil won the World Cup? (Present Perfect)", arabic: "كم مرة فازت البرازيل بكأس العالم؟ (مضارع تام)" },
        { english: "The sun rises in the east. (Present Simple)", arabic: "الشمس تشرق من الشرق. (مضارع بسيط)" },
        { english: "He was assassinated. (Past Simple Passive)", arabic: "لقد تم اغتياله. (ماضي بسيط مبني للمجهول)" },
        { english: "I've been studying for three years. (Present Perfect Continuous)", arabic: "أنا أدرس منذ ثلاث سنوات. (مضارع تام مستمر)" },
        { english: "When did the Olympic Games start? (Past Simple)", arabic: "متى بدأت الألعاب الأولمبية؟ (ماضي بسيط)" },
        { english: "It takes 8 minutes for the sun's rays to reach Earth. (Present Simple)", arabic: "تستغرق أشعة الشمس 8 دقائق للوصول إلى الأرض. (مضارع بسيط)" },
        { english: "Glasses were invented in China. (Past Simple Passive)", arabic: "اخترعت النظارات في الصين. (ماضي بسيط مبني للمجهول)" },
        { english: "People have been sending emails since the 1970s. (Present Perfect Continuous)", arabic: "يرسل الناس رسائل البريد الإلكتروني منذ السبعينيات. (مضارع تام مستمر)" },
    ],
    mcqs: [
        { question: "What tense is 'I have finished'?", options: ["Past Simple", "Present Perfect", "Present Continuous", "Past Perfect"], answer: "Present Perfect" },
        { question: "What tense is 'They are playing'?", options: ["Present Simple", "Past Continuous", "Present Continuous", "Present Perfect"], answer: "Present Continuous" },
        { question: "What tense is 'She arrived yesterday'?", options: ["Past Simple", "Present Perfect", "Past Continuous", "Future Simple"], answer: "Past Simple" },
        { question: "The sentence 'He had already left' is in the...", options: ["Past Simple", "Past Perfect", "Present Perfect", "Past Continuous"], answer: "Past Perfect" },
        { question: "The sentence 'It will rain' is in the...", options: ["Present Simple", "Future Simple", "Present Continuous", "Past Simple"], answer: "Future Simple" },
    ]
  },
  {
    type: 'lesson',
    title: "الأسئلة والنفي",
    explanation: `لتكوين الأسئلة والجمل المنفية، نعتمد بشكل أساسي على الأفعال المساعدة (do/does/did, be, have, can, will, etc.).
- للنفي (Negatives): نضيف 'not' (أو اختصارها 'n't') بعد الفعل المساعد. مثال: is not (isn't), do not (don't).
- للأسئلة (Questions): نضع الفعل المساعد قبل الفاعل. مثال: "You are happy." تصبح "?Are you happy". إذا كان السؤال يبدأ بكلمة استفهام (what, where, why)، تأتي هذه الكلمة في البداية.`,
    examples: [
        { english: "What did you do last night?", arabic: "ماذا فعلت الليلة الماضية؟" },
        { english: "Cows don't eat meat.", arabic: "الأبقار لا تأكل اللحم." },
        { english: "The sun doesn't rise in the west.", arabic: "الشمس لا تشرق من الغرب." },
        { english: "Why didn't you do your homework?", arabic: "لماذا لم تفعل واجبك؟" },
        { english: "Is he working at the moment?", arabic: "هل هو يعمل في هذه اللحظة؟" },
        { english: "She hasn't called me.", arabic: "هي لم تتصل بي." },
        { english: "They weren't at the party.", arabic: "هم لم يكونوا في الحفلة." },
        { english: "Do you have a TV in your bedroom?", arabic: "هل لديك تلفاز في غرفة نومك؟" },
        { english: "He can't swim.", arabic: "هو لا يستطيع السباحة." },
        { english: "You shouldn't smoke here.", arabic: "لا يجب أن تدخن هنا." },
    ],
    mcqs: [
        { question: "How do you make 'He works hard' negative?", options: ["He no works hard.", "He doesn't works hard.", "He don't work hard.", "He doesn't work hard."], answer: "He doesn't work hard." },
        { question: "How do you make 'She went home' a question?", options: ["Did she went home?", "Does she went home?", "Did she go home?", "She did go home?"], answer: "Did she go home?" },
        { question: "Which sentence is correct?", options: ["I not have a car.", "I haven't a car.", "I don't have a car.", "I no have a car."], answer: "I don't have a car." },
        { question: "The negative of 'They are coming' is:", options: ["They aren't coming.", "They not are coming.", "They don't coming.", "They no coming."], answer: "They aren't coming." },
        { question: "The question form of 'You saw him' is:", options: ["You saw him?", "Did you saw him?", "Do you saw him?", "Did you see him?"], answer: "Did you see him?" },
    ]
  },
  {
    type: 'lesson',
    title: "الإجابات القصيرة",
    explanation: `في المحادثات الإنجليزية اليومية، من غير الطبيعي الرد على الأسئلة بـ 'yes' أو 'no' فقط، حيث يمكن أن يبدو ذلك غير مهذب أو مفاجئًا. الطريقة الأكثر شيوعًا هي استخدام الإجابات القصيرة (Short Answers). تتكون الإجابة القصيرة من 'Yes' أو 'No'، يليها الفاعل والفعل المساعد المستخدم في السؤال.
مثال: "?Do you like coffee" -> ".Yes, I do"`,
    examples: [
        { english: "Did you have a nice time? - Yes, I did.", arabic: "هل قضيت وقتاً ممتعاً؟ - نعم، فعلت." },
        { english: "Do you want breakfast? - No, I don't.", arabic: "هل تريد فطوراً؟ - لا، لا أريد." },
        { english: "Have you had any coffee? - Yes, I have.", arabic: "هل تناولت أي قهوة؟ - نعم، تناولت." },
        { english: "Is Bill coming tonight? - No, he isn't.", arabic: "هل بيل قادم الليلة؟ - لا، ليس قادماً." },
        { english: "Are you working hard? - Yes, I am.", arabic: "هل تعمل بجد؟ - نعم، أنا كذلك." },
        { english: "Do you like cooking? - No, I don't.", arabic: "هل تحب الطبخ؟ - لا، لا أحب." },
        { english: "Is it cold out today? - Yes, it is.", arabic: "هل الجو بارد في الخارج اليوم؟ - نعم، إنه كذلك." },
        { english: "Did you go out last night? - Yes, I did.", arabic: "هل خرجت الليلة الماضية؟ - نعم، خرجت." },
        { english: "Have you ever been to Singapore? - No, I haven't.", arabic: "هل زرت سنغافورة من قبل؟ - لا، لم أفعل." },
        { english: "Can you swim? - Yes, I can.", arabic: "هل تستطيع السباحة؟ - نعم، أستطيع." },
    ],
    mcqs: [
        { question: "How do you answer 'Are you tired?' affirmatively?", options: ["Yes.", "Yes, I am.", "Yes, I'm.", "I am."], answer: "Yes, I am." },
        { question: "How do you answer 'Did he call?' negatively?", options: ["No.", "No, he didn't.", "No, he didn't call.", "He didn't."], answer: "No, he didn't." },
        { question: "Answer: 'Have they arrived?'", options: ["Yes, they have.", "Yes, they've.", "Yes, have.", "They have."], answer: "Yes, they have." },
        { question: "Answer: 'Can she play the piano?'", options: ["No, she no can.", "No, she can't.", "No, not.", "She can't."], answer: "No, she can't." },
        { question: "Answer: 'Do you understand?'", options: ["Yes, I understand.", "Yes, I do.", "Yes, I'm.", "Yes, I can."], answer: "Yes, I do." },
    ]
  },
  {
    type: 'lesson',
    title: "زمن المضارع البسيط مقابل المستمر",
    explanation: `هناك فرق مهم بين المضارع البسيط (Present Simple) والمضارع المستمر (Present Continuous).
- المضارع البسيط: يُستخدم للحقائق الثابتة، العادات، والأفعال المتكررة. (e.g., The sun rises in the east. I play tennis every Friday).
- المضارع المستمر: يُستخدم للأفعال التي تحدث الآن، في هذه اللحظة، أو حول الوقت الحالي، أو للخطط المستقبلية المؤكدة. (e.g., I am reading a book. She's working in London this month).

بعض الأفعال التي تصف الحالات (State Verbs) مثل 'know', 'like', 'want', 'understand' لا تُستخدم عادةً في الصيغة المستمرة.`,
    examples: [
        { english: "She usually drives to work, but today she's walking.", arabic: "هي عادة تقود إلى العمل، لكنها اليوم تمشي." },
        { english: "I don't understand this word.", arabic: "أنا لا أفهم هذه الكلمة." },
        { english: "He works for a company in Dallas, but he's working in Mexico this week.", arabic: "هو يعمل في شركة في دالاس، لكنه يعمل في المكسيك هذا الأسبوع." },
        { english: "I think opera is boring. (opinion)", arabic: "أعتقد أن الأوبرا مملة. (رأي)" },
        { english: "What are you thinking about? (activity)", arabic: "بماذا تفكر؟ (نشاط)" },
        { english: "She has a beautiful new car. (possession)", arabic: "هي تمتلك سيارة جديدة جميلة. (ملكية)" },
        { english: "She's having dinner now. (action)", arabic: "هي تتناول العشاء الآن. (فعل)" },
        { english: "The lions are fed once a day.", arabic: "يتم إطعام الأسود مرة واحدة في اليوم." },
        { english: "They're being fed at the moment.", arabic: "يتم إطعامهم في هذه اللحظة." },
        { english: "It rains a lot in winter.", arabic: "تمطر كثيرا في الشتاء." }
    ],
    mcqs: [
        { question: "Choose the correct sentence.", options: ["He is wanting a coffee.", "He wants a coffee.", "He want a coffee.", "He does want a coffee."], answer: "He wants a coffee." },
        { question: "Water ___ at 100 degrees Celsius.", options: ["is boiling", "boil", "boils", "boilt"], answer: "boils" },
        { question: "Please be quiet. I ___ to the radio.", options: ["listen", "am listening", "listens", "listened"], answer: "am listening" },
        { question: "He usually ___ glasses, but he isn't wearing them today.", options: ["wear / isn't wearing", "wears / doesn't wear", "is wearing / wears", "wears / isn't wearing"], answer: "wears / isn't wearing" },
        { question: "I ___ a shower every morning.", options: ["am having", "have", "has", "am having"], answer: "have" },
    ]
  },
  {
    type: 'lesson',
    title: "المبني للمجهول في المضارع",
    explanation: `يُستخدم المبني للمجهول (Passive Voice) عندما يكون التركيز على الفعل نفسه أو على من يستقبل الفعل، وليس على من يقوم بالفعل (الفاعل).
- المضارع البسيط للمبني للمجهول (Present Simple Passive): يُصاغ باستخدام 'am/is/are + past participle'. يُستخدم للحقائق العامة أو الإجراءات المتكررة.
- المضارع المستمر للمبني للمجهول (Present Continuous Passive): يُصاغ باستخدام 'am/is/are + being + past participle'. يُستخدم لوصف فعل يحدث الآن.`,
    examples: [
        { english: "We are paid with the money people give.", arabic: "يُدفع لنا بالمال الذي يعطيه الناس." },
        { english: "Children are being treated with a new kind of medicine.", arabic: "يتم علاج الأطفال بنوع جديد من الدواء." },
        { english: "English is spoken here.", arabic: "يتم التحدث باللغة الإنجليزية هنا." },
        { english: "My car is being repaired.", arabic: "سيارتي قيد الإصلاح." },
        { english: "The office is cleaned every day.", arabic: "يتم تنظيف المكتب كل يوم." },
        { english: "A new hospital is being built in the city center.", arabic: "يتم بناء مستشفى جديد في وسط المدينة." },
        { english: "These products are made in Japan.", arabic: "هذه المنتجات مصنوعة في اليابان." },
        { english: "The emails are being sent right now.", arabic: "يتم إرسال رسائل البريد الإلكتروني الآن." },
        { english: "Soccer is played by millions of people.", arabic: "كرة القدم يلعبها ملايين الناس." },
        { english: "The guests are being welcomed at the door.", arabic: "يتم الترحيب بالضيوف عند الباب." },
    ],
    mcqs: [
        { question: "How do you say 'They make cars in Germany' in passive?", options: ["Cars are make in Germany.", "Cars are made in Germany.", "Cars make in Germany.", "Cars are being made in Germany."], answer: "Cars are made in Germany." },
        { question: "The bridge ___ at the moment.", options: ["is repaired", "is being repaired", "repairs", "repaired"], answer: "is being repaired" },
        { question: "Rice ___ in China.", options: ["is grown", "is growing", "grows", "grown"], answer: "is grown" },
        { question: "The problem ___ by the manager.", options: ["is being discussed", "is discussed", "discusses", "being discussed"], answer: "is being discussed" },
        { question: "Choose the correct passive sentence.", options: ["The book is being read by the girl.", "The girl is reading the book.", "The book reads by the girl.", "The book being read."], answer: "The book is being read by the girl." },
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
];

// Combine lessons and stories
const combinedItems: LearningItem[] = [];
let lessonIndex = 0;
let storyIndex = 0;

while (lessonIndex < lessons.length) {
    // Add 3 lessons
    for (let i = 0; i < 3 && lessonIndex < lessons.length; i++) {
        combinedItems.push(lessons[lessonIndex]);
        lessonIndex++;
    }
    // Add 1 story if available
    if (storyIndex < stories.length) {
        combinedItems.push(stories[storyIndex]);
        storyIndex++;
    }
}


export const learningItems: LearningItem[] = combinedItems;
