/**
 * @fileoverview Defines the structure and content for all English lessons.
 */

export interface Lesson {
  title: string;
  explanation: string;
  examples: { english: string; arabic: string }[];
  mcqs: { question: string; options: string[]; answer: string }[];
}

export const lessons: Lesson[] = [
  {
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
    title: "الماضي البسيط مقابل الماضي المستمر",
    explanation: `يُستخدم الماضي البسيط (Past Simple) لوصف أفعال مكتملة في الماضي. يُستخدم الماضي المستمر (Past Continuous) لوصف فعل كان قيد التقدم في نقطة معينة في الماضي.
غالبًا ما يُستخدم الزمنان معًا: الماضي المستمر يصف 'الفعل الخلفي' الطويل، والماضي البسيط يصف 'الفعل القصير' الذي قاطعه.
مثال: "I was having a shower (فعل طويل) when the phone rang (فعل قصير قاطعه)".`,
    examples: [
        { english: "He danced and sang.", arabic: "هو رقص وغنى." },
        { english: "He was laughing when he saw the baby.", arabic: "كان يضحك عندما رأى الطفل." },
        { english: "I was having a shower when the phone rang.", arabic: "كنت أستحم عندما رن الهاتف." },
        { english: "They drove to the airport and flew to Glasgow.", arabic: "قادوا إلى المطار وسافروا إلى غلاسكو." },
        { english: "While I was driving, I was listening to music.", arabic: "بينما كنت أقود، كنت أستمع إلى الموسيقى." },
        { english: "She read the book, then she went to sleep.", arabic: "قرأت الكتاب، ثم ذهبت للنوم." },
        { english: "It was raining when I left the house.", arabic: "كانت تمطر عندما غادرت المنزل." },
        { english: "He fell as he was climbing the stairs.", arabic: "سقط وهو يتسلق السلالم." },
        { english: "What were you doing at 8 PM yesterday?", arabic: "ماذا كنت تفعل في الساعة 8 مساء أمس؟" },
        { english: "I saw an accident while I was waiting for the bus.", arabic: "رأيت حادثًا بينما كنت أنتظر الحافلة." },
    ],
    mcqs: [
        { question: "When I ___, she was cooking dinner.", options: ["arrived", "was arriving", "arrive", "had arrived"], answer: "arrived" },
        { question: "He ___ TV when he heard a noise.", options: ["watched", "watches", "was watching", "is watching"], answer: "was watching" },
        { question: "They ___ for a walk in the park yesterday.", options: ["go", "were going", "went", "gone"], answer: "went" },
        { question: "While we ___, the baby started to cry.", options: ["were eating", "ate", "eat", "had eaten"], answer: "were eating" },
        { question: "I ___ the book you recommended.", options: ["finished", "was finishing", "finish", "am finishing"], answer: "finished" },
    ]
  },
  {
    title: "الماضي البسيط مقابل الماضي التام",
    explanation: `الماضي التام (Past Perfect) يُستخدم للإشارة إلى فعل حدث قبل فعل آخر في الماضي. إنه 'الماضي قبل الماضي'. يُصاغ باستخدام 'had + past participle'.
عندما نروي قصة، نستخدم الماضي البسيط للأحداث الرئيسية بالترتيب، ونستخدم الماضي التام للإشارة إلى حدث وقع قبل تلك الأحداث.
مثال: "When I arrived (ماضي بسيط), the train had already left (ماضي تام)". مغادرة القطار حدثت قبل وصولي.`,
    examples: [
        { english: "I didn't laugh at his joke. Why? Had you heard it before?", arabic: "لم أضحك على نكتته. لماذا؟ هل كنت قد سمعتها من قبل؟" },
        { english: "When I arrived, the train had already left.", arabic: "عندما وصلت، كان القطار قد غادر بالفعل." },
        { english: "She told me she had bought a new dress.", arabic: "أخبرتني أنها اشترت فستانًا جديدًا." },
        { english: "He couldn't get on the plane because he had left his passport at home.", arabic: "لم يستطع ركوب الطائرة لأنه ترك جواز سفره في المنزل." },
        { english: "After he had finished his homework, he watched TV.", arabic: "بعد أن أنهى واجبه، شاهد التلفاز." },
        { english: "I had never seen such a beautiful beach before I went to Hawaii.", arabic: "لم أر قط شاطئًا بهذا الجمال قبل أن أذهب إلى هاواي." },
        { english: "The patient had died by the time the doctor arrived.", arabic: "كان المريض قد توفي بحلول وقت وصول الطبيب." },
        { english: "They had already eaten when we got there.", arabic: "كانوا قد أكلوا بالفعل عندما وصلنا إلى هناك." },
        { english: "He didn't know who she was. He had never met her before.", arabic: "لم يكن يعرف من هي. لم يكن قد قابلها من قبل." },
        { english: "I had finished the report, so I went home.", arabic: "كنت قد أنهيت التقرير، لذلك ذهبت إلى المنزل." },
    ],
    mcqs: [
        { question: "Before I went to London, I ___ English for years.", options: ["studied", "was studying", "had studied", "study"], answer: "had studied" },
        { question: "He said he ___ his wallet.", options: ["lost", "had lost", "was losing", "loses"], answer: "had lost" },
        { question: "When we arrived at the cinema, the film ___.", options: ["already started", "had already started", "was already starting", "starts"], answer: "had already started" },
        { question: "She ___ there before, so she knew her way around.", options: ["had been", "was", "has been", "is"], answer: "had been" },
        { question: "I couldn't buy the tickets because I ___ my money.", options: ["forgot", "forget", "had forgotten", "was forgetting"], answer: "had forgotten" },
    ]
  },
  {
    title: "المبني للمجهول في الماضي",
    explanation: `يُستخدم المبني للمجهول في الماضي (Past Simple Passive) عندما يكون التركيز على الحدث الذي وقع في الماضي، وليس على من قام به. غالبًا ما يكون الفاعل غير مهم أو غير معروف. يُصاغ باستخدام 'was/were + past participle'.
مثال: "The window was broken." (نحن لا نعرف من كسرها، أو لا يهمنا).
يمكن ذكر الفاعل باستخدام 'by': "Hamlet was written by Shakespeare."`,
    examples: [
        { english: "A Farewell to Arms was written by Ernest Hemingway.", arabic: "وداعًا للسلاح كُتبت بواسطة إرنست همنغواي." },
        { english: "The Pyramids were built by the ancient Egyptians.", arabic: "بُنيت الأهرامات على يد المصريين القدماء." },
        { english: "The window was broken last night.", arabic: "كُسرت النافذة الليلة الماضية." },
        { english: "This picture was painted in the 19th century.", arabic: "رُسمت هذه الصورة في القرن التاسع عشر." },
        { english: "My wallet was stolen yesterday.", arabic: "سُرقت محفظتي أمس." },
        { english: "The meal was served at 8 o'clock.", arabic: "قُدّمت الوجبة في الساعة 8." },
        { english: "The results were announced last week.", arabic: "أُعلنت النتائج الأسبوع الماضي." },
        { english: "He was awarded a prize for his work.", arabic: "مُنح جائزة على عمله." },
        { english: "The car was not damaged in the accident.", arabic: "لم تتضرر السيارة في الحادث." },
        { english: "Were these letters sent yesterday?", arabic: "هل أُرسلت هذه الرسائل أمس؟" },
    ],
    mcqs: [
        { question: "Active: 'Shakespeare wrote Hamlet.' Passive: 'Hamlet ___ by Shakespeare.'", options: ["is written", "was written", "was wrote", "wrote"], answer: "was written" },
        { question: "My car ___ last week.", options: ["was repaired", "is repaired", "repaired", "has been repaired"], answer: "was repaired" },
        { question: "The thief ___ by the police.", options: ["was caught", "catched", "was catched", "is caught"], answer: "was caught" },
        { question: "This bridge ___ 100 years ago.", options: ["built", "was builded", "is built", "was built"], answer: "was built" },
        { question: "The problem ___ yesterday.", options: ["was solved", "is solved", "solved", "had solved"], answer: "was solved" },
    ]
  },
  {
    title: "أفعال Modal للإلزام والإذن (1)",
    explanation: `تُستخدم الأفعال المساعدة (Modal Verbs) للتعبير عن الإلزام (Obligation) أو الإذن (Permission).
- الإلزام: 'must' (إلزام شخصي قوي من المتحدث)، 'have to' (إلزام خارجي، قاعدة أو قانون).
- الإذن: 'can' (يمكنني/تستطيع)، 'be allowed to' (يُسمح لي/لك).
- عدم الإلزام: 'don't have to' (ليس من الضروري).
- المنع: 'mustn't' / 'can't' (ممنوع).`,
    examples: [
        { english: "Children have to go to school.", arabic: "يجب على الأطفال الذهاب إلى المدرسة." },
        { english: "I can stay at my friend's house.", arabic: "يمكنني البقاء في منزل صديقي." },
        { english: "We're allowed to wear jeans.", arabic: "يُسمح لنا بارتداء الجينز." },
        { english: "You must write to us every week.", arabic: "يجب عليك أن تكتب لنا كل أسبوع." },
        { english: "You don't have to pay for this.", arabic: "لست مضطرًا للدفع مقابل هذا." },
        { english: "You can't smoke in here.", arabic: "لا يمكنك التدخين هنا." },
        { english: "Are we allowed to leave early?", arabic: "هل يُسمح لنا بالمغادرة مبكراً؟" },
        { english: "I have to get up early tomorrow.", arabic: "يجب أن أستيقظ مبكراً غداً." },
        { english: "You mustn't lose your passport.", arabic: "يجب ألا تفقد جواز سفرك." },
        { english: "He can't come to the party.", arabic: "هو لا يستطيع القدوم إلى الحفلة." },
    ],
    mcqs: [
        { question: "Which word expresses a rule or external obligation?", options: ["should", "can", "must", "have to"], answer: "have to" },
        { question: "Which sentence means 'It's not necessary'?", options: ["You mustn't go.", "You can't go.", "You don't have to go.", "You shouldn't go."], answer: "You don't have to go." },
        { question: "In a library, you ___ be quiet.", options: ["have to", "can", "are allowed to", "must"], answer: "must" },
        { question: "My brother ___ wear a uniform to school.", options: ["has to", "must to", "have", "must"], answer: "has to" },
        { question: "___ I borrow your pen?", options: ["Must", "Have to", "Should", "Can"], answer: "Can" },
    ]
  },
  {
    title: "should و must",
    explanation: `'should' و 'must' كلاهما يعبر عن الإلزام ولكن بدرجات مختلفة.
- 'should': تُستخدم لتقديم النصيحة (advice) أو التوصية. هي أقل قوة من 'must'. "You look tired. You should go to bed."
- 'must': تُستخدم للتعبير عن إلزام قوي أو ضرورة ملحة، وغالباً ما يأتي هذا الإلزام من المتحدث نفسه أو شعور داخلي قوي. "I must finish this today."
- 'mustn't': تُستخدم للمنع الصارم. "You mustn't smoke here."`,
    examples: [
        { english: "We should take traveller's cheques.", arabic: "يجب أن نأخذ شيكات سياحية." },
        { english: "You must write to us every week.", arabic: "يجب عليك أن تكتب لنا كل أسبوع." },
        { english: "I think you should see a doctor.", arabic: "أعتقد أنه يجب عليك زيارة الطبيب." },
        { english: "You shouldn't eat so much chocolate.", arabic: "لا يجب أن تأكل الكثير من الشوكولاتة." },
        { english: "I must finish this report by 5 PM.", arabic: "يجب أن أنهي هذا التقرير بحلول الساعة 5 مساءً." },
        { english: "You mustn't be late for the exam.", arabic: "يجب ألا تتأخر عن الامتحان." },
        { english: "He should apologize for what he said.", arabic: "يجب عليه أن يعتذر عما قاله." },
        { english: "We must be at the airport two hours before the flight.", arabic: "يجب أن نكون في المطار قبل ساعتين من الرحلة." },
        { english: "You look tired. You should get some rest.", arabic: "تبدو متعبًا. يجب أن تحصل على بعض الراحة." },
        { english: "Should I wear a tie to the interview?", arabic: "هل يجب أن أرتدي ربطة عنق للمقابلة؟" },
    ],
    mcqs: [
        { question: "Which word is best for giving advice?", options: ["must", "have to", "can", "should"], answer: "should" },
        { question: "It's a great film. You ___ see it.", options: ["must", "should", "can", "have to"], answer: "should" },
        { question: "The sign says 'No Smoking'. You ___ smoke here.", options: ["shouldn't", "don't have to", "mustn't", "can"], answer: "mustn't" },
        { question: "I ___ remember to buy a birthday card for my mum.", options: ["should", "must", "can", "am allowed to"], answer: "must" },
        { question: "I don't think you ___ spend so much money on clothes.", options: ["must", "mustn't", "should", "shouldn't"], answer: "shouldn't" },
    ]
  },
  {
    title: "صيغ المستقبل (going to و will)",
    explanation: `هناك طرق متعددة للحديث عن المستقبل في اللغة الإنجليزية.
- 'will': تُستخدم للقرارات الفورية التي تتخذ في لحظة الكلام، وللعروض، والوعود، والتنبؤات العامة المبنية على الرأي.
- 'be going to': تُستخدم للخطط والنوايا التي تم التفكير فيها مسبقًا، وللتنبؤات المبنية على دليل حالي واضح.
- المضارع المستمر: يمكن استخدامه أيضًا للترتيبات والخطط المستقبلية المؤكدة، خاصة مع تحديد الوقت.`,
    examples: [
        { english: "I'm going to buy some new shoes.", arabic: "سأشتري حذاءً جديدًا. (خطة)" },
        { english: "The phone's ringing. I'll get it.", arabic: "الهاتف يرن. سأرد عليه. (قرار فوري)" },
        { english: "Look at those black clouds! It's going to rain.", arabic: "انظر إلى تلك الغيوم السوداء! ستمطر. (تنبؤ بدليل)" },
        { english: "I think it will be a nice day tomorrow.", arabic: "أعتقد أن الطقس سيكون لطيفًا غدًا. (تنبؤ عام)" },
        { english: "I'll help you with your bags.", arabic: "سأساعدك في حمل حقائبك. (عرض)" },
        { english: "We're going to visit our cousins next weekend.", arabic: "سنزور أبناء عمومتنا في نهاية الأسبوع المقبل. (خطة)" },
        { english: "I'm tired. I think I'll go to bed.", arabic: "أنا متعب. أعتقد أنني سأذهب إلى الفراش." },
        { english: "Don't worry, I won't forget.", arabic: "لا تقلق، لن أنسى. (وعد)" },
        { english: "Are you going to watch the match tonight?", arabic: "هل ستشاهد المباراة الليلة؟" },
        { english: "We're playing tennis this afternoon. (Arrangement)", arabic: "سنلعب التنس بعد ظهر هذا اليوم. (ترتيب)" },
    ],
    mcqs: [
        { question: "For a plan you made last week, you should use:", options: ["will", "going to", "Present Continuous", "would"], answer: "going to" },
        { question: "A: 'I'm thirsty.' B: 'I ___ you a glass of water.'", options: ["am going to get", "will get", "am getting", "get"], answer: "will get" },
        { question: "He has a ticket. He ___ to the concert.", options: ["will go", "is going", "is going to go", "goes"], answer: "is going to go" },
        { question: "I promise I ___ tell anyone your secret.", options: ["won't", "am not going to", "don't", "am not"], answer: "won't" },
        { question: "The sky is very dark. It ___.", options: ["will rain", "rains", "is going to rain", "is raining"], answer: "is going to rain" },
    ]
  },
  {
    title: "الأسئلة مع 'like'",
    explanation: `كلمة 'like' يمكن أن تكون مربكة لأن لها استخدامات متعددة.
- للسؤال عن الشخصية (personality): نستخدم '?What is/are ... like'.
  مثال: "?What's your new boss like" -> ".He's very friendly"
- للسؤال عن المظهر الجسدي (appearance): نستخدم '?What do/does ... look like'.
  مثال: "?What does he look like" -> ".He's tall with dark hair"
- للسؤال عن الهوايات والاهتمامات (hobbies/interests): نستخدم '?What do/does ... like doing/eating/etc'.
  مثال: "?What do you like doing" -> ".I like playing football"`,
    examples: [
        { english: "What's she like? - She's really nice and friendly.", arabic: "كيف هي (شخصيتها)؟ - هي لطيفة وودودة حقًا." },
        { english: "What does she look like? - She has long, dark hair.", arabic: "كيف يبدو شكلها؟ - لديها شعر داكن طويل." },
        { english: "What does she like doing? - She likes dancing.", arabic: "ماذا تحب أن تفعل؟ - تحب الرقص." },
        { english: "What's the weather like? - It's sunny and warm.", arabic: "كيف هو الطقس؟ - إنه مشمس ودافئ." },
        { english: "What's your new boss like?", arabic: "كيف هو مديرك الجديد؟" },
        { english: "What does your brother look like?", arabic: "كيف يبدو أخوك؟" },
        { english: "What do they like eating?", arabic: "ماذا يحبون أن يأكلوا؟" },
        { english: "What's your new apartment like?", arabic: "كيف هي شقتك الجديدة؟" },
        { english: "What do you like to do on weekends?", arabic: "ماذا تحب أن تفعل في عطلات نهاية الأسبوع؟" },
        { english: "What would you like to drink? (preference)", arabic: "ماذا تود أن تشرب؟ (للتفضيل)" },
    ],
    mcqs: [
        { question: "To ask about someone's personality, you say:", options: ["How is she?", "What does she look like?", "What's she like?", "What does she like?"], answer: "What's she like?" },
        { question: "A: 'What does he look like?' B: '___'", options: ["He's very kind.", "He likes football.", "He's tall and has blue eyes.", "He's a doctor."], answer: "He's tall and has blue eyes." },
        { question: "A: 'What does your father like doing?' B: '___'", options: ["He is well, thanks.", "He is a kind man.", "He looks like my grandfather.", "He enjoys gardening."], answer: "He enjoys gardening." },
        { question: "The question 'What's London like?' asks for:", options: ["The weather in London.", "A description of London.", "Directions to London.", "How to like London."], answer: "A description of London." },
        { question: "To ask about hobbies, you say:", options: ["What do you look like?", "What are you like?", "What do you like doing?", "How do you do?"], answer: "What do you like doing?" },
    ]
  },
  {
    title: "أنماط الأفعال (Verb Patterns)",
    explanation: `في اللغة الإنجليزية، الفعل الذي يتبع فعلًا آخر يأخذ صيغة معينة. الأنماط الرئيسية هي:
1.  فعل + to + infinitive (المصدر): e.g., want, hope, decide, promise.
    مثال: "I decided to leave."
2.  فعل + -ing form (gerund): e.g., enjoy, finish, can't stand, look forward to.
    مثال: "I enjoy playing tennis."
3.  فعل + infinitive (بدون to): e.g., make, let.
    مثال: "My parents made me clean my room."
معرفة هذه الأنماط ضروري لتكوين جمل صحيحة وتجنب الأخطاء الشائعة.`,
    examples: [
        { english: "I enjoyed meeting your friends.", arabic: "استمتعت بلقاء أصدقائك." },
        { english: "I just wanted to say thank you.", arabic: "أردت فقط أن أقول شكرًا لك." },
        { english: "You made me feel welcome. (no 'to')", arabic: "جعلتني أشعر بالترحاب. (بدون 'to')" },
        { english: "She decided to leave early.", arabic: "قررت أن تغادر مبكرًا." },
        { english: "He finished working at 7 PM.", arabic: "أنهى العمل في الساعة 7 مساءً." },
        { english: "I'd like to call you.", arabic: "أود أن أتصل بك." },
        { english: "I'm looking forward to hearing from you.", arabic: "أتطلع إلى السماع منك." },
        { english: "Let me know if you want to visit. (no 'to')", arabic: "أعلمني إذا أردت الزيارة. (بدون 'to')" },
        { english: "He promised to help us.", arabic: "وعد بمساعدتنا." },
        { english: "I can't stand waiting in queues.", arabic: "لا أطيق الانتظار في طوابير." },
    ],
    mcqs: [
        { question: "Choose the correct form: I want ___ a new phone.", options: ["buy", "to buy", "buying", "for buying"], answer: "to buy" },
        { question: "Choose the correct form: She enjoys ___ books.", options: ["to read", "reads", "read", "reading"], answer: "reading" },
        { question: "My parents made me ___ my room.", options: ["clean", "to clean", "cleaning", "cleaned"], answer: "clean" },
        { question: "He offered ___ me to the station.", options: ["driving", "drive", "to drive", "for drive"], answer: "to drive" },
        { question: "Would you mind ___ the window?", options: ["to open", "opening", "open", "for opening"], answer: "opening" },
    ]
  },
  {
    title: "المضارع التام مقابل الماضي البسيط",
    explanation: `يعد التمييز بين المضارع التام (Present Perfect) والماضي البسيط (Past Simple) من أهم النقاط في قواعد اللغة الإنجليزية.
- الماضي البسيط: يُستخدم للحديث عن أحداث بدأت وانتهت في وقت محدد في الماضي. غالبًا ما نستخدم معه كلمات زمنية مثل 'yesterday', 'last week', 'in 2010'.
- المضارع التام: يُستخدم للحديث عن تجارب حياتية (بدون تحديد وقت)، أو أحداث ماضية لها نتيجة أو تأثير في الحاضر. غالبًا ما نستخدم معه كلمات مثل 'ever', 'never', 'already', 'yet'.`,
    examples: [
        { english: "I've worked there for five years. (I still work there)", arabic: "عملت هناك لمدة خمس سنوات. (ما زلت أعمل هناك)" },
        { english: "I worked for the BBC. (I don't work there now)", arabic: "عملت في البي بي سي. (لا أعمل هناك الآن)" },
        { english: "I've been to the United States.", arabic: "لقد زرت الولايات المتحدة. (تجربة حياتية)" },
        { english: "I went to the United States last year.", arabic: "ذهبت إلى الولايات المتحدة العام الماضي. (وقت محدد)" },
        { english: "She has written three books.", arabic: "لقد كتبت ثلاثة كتب. (في حياتها حتى الآن)" },
        { english: "She wrote her first book in 2010.", arabic: "كتبت كتابها الأول في عام 2010. (وقت محدد)" },
        { english: "Have you ever eaten sushi?", arabic: "هل أكلت السوشي من قبل؟" },
        { english: "Did you eat sushi at the party yesterday?", arabic: "هل أكلت السوشي في الحفلة أمس؟" },
        { english: "He has lost his keys. (He can't find them now)", arabic: "لقد فقد مفاتيحه. (لا يستطيع العثور عليها الآن)" },
        { english: "He lost his keys yesterday.", arabic: "فقد مفاتيحه أمس." },
    ],
    mcqs: [
        { question: "I ___ to Paris in 2018.", options: ["have been", "went", "have gone", "was"], answer: "went" },
        { question: "She ___ never seen a camel before.", options: ["has", "did", "was", "had"], answer: "has" },
        { question: "___ you finish your homework last night?", options: ["Have", "Did", "Do", "Were"], answer: "Did" },
        { question: "I can't find my phone. I think I ___ it.", options: ["lost", "have lost", "did lose", "was losing"], answer: "have lost" },
        { question: "He ___ for this company since 2015.", options: ["worked", "has worked", "did work", "was working"], answer: "has worked" },
    ]
  },
  {
    title: "المبني للمجهول في المضارع التام",
    explanation: `يُستخدم المبني للمجهول في المضارع التام (Present Perfect Passive) للحديث عن أحداث وقعت في الماضي ولها تأثير أو أهمية في الحاضر، مع التركيز على المفعول به (من استقبل الفعل).
يُصاغ باستخدام 'has/have + been + past participle'.
مثال: "The window has been broken." (النافذة مكسورة الآن). التركيز على حالة النافذة، وليس على من كسرها.`,
    examples: [
        { english: "Two Spanish novelists have been awarded the Nobel Prize.", arabic: "مُنح روائيان إسبانيان جائزة نوبل." },
        { english: "My car has been stolen!", arabic: "لقد سُرقت سيارتي!" },
        { english: "The windows haven't been cleaned for weeks.", arabic: "لم تُنظف النوافذ منذ أسابيع." },
        { english: "This book has been translated into fifty languages.", arabic: "تُرجم هذا الكتاب إلى خمسين لغة." },
        { english: "A new school has been built in our town.", arabic: "بُنيت مدرسة جديدة في بلدتنا." },
        { english: "Have the letters been sent yet?", arabic: "هل أُرسلت الرسائل بعد؟" },
        { english: "The problem has already been solved.", arabic: "لقد حُلت المشكلة بالفعل." },
        { english: "He has been invited to the party.", arabic: "لقد دُعي إلى الحفلة." },
        { english: "The criminals have been arrested.", arabic: "تم القبض على المجرمين." },
        { english: "This castle has been visited by thousands of tourists.", arabic: "زار هذه القلعة آلاف السياح." },
    ],
    mcqs: [
        { question: "Active: 'They have built a new bridge.' Passive: 'A new bridge ___.'", options: ["has been built", "is built", "was built", "had been built"], answer: "has been built" },
        { question: "The email ___ yet.", options: ["hasn't sent", "hasn't been sent", "wasn't sent", "isn't sent"], answer: "hasn't been sent" },
        { question: "All the tickets ___.", options: ["have sold", "has been sold", "have been sold", "sold"], answer: "have been sold" },
        { question: "His new film ___ by many people.", options: ["has been seen", "has seen", "is seen", "was seen"], answer: "has been seen" },
        { question: "___ your car ever ___ stolen?", options: ["Has / being", "Have / been", "Has / been", "Did / be"], answer: "Has / been" },
    ]
  },
  {
    title: "الجمل الشرطية (النوع الأول)",
    explanation: `تُستخدم الجمل الشرطية من النوع الأول (First Conditional) للحديث عن مواقف حقيقية ومحتملة في المستقبل ونتائجها المحتملة. إنها تعبر عن علاقة 'سبب ونتيجة' واقعية.
الصيغة هي: If + Present Simple, ... will + infinitive.
مثال: "If it rains (شرط محتمل), we'll stay home (نتيجة محتملة)."`,
    examples: [
        { english: "If I see Anna, I'll tell her.", arabic: "إذا رأيت آنا، سأخبرها." },
        { english: "If it rains, we'll stay home.", arabic: "إذا أمطرت، سنبقى في المنزل." },
        { english: "You will pass the exam if you study hard.", arabic: "سوف تنجح في الامتحان إذا درست بجد." },
        { english: "What will you do if you miss the bus?", arabic: "ماذا ستفعل إذا فاتتك الحافلة؟" },
        { english: "If you don't hurry, you'll be late.", arabic: "إذا لم تسرع، ستتأخر." },
        { english: "I'll call you if I have time.", arabic: "سأتصل بك إذا كان لدي وقت." },
        { english: "If she needs help, she will ask.", arabic: "إذا احتاجت مساعدة، فسوف تطلب." },
        { english: "If they invite me, I will go to the party.", arabic: "إذا دعوني، سأذهب إلى الحفلة." },
        { english: "Will you come if I pay for your ticket?", arabic: "هل ستأتي إذا دفعت ثمن تذكرتك؟" },
        { english: "If you touch that wire, you'll get an electric shock.", arabic: "إذا لمست ذلك السلك، ستصاب بصدمة كهربائية." },
    ],
    mcqs: [
        { question: "If I ___ time, I'll visit you.", options: ["will have", "have", "had", "am having"], answer: "have" },
        { question: "She will be angry if you ___ late.", options: ["will be", "are", "were", "be"], answer: "are" },
        { question: "If you don't water the plants, they ___.", options: ["die", "will die", "would die", "died"], answer: "will die" },
        { question: "What will happen if the company ___ money?", options: ["loses", "will lose", "lost", "would lose"], answer: "loses" },
        { question: "I'll go to the beach tomorrow if the weather ___ good.", options: ["will be", "would be", "is", "was"], answer: "is" },
    ]
  },
  {
    title: "الجمل الشرطية (النوع الثاني)",
    explanation: `تُستخدم الجمل الشرطية من النوع الثاني (Second Conditional) للحديث عن مواقف غير حقيقية، خيالية، أو غير محتملة في الحاضر أو المستقبل. هي غالبًا ما تُستخدم لتقديم النصيحة أو للتعبير عن أحلام ورغبات.
الصيغة هي: If + Past Simple, ... would + infinitive.
ملاحظة: من الشائع استخدام 'were' بدلاً من 'was' مع جميع الضمائر في جملة 'if'، خاصة في الكتابة الرسمية. (e.g., If I were you...).`,
    examples: [
        { english: "If I had a million dollars, I'd buy an island.", arabic: "لو كان لدي مليون دولار، لاشتريت جزيرة." },
        { english: "If I were you, I'd take the job.", arabic: "لو كنت مكانك، لقبولت الوظيفة." },
        { english: "What would you do if you met a celebrity?", arabic: "ماذا كنت ستفعل لو قابلت شخصًا مشهورًا؟" },
        { english: "If he knew the answer, he would tell us.", arabic: "لو كان يعرف الإجابة، لأخبرنا." },
        { english: "She would travel the world if she had more time.", arabic: "كانت ستسافر حول العالم لو كان لديها المزيد من الوقت." },
        { english: "If I didn't have to work, I would sleep all day.", arabic: "لو لم يكن عليّ العمل، لنمت طوال اليوم." },
        { english: "If we lived in the countryside, we would have a big garden.", arabic: "لو كنا نعيش في الريف، لكان لدينا حديقة كبيرة." },
        { english: "Would you go to the moon if you had the chance?", arabic: "هل كنت ستذهب إلى القمر لو أتيحت لك الفرصة؟" },
        { english: "If dogs could talk, life would be very different.", arabic: "لو استطاعت الكلاب التحدث، لكانت الحياة مختلفة جدًا." },
        { english: "I wouldn't do that if I were you.", arabic: "لم أكن لأفعل ذلك لو كنت مكانك." },
    ],
    mcqs: [
        { question: "If I ___ the lottery, I would travel the world.", options: ["win", "will win", "won", "had won"], answer: "won" },
        { question: "She ___ happier if she changed her job.", options: ["will be", "is", "would be", "was"], answer: "would be" },
        { question: "If I ___ you, I wouldn't worry.", options: ["am", "was", "were", "be"], answer: "were" },
        { question: "What would you do if you ___ a ghost?", options: ["see", "saw", "will see", "had seen"], answer: "saw" },
        { question: "If he ___ more, he would be healthier.", options: ["exercises", "will exercise", "exercised", "would exercise"], answer: "exercised" },
    ]
  },
  {
    title: "الجمل الزمنية (Time Clauses)",
    explanation: `الجمل الزمنية هي جمل تبدأ بكلمات ربط زمنية مثل 'when', 'as soon as', 'before', 'after', 'until'. عند الحديث عن المستقبل، القاعدة المهمة هي أننا نستخدم زمن المضارع البسيط (Present Simple) في الجملة الزمنية، وليس صيغة المستقبل 'will'.
الصيغة: Time Word + Present Simple, ... will + infinitive.
مثال: "I will call you when I arrive." (وليس "when I will arrive").`,
    examples: [
        { english: "When we get there, we'll give you a call.", arabic: "عندما نصل إلى هناك، سنتصل بك." },
        { english: "I'll call you as soon as I arrive.", arabic: "سأتصل بك حالما أصل." },
        { english: "Can I have a word with you before I go?", arabic: "هل يمكنني التحدث معك قبل أن أذهب؟" },
        { english: "Wait here until I come back.", arabic: "انتظر هنا حتى أعود." },
        { english: "After she finishes her work, she'll go home.", arabic: "بعد أن تنهي عملها، ستذهب إلى المنزل." },
        { english: "I'll do my homework when I get home.", arabic: "سأقوم بواجبي عندما أصل إلى المنزل." },
        { english: "Don't start the movie until everyone is here.", arabic: "لا تبدأ الفيلم حتى يحضر الجميع." },
        { english: "She will feel better after she takes the medicine.", arabic: "ستشعر بتحسن بعد أن تأخذ الدواء." },
        { english: "Before you leave, please turn off the lights.", arabic: "قبل أن تغادر، من فضلك أطفئ الأنوار." },
        { english: "As soon as the rain stops, we'll go for a walk.", arabic: "حالما يتوقف المطر، سنذهب في نزهة." },
    ],
    mcqs: [
        { question: "I'll tell him when I ___ him.", options: ["see", "will see", "saw", "am seeing"], answer: "see" },
        { question: "As soon as dinner ___, I'll call you.", options: ["will be ready", "is ready", "was ready", "be ready"], answer: "is ready" },
        { question: "We'll go shopping after we ___ lunch.", options: ["will have", "have", "are having", "had"], answer: "have" },
        { question: "Don't make a decision until you ___ all the facts.", options: ["will know", "knew", "know", "are knowing"], answer: "know" },
        { question: "Before she ___ to bed, she always brushes her teeth.", options: ["will go", "goes", "went", "is going"], answer: "goes" },
    ]
  },
  {
    title: "أفعال Modal للاحتمالية (2)",
    explanation: `تُستخدم الأفعال المساعدة 'must', 'could', 'might', 'can't' للتعبير عن مدى تأكدنا من شيء ما (Probability).
- 'must': تُستخدم عندما نكون متأكدين تقريبًا من شيء ما بناءً على دليل (استنتاج منطقي قوي).
- 'can't': تُستخدم عندما نكون متأكدين تقريبًا أن شيئًا ما غير صحيح أو مستحيل.
- 'might' / 'could' / 'may': تُستخدم عندما نعتقد أن شيئًا ما ممكن ولكنه غير مؤكد.`,
    examples: [
        { english: "She can't be very old. She looks about 16.", arabic: "لا يمكن أن تكون كبيرة في السن. تبدو حوالي 16 عامًا." },
        { english: "She might be in love.", arabic: "ربما تكون في حالة حب." },
        { english: "He's not answering his phone. He must be busy.", arabic: "لا يرد على هاتفه. لابد أنه مشغول." },
        { english: "It could rain later, so take an umbrella.", arabic: "قد تمطر لاحقًا، لذا خذ مظلة." },
        { english: "That can't be true! I don't believe it.", arabic: "لا يمكن أن يكون هذا صحيحًا! لا أصدق ذلك." },
        { english: "They might not come to the party.", arabic: "ربما لن يأتوا إلى الحفلة." },
        { english: "He must be tired. He's been working all day.", arabic: "لابد أنه متعب. لقد كان يعمل طوال اليوم." },
        { english: "This could be the house we're looking for.", arabic: "قد يكون هذا هو المنزل الذي نبحث عنه." },
        { english: "Someone's at the door. It could be the postman.", arabic: "شخص ما عند الباب. قد يكون ساعي البريد." },
        { english: "He's from Paris? He must speak French.", arabic: "هو من باريس؟ لابد أنه يتحدث الفرنسية." },
    ],
    mcqs: [
        { question: "He drives a Ferrari. He ___ be rich.", options: ["might", "must", "can't", "should"], answer: "must" },
        { question: "She's been studying all day. She ___ be tired.", options: ["must", "can't", "might not", "should"], answer: "must" },
        { question: "I'm not sure where she is. She ___ be at the library.", options: ["must", "can't", "could", "should"], answer: "could" },
        { question: "That story ___ be true. It's impossible.", options: ["must", "can't", "might", "should"], answer: "can't" },
        { question: "Don't eat it. It ___ be poisonous.", options: ["must", "can't", "might", "has to"], answer: "might" },
    ]
  },
  {
    title: "أفعال Modal للاحتمالية في الماضي",
    explanation: `للتعبير عن الاحتمالية أو عمل استنتاجات حول الماضي، نستخدم 'modal + have + past participle'.
- 'must have + p.p.': استنتاج منطقي قوي بأن شيئًا ما حدث.
- 'can't have + p.p.': استنتاج قوي بأن شيئًا ما لم يحدث.
- 'could/might/may have + p.p.': تخمين أو احتمال أن شيئًا ما قد حدث في الماضي.`,
    examples: [
        { english: "It could have been her suitcase.", arabic: "كان من الممكن أن تكون حقيبتها." },
        { english: "She must have been on holiday.", arabic: "لابد أنها كانت في عطلة." },
        { english: "He can't have forgotten. I reminded him this morning.", arabic: "لا يمكن أن يكون قد نسي. لقد ذكرته هذا الصباح." },
        { english: "The ground is wet. It must have rained last night.", arabic: "الأرض مبللة. لابد أنها أمطرت الليلة الماضية." },
        { english: "I can't find my keys. I might have left them in the car.", arabic: "لا أجد مفاتيحي. ربما تركتها في السيارة." },
        { english: "He didn't come to the meeting. He could have been sick.", arabic: "لم يأت إلى الاجتماع. كان من الممكن أنه كان مريضًا." },
        { english: "She looks very happy. She must have received good news.", arabic: "تبدو سعيدة جدًا. لابد أنها تلقت أخبارًا جيدة." },
        { english: "He can't have finished the project already. It's too big.", arabic: "لا يمكن أن يكون قد أنهى المشروع بالفعل. إنه كبير جدًا." },
        { english: "I don't know why she's late. She might have missed the bus.", arabic: "لا أعرف لماذا هي متأخرة. ربما فاتتها الحافلة." },
        { english: "You could have told me you were coming!", arabic: "كان بإمكانك أن تخبرني أنك قادم!" },
    ],
    mcqs: [
        { question: "He didn't answer the phone. He ___ been sleeping.", options: ["must have", "can't have", "should have", "will have"], answer: "must have" },
        { question: "The window is broken. Someone ___ broken it.", options: ["can't have", "might not have", "must have", "shouldn't have"], answer: "must have" },
        { question: "She wasn't at the party. She ___ been invited.", options: ["must not have", "can't have", "might not have", "shouldn't have"], answer: "might not have" },
        { question: "He passed the exam without studying. He ___ cheated.", options: ["can't have", "must have", "should have", "would have"], answer: "must have" },
        { question: "I can't find my book. I ___ left it at school.", options: ["must have", "might have", "can't have", "shouldn't have"], answer: "might have" },
    ]
  },
  {
    title: "المضارع التام المستمر",
    explanation: `يُستخدم المضارع التام المستمر (Present Perfect Continuous) للتأكيد على مدة استمرار فعل بدأ في الماضي وما زال مستمرًا حتى الآن، أو للتركيز على فعل انتهى للتو ولكن نتيجته واضحة.
الصيغة: 'have/has + been + verb-ing'.
غالبًا ما يُستخدم مع 'for' و 'since' للإجابة على سؤال يبدأ بـ '?How long'.`,
    examples: [
        { english: "I've been texting my friends all day long.", arabic: "لقد كنت أراسل أصدقائي طوال اليوم." },
        { english: "How long have you been learning English?", arabic: "منذ متى وأنت تتعلم اللغة الإنجليزية؟" },
        { english: "She's been living in Paris since she got married.", arabic: "هي تعيش في باريس منذ أن تزوجت." },
        { english: "It has been raining for three hours.", arabic: "إنها تمطر منذ ثلاث ساعات." },
        { english: "He's tired because he has been working all night.", arabic: "هو متعب لأنه كان يعمل طوال الليل." },
        { english: "We've been waiting for you for an hour.", arabic: "نحن ننتظرك منذ ساعة." },
        { english: "They have been arguing about money.", arabic: "لقد كانوا يتجادلون حول المال." },
        { english: "I've been reading this book all afternoon.", arabic: "لقد كنت أقرأ هذا الكتاب طوال فترة بعد الظهر." },
        { english: "What have you been doing lately?", arabic: "ماذا كنت تفعل مؤخرًا؟" },
        { english: "Your eyes are red. Have you been crying?", arabic: "عيناك حمراوان. هل كنت تبكي؟" },
    ],
    mcqs: [
        { question: "How long ___ you been waiting?", options: ["are", "did", "have", "do"], answer: "have" },
        { question: "She ___ all morning. That's why she's tired.", options: ["has cooked", "cooked", "has been cooking", "cooks"], answer: "has been cooking" },
        { question: "It ___ for days.", options: ["has been raining", "rained", "is raining", "rains"], answer: "has been raining" },
        { question: "He has been ___ that game for hours.", options: ["play", "played", "playing", "plays"], answer: "playing" },
        { question: "They ___ about this problem for weeks.", options: ["have been talking", "talked", "are talking", "talk"], answer: "have been talking" },
    ]
  },
  {
    title: "المضارع التام البسيط مقابل المستمر",
    explanation: `الاختيار بين المضارع التام البسيط (Present Perfect Simple) والمستمر (Continuous) يعتمد على ما تريد التأكيد عليه:
- البسيط ('have + p.p.'): يركز على نتيجة الفعل المكتمل أو عدد المرات. (e.g., "I've written three emails.").
- المستمر ('have been + -ing'): يركز على مدة الفعل واستمراريته، وليس بالضرورة على اكتماله. (e.g., "I've been writing emails all morning.").
ملاحظة: الأفعال التي تصف الحالات (like, know, have) لا تُستخدم في الصيغة المستمرة.`,
    examples: [
        { english: "A Manchester teenager has received a phone bill for over £450.", arabic: "تلقى مراهق من مانشستر فاتورة هاتف تزيد عن 450 جنيهًا إسترلينيًا. (نتيجة)" },
        { english: "I've been texting my friends all day long.", arabic: "لقد كنت أراسل أصدقائي طوال اليوم. (مدة)" },
        { english: "I've read three chapters of this book.", arabic: "قرأت ثلاثة فصول من هذا الكتاب. (كمية)" },
        { english: "I've been reading this book for two hours.", arabic: "أقرأ هذا الكتاب منذ ساعتين. (مدة)" },
        { english: "She has painted the kitchen.", arabic: "لقد دهنت المطبخ. (اكتمل)" },
        { english: "She has been painting the kitchen all day.", arabic: "لقد كانت تدهن المطبخ طوال اليوم. (مدة)" },
        { english: "He has broken his leg.", arabic: "لقد كسر ساقه. (نتيجة)" },
        { english: "They have lived here for ten years. (permanent state)", arabic: "لقد عاشوا هنا لمدة عشر سنوات. (حالة دائمة)" },
        { english: "They have been living here for a few months. (temporary situation)", arabic: "لقد كانوا يعيشون هنا لبضعة أشهر. (حالة مؤقتة)" },
        { english: "How many pages have you written?", arabic: "كم عدد الصفحات التي كتبتها؟" },
    ],
    mcqs: [
        { question: "She's tired. She ___ all day.", options: ["has worked", "has been working", "worked", "works"], answer: "has been working" },
        { question: "I ___ three emails so far this morning.", options: ["have been writing", "wrote", "have written", "am writing"], answer: "have written" },
        { question: "How long ___ English?", options: ["have you learned", "did you learn", "have you been learning", "do you learn"], answer: "have you been learning" },
        { question: "He ___ that car for ten years.", options: ["has had", "has been having", "had", "has"], answer: "has had" },
        { question: "The floor is wet because I ___ it.", options: ["have cleaned", "have been cleaning", "cleaned", "clean"], answer: "have been cleaning" },
    ]
  },
  {
    title: "الأسئلة غير المباشرة",
    explanation: `تُستخدم الأسئلة غير المباشرة (Indirect Questions) لجعل الأسئلة أكثر تهذيبًا ورسمية. تبدأ بعبارات مثل 'Could you tell me...' أو 'I wonder...' أو 'Do you know...'.
القاعدة الأساسية هي أن ترتيب الكلمات في الجزء الثاني من السؤال يكون نفس ترتيب الجملة الخبرية (فاعل ثم فعل)، ولا نستخدم الفعل المساعد 'do/does/did'. إذا لم يكن هناك كلمة استفهام (what, where)، نستخدم 'if' أو 'whether'.`,
    examples: [
        { english: "I wonder if you could help me.", arabic: "أتساءل عما إذا كان بإمكانك مساعدتي." },
        { english: "I don't know what time the banks close.", arabic: "لا أعرف في أي وقت تغلق البنوك." },
        { english: "Direct: Where is the station? Indirect: Could you tell me where the station is?", arabic: "مباشر: أين المحطة؟ غير مباشر: هل يمكنك أن تخبرني أين المحطة؟" },
        { english: "Direct: What time is it? Indirect: Do you know what time it is?", arabic: "مباشر: كم الساعة؟ غير مباشر: هل تعرف كم الساعة؟" },
        { english: "Direct: Did she pass the exam? Indirect: I wonder if she passed the exam.", arabic: "مباشر: هل نجحت في الامتحان؟ غير مباشر: أتساءل عما إذا كانت قد نجحت في الامتحان." },
        { english: "I'd like to know how much this costs.", arabic: "أود أن أعرف كم تكلفة هذا." },
        { english: "Can you tell me why you were late?", arabic: "هل يمكنك أن تخبرني لماذا تأخرت؟" },
        { english: "I can't remember where I parked my car.", arabic: "لا أستطيع أن أتذكر أين أوقفت سيارتي." },
        { english: "I'm not sure if he is coming.", arabic: "لست متأكدًا مما إذا كان سيأتي." },
        { english: "Do you have any idea how to solve this problem?", arabic: "هل لديك أي فكرة عن كيفية حل هذه المشكلة؟" },
    ],
    mcqs: [
        { question: "Direct: 'What is his name?' Indirect: 'Could you tell me what ___?'", options: ["his name is", "is his name", "his name was", "was his name"], answer: "his name is" },
        { question: "Direct: 'Do you like coffee?' Indirect: 'I'd like to know ___ coffee.'", options: ["do you like", "you like if", "if you like", "whether do you like"], answer: "if you like" },
        { question: "Which sentence is a correct indirect question?", options: ["I wonder where is the post office.", "I wonder where the post office is.", "I wonder where does the post office is.", "I wonder is where the post office."], answer: "I wonder where the post office is." },
        { question: "Direct: 'When did they leave?' Indirect: 'Do you know when ___?'", options: ["did they leave", "they did leave", "they left", "they leave"], answer: "they left" },
        { question: "Choose the polite question.", options: ["Where is the bathroom?", "Tell me where the bathroom is.", "Could you tell me where the bathroom is?", "Where the bathroom is?"], answer: "Could you tell me where the bathroom is?" },
    ]
  },
  {
    title: "الأسئلة المذيلة (Question Tags)",
    explanation: `الأسئلة المذيلة هي أسئلة قصيرة تضاف في نهاية الجملة. تُستخدم عادة لتأكيد المعلومات أو لبدء محادثة.
القاعدة بسيطة: إذا كانت الجملة الرئيسية مثبتة، يكون السؤال المذيل منفيًا، والعكس صحيح. نستخدم نفس الفعل المساعد الموجود في الجملة الرئيسية. إذا لم يكن هناك فعل مساعد، نستخدم 'do/does/did'.
نبرة الصوت مهمة: نبرة صاعدة تسأل سؤالًا حقيقيًا. نبرة هابطة تطلب الموافقة.`,
    examples: [
        { english: "I've got a meeting this afternoon, haven't I?", arabic: "لدي اجتماع بعد ظهر هذا اليوم، أليس كذلك؟" },
        { english: "It's a beautiful day, isn't it?", arabic: "إنه يوم جميل، أليس كذلك؟" },
        { english: "You haven't seen my keys, have you?", arabic: "لم تر مفاتيحي، أليس كذلك؟" },
        { english: "She can speak French, can't she?", arabic: "هي تستطيع التحدث بالفرنسية، أليس كذلك؟" },
        { english: "He went to the party, didn't he?", arabic: "لقد ذهب إلى الحفلة، أليس كذلك؟" },
        { english: "They don't live here, do they?", arabic: "هم لا يعيشون هنا، أليس كذلك؟" },
        { english: "We should leave now, shouldn't we?", arabic: "يجب أن نغادر الآن، أليس كذلك؟" },
        { english: "You're coming to the meeting, aren't you?", arabic: "أنت قادم إلى الاجتماع، أليس كذلك؟" },
        { english: "He wasn't very happy, was he?", arabic: "لم يكن سعيدًا جدًا، أليس كذلك؟" },
        { english: "I'm late, aren't I?", arabic: "أنا متأخر، أليس كذلك؟" },
    ],
    mcqs: [
        { question: "He's a doctor, ___?", options: ["is he", "isn't he", "does he", "doesn't he"], answer: "isn't he" },
        { question: "You live in London, ___?", options: ["do you", "don't you", "are you", "aren't you"], answer: "don't you" },
        { question: "She didn't call you, ___?", options: ["did she", "didn't she", "does she", "doesn't she"], answer: "did she" },
        { question: "They have finished, ___?", options: ["have they", "haven't they", "do they", "don't they"], answer: "haven't they" },
        { question: "Let's go for a walk, ___?", options: ["shall we", "will we", "do we", "don't we"], answer: "shall we" },
    ]
  },
  {
    title: "الكلام المنقول (الجمل الخبرية)",
    explanation: `الكلام المنقول (Reported Speech) هو عندما نخبر شخصًا ما قاله شخص آخر. عند نقل جملة خبرية (statement)، عادة ما نغير زمن الفعل إلى درجة أقدم في الماضي (وهذا ما يسمى 'backshift'). كما نغير الضمائر وتعبيرات الزمان والمكان حسب السياق.
مثال: "I am tired." (كلام مباشر) -> He said he was tired. (كلام منقول).
الفعل 'said' هو الأكثر شيوعًا، ولكن يمكن استخدام 'told' إذا ذكرنا الشخص الذي نتحدث إليه (e.g., He told me...).`,
    examples: [
        { english: "She said that they were married.", arabic: "قالت إنهم كانوا متزوجين." },
        { english: "Direct: 'I am tired.' -> Reported: He said he was tired.", arabic: "مباشر: 'أنا متعب.' -> منقول: قال إنه كان متعبًا." },
        { english: "Direct: 'I will be there.' -> Reported: She told me she would be there.", arabic: "مباشر: 'سأكون هناك.' -> منقول: أخبرتني أنها ستكون هناك." },
        { english: "Direct: 'I have finished my work.' -> Reported: He said he had finished his work.", arabic: "مباشر: 'لقد أنهيت عملي.' -> منقول: قال إنه قد أنهى عمله." },
        { english: "Direct: 'I live in this city.' -> Reported: She said she lived in that city.", arabic: "مباشر: 'أعيش في هذه المدينة.' -> منقول: قالت إنها عاشت في تلك المدينة." },
        { english: "Direct: 'We are going to the cinema tomorrow.' -> Reported: They said they were going to the cinema the next day.", arabic: "مباشر: 'سنذهب إلى السينما غدًا.' -> منقول: قالوا إنهم ذاهبون إلى السينما في اليوم التالي." },
        { english: "Direct: 'My brother can swim.' -> Reported: He said his brother could swim.", arabic: "مباشر: 'أخي يستطيع السباحة.' -> منقول: قال إن أخاه يستطيع السباحة." },
        { english: "Direct: 'I saw a great movie last week.' -> Reported: She said she had seen a great movie the previous week.", arabic: "مباشر: 'شاهدت فيلمًا رائعًا الأسبوع الماضي.' -> منقول: قالت إنها شاهدت فيلمًا رائعًا في الأسبوع السابق." },
        { english: "He told me that he didn't like coffee.", arabic: "أخبرني أنه لا يحب القهوة." },
        { english: "They said they might be late.", arabic: "قالوا إنهم قد يتأخرون." },
    ],
    mcqs: [
        { question: "Direct: 'I am happy.' Reported: She said that she ___ happy.", options: ["is", "am", "was", "be"], answer: "was" },
        { question: "Direct: 'We will come.' Reported: They said they ___ come.", options: ["will", "would", "are", "were"], answer: "would" },
        { question: "Direct: 'I've done it.' Reported: He said he ___ it.", options: ["has done", "did", "had done", "does"], answer: "had done" },
        { question: "Direct: 'I live here.' Reported: She said she lived ___.", options: ["here", "there", "this", "that"], answer: "there" },
        { question: "Direct: 'I must go.' Reported: He said he ___ go.", options: ["must", "had to", "has to", "should"], answer: "had to" },
    ]
  },
  {
    title: "الكلام المنقول (الأسئلة)",
    explanation: `عند نقل سؤال، نستخدم فعلًا مثل 'asked'. يتغير ترتيب الكلمات ليصبح كترتيب الجملة الخبرية (فاعل ثم فعل)، ولا نستخدم الفعل المساعد 'do/does/did'.
- إذا كان السؤال المباشر يبدأ بكلمة استفهام (what, where, who, etc.)، نستخدم نفس الكلمة في السؤال المنقول.
- إذا كان السؤال المباشر هو سؤال نعم/لا (يبدأ بفعل مساعد)، نستخدم 'if' أو 'whether' في السؤال المنقول.`,
    examples: [
        { english: "He asked me how I knew them.", arabic: "سألني كيف عرفتهم." },
        { english: "Direct: 'Where do you live?' -> Reported: She asked me where I lived.", arabic: "مباشر: 'أين تعيش؟' -> منقول: سألتني أين أعيش." },
        { english: "Direct: 'Are you happy?' -> Reported: He asked me if I was happy.", arabic: "مباشر: 'هل أنت سعيد؟' -> منقول: سألني إذا كنت سعيدًا." },
        { english: "Direct: 'What time is it?' -> Reported: I asked him what time it was.", arabic: "مباشر: 'كم الساعة؟' -> منقول: سألته كم كانت الساعة." },
        { english: "Direct: 'Did you see the movie?' -> Reported: She asked if I had seen the movie.", arabic: "مباشر: 'هل شاهدت الفيلم؟' -> منقول: سألت إذا كنت قد شاهدت الفيلم." },
        { english: "Direct: 'Can you help me?' -> Reported: He asked me if I could help him.", arabic: "مباشر: 'هل يمكنك مساعدتي؟' -> منقول: سألني إذا كان بإمكاني مساعدته." },
        { english: "I asked her why she was crying.", arabic: "سألتها لماذا كانت تبكي." },
        { english: "They asked me what I was doing.", arabic: "سألوني ماذا كنت أفعل." },
        { english: "The teacher asked who knew the answer.", arabic: "سأل المعلم من يعرف الإجابة." },
        { english: "She asked me whether I wanted tea or coffee.", arabic: "سألتني ما إذا كنت أريد شايًا أم قهوة." },
    ],
    mcqs: [
        { question: "Direct: 'What is your name?' Reported: He asked me what my name ___.", options: ["is", "was", "be", "are"], answer: "was" },
        { question: "Direct: 'Do you speak English?' Reported: She asked me ___ I spoke English.", options: ["that", "what", "if", "do"], answer: "if" },
        { question: "Direct: 'When did you arrive?' Reported: They asked when I ___.", options: ["arrive", "arrived", "had arrived", "did arrive"], answer: "had arrived" },
        { question: "Direct: 'Will you be here tomorrow?' Reported: He asked if I would be there ___.", options: ["tomorrow", "the next day", "yesterday", "today"], answer: "the next day" },
        { question: "Choose the correct reported question.", options: ["He asked me where do I live.", "He asked me where I live.", "He asked me where I lived.", "He asked me do I live there."], answer: "He asked me where I lived." },
    ]
  },
  {
    title: "الكلام المنقول (الأوامر والطلبات)",
    explanation: `لنقل الأوامر (commands) والطلبات (requests)، نستخدم الصيغة: 'verb + object + to + infinitive'.
- للأوامر، نستخدم أفعالاً مثل 'told', 'ordered'.
- للطلبات، نستخدم 'asked'.
- للنصيحة، نستخدم 'advised'.
- للنفي، نستخدم 'not to + infinitive'.
مثال: "Close the door." (أمر) -> He told me to close the door.
مثال: "Please don't shout." (طلب) -> He asked me not to shout.`,
    examples: [
        { english: "He told them to stop making a noise.", arabic: "أمرهم بالتوقف عن إحداث ضوضاء." },
        { english: "I asked them to stop making a noise.", arabic: "طلبت منهم التوقف عن إحداث ضوضاء." },
        { english: "Direct: 'Close the door.' -> Reported: She told me to close the door.", arabic: "مباشر: 'أغلق الباب.' -> منقول: أمرتني بإغلاق الباب." },
        { english: "Direct: 'Please wait here.' -> Reported: He asked me to wait there.", arabic: "مباشر: 'من فضلك انتظر هنا.' -> منقول: طلب مني الانتظار هناك." },
        { english: "Direct: 'Don't be late.' -> Reported: The teacher told us not to be late.", arabic: "مباشر: 'لا تتأخروا.' -> منقول: أمرنا المعلم ألا نتأخر." },
        { english: "My mother told me to clean my room.", arabic: "أمرتني أمي بتنظيف غرفتي." },
        { english: "The doctor advised him to stop smoking.", arabic: "نصحه الطبيب بالتوقف عن التدخين." },
        { english: "She asked him not to tell anyone.", arabic: "طلبت منه ألا يخبر أحداً." },
        { english: "The police ordered the driver to stop.", arabic: "أمرت الشرطة السائق بالتوقف." },
        { english: "I invited her to come to my party.", arabic: "دعوتها للحضور إلى حفلتي." }
    ],
    mcqs: [
        { question: "Direct: 'Sit down!' Reported: He told me ___ down.", options: ["sit", "to sit", "sitting", "sat"], answer: "to sit" },
        { question: "Direct: 'Please don't shout.' Reported: She asked me ___ shout.", options: ["don't", "not to", "to not", "no to"], answer: "not to" },
        { question: "My father told me ___ my homework.", options: ["do", "to do", "doing", "did"], answer: "to do" },
        { question: "He asked his friend ___ him some money.", options: ["to lend", "lend", "lending", "lent"], answer: "to lend" },
        { question: "The captain ordered the soldiers ___.", options: ["to fire", "fire", "firing", "fired"], answer: "to fire" },
    ]
  },
  {
    title: "التعابير الاصطلاحية في المحادثات الاجتماعية",
    explanation: "اللغة الإنجليزية اليومية مليئة بالتعابير الاصطلاحية (Social Expressions) التي تُستخدم في مواقف اجتماعية محددة. فهم هذه التعابير يساعد على التواصل بشكل طبيعي وفعال، ويظهر فهمًا أعمق للثقافة.",
    examples: [
      { english: "Never mind.", arabic: "لا تهتم / لا بأس. (للتخفيف من خطأ بسيط)" },
      { english: "Take care!", arabic: "اعتنِ بنفسك! (عند توديع شخص)" },
      { english: "You must be joking!", arabic: "لابد أنك تمزح! (للتعبير عن عدم التصديق)" },
      { english: "Come in and sit down.", arabic: "تفضل بالدخول واجلس. (للترحيب بالضيوف)" },
      { english: "How about you?", arabic: "ماذا عنك؟ (لإعادة توجيه السؤال)" },
      { english: "It cost a fortune!", arabic: "لقد كلف ثروة! (يعني أنه باهظ الثمن)" },
      { english: "That sounds like a good idea.", arabic: "هذه تبدو فكرة جيدة. (للموافقة على اقتراح)" },
      { english: "The break will do you good.", arabic: "الاستراحة ستفيدك. (للتشجيع على الراحة)" },
      { english: "I can't make it then.", arabic: "لا أستطيع الحضور في ذلك الوقت. (لرفض دعوة)" },
      { english: "Mind your own business!", arabic: "اهتم بشؤونك الخاصة! (رد غير مهذب)" }
    ],
    mcqs: [
      { question: "If someone says 'It cost a fortune!', it means the item was...", options: ["cheap", "free", "very expensive", "on sale"], answer: "very expensive" },
      { question: "What's a good reply to 'Sorry I'm late'?", options: ["You must be joking!", "Take care!", "Never mind.", "So am I."], answer: "Never mind." },
      { question: "If you can't attend a meeting, you can say:", options: ["I can't make it.", "I'll do you good.", "It's my favorite subject.", "Mind your own business."], answer: "I can't make it." },
      { question: "To wish someone well when they leave, you say:", options: ["Never mind.", "Take care.", "You must be joking!", "Hurry up."], answer: "Take care." },
      { question: "If someone tells you something unbelievable, you might say:", options: ["That sounds like a good idea.", "How about you?", "You must be joking!", "Take care."], answer: "You must be joking!" }
    ]
  },
  {
    title: "الأرقام والتواريخ",
    explanation: "يُعد التعبير عن الأرقام والتواريخ والمال والنسب المئوية جزءًا أساسيًا من اللغة اليومية. من المهم معرفة كيفية نطقها بشكل صحيح في سياقات مختلفة، مثل قراءة السنوات، والأسعار، وأرقام الهواتف.",
    examples: [
      { english: "£400 (four hundred pounds)", arabic: "400 جنيه إسترليني" },
      { english: "€9.40 (nine euros forty)", arabic: "9.40 يورو" },
      { english: "1/4 (a quarter)", arabic: "ربع" },
      { english: "3/4 (three quarters)", arabic: "ثلاثة أرباع" },
      { english: "6.2 (six point two)", arabic: "ستة فاصلة اثنان" },
      { english: "50% (fifty percent)", arabic: "خمسون بالمئة" },
      { english: "1995 (nineteen ninety-five)", arabic: "عام 1995" },
      { english: "15/7/94 (the fifteenth of July, nineteen ninety-four)", arabic: "15 يوليو 1994" },
      { english: "$100 (one hundred dollars)", arabic: "100 دولار" },
      { english: "2/3 (two thirds)", arabic: "ثلثان" }
    ],
    mcqs: [
      { question: "How do you say '2024'?", options: ["two thousand twenty-four", "twenty twenty-four", "two zero two four", "Both A and B are correct"], answer: "Both A and B are correct" },
      { question: "How do you say '1/2'?", options: ["one-two", "one second", "a half", "one of two"], answer: "a half" },
      { question: "How do you read '£2.50'?", options: ["two pounds fifty", "two fifty pounds", "two pounds and fifty", "two pounds and fifty"], answer: "two pounds fifty" },
      { question: "What is '75%'?", options: ["seventy-five percent", "seventy-five percentage", "percent seventy-five", "seventy and five percent"], answer: "seventy-five percent" },
      { question: "How do you say the date '01/01/2000'?", options: ["the first of January, two thousand", "one January, two thousand", "the one of January, two thousand", "first January, two thousand"], answer: "the first of January, two thousand" }
    ]
  },
  {
    title: "إعطاء الآراء",
    explanation: "هناك العديد من العبارات المستخدمة للسؤال عن الآراء وإعطائها. استخدام عبارات متنوعة مثل 'What did you think of...?', 'In my opinion...', و 'I feel that...' يجعل المحادثة أكثر ثراءً وتفاعلية. من المهم أن تكون قادرًا على التعبير عن رأيك بوضوح، سواء كان إيجابيًا أو سلبيًا.",
    examples: [
      { english: "What did you think of the play? - It was really boring!", arabic: "ما رأيك في المسرحية؟ - كانت مملة حقًا!" },
      { english: "I fell asleep during the first act.", arabic: "لقد نمت خلال الفصل الأول." },
      { english: "Did you like the film? - It was excellent.", arabic: "هل أعجبك الفيلم؟ - كان ممتازًا." },
      { english: "What do you think of their children? - I think they spoil them.", arabic: "ما رأيك في أطفالهم؟ - أعتقد أنهم يدللونهم." },
      { english: "What was your holiday like? - It was a nice break.", arabic: "كيف كانت عطلتك؟ - كانت استراحة لطيفة." },
      { english: "Did you like your pizzas? - They were delicious.", arabic: "هل أعجبتك البيتزا الخاصة بك؟ - كانت لذيذة." },
      { english: "I think they are very good.", arabic: "أعتقد أنها جيدة جدًا." },
      { english: "In my opinion, this is the best solution.", arabic: "في رأيي، هذا هو الحل الأفضل." },
      { english: "I didn't like it at all.", arabic: "لم يعجبني على الإطلاق." },
      { english: "She's usually good, but I don't think she was right for this part.", arabic: "هي عادة جيدة، لكن لا أعتقد أنها كانت مناسبة لهذا الدور." }
    ],
    mcqs: [
      { question: "To ask for an opinion about a movie, you can say:", options: ["How was the movie?", "What did you think of the movie?", "Did you like the movie?", "All of the above"], answer: "All of the above" },
      { question: "A strong negative opinion is:", options: ["It was okay.", "It wasn't bad.", "I didn't like it at all.", "It was interesting."], answer: "I didn't like it at all." },
      { question: "A positive opinion is:", options: ["It was awful.", "It was terrible.", "It was brilliant.", "It was so-so."], answer: "It was brilliant." },
      { question: "What is a good way to start giving your opinion?", options: ["You think...", "I must say...", "In my opinion...", "He thinks..."], answer: "In my opinion..." },
      { question: "If a meal was very good, you can say:", options: ["It was disgusting.", "It was tasteless.", "It was delicious.", "It was okay."], answer: "It was delicious." }
    ]
  },
  {
    title: "الطلبات والعروض",
    explanation: `لجعل حديثك أكثر تهذيبًا، من المهم استخدام الصيغ الصحيحة للطلبات (Requests) والعروض (Offers).
- للطلبات المهذبة، نستخدم 'Could you...?' أو 'Would you mind...?'.
- لتقديم العروض، نستخدم 'Can I...?', 'Shall I...?', أو 'I'll...'.
تساعد هذه الصيغ على جعل التفاعلات الاجتماعية أكثر سلاسة واحترامًا.`,
    examples: [
      { english: "Could you bring us the bill, please?", arabic: "هل يمكنك إحضار الفاتورة لنا، من فضلك؟" },
      { english: "Would you give me your work number, please?", arabic: "هل يمكنك إعطائي رقم عملك، من فضلك؟" },
      { english: "Can I help you?", arabic: "هل يمكنني مساعدتك؟" },
      { english: "I'll give you a lift if you like.", arabic: "سأوصلك إذا أردت." },
      { english: "Shall I open the window?", arabic: "هل أفتح النافذة؟" },
      { english: "Could you tell me the time, please?", arabic: "هل يمكنك إخباري بالوقت، من فضلك؟" },
      { english: "Can I get you a drink?", arabic: "هل أحضر لك شرابًا؟" },
      { english: "Would you mind opening the window?", arabic: "هل تمانع في فتح النافذة؟" },
      { english: "I'll carry that for you.", arabic: "سأحمل ذلك عنك." },
      { english: "Shall we go for a walk?", arabic: "هل نذهب في نزهة؟" }
    ],
    mcqs: [
      { question: "Which is a polite request?", options: ["Give me the book.", "Can you give me the book?", "Could you possibly give me the book?", "I want the book."], answer: "Could you possibly give me the book?" },
      { question: "To offer help, you can say:", options: ["Shall I help you?", "Can I help you?", "I'll help you.", "All of the above"], answer: "All of the above" },
      { question: "A polite way to ask a stranger to do something is:", options: ["Do this for me.", "You must do this.", "Would you mind doing this?", "I want you to do this."], answer: "Would you mind doing this?" },
      { question: "Which phrase is an offer?", options: ["I'll get it.", "You should get it.", "Did you get it?", "I have to get it."], answer: "I'll get it." },
      { question: "To ask for permission, you can say:", options: ["Shall I close the door?", "Can I close the door?", "I'll close the door.", "You must close the door."], answer: "Can I close the door?" }
    ]
  },
  {
    title: "السفر والتنقل",
    explanation: "هذا الدرس يركز على المفردات والعبارات الشائعة والمفيدة المستخدمة عند استخدام وسائل النقل العام المختلفة، مثل الحافلات والقطارات والطائرات والعبّارات، وكذلك عند التعامل في الفنادق. تعلم هذه العبارات يجعل تجربة السفر أسهل وأكثر سلاسة.",
    examples: [
      { english: "Do you think it'll be a rough crossing? (ferry)", arabic: "هل تعتقد أنها ستكون رحلة بحرية صعبة؟ (عبّارة)" },
      { english: "Could you tell us when it's our stop? (bus)", arabic: "هل يمكنك إخبارنا متى تكون محطتنا؟ (حافلة)" },
      { english: "Can you take us to the airport? (taxi)", arabic: "هل يمكنك أخذنا إلى المطار؟ (سيارة أجرة)" },
      { english: "How do I get to Oxford Circus? (underground)", arabic: "كيف أصل إلى أكسفورد سيركس؟ (مترو الأنفاق)" },
      { english: "Excuse me, are we landing on time? (plane)", arabic: "عفوًا، هل سنهبط في الوقت المحدد؟ (طائرة)" },
      { english: "You can keep the change. (taxi)", arabic: "يمكنك الاحتفاظ بالباقي. (سيارة أجرة)" },
      { english: "Excuse me, I think those seats are ours. (train)", arabic: "عفوًا، أعتقد أن تلك المقاعد لنا. (قطار)" },
      { english: "I'd like to check in, please.", arabic: "أود تسجيل الدخول، من فضلك. (فندق)" },
      { english: "Could I have a wake-up call at 7 a.m.?", arabic: "هل يمكنني الحصول على مكالمة إيقاظ في الساعة 7 صباحًا؟ (فندق)" },
      { english: "A single ticket to London, please.", arabic: "تذكرة ذهاب فقط إلى لندن، من فضلك. (محطة قطار)" }
    ],
    mcqs: [
      { question: "Where would you hear 'This is the final call for flight BA249 to New York'?", options: ["At a train station", "At an airport", "On a bus", "In a taxi"], answer: "At an airport" },
      { question: "What do you say when you get off a bus?", options: ["Thank you, driver.", "Can I have a ticket?", "How much is it?", "Is this seat taken?"], answer: "Thank you, driver." },
      { question: "A 'return ticket' is for:", options: ["One way", "Two ways (there and back)", "A group of people", "A child"], answer: "Two ways (there and back)" },
      { question: "The place where you wait for a train is called a...", options: ["platform", "runway", "port", "bus stop"], answer: "platform" },
      { question: "In a hotel, the person at the front desk is the...", options: ["pilot", "driver", "receptionist", "chef"], answer: "receptionist" }
    ]
  },
  {
    title: "العلامات والأصوات",
    explanation: "فهم اللافتات والإعلانات الصوتية أمر بالغ الأهمية في الحياة اليومية، خاصة عند السفر أو التسوق أو في الأماكن العامة. هذا الدرس يغطي العبارات الشائعة التي قد تراها على اللافتات أو تسمعها في الإعلانات، ويشرح معانيها وسياقاتها.",
    examples: [
      { english: "Dry clean only.", arabic: "تنظيف جاف فقط. (ملصق ملابس)" },
      { english: "Just looking, thanks.", arabic: "أنا أتفرج فقط، شكرًا. (في متجر)" },
      { english: "Pay and Display.", arabic: "ادفع وأبرز التذكرة. (موقف سيارات)" },
      { english: "Mind the gap.", arabic: "انتبه للفجوة. (في مترو الأنفاق)" },
      { english: "Keep out of reach of children.", arabic: "يحفظ بعيدًا عن متناول الأطفال. (منتج)" },
      { english: "Please wait to be seated.", arabic: "من فضلك انتظر حتى يتم إجلاسك. (مطعم)" },
      { english: "For external use only.", arabic: "للاستخدام الخارجي فقط. (دواء)" },
      { english: "Smoking causes fatal diseases.", arabic: "التدخين يسبب أمراضًا مميتة. (علبة سجائر)" },
      { english: "All visitors must sign in.", arabic: "يجب على جميع الزوار تسجيل الدخول. (مبنى)" },
      { english: "We apologize for the delay.", arabic: "نعتذر عن التأخير. (إعلان في محطة)" }
    ],
    mcqs: [
      { question: "Where would you see 'Pay and Display'?", options: ["In a library", "In a car park", "In a cinema", "In a school"], answer: "In a car park" },
      { question: "What does 'Just looking, thanks' mean?", options: ["You want to buy something.", "You are searching for a specific item.", "You don't need help at the moment.", "You are leaving the shop."], answer: "You don't need help at the moment." },
      { question: "A sign saying 'Staff Only' means:", options: ["Only visitors can enter.", "Only employees can enter.", "Everyone can enter.", "The area is closed."], answer: "Only employees can enter." },
      { question: "'Mind the gap' is a warning about:", options: ["The space between the train and the platform.", "A wet floor.", "Loud noise.", "A low ceiling."], answer: "The space between the train and the platform." },
      { question: "If a product is for 'external use only', you should not...", options: ["touch it", "buy it", "eat or drink it", "open it"], answer: "eat or drink it" }
    ]
  },
  {
    title: "الأفعال المركبة (Phrasal Verbs)",
    explanation: `الأفعال المركبة (Phrasal Verbs) تتكون من فعل + حرف جر أو حال (e.g., look up, get on, take off). يمكن أن يكون معناها حرفيًا أو اصطلاحيًا (idiomatic)، مما يجعلها صعبة أحيانًا.
- بعضها يمكن فصله (Separable): "Turn the light on" or "Turn on the light". إذا كان المفعول به ضميرًا، يجب أن يأتي في المنتصف: "Turn it on".
- بعضها لا يمكن فصله (Inseparable): "I'm looking for my keys." (لا يمكن قول "looking my keys for").`,
    examples: [
      { english: "She looked out of the window.", arabic: "نظرت من النافذة." },
      { english: "Look out! There's a car coming.", arabic: "انتبه! هناك سيارة قادمة." },
      { english: "Please turn on the light.", arabic: "من فضلك أشعل الضوء." },
      { english: "Please turn it on.", arabic: "من فضلك أشعله." },
      { english: "He gave up smoking last year.", arabic: "أقلع عن التدخين العام الماضي." },
      { english: "I'm looking for my keys.", arabic: "أبحث عن مفاتيحي." },
      { english: "She takes after her mother.", arabic: "هي تشبه والدتها." },
      { english: "We need to set off early tomorrow.", arabic: "نحتاج أن ننطلق مبكرًا غدًا." },
      { english: "I don't know the word, so I'll look it up.", arabic: "لا أعرف الكلمة، لذلك سأبحث عنها في القاموس." },
      { english: "Can you pick me up from the station?", arabic: "هل يمكنك أن تقلني من المحطة؟" }
    ],
    mcqs: [
      { question: "What does 'give up' mean in 'He wants to give up his job'?", options: ["to offer", "to quit", "to continue", "to find"], answer: "to quit" },
      { question: "Which sentence is correct?", options: ["Turn on it.", "Turn it on.", "On turn it.", "It turn on."], answer: "Turn it on." },
      { question: "To 'look after' someone means to:", options: ["watch them", "search for them", "take care of them", "resemble them"], answer: "take care of them" },
      { question: "The opposite of 'put on' a coat is:", options: ["put off", "take on", "take off", "put away"], answer: "take off" },
      { question: "If a plan 'falls through', it means it:", options: ["succeeded", "failed", "continued", "started"], answer: "failed" }
    ]
  },
  {
    title: "على الهاتف",
    explanation: "إجراء المحادثات الهاتفية باللغة الإنجليزية له عباراته وآدابه الخاصة. هذا الدرس يغطي كيفية طلب التحدث إلى شخص ما، وترك رسالة، والرد على المكالمات، والتعامل مع المشكلات الشائعة مثل انشغال الخط أو الرقم الخطأ بشكل مهذب واحترافي.",
    examples: [
      { english: "Can I take a message?", arabic: "هل يمكنني أخذ رسالة؟" },
      { english: "Would you like to hold?", arabic: "هل تود الانتظار؟" },
      { english: "Could I speak to John, please?", arabic: "هل يمكنني التحدث إلى جون، من فضلك؟" },
      { english: "This is Sarah speaking.", arabic: "معك سارة." },
      { english: "I'm sorry, he's not available at the moment.", arabic: "أنا آسف، هو غير متاح في الوقت الحالي." },
      { english: "Could you ask him to call me back?", arabic: "هل يمكنك أن تطلب منه معاودة الاتصال بي؟" },
      { english: "I'm afraid you've got the wrong number.", arabic: "أخشى أنك طلبت الرقم الخطأ." },
      { english: "The line is engaged. (or busy)", arabic: "الخط مشغول." },
      { english: "I'll put you through.", arabic: "سأوصلك به." },
      { english: "Thanks for calling. Bye.", arabic: "شكرًا لاتصالك. وداعًا." }
    ],
    mcqs: [
      { question: "If someone is already on another call, you say 'The line is ___.'", options: ["finished", "stopped", "engaged", "empty"], answer: "engaged" },
      { question: "To ask someone to wait on the phone, you say:", options: ["Can you hold?", "Can you stop?", "Can you wait?", "Both A and C"], answer: "Both A and C" },
      { question: "If you want to leave a message, you say:", options: ["Can I take a message?", "Can I give a message?", "Can I leave a message?", "Can I write a message?"], answer: "Can I leave a message?" },
      { question: "What do you say when you connect a caller to someone else?", options: ["I'll get you through.", "I'll put you through.", "I'll let you through.", "I'll send you through."], answer: "I'll put you through." },
      { question: "When you answer the phone at work, you should say:", options: ["Hello, who is it?", "Yes?", "Good morning, [Company Name], [Your Name] speaking.", "What do you want?"], answer: "Good morning, [Company Name], [Your Name] speaking." }
    ]
  },
  {
    title: "تقديم الاقتراحات",
    explanation: `هناك طرق عديدة لتقديم الاقتراحات (Making Suggestions) باللغة الإنجليزية. يعتمد اختيار الصيغة على مدى رسمية الموقف.
- 'Let's...': غير رسمية وشائعة. (Let's go shopping!)
- 'Why don't we/you...?': طريقة ودية لتقديم اقتراح. (Why don't we meet at 7?)
- 'How about / What about + verb-ing?': طريقة أخرى غير رسمية. (How about going to the cinema?)
- 'We could...': اقتراح أقل مباشرة ومهذب. (We could try that new restaurant.)`,
    examples: [
      { english: "Let's go shopping!", arabic: "دعنا نذهب للتسوق!" },
      { english: "Why don't you ask your parents?", arabic: "لماذا لا تسأل والديك؟" },
      { english: "How about going to the cinema tonight?", arabic: "ما رأيك في الذهاب إلى السينما الليلة؟" },
      { english: "What about a cup of tea?", arabic: "ماذا عن كوب من الشاي؟" },
      { english: "We could go for a pizza.", arabic: "يمكننا الذهاب لتناول البيتزا." },
      { english: "Let's not argue about it.", arabic: "دعنا لا نتجادل حول هذا الأمر." },
      { english: "Why don't we meet at 7?", arabic: "لماذا لا نلتقي في السابعة؟" },
      { english: "How about watching a movie at my place?", arabic: "ما رأيك في مشاهدة فيلم في منزلي؟" },
      { english: "Perhaps we could try that new restaurant.", arabic: "ربما يمكننا تجربة ذلك المطعم الجديد." },
      { english: "I suggest we take a break.", arabic: "أقترح أن نأخذ استراحة." }
    ],
    mcqs: [
      { question: "Which phrase is followed by a base verb (infinitive without to)?", options: ["How about...", "What about...", "Let's...", "I suggest..."], answer: "Let's..." },
      { question: "Complete the sentence: How about ___ a walk?", options: ["take", "to take", "taking", "taken"], answer: "taking" },
      { question: "Which is a suggestion?", options: ["We must go.", "We could go.", "We went.", "We are going."], answer: "We could go." },
      { question: "A negative suggestion is:", options: ["Let's go.", "Why don't we go?", "Let's not go.", "We could go."], answer: "Let's not go." },
      { question: "Complete the sentence: Why don't we ___ a taxi?", options: ["take", "to take", "taking", "taken"], answer: "take" }
    ]
  },
  {
    title: "الموافقة وعدم الموافقة",
    explanation: `للتعبير عن الموافقة مع شخص ما، نستخدم صيغًا قصيرة لتجنب التكرار.
- للموافقة على جملة مثبتة، نستخدم 'So + auxiliary verb + I'. (e.g., A: "I am tired." B: "So am I.")
- للموافقة على جملة منفية، نستخدم 'Neither/Nor + auxiliary verb + I'. (e.g., A: "I can't swim." B: "Neither can I.")
يمكن أيضًا استخدام 'Me too' (للمثبت) و 'Me neither' (للمنفي) في المحادثات غير الرسمية.`,
    examples: [
      { english: "A: I like ice-cream. B: So do I.", arabic: "أ: أنا أحب الآيس كريم. ب: وأنا كذلك." },
      { english: "A: I can't swim. B: Neither can I.", arabic: "أ: لا أستطيع السباحة. ب: ولا أنا كذلك." },
      { english: "A: I'm tired. B: So am I.", arabic: "أ: أنا متعب. ب: وأنا كذلك." },
      { english: "A: I don't like horror films. B: Neither do I.", arabic: "أ: لا أحب أفلام الرعب. ب: ولا أنا كذلك." },
      { english: "A: I went to the cinema yesterday. B: So did I.", arabic: "أ: ذهبت إلى السينما أمس. ب: وأنا كذلك." },
      { english: "A: I haven't finished my homework. B: Neither have I.", arabic: "أ: لم أنتهِ من واجبي. ب: ولا أنا كذلك." },
      { english: "A: I'm not hungry. B: Me neither.", arabic: "أ: أنا لست جائعًا. ب: ولا أنا." },
      { english: "A: I love this song! B: Me too!", arabic: "أ: أحب هذه الأغنية! ب: وأنا أيضًا!" },
      { english: "A: I won't be there. B: Neither will I.", arabic: "أ: لن أكون هناك. ب: ولا أنا سأكون." },
      { english: "A: She's a great singer. B: I agree.", arabic: "أ: هي مغنية رائعة. ب: أتفق معك." }
    ],
    mcqs: [
      { question: "A: 'I love chocolate.' B: '___'", options: ["So I do.", "So do I.", "Neither do I.", "I do so."], answer: "So do I." },
      { question: "A: 'I can't speak Russian.' B: '___'", options: ["So can I.", "So can't I.", "Neither can I.", "Neither I can."], answer: "Neither can I." },
      { question: "A: 'He was late.' B: '___'", options: ["So was I.", "So I was.", "Neither was I.", "I was so."], answer: "So was I." },
      { question: "A: 'They don't have a car.' B: '___'", options: ["So do we.", "We do too.", "Neither we do.", "Neither do we."], answer: "Neither do we." },
      { question: "A: 'I've seen that film.' B: '___'", options: ["So I have.", "So have I.", "Neither have I.", "I have so."], answer: "So have I." }
    ]
  },
  {
    title: "التعبير عن الكمية",
    explanation: `تُستخدم كلمات تحديد الكمية (Quantifiers) للتعبير عن كمية أو عدد شيء ما.
- مع الأسماء المعدودة (Countable nouns): 'many', 'a few', 'several'.
- مع الأسماء غير المعدودة (Uncountable nouns): 'much', 'a little'.
- مع كلا النوعين: 'a lot of', 'lots of', 'some', 'any', 'enough'.
'too' تعني 'أكثر من اللازم'. 'enough' تعني 'الكمية الكافية'.`,
    examples: [
      { english: "How much coffee do you drink?", arabic: "كم تشرب من القهوة؟" },
      { english: "That's too much!", arabic: "هذا كثير جدًا!" },
      { english: "How many brothers do you have?", arabic: "كم عدد الإخوة لديك؟" },
      { english: "I don't have much time.", arabic: "ليس لدي الكثير من الوقت." },
      { english: "There are a lot of people here.", arabic: "هناك الكثير من الناس هنا." },
      { english: "I only have a little money.", arabic: "لدي القليل من المال فقط." },
      { english: "She has a few close friends.", arabic: "لديها عدد قليل من الأصدقاء المقربين." },
      { english: "Is there enough food for everyone?", arabic: "هل هناك طعام كافٍ للجميع؟" },
      { english: "He eats too many sweets.", arabic: "يأكل الكثير من الحلويات." },
      { english: "We need some sugar.", arabic: "نحتاج بعض السكر." }
    ],
    mcqs: [
      { question: "How ___ water do you drink a day?", options: ["many", "much", "a lot of", "some"], answer: "much" },
      { question: "There are ___ people on the bus. It's crowded.", options: ["too much", "too many", "enough", "a little"], answer: "too many" },
      { question: "I can't buy it. I don't have ___ money.", options: ["many", "a few", "enough", "too"], answer: "enough" },
      { question: "She speaks ___ English.", options: ["a few", "many", "a little", "some of"], answer: "a little" },
      { question: "He has ___ books about history.", options: ["a lot of", "much", "a little", "any"], answer: "a lot of" }
    ]
  },
  {
    title: "اللغة الإنجليزية غير الرسمية",
    explanation: "اللغة غير الرسمية (Informal English) هي اللغة التي نستخدمها مع الأصدقاء والعائلة. تتميز باستخدام الاختصارات (wanna, gotta)، والتعابير العامية (What's up?, cool), وأسلوب أكثر استرخاءً من اللغة الرسمية المستخدمة في الكتابة الأكاديمية أو بيئة العمل.",
    examples: [
      { english: "What do you say we break for lunch?", arabic: "ما رأيك أن نأخذ استراحة للغداء؟" },
      { english: "What's up?", arabic: "ما الأخبار؟ / كيف حالك؟" },
      { english: "Hang on a sec!", arabic: "انتظر لحظة!" },
      { english: "I gotta go.", arabic: "يجب أن أذهب. (I have got to go)" },
      { english: "Wanna get a coffee?", arabic: "هل تريد أن نحصل على قهوة؟ (Want to)" },
      { english: "Gimme a break!", arabic: "أعطني استراحة! / ارحمني!" },
      { english: "He's a cool guy.", arabic: "إنه شخص رائع." },
      { english: "No worries.", arabic: "لا تقلق / لا بأس." },
      { english: "What have you been up to?", arabic: "ماذا كنت تفعل (مؤخرًا)؟" },
      { english: "I'm knackered.", arabic: "أنا متعب جدًا." }
    ],
    mcqs: [
      { question: "'Wanna' is a short form of:", options: ["Want a", "Want to", "What do", "What are"], answer: "Want to" },
      { question: "'What's up?' is a way to say:", options: ["Where are you going?", "Hello, how are you?", "What is that in the sky?", "I don't understand."], answer: "Hello, how are you?" },
      { question: "What does 'I'm knackered' mean?", options: ["I'm hungry.", "I'm very happy.", "I'm very tired.", "I'm angry."], answer: "I'm very tired." },
      { question: "'Gotta' is the informal version of:", options: ["Go to", "Get to", "Got to", "Going to"], answer: "Got to" },
      { question: "If a friend says 'No worries', they mean:", options: ["I am worried.", "Don't be worried.", "It's not a problem.", "Both B and C"], answer: "Both B and C" }
    ]
  },
  {
    title: "قول آسف",
    explanation: `هناك طرق مختلفة للاعتذار في اللغة الإنجليزية حسب الموقف ودرجة الرسمية.
- 'I'm sorry': الاعتذار العام والأكثر شيوعًا.
- 'Excuse me': تُستخدم للفت الانتباه بلطف، أو للمرور، أو قبل مقاطعة شخص ما.
- 'Pardon?' / 'Sorry?': لطلب تكرار شيء لم تسمعه جيدًا.
- 'I apologize': طريقة أكثر رسمية للاعتذار، تُستخدم غالبًا في الكتابة أو المواقف الرسمية.`,
    examples: [
      { english: "I'm so sorry! I didn't mean to do that.", arabic: "أنا آسف جدًا! لم أقصد فعل ذلك." },
      { english: "Excuse me, can I get past?", arabic: "عفوًا، هل يمكنني المرور؟" },
      { english: "I'm sorry for being late.", arabic: "أنا آسف على التأخير." },
      { english: "Pardon? I didn't hear what you said.", arabic: "عفوًا؟ لم أسمع ما قلته." },
      { english: "I apologize for my mistake.", arabic: "أعتذر عن خطئي." },
      { english: "Excuse me, do you have the time?", arabic: "عفوًا، هل لديك الوقت؟" },
      { english: "I'm really sorry to hear about your news.", arabic: "يؤسفني حقًا سماع أخبارك." },
      { english: "Oh, sorry! Was that your seat?", arabic: "أوه، آسف! هل كان هذا مقعدك؟" },
      { english: "I'm afraid I have some bad news.", arabic: "أخشى أن لدي بعض الأخبار السيئة." },
      { english: "Please forgive me.", arabic: "من فضلك سامحني." }
    ],
    mcqs: [
      { question: "To get someone's attention politely, you say:", options: ["Hey!", "Listen!", "Sorry!", "Excuse me!"], answer: "Excuse me!" },
      { question: "If you accidentally bump into someone, you say:", options: ["Pardon me.", "I'm sorry.", "Watch out.", "My fault."], answer: "I'm sorry." },
      { question: "If you didn't hear what someone said, you can say:", options: ["What?", "Say it again.", "Sorry?", "All of the above"], answer: "All of the above" },
      { question: "A more formal way to say sorry is:", options: ["My bad.", "Oops.", "I apologize.", "Sorry about that."], answer: "I apologize." },
      { question: "You say 'I'm sorry to hear that' when...", options: ["you receive bad news about someone.", "you make a mistake.", "you are late.", "you need help."], answer: "you receive bad news about someone." }
    ]
  },
  {
    title: "مراجعة: تصحيح الأخطاء (1)",
    explanation: "تحديد وتصحيح الأخطاء اللغوية الشائعة هو جزء مهم من عملية التعلم. يركز هذا الدرس على الأخطاء الأساسية في استخدام الأزمنة، وحروف الجر، وصيغ الأفعال، وترتيب الكلمات، والتي غالبًا ما يقع فيها المتعلمون في المراحل الأولى.",
    examples: [
      { english: "Incorrect: I am born in 1990. Correct: I was born in 1990.", arabic: "خطأ: أنا أولد في 1990. صحيح: أنا وُلدت في 1990." },
      { english: "Incorrect: He don't like fish. Correct: He doesn't like fish.", arabic: "خطأ: هو لا يحب السمك. صحيح: هو لا يحب السمك." },
      { english: "Incorrect: I have been to Paris last year. Correct: I went to Paris last year.", arabic: "خطأ: لقد كنت في باريس العام الماضي. صحيح: ذهبت إلى باريس العام الماضي." },
      { english: "Incorrect: She is more taller than me. Correct: She is taller than me.", arabic: "خطأ: هي أكثر أطول مني. صحيح: هي أطول مني." },
      { english: "Incorrect: We discussed about the problem. Correct: We discussed the problem.", arabic: "خطأ: ناقشنا حول المشكلة. صحيح: ناقشنا المشكلة." },
      { english: "Incorrect: I'm looking forward to see you. Correct: I'm looking forward to seeing you.", arabic: "خطأ: أتطلع لرؤيتك. صحيح: أتطلع لرؤيتك." },
      { english: "Incorrect: It depends of the weather. Correct: It depends on the weather.", arabic: "خطأ: يعتمد من الطقس. صحيح: يعتمد على الطقس." },
      { english: "Incorrect: My sister she is a doctor. Correct: My sister is a doctor.", arabic: "خطأ: أختي هي طبيبة. صحيح: أختي طبيبة." },
      { english: "Incorrect: I didn't see nobody. Correct: I didn't see anybody.", arabic: "خطأ: لم أر لا أحد. صحيح: لم أر أي أحد." },
      { english: "Incorrect: Where did you went? Correct: Where did you go?", arabic: "خطأ: أين ذهبت؟ صحيح: أين ذهبت؟" }
    ],
    mcqs: [
      { question: "Which sentence is correct?", options: ["He has 30 years.", "He is 30 years old.", "He is 30 years.", "Both B and C are correct."], answer: "He is 30 years old." },
      { question: "Correct the sentence: 'I'm agree with you.'", options: ["I'm agreed with you.", "I agreeing with you.", "I agree with you.", "I'm in agree with you."], answer: "I agree with you." },
      { question: "Which sentence is correct?", options: ["She gave to me a book.", "She gave me a book.", "She gave a book me.", "She me gave a book."], answer: "She gave me a book." },
      { question: "Correct the sentence: 'I've been here since three hours.'", options: ["...since three hours ago.", "...for three hours.", "...from three hours.", "Correct as is."], answer: "...for three hours." },
      { question: "Which sentence is correct?", options: ["Despite of the rain, we went out.", "Despite the rain, we went out.", "In despite of the rain, we went out.", "Despite it was raining, we went out."], answer: "Despite the rain, we went out." }
    ]
  },
  {
    title: "كتابة الرسائل ورسائل البريد الإلكتروني",
    explanation: "تختلف كتابة الرسائل الرسمية عن غير الرسمية في الأسلوب والمفردات والتحيات والخاتمة. من المهم معرفة الصيغ المناسبة لكل نوع. الرسائل الرسمية تتطلب لغة مهذبة ومحددة، بينما الرسائل غير الرسمية تكون أكثر استرخاءً وشخصية.",
    examples: [
      { english: "Informal greeting: Hi John, / Dear Mum,", arabic: "تحية غير رسمية: مرحبًا جون، / أمي العزيزة،" },
      { english: "Formal greeting: Dear Mr. Smith, / Dear Sir or Madam,", arabic: "تحية رسمية: عزيزي السيد سميث، / سيدي أو سيدتي العزيز/ة،" },
      { english: "Informal closing: Best wishes, / Lots of love,", arabic: "خاتمة غير رسمية: مع أطيب التمنيات، / مع كل الحب،" },
      { english: "Formal closing: Yours sincerely, / Yours faithfully,", arabic: "خاتمة رسمية: المخلص لك، / مع خالص التقدير،" },
      { english: "I'm writing to ask for some information.", arabic: "أكتب لطلب بعض المعلومات. (رسمي)" },
      { english: "Just a quick note to say thanks for the weekend.", arabic: "ملاحظة سريعة لأقول شكرًا على عطلة نهاية الأسبوع. (غير رسمي)" },
      { english: "I look forward to hearing from you.", arabic: "أتطلع إلى السماع منك. (رسمي)" },
      { english: "Hope to hear from you soon.", arabic: "آمل أن أسمع منك قريبًا. (غير رسمي)" },
      { english: "Please find attached my CV.", arabic: "تجدون سيرتي الذاتية مرفقة. (رسمي)" },
      { english: "Sorry for the delay in replying.", arabic: "آسف على التأخير في الرد. (غير رسمي)" }
    ],
    mcqs: [
      { question: "If you start a formal letter with 'Dear Sir or Madam,', you should end it with:", options: ["Yours sincerely,", "Yours faithfully,", "Best wishes,", "Regards,"], answer: "Yours faithfully," },
      { question: "Which is an informal greeting?", options: ["Dear Ms. Jones,", "To Whom It May Concern,", "Hey Sarah,", "Good morning,"], answer: "Hey Sarah," },
      { question: "In a formal email asking for a job, you would write:", options: ["Gimme a job.", "I wanna work for you.", "I am writing to apply for the position of...", "I want to apply for the job."], answer: "I am writing to apply for the position of..." },
      { question: "The abbreviation 'asap' means:", options: ["as soon as possible", "after school and practice", "at some appointed place", "always say a prayer"], answer: "as soon as possible" },
      { question: "If you know the name of the person you are writing to (e.g., Mr. Smith), you should end with:", options: ["Yours sincerely,", "Yours faithfully,", "Best regards,", "Love,"], answer: "Yours sincerely," }
    ]
  },
  {
    title: "كتابة قصة (1)",
    explanation: "تتطلب كتابة قصة جيدة (Narrative) استخدام أزمنة الماضي بشكل صحيح لترتيب الأحداث (الماضي البسيط، المستمر، التام). كما يجب استخدام كلمات الربط الزمني (e.g., first, then, after that, finally, suddenly) لجعل القصة متماسكة ومثيرة للاهتمام وواضحة للقارئ.",
    examples: [
      { english: "Once upon a time, there was an old king.", arabic: "في يوم من الأيام، كان هناك ملك عجوز." },
      { english: "It was a dark and stormy night.", arabic: "كانت ليلة مظلمة وعاصفة." },
      { english: "He was walking home when suddenly he heard a strange noise.", arabic: "كان يسير إلى المنزل عندما سمع فجأة ضوضاء غريبة." },
      { english: "First, he opened the door. Then, he turned on the light.", arabic: "أولاً، فتح الباب. ثم، أشعل الضوء." },
      { english: "She had never seen anything like it before.", arabic: "لم تر شيئًا كهذا من قبل." },
      { english: "After a while, they decided to leave.", arabic: "بعد فترة، قرروا المغادرة." },
      { english: "In the end, they all lived happily ever after.", arabic: "في النهاية، عاشوا جميعًا في سعادة وهناء." },
      { english: "The next morning, the sun was shining.", arabic: "في صباح اليوم التالي، كانت الشمس مشرقة." },
      { english: "He was tired because he had been working all day.", arabic: "كان متعبًا لأنه كان يعمل طوال اليوم." },
      { english: "To her surprise, the box was empty.", arabic: "لدهشتها، كان الصندوق فارغًا." }
    ],
    mcqs: [
      { question: "To set the scene of a story, you can use:", options: ["Past Continuous", "Present Simple", "Future Simple", "Present Perfect"], answer: "Past Continuous" },
      { question: "Which word indicates a sudden event?", options: ["Finally", "Meanwhile", "Suddenly", "After that"], answer: "Suddenly" },
      { question: "To talk about an action that happened before the main story, you use:", options: ["Past Simple", "Past Continuous", "Past Perfect", "Present Perfect"], answer: "Past Perfect" },
      { question: "A common way to start a fairy tale is:", options: ["To begin with,", "In the beginning,", "First of all,", "Once upon a time,"], answer: "Once upon a time," },
      { question: "To show the sequence of events, you can use words like:", options: ["First, then, finally", "Because, so, therefore", "Although, but, however", "Good, bad, interesting"], answer: "First, then, finally" }
    ]
  },
  {
    title: "كتابة موضوع (مع وضد)",
    explanation: `كتابة مقال يعرض وجهات نظر متعارضة (For and Against Essay) يتطلب بنية واضحة:
1.  المقدمة: قدم الموضوع بشكل عام دون إبداء رأيك.
2.  صلب الموضوع: فقرة (أو أكثر) للحجج المؤيدة (For)، وفقرة (أو أكثر) للحجج المعارضة (Against). استخدم كلمات ربط مثل 'On the one hand' و 'On the other hand'.
3.  الخاتمة: لخص النقاط الرئيسية وأعط رأيك الشخصي بوضوح.`,
    examples: [
      { english: "Introduction: Many people believe that... However, others argue that...", arabic: "مقدمة: يعتقد الكثير من الناس أن... ولكن، يجادل آخرون بأن..." },
      { english: "Argument for: On the one hand, one of the main advantages is...", arabic: "حجة مؤيدة: من ناحية، إحدى المزايا الرئيسية هي..." },
      { english: "Argument against: On the other hand, a significant disadvantage is...", arabic: "حجة معارضة: من ناحية أخرى، عيب كبير هو..." },
      { english: "Adding a point: Furthermore, / In addition, ...", arabic: "إضافة نقطة: علاوة على ذلك، / بالإضافة إلى ذلك، ..." },
      { english: "Giving an example: For example, / For instance, ...", arabic: "إعطاء مثال: على سبيل المثال، / مثلاً، ..." },
      { english: "Showing contrast: However, / Nevertheless, ...", arabic: "إظهار التباين: لكن، / مع ذلك، ..." },
      { english: "Conclusion: In conclusion, / To sum up, ...", arabic: "خاتمة: في الختام، / خلاصة القول، ..." },
      { english: "Expressing opinion: I personally believe that...", arabic: "التعبير عن الرأي: أنا شخصياً أعتقد أن..." },
      { english: "It is often said that living in a city has many benefits.", arabic: "كثيرا ما يقال أن العيش في مدينة له فوائد عديدة." },
      { english: "Despite the drawbacks, I feel that the advantages outweigh them.", arabic: "على الرغم من العيوب، أشعر أن المزايا تفوقها." }
    ],
    mcqs: [
      { question: "To introduce an opposing point, you can use:", options: ["Moreover", "In addition", "On the other hand", "For example"], answer: "On the other hand" },
      { question: "Which phrase is used to conclude an essay?", options: ["Firstly", "For instance", "In conclusion", "Another point is"], answer: "In conclusion" },
      { question: "To add another point to your argument, you can use:", options: ["However", "Furthermore", "In contrast", "Therefore"], answer: "Furthermore" },
      { question: "The first paragraph of a 'for and against' essay is the:", options: ["Conclusion", "Main body", "Introduction", "Summary"], answer: "Introduction" },
      { question: "Where should you usually state your own opinion?", options: ["In the introduction", "In the main body", "In the conclusion", "In every paragraph"], answer: "In the conclusion" }
    ]
  },
  {
    title: "كتابة حجز",
    explanation: "عند كتابة بريد إلكتروني أو رسالة لعمل حجز (فندق، مطعم، تذاكر)، يجب أن تكون واضحًا وموجزًا ومباشرًا. اذكر جميع المعلومات الأساسية التي يحتاجها الطرف الآخر لتأكيد الحجز، مثل نوع الحجز، التواريخ، عدد الأشخاص، وأي طلبات خاصة.",
    examples: [
      { english: "I would like to book a double room for two nights.", arabic: "أود حجز غرفة مزدوجة لليلتين." },
      { english: "I am writing to make a reservation.", arabic: "أكتب لعمل حجز." },
      { english: "We will be arriving on July 15th and departing on July 17th.", arabic: "سنصل في 15 يوليو ونغادر في 17 يوليو." },
      { english: "Could you please confirm the reservation and the price?", arabic: "هل يمكنك تأكيد الحجز والسعر من فضلك؟" },
      { english: "I would like to reserve a table for four people at 8 p.m.", arabic: "أود حجز طاولة لأربعة أشخاص في الساعة 8 مساءً." },
      { english: "Please let me know if this is possible.", arabic: "من فضلك أعلمني إذا كان هذا ممكنًا." },
      { english: "We require a room with a sea view.", arabic: "نحن نطلب غرفة تطل على البحر." },
      { english: "Is breakfast included in the price?", arabic: "هل الإفطار مشمول في السعر؟" },
      { english: "Thank you for your assistance.", arabic: "شكرًا لمساعدتك." },
      { english: "I look forward to your confirmation.", arabic: "أتطلع إلى تأكيدكم." }
    ],
    mcqs: [
      { question: "Which phrase is essential for a hotel booking?", options: ["The dates of your stay", "Your favourite food", "Your job", "Your hobbies"], answer: "The dates of your stay" },
      { question: "To ask the hotel to reply, you can write:", options: ["I want a room.", "You must reply.", "Could you please confirm the reservation?", "Is it a good hotel?"], answer: "Could you please confirm the reservation?" },
      { question: "A 'double room' is for:", options: ["One person", "Two people", "A family", "Three people"], answer: "Two people" },
      { question: "A formal way to start a reservation email is:", options: ["Hey,", "Gimme a room,", "Dear Sir/Madam,", "What's up,"], answer: "Dear Sir/Madam," },
      { question: "To make a special request, you can write:", options: ["We require...", "We want...", "Give us...", "We would like..."], answer: "We require..." }
    ]
  },
  {
    title: "كتابة وصف (1)",
    explanation: "الوصف الجيد لشخص أو مكان (Description) يستخدم صفات متنوعة وتفاصيل حسية (ما تراه، تسمعه، تشعر به) لخلق صورة حية في ذهن القارئ. حاول استخدام مفردات غنية وتجنب الكلمات العامة مثل 'good' أو 'nice'.",
    examples: [
      { english: "New York is a bustling, cosmopolitan city.", arabic: "نيويورك مدينة صاخبة وعالمية." },
      { english: "He was a tall, elderly man with a friendly smile.", arabic: "كان رجلاً طويلًا ومسنًا بابتسامة ودودة." },
      { english: "The town has many historic buildings and narrow, cobbled streets.", arabic: "تحتوي المدينة على العديد من المباني التاريخية والشوارع الضيقة المرصوفة بالحصى." },
      { english: "The food was fresh and delicious.", arabic: "كان الطعام طازجًا ولذيذًا." },
      { english: "She has long, dark hair and striking blue eyes.", arabic: "لديها شعر داكن طويل وعيون زرقاء لافتة للنظر." },
      { english: "The atmosphere in the café was warm and cozy.", arabic: "كان الجو في المقهى دافئًا ومريحًا." },
      { english: "It is a small, picturesque village in the mountains.", arabic: "إنها قرية صغيرة خلابة في الجبال." },
      { english: "The people were very welcoming and sociable.", arabic: "كان الناس مضيافين واجتماعيين للغاية." },
      { english: "The apartment was modern and spacious.", arabic: "كانت الشقة حديثة وواسعة." },
      { english: "He wore an old, worn-out coat.", arabic: "كان يرتدي معطفًا قديمًا وباليًا." }
    ],
    mcqs: [
      { question: "To describe a town, you can talk about its:", options: ["buildings", "atmosphere", "people", "All of the above"], answer: "All of the above" },
      { question: "Which word describes a person's character?", options: ["tall", "sociable", "blonde", "thin"], answer: "sociable" },
      { question: "To make a description more vivid, you should use:", options: ["many verbs", "adjectives and details", "only short sentences", "formal language"], answer: "adjectives and details" },
      { question: "The word 'bustling' means:", options: ["quiet and peaceful", "full of busy activity", "old and historic", "modern and clean"], answer: "full of busy activity" },
      { question: "A 'picturesque' village is:", options: ["polluted", "very pretty", "very large", "very boring"], answer: "very pretty" }
    ]
  },
  {
    title: "كتابة رسالة طلب وظيفة",
    explanation: `رسالة طلب الوظيفة (Letter of Application) هي رسالة رسمية يجب أن تكون احترافية ومقنعة. يجب أن تتضمن:
1.  مقدمة: اذكر الوظيفة التي تتقدم لها وأين رأيت الإعلان.
2.  صلب الموضوع: اشرح لماذا أنت مناسب للوظيفة، مع ربط مهاراتك وخبراتك (من سيرتك الذاتية) بمتطلبات الوظيفة.
3.  خاتمة: عبر عن اهتمامك، واذكر أنك متاح للمقابلة، وأنهِ الرسالة بشكل رسمي.`,
    examples: [
      { english: "I am writing to apply for the position of... advertised in...", arabic: "أكتب للتقدم لوظيفة... المعلن عنها في..." },
      { english: "As you can see from my enclosed CV, I have...", arabic: "كما ترون من سيرتي الذاتية المرفقة، لدي..." },
      { english: "I have two years of experience in this field.", arabic: "لدي خبرة سنتين في هذا المجال." },
      { english: "I consider myself to be a reliable and hardworking person.", arabic: "أعتبر نفسي شخصًا موثوقًا ومجتهدًا." },
      { english: "I am fluent in English and French.", arabic: "أنا أتحدث الإنجليزية والفرنسية بطلاقة." },
      { english: "I am available for an interview at your convenience.", arabic: "أنا متاح للمقابلة في الوقت الذي يناسبكم." },
      { english: "Thank you for your time and consideration.", arabic: "شكرًا على وقتكم واهتمامكم." },
      { english: "I look forward to hearing from you.", arabic: "أتطلع إلى السماع منكم." },
      { english: "My skills are an excellent match for this position.", arabic: "مهاراتي تتوافق بشكل ممتاز مع هذه الوظيفة." },
      { english: "Please do not hesitate to contact me if you require further information.", arabic: "من فضلكم لا تترددوا في الاتصال بي إذا احتجتم إلى مزيد من المعلومات." }
    ],
    mcqs: [
      { question: "What should you always include with a letter of application?", options: ["A photo", "Your CV/résumé", "A letter from your parents", "Your favorite book"], answer: "Your CV/résumé" },
      { question: "The tone of a letter of application should be:", options: ["Informal and friendly", "Formal and professional", "Funny and witty", "Sad and serious"], answer: "Formal and professional" },
      { question: "Which phrase is used to start the letter?", options: ["I want the job...", "Gimme the job...", "I am writing to apply for the position of...", "I need a job..."], answer: "I am writing to apply for the position of..." },
      { question: "To show you are ready for an interview, you can write:", options: ["I am available for an interview.", "You must interview me.", "When is the interview?", "I will come for an interview."], answer: "I am available for an interview." },
      { question: "A good way to end the letter is:", options: ["Bye!", "Cheers,", "Yours faithfully,", "See ya,"], answer: "Yours faithfully," }
    ]
  },
  {
    title: "كتابة قصة (2)",
    explanation: "تطوير مهارات السرد القصصي يتضمن ليس فقط سرد الأحداث، بل أيضًا بناء التشويق (suspense)، ووصف مشاعر الشخصيات (feelings)، واستخدام الحوار (dialogue) لجعل القصة أكثر حيوية وواقعية وإشراكًا للقارئ.",
    examples: [
      { english: "His heart was pounding in his chest.", arabic: "كان قلبه يخفق في صدره." },
      { english: "'What was that?' she whispered.", arabic: "'ما هذا؟' همست." },
      { english: "He couldn't believe his eyes.", arabic: "لم يستطع أن يصدق عينيه." },
      { english: "A feeling of dread washed over him.", arabic: "اجتاحه شعور بالرهبة." },
      { english: "Without thinking, he started to run.", arabic: "بدون تفكير، بدأ يركض." },
      { english: "She held her breath, listening intently.", arabic: "حبست أنفاسها، تستمع باهتمام." },
      { english: "'Don't move,' he said in a low voice.", arabic: "'لا تتحرك،' قال بصوت منخفض." },
      { english: "Tears of relief streamed down her face.", arabic: "انهمرت دموع الارتياح على وجهها." },
      { english: "It all happened so fast.", arabic: "حدث كل شيء بسرعة كبيرة." },
      { english: "He knew he would never forget that day.", arabic: "كان يعلم أنه لن ينسى ذلك اليوم أبدًا." }
    ],
    mcqs: [
      { question: "To show a character is scared, you can write:", options: ["He was happy.", "He was laughing.", "His heart was pounding.", "He was calm."], answer: "His heart was pounding." },
      { question: "What is 'dialogue' in a story?", options: ["The description of the place.", "The characters' thoughts.", "What the characters say.", "The final part of the story."], answer: "What the characters say." },
      { question: "To build suspense, you might use:", options: ["Long, descriptive sentences.", "Short, dramatic sentences.", "Funny jokes.", "A happy ending."], answer: "Short, dramatic sentences." },
      { question: "The word 'whispered' means:", options: ["spoke very loudly", "spoke very quietly", "spoke very quickly", "spoke very angrily"], answer: "spoke very quietly" },
      { question: "Which sentence shows a character's strong emotion?", options: ["He walked down the street.", "He looked at his watch.", "Tears streamed down her face.", "He opened the door."], answer: "Tears streamed down her face." }
    ]
  },
  {
    title: "كتابة وصف (2)",
    explanation: "الوصف المتقدم لا يقتصر على المظهر الخارجي، بل يشمل أيضًا الشخصية، العادات، والمشاعر. استخدام المقارنات (comparisons) والتشبيهات (similes) يمكن أن يجعل الوصف أقوى وأكثر تأثيرًا ولا يُنسى.",
    examples: [
      { english: "He has a very cheerful personality.", arabic: "لديه شخصية مرحة جدًا." },
      { english: "She is as brave as a lion.", arabic: "هي شجاعة كالأسد." },
      { english: "He has a quirky sense of humor.", arabic: "لديه حس فكاهة غريب." },
      { english: "The old house looked sad and neglected.", arabic: "بدا المنزل القديم حزينًا ومهملًا." },
      { english: "She was always tapping her fingers on the table, a sign of her impatience.", arabic: "كانت دائمًا تنقر بأصابعها على الطاولة، علامة على نفاد صبرها." },
      { english: "His smile could light up a room.", arabic: "ابتسامته يمكن أن تضيء غرفة." },
      { english: "He is a very reliable and easygoing person.", arabic: "هو شخص موثوق جدًا وسهل المعشر." },
      { english: "The city has a vibrant and energetic atmosphere.", arabic: "المدينة لها جو نابض بالحياة ومليء بالطاقة." },
      { english: "She was known for her generosity and kindness.", arabic: "كانت معروفة بكرمها ولطفها." },
      { english: "The painting was a chaotic mix of bright colors.", arabic: "كانت اللوحة مزيجًا فوضويًا من الألوان الزاهية." }
    ],
    mcqs: [
      { question: "The phrase 'as brave as a lion' is an example of a:", options: ["metaphor", "simile", "personification", "adjective"], answer: "simile" },
      { question: "To describe someone's habits, you can talk about:", options: ["their height", "what they often do", "their eye color", "their age"], answer: "what they often do" },
      { question: "'Easygoing' describes someone who is:", options: ["relaxed and not easily upset", "often angry", "very serious", "not friendly"], answer: "relaxed and not easily upset" },
      { question: "'Vibrant' means:", options: ["dull and boring", "full of energy and life", "quiet and calm", "old and traditional"], answer: "full of energy and life" },
      { question: "Which of the following is NOT a personality adjective?", options: ["sociable", "reliable", "tall", "cheerful"], answer: "tall" }
    ]
  },
  {
    title: "كتابة سيرة ذاتية",
    explanation: `كتابة سيرة ذاتية (Biography) لشخص ما تتطلب البحث وجمع المعلومات عن حياته، ثم تنظيمها بأسلوب قصصي بترتيب زمني. يجب أن تكون الكتابة موضوعية وتستند إلى حقائق، وتغطي المراحل الرئيسية في حياة الشخص:
- الولادة والنشأة (Birth and early life)
- التعليم والمسيرة المهنية (Education and career)
- الإنجازات الهامة (Major achievements)
- الحياة الشخصية (Personal life)
- السنوات الأخيرة والوفاة (Later years and death)`,
    examples: [
      { english: "Pablo Picasso was born in Málaga, Spain, in 1881.", arabic: "ولد بابلو بيكاسو في مالقة، إسبانيا، عام 1881." },
      { english: "He showed artistic talent from a very young age.", arabic: "أظهر موهبة فنية منذ سن مبكرة جدًا." },
      { english: "He graduated in 1917, but he didn't go to college.", arabic: "تخرج عام 1917، لكنه لم يذهب إلى الكلية." },
      { english: "In 1937, he painted his masterpiece, Guernica.", arabic: "في عام 1937، رسم تحفته الفنية، غيرنيكا." },
      { english: "He was awarded the Nobel Prize for literature in 1954.", arabic: "مُنح جائزة نوبل في الأدب عام 1954." },
      { english: "Throughout his life, he married four times.", arabic: "تزوج أربع مرات طوال حياته." },
      { english: "His work had a major influence on 20th-century art.", arabic: "كان لعمله تأثير كبير على فن القرن العشرين." },
      { english: "He suffered from depression in his later years.", arabic: "عانى من الاكتئاب في سنواته الأخيرة." },
      { english: "He died of heart failure in 1973.", arabic: "توفي بسبب قصور في القلب عام 1973." },
      { english: "His legacy continues to inspire artists around the world.", arabic: "إرثه لا يزال يلهم الفنانين في جميع أنحاء العالم." }
    ],
    mcqs: [
      { question: "A biography is a story of:", options: ["a fictional character", "a real person's life", "a scientific discovery", "a country's history"], answer: "a real person's life" },
      { question: "Biographies are usually written in:", options: ["chronological order", "reverse order", "random order", "order of importance"], answer: "chronological order" },
      { question: "The information in a biography should be based on:", options: ["rumors and gossip", "the writer's imagination", "facts and research", "the writer's opinion"], answer: "facts and research" },
      { question: "What is a 'masterpiece'?", options: ["An early work", "A famous failure", "An artist's greatest work", "A copy of a work"], answer: "An artist's greatest work" },
      { question: "The word 'legacy' refers to:", options: ["someone's children", "something left behind after death", "a person's final illness", "a person's house"], answer: "something left behind after death" }
    ]
  },
  {
    title: "كلمات ربط الأفكار",
    explanation: `كلمات الربط (Linking words and phrases) ضرورية لجعل الكتابة أكثر سلاسة ومنطقية. هي تربط الجمل والأفكار معًا لتوضح العلاقة بينها.
- للسبب (Reason): because, since
- للنتيجة (Result): so, therefore
- للتناقض (Contrast): but, however, although
- للإضافة (Addition): and, in addition, furthermore`,
    examples: [
      { english: "I was tired, so I went to bed early.", arabic: "كنت متعبًا، لذلك ذهبت إلى الفراش مبكرًا." },
      { english: "He is rich, but he is not happy.", arabic: "هو غني، لكنه ليس سعيدًا." },
      { english: "She stayed at home because she was sick.", arabic: "بقيت في المنزل لأنها كانت مريضة." },
      { english: "Although it was raining, we went for a walk.", arabic: "على الرغم من أنها كانت تمطر، ذهبنا في نزهة." },
      { english: "I like both tea and coffee.", arabic: "أنا أحب الشاي والقهوة." },
      { english: "He studied hard; therefore, he passed the exam.", arabic: "لقد درس بجد؛ لذلك، نجح في الامتحان." },
      { english: "In addition to his salary, he receives a bonus.", arabic: "بالإضافة إلى راتبه، يحصل على مكافأة." },
      { english: "I'll call you when I get home.", arabic: "سأتصل بك عندما أصل إلى المنزل." },
      { english: "She is not only intelligent but also very kind.", arabic: "هي ليست ذكية فحسب، بل لطيفة جدًا أيضًا." },
      { english: "We can go to the cinema or we can stay home.", arabic: "يمكننا الذهاب إلى السينما أو يمكننا البقاء في المنزل." }
    ],
    mcqs: [
      { question: "Which word shows a reason?", options: ["so", "but", "because", "and"], answer: "because" },
      { question: "Which word shows a result?", options: ["because", "so", "although", "or"], answer: "so" },
      { question: "Which word shows a contrast?", options: ["and", "so", "because", "but"], answer: "but" },
      { question: "Complete the sentence: ___ he is very old, he is very active.", options: ["Because", "So", "Although", "And"], answer: "Although" },
      { question: "I was hungry, ___ I made a sandwich.", options: ["but", "because", "so", "although"], answer: "so" }
    ]
  },
  {
    title: "مراجعة: تصحيح الأخطاء (2)",
    explanation: "هذا الدرس هو مراجعة متقدمة تركز على الأخطاء الدقيقة في اللغة الإنجليزية، مثل استخدام الصفات المنتهية بـ -ed/-ing، والمقارنات، والأسماء المعدودة وغير المعدودة، وحروف الجر، وغيرها من القواعد التي غالبًا ما تكون صعبة على المتعلمين وتتطلب انتباهًا للتفاصيل.",
    examples: [
      { english: "Incorrect: I'm very interesting in history. Correct: I'm very interested in history.", arabic: "خطأ: أنا مثير جدًا في التاريخ. صحيح: أنا مهتم جدًا بالتاريخ." },
      { english: "Incorrect: It was a such good movie. Correct: It was such a good movie.", arabic: "خطأ: كان فيلم جيد كهذا. صحيح: كان فيلمًا جيدًا كهذا." },
      { english: "Incorrect: I'm used to get up early. Correct: I'm used to getting up early.", arabic: "خطأ: أنا معتاد على الاستيقاظ مبكرًا. صحيح: أنا معتاد على الاستيقاظ مبكرًا." },
      { english: "Incorrect: She asked me where am I from. Correct: She asked me where I am from.", arabic: "خطأ: سألتني أين أنا من. صحيح: سألتني من أين أنا." },
      { english: "Incorrect: There is less people than yesterday. Correct: There are fewer people than yesterday.", arabic: "خطأ: هناك أقل من الناس من أمس. صحيح: هناك عدد أقل من الناس من أمس." },
      { english: "Incorrect: Everyone are happy. Correct: Everyone is happy.", arabic: "خطأ: الجميع سعداء. صحيح: الجميع سعيد." },
      { english: "Incorrect: I suggest to go to the cinema. Correct: I suggest going to the cinema.", arabic: "خطأ: أقترح الذهاب إلى السينما. صحيح: أقترح الذهاب إلى السينما." },
      { english: "Incorrect: He is married with a doctor. Correct: He is married to a doctor.", arabic: "خطأ: هو متزوج مع طبيبة. صحيح: هو متزوج من طبيبة." },
      { english: "Incorrect: I went to the bed late. Correct: I went to bed late.", arabic: "خطأ: ذهبت إلى السرير متأخرًا. صحيح: ذهبت إلى الفراش متأخرًا." },
      { english: "Incorrect: This is the man which I met. Correct: This is the man who I met.", arabic: "خطأ: هذا هو الرجل الذي قابلته. صحيح: هذا هو الرجل الذي قابلته." }
    ],
    mcqs: [
      { question: "Which sentence is correct?", options: ["The police is coming.", "The police are coming.", "The polices are coming.", "The police am coming."], answer: "The police are coming." },
      { question: "Correct the sentence: 'I have a good news for you.'", options: ["I have a good new for you.", "I have good news for you.", "I have good new for you.", "I have some good new."], answer: "I have good news for you." },
      { question: "Which is correct?", options: ["a advice", "an advice", "some advice", "advices"], answer: "some advice" },
      { question: "She's good ___ playing tennis.", options: ["in", "on", "at", "for"], answer: "at" },
      { question: "I've been waiting ___ 2 o'clock.", options: ["for", "since", "at", "from"], answer: "since" }
    ]
  },
  {
    title: "مفردات: أجزاء الكلام والمعنى",
    explanation: "فهم أجزاء الكلام (Parts of Speech) - مثل الاسم (noun)، والفعل (verb)، والصفة (adjective)، والحال (adverb) - يساعد على تحديد معنى الكلمات من سياق الجملة، حتى لو كانت الكلمة غير معروفة. بنية الجملة وموقع الكلمة يعطيان أدلة قوية على وظيفتها.",
    examples: [
      { english: "He ate his (noun) loudly.", arabic: "أكل (اسمه) بصوت عالٍ." },
      { english: "I (verb) on the ice.", arabic: "أنا (فعل) على الجليد." },
      { english: "They fell (adverb) in love.", arabic: "وقعوا (حال) في الحب." },
      { english: "It was an (adjective) day.", arabic: "كان يومًا (صفة)." },
      { english: "She spoke with great (noun).", arabic: "تحدثت بـ (اسم) عظيم." },
      { english: "He runs very (adverb).", arabic: "يركض (حال) جدًا." },
      { english: "The sky is very (adjective).", arabic: "السماء (صفة) جدًا." },
      { english: "The cat (verb) quietly.", arabic: "القطة (فعل) بهدوء." },
      { english: "This is a beautiful (noun).", arabic: "هذا (اسم) جميل." },
      { english: "I need to (verb) this problem.", arabic: "أحتاج إلى (فعل) هذه المشكلة." }
    ],
    mcqs: [
      { question: "In 'a beautiful car', 'beautiful' is a(n):", options: ["noun", "verb", "adjective", "adverb"], answer: "adjective" },
      { question: "In 'He speaks slowly', 'slowly' is a(n):", options: ["noun", "verb", "adjective", "adverb"], answer: "adverb" },
      { question: "The word 'happiness' is a(n):", options: ["noun", "verb", "adjective", "adverb"], answer: "noun" },
      { question: "In 'Please decide quickly', 'decide' is a(n):", options: ["noun", "verb", "adjective", "adverb"], answer: "verb" },
      { question: "A word that describes a noun is a(n):", options: ["noun", "verb", "adjective", "adverb"], answer: "adjective" }
    ]
  },
  {
    title: "مفردات: الهجاء والنطق",
    explanation: "الهجاء في اللغة الإنجليزية ليس دائمًا متسقًا مع النطق، مما يمثل تحديًا. هذا الدرس يركز على مجموعات الكلمات التي لها أصوات متشابهة ولكن هجاء مختلف (homophones)، والكلمات التي لها هجاء متشابه ونطق مختلف، لمساعدتك على تحسين النطق والإملاء.",
    examples: [
      { english: "good / food / wood / stood (food is different)", arabic: "good / food / wood / stood (food مختلفة)" },
      { english: "bread / head / read (present) / read (past) (read-present is different)", arabic: "bread / head / read (present) / read (past) (read-present مختلفة)" },
      { english: "paid / made / played / said (said is different)", arabic: "paid / made / played / said (said مختلفة)" },
      { english: "done / phone / sun / won (phone is different)", arabic: "done / phone / sun / won (phone مختلفة)" },
      { english: "dear / hear / bear / near (bear is different)", arabic: "dear / hear / bear / near (bear مختلفة)" },
      { english: "work / fork / walk / pork (work is different)", arabic: "work / fork / walk / pork (work مختلفة)" },
      { english: "Though, through, tough, thought - all have different pronunciations.", arabic: "Though, through, tough, thought - كلها لها نطق مختلف." },
      { english: "The words 'see' and 'sea' sound the same.", arabic: "كلمتا 'see' و 'sea' لهما نفس النطق." },
      { english: "The words 'write' and 'right' sound the same.", arabic: "كلمتا 'write' و 'right' لهما نفس النطق." },
      { english: "The 'gh' in 'enough' is pronounced like 'f'.", arabic: "حرفا 'gh' في 'enough' ينطقان مثل 'f'." }
    ],
    mcqs: [
      { question: "Which word does not rhyme with '-ight'?", options: ["light", "right", "fight", "weight"], answer: "weight" },
      { question: "The 'ea' in 'bread' sounds like the 'ea' in:", options: ["meat", "head", "leaf", "speak"], answer: "head" },
      { question: "Which word has a silent 'k'?", options: ["king", "keep", "kick", "know"], answer: "know" },
      { question: "Which word rhymes with 'blue'?", options: ["show", "low", "through", "now"], answer: "through" },
      { question: "The 'o' in 'come' sounds like the 'o' in:", options: ["home", "some", "go", "so"], answer: "some" }
    ]
  },
  {
    title: "مفردات: تكوين الكلمات",
    explanation: "يمكن تكوين كلمات جديدة في اللغة الإنجليزية عن طريق إضافة بادئات (prefixes) مثل 'un-', 'im-', 'dis-' لتغيير المعنى (غالبًا إلى العكس)، أو لواحق (suffixes) مثل '-ness', '-ion', '-able' لتغيير نوع الكلمة (من فعل إلى اسم، أو من اسم إلى صفة).",
    examples: [
      { english: "act (verb) -> actor (noun), action (noun), active (adjective)", arabic: "act (فعل) -> actor (اسم), action (اسم), active (صفة)" },
      { english: "happy (adjective) -> unhappy (adjective), happiness (noun)", arabic: "happy (صفة) -> unhappy (صفة), happiness (اسم)" },
      { english: "employ (verb) -> employer (noun), employee (noun), unemployment (noun)", arabic: "employ (فعل) -> employer (اسم), employee (اسم), unemployment (اسم)" },
      { english: "comfort (noun) -> comfortable (adjective), uncomfortable (adjective)", arabic: "comfort (اسم) -> comfortable (صفة), uncomfortable (صفة)" },
      { english: "possible (adjective) -> impossible (adjective)", arabic: "possible (صفة) -> impossible (صفة)" },
      { english: "friend (noun) -> friendly (adjective), friendship (noun)", arabic: "friend (اسم) -> friendly (صفة), friendship (اسم)" },
      { english: "connect (verb) -> disconnect (verb), connection (noun)", arabic: "connect (فعل) -> disconnect (فعل), connection (اسم)" },
      { english: "danger (noun) -> dangerous (adjective)", arabic: "danger (اسم) -> dangerous (صفة)" },
      { english: "music (noun) -> musical (adjective), musician (noun)", arabic: "music (اسم) -> musical (صفة), musician (اسم)" },
      { english: "hope (verb) -> hopeful (adjective), hopeless (adjective)", arabic: "hope (فعل) -> hopeful (صفة), hopeless (صفة)" }
    ],
    mcqs: [
      { question: "The suffix '-ness' often turns an adjective into a(n):", options: ["verb", "adverb", "noun", "adjective"], answer: "noun" },
      { question: "What is the opposite of 'possible'?", options: ["unpossible", "dispossible", "impossible", "inpossible"], answer: "impossible" },
      { question: "A person who plays the piano is a:", options: ["pianist", "pianoer", "pianor", "pianoist"], answer: "pianist" },
      { question: "The noun form of the verb 'decide' is:", options: ["decidement", "decidation", "decision", "decidance"], answer: "decision" },
      { question: "The adjective form of 'beauty' is:", options: ["beautious", "beautific", "beautiful", "beautified"], answer: "beautiful" }
    ]
  },
  {
    title: "مفردات: الكلمات المتلازمة (Collocations)",
    explanation: "المتلازمات اللفظية (Collocations) هي كلمات غالبًا ما تأتي معًا بشكل طبيعي في اللغة. تعلم هذه المتلازمات يجعل لغتك تبدو أكثر طلاقة وأصالة، ويساعدك على تجنب تركيبات الكلمات غير الطبيعية. على سبيل المثال، نقول 'make a mistake' وليس 'do a mistake'.",
    examples: [
      { english: "strong coffee", arabic: "قهوة قوية" },
      { english: "full-time job", arabic: "وظيفة بدوام كامل" },
      { english: "film star", arabic: "نجم سينمائي" },
      { english: "drive carefully", arabic: "قُدْ بحذر" },
      { english: "fall in love", arabic: "يقع في الحب" },
      { english: "make a mistake", arabic: "يرتكب خطأ" },
      { english: "do your homework", arabic: "تقوم بواجبك" },
      { english: "take a photo", arabic: "يلتقط صورة" },
      { english: "have a good time", arabic: "يقضي وقتا ممتعا" },
      { english: "fast food", arabic: "طعام سريع" }
    ],
    mcqs: [
      { question: "Which verb goes with 'a mistake'?", options: ["do", "make", "take", "have"], answer: "make" },
      { question: "Which adjective goes with 'rain'?", options: ["strong", "heavy", "big", "powerful"], answer: "heavy" },
      { question: "You ___ a shower.", options: ["do", "make", "take", "get"], answer: "take" },
      { question: "Which verb goes with 'a party'?", options: ["make", "do", "have", "take"], answer: "have" },
      { question: "Which word correctly completes the phrase: 'to ___ a promise'?", options: ["do", "say", "make", "take"], answer: "make" }
    ]
  },
  {
    title: "مفردات: الرياضة والترفيه",
    explanation: `يتم استخدام أفعال مختلفة مع الأنشطة الرياضية والترفيهية.
- 'play': للرياضات التي بها كرة وألعاب المنافسة (football, chess).
- 'go': للأنشطة التي تنتهي بـ '-ing' (skiing, jogging, swimming).
- 'do': للفنون القتالية، التمارين، والأنشطة الفردية غير التنافسية (judo, aerobics, yoga).`,
    examples: [
      { english: "play football / volleyball / tennis", arabic: "يلعب كرة القدم / الكرة الطائرة / التنس" },
      { english: "go skiing / snowboarding / fishing", arabic: "يذهب للتزلج / التزلج على الجليد / صيد السمك" },
      { english: "do aerobics / yoga / martial arts", arabic: "يمارس التمارين الرياضية / اليوغا / الفنون القتالية" },
      { english: "play chess / cards", arabic: "يلعب الشطرنج / الورق" },
      { english: "go jogging / swimming", arabic: "يذهب للركض / السباحة" },
      { english: "do gymnastics / judo", arabic: "يمارس الجمباز / الجودو" },
      { english: "play basketball / golf", arabic: "يلعب كرة السلة / الجولف" },
      { english: "go mountain biking / hiking", arabic: "يذهب لركوب الدراجات الجبلية / المشي لمسافات طويلة" },
      { english: "do ballet / karate", arabic: "يمارس الباليه / الكاراتيه" },
      { english: "play the piano / the guitar", arabic: "يعزف على البيانو / الجيتار" }
    ],
    mcqs: [
      { question: "Which verb do you use with 'judo'?", options: ["play", "go", "do", "make"], answer: "do" },
      { question: "Which verb do you use with 'cycling'?", options: ["play", "go", "do", "ride"], answer: "go" },
      { question: "Which verb do you use with 'baseball'?", options: ["play", "go", "do", "have"], answer: "play" },
      { question: "Complete the sentence: I like to ___ yoga in the morning.", options: ["play", "go", "do", "take"], answer: "do" },
      { question: "Complete the sentence: Let's ___ swimming this afternoon.", options: ["play", "go", "do", "make"], answer: "go" }
    ]
  },
  {
    title: "مفردات: الفن والأدب",
    explanation: "يغطي هذا الدرس المفردات الأساسية المتعلقة بمجالات الفنون والأدب، بما في ذلك أسماء المبدعين (painter, poet, novelist)، وأنواع الأعمال الفنية والأدبية (picture, poem, novel)، والأماكن ذات الصلة (art gallery, exhibition).",
    examples: [
      { english: "A painter paints pictures.", arabic: "الرسام يرسم لوحات." },
      { english: "A poet writes poems.", arabic: "الشاعر يكتب قصائد." },
      { english: "A novelist writes novels.", arabic: "الروائي يكتب روايات." },
      { english: "An author writes books.", arabic: "المؤلف يكتب كتبًا." },
      { english: "We went to an exhibition at the art gallery.", arabic: "ذهبنا إلى معرض في المعرض الفني." },
      { english: "A biography is a book about someone's life.", arabic: "السيرة الذاتية هي كتاب عن حياة شخص ما." },
      { english: "Guernica is a masterpiece by Picasso.", arabic: "غيرنيكا هي تحفة فنية لبيكاسو." },
      { english: "I'm reading the first chapter of his new novel.", arabic: "أقرأ الفصل الأول من روايته الجديدة." },
      { english: "The play has three acts.", arabic: "المسرحية لها ثلاثة فصول." },
      { english: "This statue is a beautiful sculpture.", arabic: "هذا التمثال هو منحوتة جميلة." }
    ],
    mcqs: [
      { question: "A person who writes novels is called a(n):", options: ["poet", "author", "novelist", "painter"], answer: "novelist" },
      { question: "A place where you see paintings is an:", options: ["art gallery", "library", "cinema", "theatre"], answer: "art gallery" },
      { question: "A book about a person's life is a:", options: ["novel", "poem", "biography", "fairy tale"], answer: "biography" },
      { question: "Shakespeare was a famous...", options: ["painter and sculptor", "playwright and poet", "novelist and musician", "actor and director"], answer: "playwright and poet" },
      { question: "A single part of a play is called an:", options: ["act", "chapter", "verse", "scene"], answer: "act" }
    ]
  },
  {
    title: "مفردات: كلمات الجنسية",
    explanation: "هذا الدرس يوضح كيفية تكوين الكلمات المتعلقة بالدول، الجنسيات، واللغات. لاحظ أن جميع هذه الكلمات تبدأ بحرف كبير في اللغة الإنجليزية. هناك أنماط مختلفة لتكوين هذه الكلمات (مثل إضافة -an, -ese, -ish) وبعضها شاذ.",
    examples: [
      { english: "Country: Japan -> Adjective: Japanese -> People: the Japanese", arabic: "الدولة: اليابان -> الصفة: ياباني -> الشعب: اليابانيون" },
      { english: "Country: Spain -> Adjective: Spanish -> People: the Spanish", arabic: "الدولة: إسبانيا -> الصفة: إسباني -> الشعب: الإسبان" },
      { english: "Country: France -> Adjective: French -> People: the French", arabic: "الدولة: فرنسا -> الصفة: فرنسي -> الشعب: الفرنسيون" },
      { english: "Country: Italy -> People: Italians", arabic: "الدولة: إيطاليا -> الشعب: الإيطاليون" },
      { english: "Country: Germany -> Adjective: German", arabic: "الدولة: ألمانيا -> الصفة: ألماني" },
      { english: "Country: China -> Adjective: Chinese", arabic: "الدولة: الصين -> الصفة: صيني" },
      { english: "Country: Britain -> Adjective: British", arabic: "الدولة: بريطانيا -> الصفة: بريطاني" },
      { english: "Country: Russia -> Adjective: Russian", arabic: "الدولة: روسيا -> الصفة: روسي" },
      { english: "Country: Brazil -> People: Brazilians", arabic: "الدولة: البرازيل -> الشعب: البرازيليون" },
      { english: "Country: Greece -> People: Greeks", arabic: "الدولة: اليونان -> الشعب: اليونانيون" }
    ],
    mcqs: [
      { question: "A person from Portugal is:", options: ["Portugalish", "Portugalian", "Portuguese", "Portugee"], answer: "Portuguese" },
      { question: "The language spoken in Egypt is:", options: ["Egyptish", "Egypterian", "Egyptian", "Arabic"], answer: "Arabic" },
      { question: "If you are from the Netherlands, you are:", options: ["Netherlish", "Dutch", "Netherlander", "Hollandic"], answer: "Dutch" },
      { question: "The adjective for Switzerland is:", options: ["Switzer", "Swiss", "Switzerlandish", "Swess"], answer: "Swiss" },
      { question: "People from Poland are called:", options: ["Polanese", "Polish", "Poles", "Both B and C"], answer: "Both B and C" }
    ]
  },
  {
    title: "مفردات: الطقس",
    explanation: "يغطي هذا الدرس المفردات الأساسية لوصف الطقس. من المهم معرفة الفرق بين الاسم (rain)، والصفة (rainy)، والفعل (to rain). تعلم هذه المفردات يمكنك من فهم نشرات الطقس والمشاركة في المحادثات اليومية عن الطقس.",
    examples: [
      { english: "It's sunny.", arabic: "الجو مشمس." },
      { english: "There is a lot of sunshine.", arabic: "هناك الكثير من أشعة الشمس." },
      { english: "The sun's shining.", arabic: "الشمس مشرقة." },
      { english: "It's cloudy.", arabic: "الجو غائم." },
      { english: "It's windy.", arabic: "الجو عاصف." },
      { english: "The wind's blowing.", arabic: "الرياح تهب." },
      { english: "It's raining.", arabic: "إنها تمطر." },
      { english: "It's foggy.", arabic: "الجو ضبابي." },
      { english: "It's snowing.", arabic: "إنها تثلج." },
      { english: "There might be a thunderstorm later.", arabic: "قد تكون هناك عاصفة رعدية لاحقًا." }
    ],
    mcqs: [
      { question: "What do you call frozen rain?", options: ["ice", "snow", "fog", "sleet"], answer: "snow" },
      { question: "The adjective for 'wind' is:", options: ["windy", "winded", "wond", "windful"], answer: "windy" },
      { question: "The noun for the adjective 'cloudy' is:", options: ["clouding", "cloudful", "cloud", "clouds"], answer: "cloud" },
      { question: "When it's very cold, the temperature is...", options: ["boiling", "hot", "mild", "freezing"], answer: "freezing" },
      { question: "A period with no rain is called a:", options: ["flood", "drought", "storm", "hurricane"], answer: "drought" }
    ]
  },
  {
    title: "مفردات: وصف الطعام والمدن والناس",
    explanation: "استخدام الصفات المناسبة أمر ضروري لوصف الأشياء بدقة وجعل لغتك أكثر تعبيرًا. يركز هذا الدرس على الصفات الشائعة لوصف الطعام (e.g., fresh, tasteless, delicious)، والمدن (e.g., historic, polluted, cosmopolitan)، والناس (e.g., sociable, elderly, sophisticated).",
    examples: [
      { english: "fresh food / polluted town / sophisticated people", arabic: "طعام طازج / مدينة ملوثة / أناس راقون" },
      { english: "historic towns / elderly people", arabic: "مدن تاريخية / كبار السن" },
      { english: "The pizza was delicious.", arabic: "كانت البيتزا لذيذة." },
      { english: "New York is a cosmopolitan city.", arabic: "نيويورك مدينة عالمية." },
      { english: "He is a very wealthy and outgoing person.", arabic: "هو شخص ثري ومنفتح جدًا." },
      { english: "I don't like tasteless food.", arabic: "لا أحب الطعام الذي لا طعم له." },
      { english: "London is a busy, crowded city.", arabic: "لندن مدينة مزدحمة ومكتظة." },
      { english: "She is very shy and doesn't talk much.", arabic: "هي خجولة جدًا ولا تتحدث كثيرًا." },
      { english: "This coffee is too bitter.", arabic: "هذه القهوة مرة جدًا." },
      { english: "My hometown is a small, quiet place.", arabic: "مسقط رأسي مكان صغير وهادئ." }
    ],
    mcqs: [
      { question: "A 'cosmopolitan' city is:", options: ["small and quiet", "full of people from different countries", "very old", "very polluted"], answer: "full of people from different countries" },
      { question: "The opposite of 'delicious' is:", options: ["tasty", "sweet", "disgusting", "fresh"], answer: "disgusting" },
      { question: "An 'outgoing' person is:", options: ["shy", "quiet", "friendly and sociable", "unhappy"], answer: "friendly and sociable" },
      { question: "A 'historic' building is:", options: ["new and modern", "very big", "very old and important", "ugly"], answer: "very old and important" },
      { question: "Food that has no flavour is:", options: ["spicy", "sour", "tasteless", "salty"], answer: "tasteless" }
    ]
  },
  {
    title: "مفردات: الصفات الأساسية والقوية",
    explanation: `بعض الصفات (strong adjectives) لها معنى أقوى بطبيعتها من الصفات الأساسية (base adjectives). القاعدة المهمة هي أننا لا نستخدم 'very' مع الصفات القوية؛ بدلاً من ذلك، نستخدم ظروفًا مثل 'absolutely' أو 'really' أو 'totally' للتأكيد.
- Base: very good, very tired, very big
- Strong: absolutely fantastic, absolutely exhausted, absolutely huge`,
    examples: [
      { english: "base: good -> strong: wonderful, fantastic, brilliant", arabic: "أساسي: جيد -> قوي: رائع، مدهش، لامع" },
      { english: "base: tired -> strong: exhausted", arabic: "أساسي: متعب -> قوي: منهك" },
      { english: "base: big -> strong: huge, enormous", arabic: "أساسي: كبير -> قوي: ضخم، هائل" },
      { english: "base: small -> strong: tiny", arabic: "أساسي: صغير -> قوي: ضئيل" },
      { english: "base: bad -> strong: awful, terrible, disgusting", arabic: "أساسي: سيء -> قوي: فظيع، رهيب، مقرف" },
      { english: "base: interesting -> strong: fascinating", arabic: "أساسي: مثير للاهتمام -> قوي: آسر" },
      { english: "base: cold -> strong: freezing", arabic: "أساسي: بارد -> قوي: متجمد" },
      { english: "base: hot -> strong: boiling", arabic: "أساسي: حار -> قوي: مغلي" },
      { english: "The film was absolutely fantastic.", arabic: "كان الفيلم رائعًا للغاية." },
      { english: "I was very tired, in fact, I was exhausted.", arabic: "كنت متعبًا جدًا، في الواقع، كنت منهكًا." }
    ],
    mcqs: [
      { question: "Which is a strong adjective for 'happy'?", options: ["pleased", "glad", "delighted", "content"], answer: "delighted" },
      { question: "You can say 'absolutely ___.'", options: ["good", "bad", "huge", "small"], answer: "huge" },
      { question: "Which is a strong adjective for 'angry'?", options: ["annoyed", "furious", "upset", "irritated"], answer: "furious" },
      { question: "You say 'very ___', but 'absolutely ___'.", options: ["good / fantastic", "fantastic / good", "big / huge", "tiny / small"], answer: "good / fantastic" },
      { question: "A strong adjective for 'surprised' is:", options: ["shocked", "amazed", "astonished", "All of the above"], answer: "All of the above" }
    ]
  },
  {
    title: "مفردات: ظروف التعديل",
    explanation: "الظروف (Adverbs) مثل 'very', 'really', 'absolutely', 'extremely' تعدل الصفات لتجعلها أقوى أو أضعف. من المهم معرفة أي الظروف يمكن استخدامها مع أي الصفات. 'very' و 'really' و 'extremely' تُستخدمان مع الصفات الأساسية (base adjectives)، بينما 'absolutely' و 'totally' تُستخدمان مع الصفات القوية (strong adjectives).",
    examples: [
      { english: "I'm very tired.", arabic: "أنا متعب جدًا." },
      { english: "It's absolutely wonderful.", arabic: "إنه رائع للغاية." },
      { english: "She is really intelligent.", arabic: "هي ذكية حقًا." },
      { english: "The weather was extremely cold.", arabic: "كان الطقس باردًا للغاية." },
      { english: "This food is quite good.", arabic: "هذا الطعام جيد إلى حد ما." },
      { english: "I'm not very happy about it.", arabic: "لست سعيدًا جدًا بهذا الأمر." },
      { english: "He was incredibly lucky.", arabic: "كان محظوظًا بشكل لا يصدق." },
      { english: "The test was surprisingly easy.", arabic: "كان الاختبار سهلاً بشكل مدهش." },
      { english: "Incorrect: I'm very exhausted. Correct: I'm absolutely exhausted.", arabic: "خطأ: أنا منهك جدًا. صحيح: أنا منهك تمامًا." },
      { english: "Incorrect: It's absolutely good. Correct: It's very good.", arabic: "خطأ: إنه جيد للغاية. صحيح: إنه جيد جدًا." }
    ],
    mcqs: [
      { question: "Which adverb can you use with the strong adjective 'freezing'?", options: ["very", "a bit", "absolutely", "fairly"], answer: "absolutely" },
      { question: "Which sentence is correct?", options: ["She is very beautiful.", "She is absolutely beautiful.", "Both are correct.", "Neither is correct."], answer: "Both are correct." },
      { question: "Which adverb means 'a little'?", options: ["extremely", "incredibly", "quite", "slightly"], answer: "slightly" },
      { question: "Complete the sentence: The exam was ___ difficult.", options: ["incredibly", "absolutely", "totally", "all of the above are possible"], answer: "incredibly" },
      { question: "Which sentence is INCORRECT?", options: ["The journey was very long.", "The journey was absolutely long.", "The journey was extremely long.", "The journey was rather long."], answer: "The journey was absolutely long." }
    ]
  },
  {
    title: "مفردات: صفات الشخصية",
    explanation: "هذا الدرس يركز على الصفات (Adjectives) المستخدمة لوصف شخصية الإنسان وطباعه. تعلم هذه المفردات يمكنك من وصف أصدقائك وعائلتك وزملائك بشكل أفضل وأكثر دقة.",
    examples: [
      { english: "A reliable person is someone you can trust.", arabic: "الشخص الموثوق هو شخص يمكنك الوثوق به." },
      { english: "A sociable person enjoys being with other people.", arabic: "الشخص الاجتماعي يستمتع بكونه مع الآخرين." },
      { english: "An easygoing person is relaxed and not easily upset.", arabic: "الشخص سهل المعشر هو شخص مسترخٍ ولا ينزعج بسهولة." },
      { english: "She is very cheerful and optimistic.", arabic: "هي مرحة ومتفائلة جدًا." },
      { english: "He can be a bit moody sometimes.", arabic: "يمكن أن يكون متقلب المزاج أحيانًا." },
      { english: "My boss is very hardworking and ambitious.", arabic: "مديري مجتهد وطموح جدًا." },
      { english: "You should be more patient.", arabic: "يجب أن تكون أكثر صبرًا." },
      { english: "Her brother is quite shy and reserved.", arabic: "أخوها خجول ومتحفظ إلى حد ما." },
      { english: "He's very generous and always helps people.", arabic: "هو كريم جدًا ويساعد الناس دائمًا." },
      { english: "Don't be so selfish! Think about others.", arabic: "لا تكن أنانيًا جدًا! فكر في الآخرين." }
    ],
    mcqs: [
      { question: "The opposite of 'generous' is:", options: ["kind", "mean", "sociable", "reliable"], answer: "mean" },
      { question: "A 'hardworking' person:", options: ["doesn't like to work", "works a lot", "is often late for work", "is lazy"], answer: "works a lot" },
      { question: "If someone is 'shy', they are:", options: ["talkative", "quiet and nervous with new people", "confident", "outgoing"], answer: "quiet and nervous with new people" },
      { question: "A person who always tells the truth is:", options: ["honest", "loyal", "brave", "funny"], answer: "honest" },
      { question: "An 'ambitious' person wants to be:", options: ["popular", "successful", "relaxed", "funny"], answer: "successful" }
    ]
  },
  {
    title: "مفردات: الأسماء المركبة",
    explanation: "الأسماء المركبة (Compound Nouns) تتكون من كلمتين أو أكثر تعملان معًا كاسم واحد له معنى محدد. يمكن كتابتها ككلمة واحدة (e.g., toothpaste)، أو بواصلة (e.g., five-star), أو ككلمتين منفصلتين (e.g., swimming pool).",
    examples: [
      { english: "She has her hair in a ponytail.", arabic: "شعرها مربوط على شكل ذيل حصان." },
      { english: "He wants to be a movie star.", arabic: "يريد أن يصبح نجمًا سينمائيًا." },
      { english: "Let's go to the swimming pool.", arabic: "دعنا نذهب إلى حمام السباحة." },
      { english: "I need to buy some toothpaste.", arabic: "أحتاج لشراء بعض معجون الأسنان." },
      { english: "He got stuck in a traffic jam.", arabic: "علق في ازدحام مروري." },
      { english: "My credit card is in my wallet.", arabic: "بطاقتي الائتمانية في محفظتي." },
      { english: "We're staying in a five-star hotel.", arabic: "نحن نقيم في فندق خمس نجوم." },
      { english: "Have you seen the newspaper today?", arabic: "هل رأيت صحيفة اليوم؟" },
      { english: "My alarm clock didn't go off this morning.", arabic: "لم يرن منبهي هذا الصباح." },
      { english: "He works as a firefighter.", arabic: "يعمل كرجل إطفاء." }
    ],
    mcqs: [
      { question: "What do you call the room where you sleep?", options: ["sleep room", "room bed", "bedroom", "bed's room"], answer: "bedroom" },
      { question: "A person who cuts hair is a:", options: ["haircutter", "hairdresser", "cut hairer", "hair artist"], answer: "hairdresser" },
      { question: "What is the thing you use to wash your hands with?", options: ["hand soap", "wash hands", "soap hand", "hand's soap"], answer: "hand soap" },
      { question: "The main light in a room, on the ceiling, is the:", options: ["ceilinglight", "lightceiling", "room light", "main light"], answer: "ceilinglight" },
      { question: "Which is a compound noun?", options: ["beautiful house", "running shoes", "tall man", "eating food"], answer: "running shoes" }
    ]
  },
  {
    title: "مفردات: أفعال وأسماء متلازمة",
    explanation: "كما هو الحال مع الصفات، هناك أفعال معينة تتلازم بشكل طبيعي مع أسماء معينة (Verb-Noun Collocations). تعلم هذه المتلازمات يساعد على تجنب الأخطاء الشائعة ويجعل لغتك تبدو أكثر طبيعية. على سبيل المثال، نقول 'tell a joke' وليس 'say a joke'.",
    examples: [
      { english: "whistle a tune", arabic: "يصفر لحنًا" },
      { english: "lick an ice-cream", arabic: "يلعق آيس كريم" },
      { english: "make your bed", arabic: "يرتب سريرك" },
      { english: "take a photo", arabic: "يلتقط صورة" },
      { english: "have a shower", arabic: "يستحم" },
      { english: "do the dishes", arabic: "يغسل الأطباق" },
      { english: "tell a joke", arabic: "يروي نكتة" },
      { english: "save money", arabic: "يوفر المال" },
      { english: "spend time", arabic: "يقضي وقتًا" },
      { english: "break a promise", arabic: "يخلف وعدًا" }
    ],
    mcqs: [
      { question: "Which verb goes with 'a secret'?", options: ["tell", "say", "keep", "speak"], answer: "keep" },
      { question: "You don't 'do' a mistake, you ___ a mistake.", options: ["make", "have", "take", "give"], answer: "make" },
      { question: "Which verb means to start a journey?", options: ["make off", "do off", "set off", "put off"], answer: "set off" },
      { question: "We ___ our homework.", options: ["make", "do", "have", "take"], answer: "do" },
      { question: "It's important not to ___ lies.", options: ["say", "speak", "talk", "tell"], answer: "tell" }
    ]
  },
  {
    title: "مفردات: التعابير الاصطلاحية (Idioms)",
    explanation: "التعابير الاصطلاحية (Idioms) هي عبارات لها معنى مجازي يختلف عن المعنى الحرفي للكلمات المكونة لها. هي جزء مهم من الطلاقة في اللغة، وفهمها يساعد على فهم المتحدثين الأصليين بشكل أفضل.",
    examples: [
      { english: "hold your breath", arabic: "يحبس أنفاسه (ينتظر بقلق)" },
      { english: "hit the roof", arabic: "يستشيط غضبًا" },
      { english: "It's raining cats and dogs.", arabic: "إنها تمطر بغزارة." },
      { english: "Break a leg!", arabic: "حظًا موفقًا! (تقال للممثلين)" },
      { english: "He spilled the beans.", arabic: "لقد أفشى السر." },
      { english: "This is a piece of cake.", arabic: "هذا سهل جدًا." },
      { english: "You're pulling my leg.", arabic: "أنت تمزح معي." },
      { english: "I'm feeling under the weather.", arabic: "أشعر بالمرض." },
      { english: "Let's call it a day.", arabic: "لننهي العمل لهذا اليوم." },
      { english: "The exam was a walk in the park.", arabic: "كان الامتحان سهلاً للغاية." }
    ],
    mcqs: [
      { question: "If something is 'a piece of cake', it is:", options: ["very difficult", "very easy", "very tasty", "very expensive"], answer: "very easy" },
      { question: "What does 'to hit the roof' mean?", options: ["to become very happy", "to become very sad", "to become very angry", "to climb on the roof"], answer: "to become very angry" },
      { question: "If it's 'raining cats and dogs', the weather is:", options: ["sunny", "windy", "raining heavily", "snowing"], answer: "raining heavily" },
      { question: "If you 'spill the beans', you:", options: ["make a mess", "cook a meal", "tell a secret", "buy groceries"], answer: "tell a secret" },
      { question: "'To feel under the weather' means to feel:", options: ["sad", "happy", "hot", "sick"], answer: "sick" }
    ]
  },
  {
    title: "مفردات: الولادة، الزواج، والوفاة",
    explanation: "هذا الدرس يغطي المفردات الأساسية المتعلقة بالأحداث الكبرى والمراحل المختلفة في حياة الإنسان، مثل الولادة (birth)، والخطوبة (engagement)، والزواج (marriage)، والتقاعد (retirement)، والوفاة (death).",
    examples: [
      { english: "have a baby", arabic: "يرزق بطفل" },
      { english: "get engaged", arabic: "يخطب / تخطب" },
      { english: "get married", arabic: "يتزوج" },
      { english: "funeral", arabic: "جنازة" },
      { english: "She is pregnant.", arabic: "هي حامل." },
      { english: "The couple went on their honeymoon.", arabic: "ذهب الزوجان في شهر العسل." },
      { english: "They got divorced last year.", arabic: "لقد تطلقا العام الماضي." },
      { english: "He retired from his job at age 65.", arabic: "تقاعد من وظيفته في سن 65." },
      { english: "My condolences on your loss.", arabic: "تعازيّ في مصابكم." },
      { english: "The bride wore a beautiful white dress.", arabic: "ارتدت العروس فستانًا أبيض جميلًا." }
    ],
    mcqs: [
      { question: "A party to celebrate a marriage is a:", options: ["birthday party", "wedding reception", "funeral", "graduation"], answer: "wedding reception" },
      { question: "The period before marriage is called:", options: ["honeymoon", "engagement", "divorce", "retirement"], answer: "engagement" },
      { question: "A woman whose husband has died is a:", options: ["bride", "groom", "widow", "spinster"], answer: "widow" },
      { question: "The legal end of a marriage is a:", options: ["funeral", "wedding", "divorce", "honeymoon"], answer: "divorce" },
      { question: "A baby that has just been born is a:", options: ["toddler", "teenager", "newborn", "infant"], answer: "newborn" }
    ]
  },
  {
    title: "مراجعة شاملة للأزمنة",
    explanation: "مراجعة مركزة لجميع أزمنة الفعل الرئيسية (المضارع، الماضي، المستقبل) بأنواعها المختلفة (البسيطة، المستمرة، التامة، والتامة المستمرة)، مع التركيز على الفروقات الدقيقة في الاستخدام ومتى نختار كل زمن للتعبير عن المعنى الصحيح.",
    examples: [
      { english: "I work here. (Present Simple)", arabic: "أنا أعمل هنا. (مضارع بسيط)" },
      { english: "I am working now. (Present Continuous)", arabic: "أنا أعمل الآن. (مضارع مستمر)" },
      { english: "I worked yesterday. (Past Simple)", arabic: "عملت أمس. (ماضي بسيط)" },
      { english: "I was working when you called. (Past Continuous)", arabic: "كنت أعمل عندما اتصلت. (ماضي مستمر)" },
      { english: "I have worked here for 3 years. (Present Perfect)", arabic: "عملت هنا لمدة 3 سنوات. (مضارع تام)" },
      { english: "I have been working all day. (Present Perfect Continuous)", arabic: "كنت أعمل طوال اليوم. (مضارع تام مستمر)" },
      { english: "I had worked there before I moved. (Past Perfect)", arabic: "كنت قد عملت هناك قبل أن أنتق. (ماضي تام)" },
      { english: "I will work tomorrow. (Future Simple)", arabic: "سأعمل غدًا. (مستقبل بسيط)" },
      { english: "I am going to work harder. (Future with going to)", arabic: "سأعمل بجد أكبر. (مستقبل بـ going to)" },
      { english: "This time next week, I will be working. (Future Continuous)", arabic: "في مثل هذا الوقت الأسبوع المقبل، سأكون أعمل. (مستقبل مستمر)" }
    ],
    mcqs: [
      { question: "He ___ for the bus when it started to rain.", options: ["waited", "was waiting", "has waited", "waits"], answer: "was waiting" },
      { question: "I ___ this film before.", options: ["saw", "have seen", "see", "am seeing"], answer: "have seen" },
      { question: "By the time we got there, the party ___.", options: ["finished", "has finished", "had finished", "was finishing"], answer: "had finished" },
      { question: "Look! That car ___ crash.", options: ["will", "is going to", "crashes", "would"], answer: "is going to" },
      { question: "She ___ English since she was a child.", options: ["learns", "has been learning", "learned", "was learning"], answer: "has been learning" }
    ]
  },
  {
    title: "مراجعة شاملة للمبني للمجهول",
    explanation: "مراجعة لصيغ المبني للمجهول (Passive Voice) في مختلف الأزمنة (المضارع، الماضي، المستقبل، مع الأفعال المساعدة). يركز الدرس على كيفية تحويل الجمل من المبني للمعلوم إلى المجهول، ومتى يكون استخدام المبني للمجهول هو الخيار الأفضل (عندما يكون الفاعل غير مهم أو غير معروف).",
    examples: [
      { english: "The car is washed every week. (Present Simple Passive)", arabic: "تُغسل السيارة كل أسبوع." },
      { english: "The car is being washed now. (Present Continuous Passive)", arabic: "تُغسل السيارة الآن." },
      { english: "The car was washed yesterday. (Past Simple Passive)", arabic: "غُسلت السيارة أمس." },
      { english: "The car was being washed when I arrived. (Past Continuous Passive)", arabic: "كانت السيارة تُغسل عندما وصلت." },
      { english: "The car has been washed. (Present Perfect Passive)", arabic: "لقد غُسلت السيارة." },
      { english: "The car had been washed before they sold it. (Past Perfect Passive)", arabic: "كانت السيارة قد غُسلت قبل أن يبيعوها." },
      { english: "The car will be washed tomorrow. (Future Simple Passive)", arabic: "ستُغسل السيارة غدًا." },
      { english: "The car should be washed. (Modal Passive)", arabic: "يجب غسل السيارة." },
      { english: "The car is going to be washed. (Future Passive with going to)", arabic: "سوف تُغسل السيارة." },
      { english: "Mistakes were made.", arabic: "ارتُكبت أخطاء." }
    ],
    mcqs: [
      { question: "Active: 'They are building a house.' Passive: 'A house ___.'", options: ["is built", "is being built", "was built", "has been built"], answer: "is being built" },
      { question: "The results ___ tomorrow.", options: ["will announce", "will be announced", "are announced", "have been announced"], answer: "will be announced" },
      { question: "This problem must ___ immediately.", options: ["solve", "be solved", "be solving", "solved"], answer: "be solved" },
      { question: "The letters ___ yet.", options: ["haven't been posted", "haven't posted", "didn't post", "weren't posted"], answer: "haven't been posted" },
      { question: "Romeo and Juliet ___ by Shakespeare.", options: ["was written", "were written", "wrote", "was wrote"], answer: "were written" }
    ]
  },
  {
    title: "الصفات المنتهية بـ -ed و -ing",
    explanation: `هناك فرق مهم في المعنى بين الصفات التي تنتهي بـ '-ed' وتلك التي تنتهي بـ '-ing'.
- الصفات المنتهية بـ '-ing' (e.g., boring, interesting, exciting): تصف الشيء أو الشخص أو الموقف الذي يسبب الشعور.
- الصفات المنتهية بـ '-ed' (e.g., bored, interested, excited): تصف شعور الشخص أو إحساسه.
مثال: "The film was boring, so I felt bored."`,
    examples: [
      { english: "The movie was boring.", arabic: "كان الفيلم مملاً." },
      { english: "I was bored during the movie.", arabic: "شعرت بالملل أثناء الفيلم." },
      { english: "His speech was very interesting.", arabic: "كان خطابه مثيرًا للاهتمام للغاية." },
      { english: "I am interested in history.", arabic: "أنا مهتم بالتاريخ." },
      { english: "This is a surprising result.", arabic: "هذه نتيجة مفاجئة." },
      { english: "I was surprised to see him.", arabic: "فوجئت برؤيته." },
      { english: "The journey was exhausting.", arabic: "كانت الرحلة مرهقة." },
      { english: "I feel exhausted after work.", arabic: "أشعر بالإرهاق بعد العمل." },
      { english: "The news was shocking.", arabic: "كانت الأخبار صادمة." },
      { english: "We were shocked by the news.", arabic: "صُدمنا بالأخبار." }
    ],
    mcqs: [
      { question: "I find rollercoasters very ___.", options: ["exciting", "excited", "excite", "excitement"], answer: "exciting" },
      { question: "He was ___ to learn that he had won.", options: ["amazing", "amazed", "amaze", "amazement"], answer: "amazed" },
      { question: "This book is so ___. I can't finish it.", options: ["boring", "bored", "bore", "boredom"], answer: "boring" },
      { question: "She was ___ with the service at the hotel.", options: ["disappointing", "disappointed", "disappoint", "disappointment"], answer: "disappointed" },
      { question: "It was a very ___ experience.", options: ["frightening", "frightened", "frighten", "fright"], answer: "frightening" }
    ]
  }
];
