/**
 * @fileoverview Defines the content for each screen/tab of the application.
 */
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from "@/components/ui/scroll-area";

export function HomeScreen() {
  return (
    <section className="animate-fadeIn text-center flex flex-col items-center justify-center h-[60vh]">
      <h2 className="text-4xl font-bold mb-4">أهلاً بك في TriNav</h2>
    </section>
  );
}

const lessons = [
    { title: "أزمنة الأفعال المساعدة", explanation: "الأفعال المساعدة 'do', 'be', 'have' هي أساس تكوين الأزمنة المختلفة في اللغة الإنجليزية، سواء في السؤال أو النفي أو في الصيغ المستمرة والتامة.", example: "Where do you come from? / I am studying. / I have finished." },
    { title: "الأسئلة والنفي", explanation: "لتكوين الأسئلة والجمل المنفية، نستخدم الأفعال المساعدة. 'do/does/did' مع الأزمنة البسيطة، و'be' و'have' مع الأزمنة الأخرى.", example: "What did you do? / Cows don't eat meat." },
    { title: "زمن المضارع البسيط", explanation: "يُستخدم للتعبير عن الحقائق العامة، العادات، والأفعال المتكررة التي تحدث بشكل منتظم.", example: "The sun rises in the east." },
    { title: "زمن المضارع المستمر", explanation: "يُستخدم لوصف فعل يحدث في لحظة الكلام، أو فعل مؤقت يستمر لفترة محدودة في الحاضر.", example: "He is working in France at the moment." },
    { title: "المبني للمجهول في المضارع", explanation: "تُستخدم هذه الصيغة عندما يكون التركيز على الحدث أو المفعول به بدلاً من الفاعل، أو عندما يكون الفاعل غير معروف.", example: "Children are treated with new medicine." },
    { title: "الفرق بين المضارع البسيط والمستمر", explanation: "المضارع البسيط يعبر عن عادات وحقائق ثابتة، بينما المضارع المستمر يصف أفعالاً مؤقتة تحدث الآن أو في فترة حالية.", example: "She usually drives, but today she's walking." },
    { title: "زمن الماضي البسيط", explanation: "يُستخدم لوصف حدث بدأ وانتهى في وقت محدد في الماضي.", example: "He danced and sang all night." },
    { title: "زمن الماضي المستمر", explanation: "يُستخدم لوصف فعل كان مستمراً في الماضي عندما قاطعه فعل آخر، أو لوصف مشهد في قصة.", example: "He was laughing when he saw the baby." },
    { title: "زمن الماضي التام", explanation: "يُستخدم لوصف حدث وقع قبل حدث آخر في الماضي. الحدث الأقدم يكون في الماضي التام.", example: "Had you heard the joke before?" },
    { title: "المبني للمجهول في الماضي", explanation: "تُستخدم هذه الصيغة للتركيز على المفعول به لحدث وقع في الماضي، ويكون الفاعل غير مهم أو غير معروف.", example: "The book was written by Hemingway." },
    { title: "أفعال Modal (الإلزام)", explanation: "الفعل 'have to' يُستخدم للتعبير عن الالتزام أو الضرورة المفروضة من الخارج (قوانين، قواعد).", example: "Children have to go to school." },
    { title: "أفعال Modal (السماح)", explanation: "الفعلان 'can' و 'be allowed to' يُستخدمان للتعبير عن الإذن والسماح بفعل شيء ما.", example: "We're allowed to wear jeans." },
    { title: "أفعال Modal (النصيحة)", explanation: "الفعل 'should' يُستخدم لتقديم نصيحة أو توصية، أو للتعبير عن ما هو الشيء الصحيح الذي يجب فعله.", example: "You should take traveller's cheques." },
    { title: "صيغ المستقبل (going to)", explanation: "تُستخدم للتعبير عن خطة أو نية مستقبلية تم التفكير فيها مسبقًا، أو للتنبؤ بحدث وشيك بناءً على دليل حالي.", example: "I'm going to buy some." },
    { title: "صيغ المستقبل (will)", explanation: "تُستخدم لاتخاذ قرار فوري في لحظة الكلام، أو لتقديم عرض، أو للتنبؤ بالمستقبل بناءً على رأي شخصي.", example: "I'll get a loaf of bread." },
    { title: "صيغ المستقبل (المضارع المستمر)", explanation: "يُستخدم المضارع المستمر للتعبير عن ترتيبات مستقبلية مؤكدة ومخطط لها، خاصة مع وجود وقت ومكان محددين.", example: "We're playing tennis this afternoon." },
    { title: "السؤال بـ 'like'", explanation: "تُستخدم صيغ مختلفة من 'like' للسؤال عن الشخصية (What's she like?)، المظهر (What does she look like?)، أو الهوايات (What does she like doing?).", example: "What's she like? / What does she like doing?" },
    { title: "أنماط الأفعال (Verb Patterns)", explanation: "بعض الأفعال في الإنجليزية يتبعها صيغة المصدر مع 'to' (to-infinitive)، وبعضها يتبعها صيغة الفعل مع '-ing' (gerund).", example: "I enjoyed meeting your friends. / I wanted to say thank you." },
    { title: "زمن المضارع التام", explanation: "يُستخدم لربط الماضي بالحاضر، لوصف حدث بدأ في الماضي وما زال مستمراً أو له تأثير على الحاضر.", example: "I've worked there for five years." },
    { title: "مقارنة بين المضارع التام والماضي البسيط", explanation: "الماضي البسيط يُستخدم لحدث انتهى في وقت محدد بالماضي. المضارع التام يُستخدم لحدث غير محدد زمنياً أو ما زال مستمراً.", example: "I've worked there for five years. (still there) / I worked for the BBC. (finished)" },
    { title: "المبني للمجهول في المضارع التام", explanation: "تُستخدم هذه الصيغة للتركيز على المفعول به لحدث وقع في الماضي وله نتيجة في الحاضر.", example: "Two prizes have been awarded." },
    { title: "الأفعال المركبة (Phrasal Verbs)", explanation: "هي أفعال يتغير معناها بإضافة حرف جر أو ظرف. يمكن أن يكون المعنى حرفياً أو اصطلاحياً.", example: "She looked out of the window. / Look out!" },
    { title: "الأفعال المركبة (القابلة للفصل وغير القابلة للفصل)", explanation: "بعض الأفعال المركبة يمكن وضع المفعول به بين الفعل وحرف الجر (separable)، وبعضها يجب أن يأتي المفعول به بعد حرف الجر (inseparable).", example: "Turn it on. / Look after it." },
    { title: "الجمل الشرطية (النوع الأول)", explanation: "تُستخدم للتعبير عن موقف حقيقي أو محتمل في المستقبل ونتيجته المحتملة. (If + Present Simple, ... will + infinitive)", example: "If I see Anna, I'll tell her." },
    { title: "الجمل الشرطية (النوع الثاني)", explanation: "تُستخدم للتعبير عن مواقف خيالية أو غير محتملة في الحاضر أو المستقبل. (If + Past Simple, ... would + infinitive)", example: "If I had £5 million, I'd buy an island." },
    { title: "جمل الوقت (Time Clauses)", explanation: "تُستخدم أدوات الربط الزمنية مثل 'when', 'as soon as', 'before' لربط حدثين في المستقبل. نستخدم المضارع البسيط بعد أداة الربط.", example: "When we get there, we'll call you." },
    { title: "أفعال Modal (الاحتمالية)", explanation: "تُستخدم 'must', 'could', 'might', 'can't' للتعبير عن درجات مختلفة من اليقين أو الاحتمالية في الحاضر.", example: "She can't be very old. / She might be in love." },
    { title: "الأفعال Modal في الماضي (الاحتمالية)", explanation: "تُستخدم صيغة 'modal + have + past participle' للتعبير عن احتمالية أو استنتاج منطقي حول حدث في الماضي.", example: "It could have been her suitcase. / She must have been on holiday." },
    { title: "العلاقات والصفات الشخصية", explanation: "مجموعة من الصفات التي تستخدم لوصف شخصية الأفراد مثل موثوق، اجتماعي، وسهل المعشر.", example: "He is very reliable and sociable." },
    { title: "الموافقة والاختلاف", explanation: "استخدام عبارات مثل 'So do I' للموافقة على جملة مثبتة، و'Neither do I' للموافقة على جملة منفية.", example: "A: I love chocolate. B: So do I." },
    { title: "المضارع التام المستمر", explanation: "يُستخدم للتأكيد على استمرارية فعل بدأ في الماضي وما زال مستمراً حتى لحظة الكلام، أو انتهى للتو.", example: "I've been texting my friends all day." },
    { title: "التعبيرات الزمنية", explanation: "استخدام كلمات مثل 'for' مع فترة زمنية (for two years) و'since' مع نقطة بداية زمنية (since 2020) مع الأزمنة التامة.", example: "She's been living in Paris since she got married." },
    { title: "الأسئلة غير المباشرة", explanation: "هي طريقة أكثر تهذيباً لطرح الأسئلة، تبدأ غالباً بعبارات مثل 'Could you tell me...' أو 'I wonder if...'. ترتيب الجملة يكون كالجملة الخبرية.", example: "I wonder if you could help me." },
    { title: "الأسئلة المذيلة (Question Tags)", explanation: "هي أسئلة قصيرة تُضاف في نهاية الجملة للتأكيد أو للحصول على موافقة. تكون عكس الجملة (مثبتة مع نفي، والعكس).", example: "It's a lovely day, isn't it?" },
    { title: "الكلام المنقول (Statements)", explanation: "عند نقل كلام شخص آخر، عادةً ما نغير زمن الفعل إلى درجة أقدم في الماضي (مثلاً المضارع البسيط يصبح ماضي بسيط).", example: "She said that they were married." },
    { title: "الكلام المنقول (Questions)", explanation: "عند نقل سؤال، نستخدم ترتيب الجملة الخبرية ونستخدم 'if' أو 'whether' للأسئلة التي جوابها نعم/لا.", example: "He asked me how I knew them." },
    { title: "الكلام المنقول (Commands)", explanation: "عند نقل أمر أو طلب، نستخدم صيغة 'verb + object + to + infinitive'.", example: "He told them to stop making a noise." },
    { title: "الأسماء المركبة", explanation: "هي كلمات تتكون من اسمين أو أكثر لتكوين معنى جديد، مثل 'ponytail' أو 'movie star'.", example: "He is a famous movie star." },
    { title: "التعابير الاصطلاحية (Idioms)", explanation: "هي عبارات لها معنى مجازي يختلف عن المعنى الحرفي لكلماتها، مثل 'hold your breath' (انتظر بترقب).", example: "Don't worry, it's a piece of cake." },
    { title: "مفردات: الولادة، الزواج، الموت", explanation: "مجموعة من الكلمات والعبارات الأساسية المتعلقة بأحداث الحياة الكبرى.", example: "They got engaged last year. / She had a baby." },
    { title: "التعبير عن الكمية", explanation: "استخدام كلمات مثل 'much' (لغير المعدود)، 'many' (للمعدود)، و 'a lot of' (لكليهما) للتعبير عن الكميات.", example: "How much coffee do you drink?" },
    { title: "الإنجليزية غير الرسمية", explanation: "تشمل العبارات والأسئلة العامية الشائعة في المحادثات اليومية بين الأصدقاء.", example: "What's up? / How's it going?" },
    { title: "الاعتذار", explanation: "طرق مختلفة للتعبير عن الأسف، مثل 'I'm sorry' للاعتذار و 'Excuse me' للفت الانتباه أو المرور.", example: "I'm so sorry! / Excuse me!" },
    { title: "الأجوبة القصيرة", explanation: "في المحادثات، من الأدب استخدام إجابات قصيرة تتضمن الفعل المساعد بدلاً من 'Yes' أو 'No' فقط.", example: "A: Do you like tea? B: Yes, I do." },
    { title: "مفردات السفر", explanation: "كلمات وعبارات ضرورية للتنقل في المطارات، الفنادق، واستخدام وسائل النقل العام.", example: "Could you tell me where Gate 23 is?" },
    { title: "وصف الطعام والمدن والأشخاص", explanation: "استخدام مجموعة متنوعة من الصفات لإعطاء وصف حيوي ودقيق للأماكن، الأطعمة، والأشخاص.", example: "The food was delicious and the city was historic." },
    { title: "التعبيرات الاجتماعية", explanation: "هي عبارات قصيرة شائعة تُستخدم في المواقف الاجتماعية اليومية للتعبير عن التعاطف أو لإنهاء محادثة.", example: "Never mind. / Take care!" },
    { title: "الأرقام والتواريخ", explanation: "كيفية قراءة وكتابة الأرقام المختلفة بشكل صحيح، بما في ذلك المال، الكسور، التواريخ، وأرقام الهواتف.", example: "It costs €9.40. The date is 15/7/94." },
    { title: "الطلبات والعروض", explanation: "استخدام صيغ مهذبة مثل 'Could you...?' لتقديم طلب، و 'Shall I...?' أو 'I'll...' لتقديم عرض للمساعدة.", example: "Could you help me? / Shall I help you?" },
    { title: "مفردات الطقس", explanation: "مجموعة من الأسماء والصفات والأفعال المستخدمة لوصف أحوال الطقس المختلفة.", example: "It's sunny today, but it might be windy tomorrow." },
    { title: "الصفات القوية والأساسية", explanation: "بعض الصفات لها مقابل أقوى (strong adjective) لا يستخدم مع 'very' بل مع 'absolutely' (مثال: good -> wonderful).", example: "The film wasn't just good, it was wonderful." },
    { title: "أجزاء الكلام", explanation: "فهم دور الكلمات في الجملة (اسم، فعل، صفة، ظرف) يساعد على بناء جمل صحيحة.", example: "He was eating his popcorn loudly." },
    { title: "تكوين الكلمات", explanation: "يمكن تكوين كلمات جديدة عن طريق إضافة بادئات (prefixes) أو لاحقات (suffixes) إلى الكلمة الأساسية.", example: "My brother is an actor." },
    { title: "الكلمات المتلازمة (Collocations)", explanation: "هي كلمات تظهر معًا بشكل طبيعي ومتكرر في اللغة، مثل 'strong coffee' أو 'heavy rain'.", example: "You paint a picture, but read a poem." },
    { title: "كلمات الجنسية", explanation: "التفريق بين اسم البلد (Spain)، صفة الجنسية (Spanish)، والشعب كمجموعة (the Spanish).", example: "I am from France. I am French. The French love cheese." },
    { title: "تقديم الاقتراحات", explanation: "استخدام عبارات متنوعة مثل 'Let's...', 'Why don't we...?', أو 'How about...?' لتقديم أفكار أو اقتراحات.", example: "Why don't you ask your parents?" },
    { title: "الأسماء والأفعال المتلازمة", explanation: "أفعال وأسماء معينة غالباً ما تستخدم معاً بشكل طبيعي، مثل 'whistle a tune' (يصفر لحناً).", example: "You whistle a tune or lick an ice-cream." },
    { title: "تصحيح الأخطاء", explanation: "مهارة أساسية تتضمن التعرف على الأخطاء الشائعة في القواعد والمفردات وتصويبها.", example: "Incorrect: I am liking this. Correct: I like this." },
    { title: "كتابة الرسائل ورسائل البريد الإلكتروني", explanation: "تعلم الهيكل والعبارات المناسبة للرسائل الرسمية (Dear Sir/Madam) وغير الرسمية (Hi John).", example: "Dear Sir/Madam, I am writing to apply for..." },
    { title: "كتابة السرد (Narrative)", explanation: "فن سرد قصة أو سلسلة من الأحداث بترتيب زمني ومنطقي، باستخدام كلمات ربط مثل 'then', 'after that'.", example: "First, we went to the park. Then, we saw a movie." },
    { title: "كتابة المقالات (For and Against)", explanation: "مقالات تناقش موضوعاً من وجهتي نظر متعارضتين، وتقدم حججاً لكل جانب قبل الوصول إلى استنتاج.", example: "On the one hand, technology connects us. On the other hand, it can isolate us." },
    { title: "وصف مكان أو شخص", explanation: "استخدام لغة وصفية غنية بالتفاصيل والصفات لرسم صورة واضحة للقارئ عن شخص أو مكان.", example: "New York is a bustling city with towering skyscrapers." },
    { title: "كتابة السيرة الذاتية (Biography)", explanation: "سرد قصة حياة شخص ما، وعادة ما تكون مرتبة ترتيباً زمنياً من الولادة إلى الوفاة أو الوقت الحاضر.", example: "Picasso was born in 1881 and showed genius from a young age." },
    { title: "ربط الأفكار", explanation: "استخدام أدوات الربط (conjunctions) مثل 'and', 'but', 'so', 'because' لربط الجمل والأفكار معاً بشكل منطقي.", example: "I was tired, so I went to bed early." },
    { title: "تقديم الآراء", explanation: "استخدام عبارات متنوعة للتعبير عن رأيك الشخصي حول موضوع ما، مثل 'I think...', 'In my opinion...', أو 'What did you think of...?'.", example: "What did you think of the play? It was really boring!" },
    { title: "مفردات الرياضة والترفيه", explanation: "استخدام الأفعال 'play' (للرياضات التي بها كرة)، 'go' (للأنشطة التي تنتهي بـ -ing)، و'do' (للأنشطة الفردية وفنون الدفاع عن النفس).", example: "play football, go skiing, do aerobics" },
    { title: "مفردات الفن والأدب", explanation: "مصطلحات أساسية تتعلق بمجالات الفن المختلفة مثل الرسم (painter, portrait) والأدب (author, novel).", example: "He is a painter. She wrote a novel." },
    { title: "استخدام 'is' أو 'has' المختصرة ('s)", explanation: "يمكن أن تكون 's اختصاراً لـ 'is' (He's running) أو 'has' (He's gone). السياق يحدد المعنى.", example: "He's running. (is) / He's gone home. (has)" },
    { title: "الظروف المعدلة (Modifying Adverbs)", explanation: "تُستخدم الظروف مثل 'very' لتقوية الصفات العادية (very tired)، و'absolutely' لتقوية الصفات القوية (absolutely wonderful).", example: "very tired / absolutely wonderful" },
    { title: "الشرط الصفري (Zero Conditional)", explanation: "يُستخدم للحقائق العامة والعلمية التي تكون صحيحة دائمًا. (If + Present Simple, ... Present Simple)", example: "If you heat ice, it melts." },
    { title: "الجمل الاسمية (Participles)", explanation: "يمكن استخدام صيغ الفعل (-ing و -ed) كصفات لوصف الأسماء، وهي طريقة مختصرة لاستخدام الجمل الوصفية.", example: "The woman driving the car is my aunt. / The book written by him is famous." },
    { title: "العبارات على الهاتف", explanation: "مجموعة من العبارات القياسية المستخدمة في المحادثات الهاتفية، سواء للرد أو لطلب التحدث مع شخص ما أو أخذ رسالة.", example: "Can I take a message? / Would you like to hold?" },
    { title: "مفردات الأحلام والطموحات", explanation: "كلمات وعبارات للتحدث عن الأهداف المهنية والشخصية، مثل 'dream job' (وظيفة الأحلام).", example: "She wants to be a journalist. / He dreams of being a millionaire." },
    { title: "التحدث عن القواعد واللوائح", explanation: "استخدام أفعال مثل 'have to', 'must', 'can't', 'be allowed to' للتحدث عن القوانين والقواعد الإلزامية أو الممنوعة.", example: "You have to wear a seat-belt. / You aren't allowed to smoke here." },
    { title: "التحدث عن الأخبار", explanation: "عبارات شائعة لمناقشة الأحداث الجارية والأخبار، مثل 'Have you heard about...?' أو 'What's in the news today?'.", example: "What's in the news today? / Have you heard about...?" },
    { title: "التحدث عن العادات السابقة", explanation: "استخدام 'used to + infinitive' للحديث عن عادات أو حالات كانت موجودة في الماضي ولكنها لم تعد كذلك الآن.", example: "I used to smoke, but I quit last year." },
    { title: "الضمائر النسبية (Relative Clauses)", explanation: "استخدام كلمات مثل 'who' (للأشخاص)، 'which'/'that' (للأشياء)، و 'where' (للأماكن) لإضافة معلومات أساسية عن اسم ما.", example: "That's the man who lives next door. / The hotel where we stayed was nice." }
];


