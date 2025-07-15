
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
  {
    type: 'lesson',
    title: "الأفعال المساعدة (do, be, have)",
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
        { english: "She usually drives to work, but today she is walking.", arabic: "هي عادة تقود إلى العمل، لكنها اليوم تمشي." },
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
  },
  {
    type: 'lesson',
    title: "أزمنة الماضي (البسيط والمستمر)",
    explanation: `يُستخدم الماضي البسيط (Past Simple) لوصف أحداث بدأت وانتهت في وقت محدد في الماضي. غالبًا ما نستخدم كلمات مثل yesterday, last week, in 1999.
يُستخدم الماضي المستمر (Past Continuous) لوصف حدث كان جاريًا في وقت معين في الماضي، أو لوصف حدث كان جاريًا عندما قطعه حدث آخر (والحدث القاطع يكون في الماضي البسيط).`,
    examples: [
      { english: "He danced and sang.", arabic: "هو رقص وغنى." },
      { english: "He was laughing when he saw the baby.", arabic: "كان يضحك عندما رأى الطفل." },
      { english: "What were you doing at 8 PM last night?", arabic: "ماذا كنت تفعل في الساعة 8 مساءً الليلة الماضية؟" },
      { english: "I didn't go to the party yesterday.", arabic: "لم أذهب إلى الحفلة أمس." },
      { english: "While I was reading, the phone rang.", arabic: "بينما كنت أقرأ، رن الهاتف." },
      { english: "She arrived, opened the door, and went inside.", arabic: "هي وصلت، فتحت الباب، ودخلت." },
      { english: "They were playing football when it started to rain.", arabic: "كانوا يلعبون كرة القدم عندما بدأت تمطر." },
      { english: "He lived in London for five years.", arabic: "عاش في لندن لمدة خمس سنوات." },
      { english: "The sun was shining and the birds were singing.", arabic: "كانت الشمس مشرقة والطيور تغني." },
      { english: "Did you watch the movie on TV?", arabic: "هل شاهدت الفيلم على التلفزيون؟" }
    ],
    mcqs: [
      { question: "When I arrived, they ___ dinner.", options: ["had", "was having", "were having", "have"], answer: "were having" },
      { question: "She ___ to school when she saw the accident.", options: ["walked", "was walking", "walks", "is walking"], answer: "was walking" },
      { question: "I ___ a great film last night.", options: ["see", "was seeing", "saw", "have seen"], answer: "saw" },
      { question: "What ___ when I called you?", options: ["did you do", "were you doing", "you were doing", "you did"], answer: "were you doing" },
      { question: "He didn't ___ to my question.", options: ["listened", "was listening", "listen", "to listen"], answer: "listen" }
    ]
  },
  {
    type: 'lesson',
    title: "الماضي البسيط مقابل الماضي التام",
    explanation: `يُستخدم الماضي البسيط (Past Simple) لوصف حدث انتهى في الماضي. يُستخدم الماضي التام (Past Perfect) لوصف حدث وقع *قبل* حدث آخر في الماضي. الماضي التام يساعد في توضيح تسلسل الأحداث.
تكوينه: had + past participle.`,
    examples: [
      { english: "I didn't laugh at his joke because I had heard it before.", arabic: "لم أضحك على نكتته لأنني كنت قد سمعتها من قبل." },
      { english: "When he arrived at the station, the train had already left.", arabic: "عندما وصل إلى المحطة، كان القطار قد غادر بالفعل." },
      { english: "She told me she had bought a new car.", arabic: "أخبرتني أنها اشترت سيارة جديدة." },
      { english: "He had never flown before his trip to Paris.", arabic: "لم يسبق له أن طار قبل رحلته إلى باريس." },
      { english: "I realized I had forgotten my keys at home.", arabic: "أدركت أنني نسيت مفاتيحي في المنزل." },
      { english: "By the time I got there, they had eaten all the food.", arabic: "بحلول الوقت الذي وصلت فيه، كانوا قد أكلوا كل الطعام." },
      { english: "Had you finished your work when she called?", arabic: "هل كنت قد أنهيت عملك عندما اتصلت؟" },
      { english: "The film had started before we sat down.", arabic: "كان الفيلم قد بدأ قبل أن نجلس." },
      { english: "He failed the exam because he hadn't studied.", arabic: "رسب في الامتحان لأنه لم يكن قد درس." },
      { english: "They moved after they had sold their house.", arabic: "انتقلوا بعد أن باعوا منزلهم." }
    ],
    mcqs: [
      { question: "When she arrived, the party ___.", options: ["started", "had started", "was starting", "start"], answer: "had started" },
      { question: "He ___ breakfast when he went to work.", options: ["hadn't eat", "hadn't ate", "hadn't eaten", "not eaten"], answer: "hadn't eaten" },
      { question: "I felt much better after I ___ some rest.", options: ["had have", "had had", "was having", "have had"], answer: "had had" },
      { question: "He knew London so well because he ___ there many times.", options: ["visited", "had visited", "was visiting", "visit"], answer: "had visited" },
      { question: "By the time the police arrived, the thief ___.", options: ["escaped", "had escaped", "was escaping", "escape"], answer: "had escaped" }
    ]
  },
  {
    type: 'lesson',
    title: "المبني للمجهول في الماضي",
    explanation: `يُستخدم المبني للمجهول في الماضي (Past Passive) عندما يكون التركيز على الحدث الذي وقع في الماضي، وليس على من قام به.
- الماضي البسيط للمبني للمجهول (Past Simple Passive): يُصاغ باستخدام 'was/were + past participle'.
- الماضي المستمر للمبني للمجهول (Past Continuous Passive): يُصاغ باستخدام 'was/were + being + past participle'.`,
    examples: [
      { english: "A Farewell to Arms was written by Ernest Hemingway.", arabic: "رواية وداعًا للسلاح كُتبت بواسطة إرنست همنغواي." },
      { english: "The pyramids were built by the ancient Egyptians.", arabic: "الأهرامات بُنيت بواسطة المصريين القدماء." },
      { english: "My car was being repaired when you called.", arabic: "سيارتي كانت قيد الإصلاح عندما اتصلت." },
      { english: "The window was broken last night.", arabic: "النافذة كُسرت الليلة الماضية." },
      { english: "This photo was taken in 1998.", arabic: "هذه الصورة التُقطت في عام 1998." },
      { english: "The food was being served when the lights went out.", arabic: "الطعام كان يُقدم عندما انقطعت الأنوار." },
      { english: "He was told to wait outside.", arabic: "قيل له أن ينتظر في الخارج." },
      { english: "The old bridge was destroyed in the storm.", arabic: "الجسر القديم دُمر في العاصفة." },
      { english: "All the tickets were sold out quickly.", arabic: "جميع التذاكر بيعت بسرعة." },
      { english: "The rooms were being cleaned all morning.", arabic: "الغرف كانت تُنظف طوال الصباح." }
    ],
    mcqs: [
      { question: "The Mona Lisa ___ by Leonardo da Vinci.", options: ["painted", "was painting", "was painted", "is painted"], answer: "was painted" },
      { question: "The thief ___ by the police yesterday.", options: ["was catching", "was caught", "caught", "is caught"], answer: "was caught" },
      { question: "The house ___ when the fire started.", options: ["was building", "built", "was being built", "is built"], answer: "was being built" },
      { question: "America ___ by Columbus in 1492.", options: ["discovered", "was discovered", "was being discovered", "discovers"], answer: "was discovered" },
      { question: "The cake ___ by my sister for the party.", options: ["was made", "made", "was making", "makes"], answer: "was made" }
    ]
  },
  {
    type: 'lesson',
    title: "أفعال Modal (1): الالتزام والإذن",
    explanation: `أفعال Modal مثل 'have to', 'can', 'be allowed to' تُستخدم للتعبير عن الالتزام (Obligation) والإذن (Permission).
- 'have to' / 'has to': للتعبير عن التزام قوي أو قاعدة خارجية.
- 'don't have to': للتعبير عن عدم وجود التزام.
- 'can': للتعبير عن القدرة أو الإذن غير الرسمي.
- 'be allowed to': للتعبير عن الإذن الرسمي.`,
    examples: [
      { english: "Children have to go to school.", arabic: "يجب على الأطفال الذهاب إلى المدرسة." },
      { english: "I can stay at my friend's house.", arabic: "يمكنني البقاء في منزل صديقي." },
      { english: "We're allowed to wear jeans.", arabic: "مسموح لنا بارتداء الجينز." },
      { english: "You don't have to pay for this.", arabic: "ليس عليك أن تدفع مقابل هذا." },
      { english: "I have to finish this report by 5 PM.", arabic: "يجب أن أنهي هذا التقرير بحلول الساعة 5 مساءً." },
      { english: "Can I borrow your pen?", arabic: "هل يمكنني استعارة قلمك؟" },
      { english: "You are not allowed to smoke in here.", arabic: "غير مسموح لك بالتدخين هنا." },
      { english: "He has to wear a uniform at work.", arabic: "يجب عليه ارتداء زي رسمي في العمل." },
      { english: "She can't come to the party.", arabic: "لا يمكنها الحضور إلى الحفلة." },
      { english: "We don't have to get up early tomorrow.", arabic: "ليس علينا الاستيقاظ مبكرًا غدًا." }
    ],
    mcqs: [
      { question: "You ___ buy a ticket before getting on the train.", options: ["can", "have to", "are allowed to", "don't have to"], answer: "have to" },
      { question: "You ___ park here. It's forbidden.", options: ["can", "can't", "have to", "don't have to"], answer: "can't" },
      { question: "I ___ go now, or I'll be late.", options: ["can", "have to", "am allowed to", "don't have to"], answer: "have to" },
      { question: "It's a free museum. You ___ pay.", options: ["have to", "must", "don't have to", "can't"], answer: "don't have to" },
      { question: "___ I use your phone?", options: ["Have to", "Am allowed to", "Can", "Must"], answer: "Can" }
    ]
  },
  {
    type: 'lesson',
    title: "أفعال Modal (should, must)",
    explanation: `'should' و 'must' هما فعلان من أفعال Modal يُستخدمان لتقديم النصيحة والتعبير عن الالتزام.
- 'should': يُستخدم لتقديم النصيحة أو التوصية. هو أقل قوة من 'must'. (e.g., You should see a doctor).
- 'must': يُستخدم للتعبير عن التزام قوي، ضرورة، أو أمر. غالبًا ما يأتي من المتحدث نفسه.
- 'mustn't': يُستخدم للتعبير عن المنع (prohibition). (e.g., You mustn't smoke here).`,
    examples: [
      { english: "We should take traveller's cheques.", arabic: "يجب أن نأخذ شيكات سياحية." },
      { english: "You must write to us every week.", arabic: "يجب أن تكتب لنا كل أسبوع." },
      { english: "You look tired. You should get some rest.", arabic: "تبدو متعبًا. يجب أن تأخذ قسطًا من الراحة." },
      { english: "You mustn't lose your passport.", arabic: "يجب ألا تفقد جواز سفرك." },
      { english: "I think he should apologize.", arabic: "أعتقد أنه يجب عليه أن يعتذر." },
      { english: "All visitors must sign in.", arabic: "يجب على جميع الزوار تسجيل الدخول." },
      { english: "You shouldn't eat so much fast food.", arabic: "لا يجب أن تأكل الكثير من الوجبات السريعة." },
      { english: "He must be at work; he's not answering his phone.", arabic: "لابد أنه في العمل؛ إنه لا يرد على هاتفه." },
      { english: "They must follow the rules.", arabic: "يجب عليهم اتباع القواعد." },
      { english: "I should call my parents more often.", arabic: "يجب أن أتصل بوالدي أكثر." }
    ],
    mcqs: [
      { question: "It's a great movie. You ___ see it.", options: ["must", "should", "have to", "can"], answer: "should" },
      { question: "You ___ touch that! It's dangerous.", options: ["shouldn't", "mustn't", "don't have to", "can't"], answer: "mustn't" },
      { question: "He's very ill. He ___ stay in bed.", options: ["should", "must", "can", "is allowed to"], answer: "must" },
      { question: "I think we ___ leave now.", options: ["must", "should", "have to", "can"], answer: "should" },
      { question: "If you want to pass, you ___ study harder.", options: ["should", "must", "can't", "don't have to"], answer: "must" }
    ]
  },
  {
    type: 'lesson',
    title: "صيغ المستقبل (going to, will)",
    explanation: `هناك طرق مختلفة للتعبير عن المستقبل في اللغة الإنجليزية. 'going to' و 'will' هما الأكثر شيوعًا.
- 'be going to': يُستخدم للخطط والنوايا التي تم اتخاذ القرار بشأنها قبل لحظة الكلام، أو للتنبؤات المبنية على دليل حالي.
- 'will': يُستخدم للقرارات الفورية التي يتم اتخاذها في لحظة الكلام، للعروض، للوعود، وللتنبؤات العامة.`,
    examples: [
      { english: "I'm going to buy some new shoes.", arabic: "سأشتري بعض الأحذية الجديدة." },
      { english: "I think it will rain tomorrow.", arabic: "أعتقد أنها ستمطر غدًا." },
      { english: "The phone is ringing. I'll get it!", arabic: "الهاتف يرن. سأرد عليه!" },
      { english: "Look at those black clouds! It's going to rain.", arabic: "انظر إلى تلك الغيوم السوداء! إنها ستمطر." },
      { english: "We are going to visit Spain next summer.", arabic: "سنزور إسبانيا الصيف المقبل." },
      { english: "Don't worry, I won't tell anyone your secret.", arabic: "لا تقلق، لن أخبر أحدًا بسرك." },
      { english: "I'll help you with your bags.", arabic: "سأساعدك في حمل حقائبك." },
      { english: "He's studying hard. He's going to pass the exam.", arabic: "إنه يدرس بجد. سينجح في الامتحان." },
      { english: "Maybe I'll see you later.", arabic: "ربما أراك لاحقًا." },
      { english: "What are you going to do this evening?", arabic: "ماذا ستفعل هذا المساء؟" }
    ],
    mcqs: [
      { question: "A: The bag is heavy. B: I ___ it for you.", options: ["am going to carry", "will carry", "carry", "am carrying"], answer: "will carry" },
      { question: "I have decided. I ___ a new job.", options: ["will look for", "am looking for", "am going to look for", "look for"], answer: "am going to look for" },
      { question: "I think our team ___ win the match.", options: ["is going to", "will", "is winning", "wins"], answer: "will" },
      { question: "It's very cold. ___ you close the window, please?", options: ["Are you going to", "Will", "Do", "Are"], answer: "Will" },
      { question: "Watch out! You ___ fall.", options: ["will", "are going to", "are falling", "fall"], answer: "are going to" }
    ]
  },
  {
    type: 'lesson',
    title: "المضارع المستمر للمستقبل",
    explanation: `يمكن استخدام المضارع المستمر (Present Continuous) للتعبير عن خطط أو ترتيبات مستقبلية مؤكدة، خاصة عندما يكون الوقت والمكان قد تم تحديدهما بالفعل. غالبًا ما يُستخدم هذا مع الأفعال التي تشير إلى الأنشطة الاجتماعية أو المواعيد.`,
    examples: [
      { english: "We're playing tennis this afternoon.", arabic: "سنلعب التنس بعد ظهر هذا اليوم." },
      { english: "I'm meeting my friends for dinner tonight.", arabic: "سأقابل أصدقائي على العشاء الليلة." },
      { english: "What are you doing this weekend?", arabic: "ماذا تفعل في عطلة نهاية الأسبوع هذه؟" },
      { english: "He's flying to London tomorrow morning.", arabic: "سيسافر إلى لندن صباح الغد." },
      { english: "She's not coming to the party on Saturday.", arabic: "هي لن تأتي إلى الحفلة يوم السبت." },
      { english: "They are getting married next month.", arabic: "سيتزوجان الشهر المقبل." },
      { english: "I'm having a meeting with my boss at 3 PM.", arabic: "لدي اجتماع مع مديري في الساعة 3 مساءً." },
      { english: "Are you going to the concert next week?", arabic: "هل ستذهب إلى الحفل الأسبوع المقبل؟" },
      { english: "We're leaving at 6 o'clock.", arabic: "سنغادر في الساعة 6." },
      { english: "The company is launching a new product in May.", arabic: "الشركة ستطلق منتجًا جديدًا في مايو." }
    ],
    mcqs: [
      { question: "I can't meet you tomorrow. I ___ my grandparents.", options: ["visit", "will visit", "am visiting", "am going to visit"], answer: "am visiting" },
      { question: "What time ___ tomorrow?", options: ["are you leaving", "do you leave", "will you leave", "you are leaving"], answer: "are you leaving" },
      { question: "She ___ a doctor's appointment this afternoon.", options: ["has", "is having", "will have", "has got"], answer: "is having" },
      { question: "We ___ a party next Saturday. Would you like to come?", options: ["have", "will have", "are having", "are going to have"], answer: "are having" },
      { question: "He isn't working next week. He ___ on holiday.", options: ["goes", "will go", "is going", "is going to go"], answer: "is going" }
    ]
  },
  {
    type: 'lesson',
    title: "الأسئلة مع 'like'",
    explanation: `كلمة 'like' يمكن أن تكون مربكة لأن لها استخدامات مختلفة.
- 'What's she like?': يسأل عن الشخصية أو الصفات العامة. (She's very friendly).
- 'What does she look like?': يسأل عن المظهر الجسدي. (She's tall and has dark hair).
- 'What does she like doing?': يسأل عن الهوايات والاهتمامات. (She likes reading and swimming).`,
    examples: [
      { english: "What's she like?", arabic: "كيف هي؟ (عن شخصيتها)" },
      { english: "What does she look like?", arabic: "كيف يبدو شكلها؟" },
      { english: "What does she like doing?", arabic: "ماذا تحب أن تفعل؟" },
      { english: "What's the new teacher like?", arabic: "كيف هو المعلم الجديد؟" },
      { english: "What does your new apartment look like?", arabic: "كيف يبدو شقتك الجديدة؟" },
      { english: "What's the weather like today?", arabic: "كيف هو الطقس اليوم؟" },
      { english: "He's very kind and funny. That's what he's like.", arabic: "إنه لطيف ومضحك للغاية. هكذا هو." },
      { english: "She looks like her mother.", arabic: "هي تشبه والدتها." },
      { english: "I don't like horror movies.", arabic: "أنا لا أحب أفلام الرعب." },
      { english: "What would you like to drink?", arabic: "ماذا تود أن تشرب؟" }
    ],
    mcqs: [
      { question: "To ask about someone's personality, you say:", options: ["What does he look like?", "How is he?", "What's he like?", "What does he like?"], answer: "What's he like?" },
      { question: "The answer 'She's tall with blue eyes' is for the question:", options: ["What's she like?", "What does she like?", "How is she?", "What does she look like?"], answer: "What does she look like?" },
      { question: "'She enjoys playing the piano.' This answers:", options: ["What's she like?", "What does she like doing?", "What does she look like?", "How does she like it?"], answer: "What does she like doing?" },
      { question: "A: What's your boss like? B: ___", options: ["He's tall.", "He's strict but fair.", "He likes golf.", "He looks like tired."], answer: "He's strict but fair." },
      { question: "A: What does your brother look like? B: ___", options: ["He's a doctor.", "He's very intelligent.", "He's short and has red hair.", "He likes watching football."], answer: "He's short and has red hair." }
    ]
  },
  {
    type: 'lesson',
    title: "أنماط الأفعال (Verb Patterns)",
    explanation: `بعض الأفعال في اللغة الإنجليزية تتبعها صيغة معينة من الأفعال الأخرى. الأنماط الشائعة هي:
1. فعل + to + infinitive (e.g., want to go, decide to leave)
2. فعل + gerund (-ing form) (e.g., enjoy reading, stop talking)
3. فعل + مفعول به + to + infinitive (e.g., want someone to do something)
4. فعل + مفعول به + infinitive (بدون to) (e.g., make someone do something, let someone go)`,
    examples: [
      { english: "I enjoyed meeting your friends.", arabic: "استمتعت بمقابلة أصدقائك." },
      { english: "I just wanted to say thank you.", arabic: "أردت فقط أن أقول شكرًا لك." },
      { english: "You made me feel welcome.", arabic: "جعلتني أشعر بالترحاب." },
      { english: "I stopped feeling homesick.", arabic: "توقفت عن الشعور بالحنين إلى الوطن." },
      { english: "I stopped to visit my aunt.", arabic: "توقفت لكي أزور عمتي." },
      { english: "She invited me to go back.", arabic: "دعتني للعودة." },
      { english: "Let me know if you want to visit.", arabic: "أخبرني إذا كنت تريد الزيارة." },
      { english: "I'm thinking of going next year.", arabic: "أفكر في الذهاب العام المقبل." },
      { english: "I can't stand waiting in queues.", arabic: "لا أطيق الانتظار في طوابير." },
      { english: "He promised to call me.", arabic: "وعد بالاتصال بي." }
    ],
    mcqs: [
      { question: "I can't imagine ___ in another country.", options: ["to live", "living", "live", "to living"], answer: "living" },
      { question: "He refused ___ the question.", options: ["to answer", "answering", "answer", "to answering"], answer: "to answer" },
      { question: "My parents let me ___ out late.", options: ["to stay", "staying", "stay", "to staying"], answer: "stay" },
      { question: "She seems ___ a nice person.", options: ["to be", "being", "be", "to being"], answer: "to be" },
      { question: "Have you finished ___ that book yet?", options: ["to read", "reading", "read", "to reading"], answer: "reading" }
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

    