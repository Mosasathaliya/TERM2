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
    title: "أزمنة الأفعال المساعدة",
    explanation: "الأفعال المساعدة 'do', 'be', 'have' هي أساس تكوين الأزمنة المختلفة في اللغة الإنجليزية. تُستخدم في تكوين الأسئلة، والجمل المنفية، والأزمنة المستمرة والتامة، وهي ضرورية لفهم بنية الجملة بشكل صحيح.",
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
    title: "زمن المضارع البسيط",
    explanation: "يُستخدم زمن المضارع البسيط للتعبير عن الحقائق العامة التي لا تتغير (مثل The sun rises in the east)، والعادات اليومية أو الأفعال المتكررة (مثل I drink coffee every morning)، والجداول الزمنية والمواعيد الثابتة (مثل The train leaves at 8 AM).",
    examples: [
      { english: "The sun rises in the east.", arabic: "تشرق الشمس من الشرق." },
      { english: "She usually drives to work.", arabic: "هي عادة تقود السيارة إلى العمل." },
      { english: "Cows don't eat meat.", arabic: "الأبقار لا تأكل اللحم." },
      { english: "Does she work in a bank?", arabic: "هل هي تعمل في بنك؟" },
      { english: "Water boils at 100 degrees Celsius.", arabic: "يغلي الماء عند 100 درجة مئوية." },
      { english: "They play tennis every Saturday.", arabic: "هم يلعبون التنس كل يوم سبت." },
      { english: "He doesn't speak French.", arabic: "هو لا يتحدث الفرنسية." },
      { english: "Our lessons start at 9:00.", arabic: "دروسنا تبدأ في الساعة 9:00." },
      { english: "I check my email every hour.", arabic: "أتفقد بريدي الإلكتروني كل ساعة." },
      { english: "Do you like classical music?", arabic: "هل تحب الموسيقى الكلاسيكية؟" },
    ],
    mcqs: [
      { question: "Which sentence describes a habit?", options: ["He is running.", "The train arrived.", "She often reads books.", "I will go soon."], answer: "She often reads books." },
      { question: "Choose the correct form: He ___ a doctor.", options: ["be", "is", "are", "am"], answer: "is" },
      { question: "What is the correct question form?", options: ["You like pizza?", "Do you like pizza?", "Does you like pizza?", "Are you like pizza?"], answer: "Do you like pizza?" },
      { question: "The Earth ___ around the Sun.", options: ["go", "goes", "is going", "went"], answer: "goes" },
      { question: "Complete the sentence: We ___ live in London.", options: ["doesn't", "don't", "isn't", "aren't"], answer: "don't" },
    ],
  },
  {
    title: "زمن المضارع المستمر",
    explanation: "يُستخدم زمن المضارع المستمر لوصف فعل يحدث في نفس لحظة الكلام (الآن)، أو فعل مؤقت يستمر لفترة محدودة في الحاضر. كما يُستخدم لوصف ترتيبات مستقبلية مؤكدة.",
    examples: [
        { english: "He is working in France at the moment.", arabic: "هو يعمل في فرنسا في هذه اللحظة." },
        { english: "The children are playing in the garden.", arabic: "الأطفال يلعبون في الحديقة." },
        { english: "I'm not driving, I'm walking today.", arabic: "أنا لا أقود السيارة، أنا أمشي اليوم." },
        { english: "What are you doing right now?", arabic: "ماذا تفعل الآن؟" },
        { english: "She is studying for her exams this week.", arabic: "هي تدرس لامتحاناتها هذا الأسبوع." },
        { english: "We are meeting our friends tonight.", arabic: "سنقابل أصدقاءنا الليلة." },
        { english: "Why are you wearing a coat? It's hot.", arabic: "لماذا ترتدي معطفًا؟ الجو حار." },
        { english: "Look! It's raining.", arabic: "انظر! إنها تمطر." },
        { english: "He isn't listening to the teacher.", arabic: "هو لا يستمع إلى المعلم." },
        { english: "They are building a new bridge.", arabic: "هم يبنون جسرًا جديدًا." },
    ],
    mcqs: [
        { question: "Which option describes an action happening now?", options: ["She sings well.", "She will sing.", "She sang a song.", "She is singing."], answer: "She is singing." },
        { question: "Complete: They ___ playing football.", options: ["is", "are", "am", "do"], answer: "are" },
        { question: "Which is a future arrangement?", options: ["I work every day.", "I am visiting my aunt tomorrow.", "I worked yesterday.", "I have worked a lot."], answer: "I am visiting my aunt tomorrow." },
        { question: "Correct the sentence: I am liking this pizza.", options: ["I likes this pizza.", "I like this pizza.", "I am like this pizza.", "Correct as is."], answer: "I like this pizza." },
        { question: "What is she doing? She ___ a book.", options: ["reads", "is reading", "read", "has read"], answer: "is reading" },
    ]
  },
  {
    title: "زمن الماضي البسيط",
    explanation: "يُستخدم زمن الماضي البسيط لوصف حدث بدأ وانتهى في وقت محدد في الماضي. غالبًا ما تأتي معه تعبيرات زمنية مثل yesterday, last week, in 2010.",
    examples: [
        { english: "He danced and sang all night.", arabic: "لقد رقص وغنى طوال الليل." },
        { english: "We visited Paris last year.", arabic: "زرنا باريس العام الماضي." },
        { english: "She didn't go to the party.", arabic: "هي لم تذهب إلى الحفلة." },
        { english: "Did you finish your work yesterday?", arabic: "هل أنهيت عملك أمس؟" },
        { english: "I bought a new car two days ago.", arabic: "اشتريت سيارة جديدة قبل يومين." },
        { english: "They lived in that house for ten years.", arabic: "عاشوا في ذلك المنزل لمدة عشر سنوات." },
        { english: "Shakespeare wrote 'Hamlet'.", arabic: "كتب شكسبير 'هاملت'." },
        { english: "The train arrived on time.", arabic: "وصل القطار في الوقت المحدد." },
        { english: "He didn't know the answer.", arabic: "لم يكن يعرف الإجابة." },
        { english: "Where did you buy that hat?", arabic: "من أين اشتريت تلك القبعة؟" },
    ],
    mcqs: [
        { question: "Which verb is in the Past Simple?", options: ["go", "gone", "went", "going"], answer: "went" },
        { question: "Complete: I ___ a great film last night.", options: ["see", "seen", "saw", "am seeing"], answer: "saw" },
        { question: "The negative form of 'He came' is:", options: ["He didn't came.", "He no come.", "He didn't come.", "He not came."], answer: "He didn't come." },
        { question: "What did you ___ for dinner?", options: ["eat", "ate", "eaten", "eating"], answer: "eat" },
        { question: "The statement 'I was at home' in question form is:", options: ["You were at home?", "Were you at home?", "Did you be at home?", "Have you been at home?"], answer: "Were you at home?" },
    ]
  },
  {
    title: "زمن الماضي المستمر",
    explanation: "يُستخدم لوصف فعل كان مستمراً في وقت معين في الماضي، أو لوصف فعل كان يحدث عندما قاطعه فعل آخر (عادة ما يكون في الماضي البسيط).",
    examples: [
        { english: "He was laughing when he saw the baby.", arabic: "كان يضحك عندما رأى الطفل." },
        { english: "I was watching TV when the phone rang.", arabic: "كنت أشاهد التلفاز عندما رن الهاتف." },
        { english: "They were playing cards all evening.", arabic: "كانوا يلعبون الورق طوال المساء." },
        { english: "What were you doing at 8 PM last night?", arabic: "ماذا كنت تفعل في الساعة 8 مساءً الليلة الماضية؟" },
        { english: "It was raining, so we stayed inside.", arabic: "كانت السماء تمطر، لذلك بقينا في الداخل." },
        { english: "She wasn't sleeping when I called her.", arabic: "لم تكن نائمة عندما اتصلت بها." },
        { english: "While I was studying, my brother was listening to music.", arabic: "بينما كنت أدرس، كان أخي يستمع إلى الموسيقى." },
        { english: "The sun was shining and the birds were singing.", arabic: "كانت الشمس مشرقة والطيور تغني." },
        { english: "He fell while he was climbing the ladder.", arabic: "لقد سقط بينما كان يتسلق السلم." },
        { english: "Were you working on the project yesterday?", arabic: "هل كنت تعمل على المشروع أمس؟" },
    ],
    mcqs: [
        { question: "Choose the correct sentence:", options: ["I was read when she called.", "I read when she was calling.", "I was reading when she called.", "I am reading when she called."], answer: "I was reading when she called." },
        { question: "What were you doing? I ___ to music.", options: ["listened", "was listening", "listen", "am listening"], answer: "was listening" },
        { question: "They ___ for the bus when it started to rain.", options: ["waited", "wait", "were waiting", "are waiting"], answer: "were waiting" },
        { question: "He wasn't driving fast. This sentence is:", options: ["Past Simple", "Present Continuous", "Past Continuous", "Present Perfect"], answer: "Past Continuous" },
        { question: "While she was cooking, the children ___.", options: ["played", "were playing", "play", "are playing"], answer: "were playing" },
    ]
  },
  {
    title: "زمن الماضي التام",
    explanation: "يُستخدم لوصف حدث وقع قبل حدث آخر في الماضي. الحدث الأقدم يكون في الماضي التام (had + past participle)، والحدث الأحدث في الماضي البسيط.",
    examples: [
        { english: "Had you heard the joke before?", arabic: "هل سمعت النكتة من قبل؟" },
        { english: "The train had already left when I arrived at the station.", arabic: "كان القطار قد غادر بالفعل عندما وصلت إلى المحطة." },
        { english: "She hadn't seen the film, so she didn't know the ending.", arabic: "لم تكن قد شاهدت الفيلم، لذلك لم تكن تعرف النهاية." },
        { english: "By the time he was 25, he had started his own company.", arabic: "بحلول الوقت الذي بلغ فيه 25 عامًا، كان قد بدأ شركته الخاصة." },
        { english: "He told me he had lost his keys.", arabic: "أخبرني أنه قد أضاع مفاتيحه." },
        { english: "I didn't laugh because I had heard the joke before.", arabic: "لم أضحك لأنني كنت قد سمعت النكتة من قبل." },
        { english: "After she had finished her work, she went home.", arabic: "بعد أن أنهت عملها، ذهبت إلى المنزل." },
        { english: "They had never flown before their trip to London.", arabic: "لم يكونوا قد سافروا بالطائرة من قبل رحلتهم إلى لندن." },
        { english: "Had the game started when you turned on the TV?", arabic: "هل كانت المباراة قد بدأت عندما شغلت التلفاز؟" },
        { english: "We couldn't get a room because we hadn't booked.", arabic: "لم نتمكن من الحصول على غرفة لأننا لم نكن قد حجزنا." },
    ],
    mcqs: [
        { question: "I arrived late. The film ___ started.", options: ["has", "have", "had", "was"], answer: "had" },
        { question: "When I got home, I realized I ___ my wallet at the office.", options: ["leave", "left", "was leaving", "had left"], answer: "had left" },
        { question: "She ___ there before, so she knew the way.", options: ["was", "had been", "is", "has been"], answer: "had been" },
        { question: "Choose the correct sentence:", options: ["She had eaten before I had arrived.", "She ate before I had arrived.", "She had eaten before I arrived.", "She ate before I ate."], answer: "She had eaten before I arrived." },
        { question: "He wasn't hungry because he ___ a big lunch.", options: ["had eaten", "ate", "eats", "was eating"], answer: "had eaten" },
    ]
  },
  {
    title: "صيغ المستقبل (going to, will, Present Continuous)",
    explanation: "تُستخدم صيغ مختلفة للتعبير عن المستقبل: 'going to' للخطط والنوايا، 'will' للقرارات الفورية والعروض والتنبؤات، والمضارع المستمر للترتيبات المؤكدة.",
    examples: [
        { english: "I'm going to buy some new shoes.", arabic: "سأشتري بعض الأحذية الجديدة (خطة)." },
        { english: "Look at the clouds! It's going to rain.", arabic: "انظر إلى الغيوم! ستمطر (تنبؤ بدليل)." },
        { english: "The phone is ringing. I'll get it!", arabic: "الهاتف يرن. سأرد عليه! (قرار فوري)." },
        { english: "I think Brazil will win the World Cup.", arabic: "أعتقد أن البرازيل ستفوز بكأس العالم (تنبؤ/رأي)." },
        { english: "We're playing tennis this afternoon.", arabic: "سنلعب التنس بعد ظهر هذا اليوم (ترتيب)." },
        { english: "He's flying to Dubai next week.", arabic: "سيسافر إلى دبي الأسبوع المقبل (ترتيب)." },
        { english: "Will you help me with this box?", arabic: "هل ستساعدني في حمل هذا الصندوق؟ (طلب)." },
        { english: "I'll call you when I get home.", arabic: "سأتصل بك عندما أصل إلى المنزل (وعد)." },
        { english: "They are going to visit their grandparents.", arabic: "سيزورون أجدادهم (نية)." },
        { english: "Perhaps I will see you later.", arabic: "ربما سأراك لاحقًا (احتمال)." },
    ],
    mcqs: [
        { question: "For a spontaneous decision, we use:", options: ["going to", "Present Continuous", "will", "Present Simple"], answer: "will" },
        { question: "I've saved enough money. I ___ a car.", options: ["will buy", "am going to buy", "am buying", "buy"], answer: "am going to buy" },
        { question: "What are your plans for the weekend? - I ___ my room.", options: ["will clean", "am cleaning", "am going to clean", "clean"], answer: "am going to clean" },
        { question: "My flight ___ at 10 AM tomorrow.", options: ["is leaving", "will leave", "leaves", "is going to leave"], answer: "leaves" },
        { question: "Don't worry, I ___ you with your project.", options: ["help", "am helping", "am going to help", "will help"], answer: "will help" },
    ]
  },
  {
    title: "المبني للمجهول (Passive Voice)",
    explanation: "يُستخدم المبني للمجهول عندما يكون التركيز على الحدث أو المفعول به بدلاً من الفاعل. يتم تكوينه باستخدام (verb to be + past participle).",
    examples: [
        { english: "The book was written by Hemingway.", arabic: "الكتاب كُتب بواسطة همنغواي." },
        { english: "English is spoken all over the world.", arabic: "اللغة الإنجليزية يتم التحدث بها في جميع أنحاء العالم." },
        { english: "My car is being repaired today.", arabic: "سيارتي يتم إصلاحها اليوم." },
        { english: "The thief has been arrested.", arabic: "تم القبض على اللص." },
        { english: "The museum was built in 1990.", arabic: "تم بناء المتحف في عام 1990." },
        { english: "Mistakes were made.", arabic: "تم ارتكاب أخطاء." },
        { english: "This castle will be visited by many tourists.", arabic: "سيزور هذه القلعة العديد من السياح." },
        { english: "A new kind of medicine is being tested.", arabic: "يتم اختبار نوع جديد من الأدوية." },
        { english: "The windows had been cleaned before the party.", arabic: "كانت النوافذ قد نُظفت قبل الحفلة." },
        { english: "The results will be announced tomorrow.", arabic: "سيتم إعلان النتائج غدًا." },
    ],
    mcqs: [
        { question: "The active sentence 'Someone stole my bike' in passive is:", options: ["My bike was stolen.", "My bike is stolen.", "My bike was stole.", "My bike has been stolen."], answer: "My bike was stolen." },
        { question: "America ___ by Columbus in 1492.", options: ["discovered", "was discovered", "is discovered", "had discovered"], answer: "was discovered" },
        { question: "The report must ___ by Friday.", options: ["finish", "be finished", "finished", "be finishing"], answer: "be finished" },
        { question: "Active: 'They are building a new school.' Passive: 'A new school ___.'", options: ["is built", "is being built", "was built", "has been built"], answer: "is being built" },
        { question: "The Mona Lisa ___ by Leonardo da Vinci.", options: ["was painted", "painted", "paints", "is painting"], answer: "was painted" },
    ]
  },
  {
    title: "الأفعال الشرطية (Conditionals)",
    explanation: "تُستخدم الجمل الشرطية للتعبير عن مواقف حقيقية أو خيالية. النوع الأول (First Conditional) للمواقف المحتملة في المستقبل (If + present, will + verb). النوع الثاني (Second Conditional) للمواقف غير المحتملة أو الخيالية في الحاضر (If + past, would + verb).",
    examples: [
        { english: "If I see Anna, I'll tell her.", arabic: "إذا رأيت آنا، سأخبرها." },
        { english: "If you study hard, you will pass the exam.", arabic: "إذا درست بجد، ستنجح في الامتحان." },
        { english: "If it rains tomorrow, we will stay at home.", arabic: "إذا أمطرت غدًا، سنبقى في المنزل." },
        { english: "What will you do if you miss the train?", arabic: "ماذا ستفعل إذا فاتك القطار؟" },
        { english: "If I had a million dollars, I would buy a big house.", arabic: "لو كان لدي مليون دولار، لاشتريت منزلاً كبيراً." },
        { english: "If I were you, I would apologize.", arabic: "لو كنت مكانك، لاعتذرت." },
        { english: "What would you do if you won the lottery?", arabic: "ماذا كنت ستفعل لو فزت باليانصيب؟" },
        { english: "She would travel more if she had more money.", arabic: "كانت ستسافر أكثر لو كان لديها المزيد من المال." },
        { english: "If dogs could talk, what would they say?", arabic: "لو استطاعت الكلاب التحدث، ماذا كانت ستقول؟" },
        { english: "If he knew the answer, he would tell us.", arabic: "لو كان يعرف الإجابة، لكان أخبرنا." },
    ],
    mcqs: [
        { question: "If I ___ you, I would take the job.", options: ["am", "was", "were", "be"], answer: "were" },
        { question: "If it snows, we ___ a snowman.", options: ["will make", "would make", "make", "made"], answer: "will make" },
        { question: "If he ___ harder, he would get a promotion.", options: ["works", "worked", "would work", "will work"], answer: "worked" },
        { question: "She will be late if she ___ now.", options: ["don't leave", "doesn't leave", "won't leave", "wouldn't leave"], answer: "doesn't leave" },
        { question: "What would you do if you ___ a celebrity?", options: ["meet", "will meet", "met", "would meet"], answer: "met" },
    ]
  },
  {
    title: "الكلام المنقول (Reported Speech)",
    explanation: "يُستخدم الكلام المنقول لنقل ما قاله شخص آخر. عادةً ما يتم تغيير زمن الفعل إلى درجة أقدم في الماضي (backshift)، وتتغير الضمائر والتعبيرات الزمنية والمكانية.",
    examples: [
        { english: "Direct: 'I am happy.' -> Reported: She said that she was happy.", arabic: "مباشر: 'أنا سعيد.' -> منقول: قالت إنها كانت سعيدة." },
        { english: "Direct: 'We will come.' -> Reported: They said they would come.", arabic: "مباشر: 'سنأتي.' -> منقول: قالوا إنهم سيأتون." },
        { english: "Direct: 'Where do you live?' -> Reported: He asked me where I lived.", arabic: "مباشر: 'أين تعيش؟' -> منقول: سألني أين أعيش." },
        { english: "Direct: 'Did you finish it?' -> Reported: She asked if I had finished it.", arabic: "مباشر: 'هل أنهيته؟' -> منقول: سألت إذا كنت قد أنهيته." },
        { english: "Direct: 'Stop talking!' -> Reported: The teacher told us to stop talking.", arabic: "مباشر: 'توقفوا عن الكلام!' -> منقول: أخبرنا المعلم أن نتوقف عن الكلام." },
        { english: "Direct: 'I worked here yesterday.' -> Reported: He said he had worked there the day before.", arabic: "مباشر: 'عملت هنا أمس.' -> منقول: قال إنه عمل هناك في اليوم السابق." },
        { english: "Direct: 'I can swim.' -> Reported: She said she could swim.", arabic: "مباشر: 'أستطيع السباحة.' -> منقول: قالت إنها تستطيع السباحة." },
        { english: "Direct: 'Don't be late.' -> Reported: He told me not to be late.", arabic: "مباشر: 'لا تتأخر.' -> منقول: أخبرني ألا أتأخر." },
        { english: "Direct: 'Are you coming?' -> Reported: She asked whether I was coming.", arabic: "مباشر: 'هل أنت قادم؟' -> منقول: سألت ما إذا كنت قادمًا." },
        { english: "Direct: 'What is your name?' -> Reported: I asked him what his name was.", arabic: "مباشر: 'ما اسمك؟' -> منقول: سألته ما هو اسمه." },
    ],
    mcqs: [
        { question: "Direct: 'I am tired.' Reported: She said she ___ tired.", options: ["is", "am", "was", "be"], answer: "was" },
        { question: "Direct: 'Where are you going?' Reported: He asked me where I ___ going.", options: ["am", "are", "was", "go"], answer: "was" },
        { question: "Direct: 'I'll call you tomorrow.' Reported: He said he would call me ___.", options: ["tomorrow", "the next day", "yesterday", "that day"], answer: "the next day" },
        { question: "Direct: 'Please help me.' Reported: She asked me ___ her.", options: ["help", "to help", "helping", "helped"], answer: "to help" },
        { question: "Direct: 'I have seen this movie.' Reported: He told me he ___ that movie.", options: ["has seen", "saw", "had seen", "sees"], answer: "had seen" },
    ]
  }
  // Add more lessons as needed from the original list
];