export function BookScreen() {
    return (
        <section className="animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-center">دروس اللغة الإنجليزية</h2>
            <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {lessons.map((lesson, i) => (
                        <Card key={i} className="transform transition-all hover:scale-[1.03] hover:shadow-lg bg-card/70 backdrop-blur-sm flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg text-primary">{lesson.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col justify-between">
                                <p className="text-muted-foreground mb-3">{lesson.explanation}</p>
                                <div className="p-3 bg-muted/50 rounded-md">
                                  <p className="text-sm font-mono text-left" dir="ltr">{lesson.example}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </section>
    );
}


export function AiScreen() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const askAI = () => {
    if (!input.trim()) return;
    setResponse(`لقد سألت: "${input}". إليك كيف يمكننا المساعدة...`);
    setInput("");
  };

  return (
    <section className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">اسأل الذكاء الاصطناعي</h2>
      <Card className="bg-card/70 backdrop-blur-sm">
        <CardContent className="pt-6">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب سؤالك هنا..."
            rows={3}
            className="w-full p-3 rounded-md focus:ring-2 focus:ring-primary outline-none transition bg-background"
          />
          <Button
            onClick={askAI}
            className="mt-3"
          >
            إرسال السؤال
          </Button>
        </CardContent>
      </Card>
      {response && (
        <Card className="mt-4 bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <p>{response}</p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

export function ProgressScreen() {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prevProgress => (prevProgress >= 85 ? 13 : prevProgress + Math.random() * 15));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">تقدم التعلّم</h2>
      <Card className="bg-card/70 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span>التقدم العام</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="uppercase text-xs text-muted-foreground">الدروس المكتملة</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">14/80</p>
                </CardContent>
            </Card>
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="uppercase text-xs text-muted-foreground">الدروس المتبقية</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">66</p>
                </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

    