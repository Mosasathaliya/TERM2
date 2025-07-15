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
    { title: "أزمنة الأفعال المساعدة", explanation: "فهم دور 'do', 'be', 'have' في تكوين الأزمنة.", example: "Where do you come from? / I am studying. / I have finished." },
    { title: "الأسئلة والنفي", explanation: "كيفية تكوين الأسئلة والجمل المنفية في الأزمنة المختلفة.", example: "What did you do? / Cows don't eat meat." },
    { title: "زمن المضارع البسيط", explanation: "يُستخدم للتعبير عن الحقائق والعادات.", example: "The sun rises in the east." },
    { title: "زمن المضارع المستمر", explanation: "يُستخدم لوصف فعل يحدث الآن.", example: "He is working in France at the moment." },
    { title: "المبني للمجهول في المضارع", explanation: "يُستخدم عندما يكون الفاعل غير معروف أو غير مهم.", example: "Children are treated with new medicine." },
    { title: "الفرق بين المضارع البسيط والمستمر", explanation: "متى نستخدم كل زمن؟ الفرق بين الحدث الدائم والمؤقت.", example: "She usually drives, but today she's walking." },
    { title: "زمن الماضي البسيط", explanation: "يُستخدم لوصف حدث اكتمل في الماضي.", example: "He danced and sang all night." },
    { title: "زمن الماضي المستمر", explanation: "يُستخدم لوصف فعل كان مستمرًا في الماضي.", example: "He was laughing when he saw the baby." },
    { title: "زمن الماضي التام", explanation: "يُستخدم لوصف حدث وقع قبل حدث آخر في الماضي.", example: "Had you heard the joke before?" },
    { title: "المبني للمجهول في الماضي", explanation: "يُستخدم عندما يكون الفاعل في الماضي غير مهم.", example: "The book was written by Hemingway." },
    { title: "أفعال Modal (الإلزام)", explanation: "تُستخدم للتعبير عن الالتزام والضرورة.", example: "Children have to go to school." },
    { title: "أفعال Modal (السماح)", explanation: "تُستخدم للتعبير عن الإذن والسماح.", example: "We're allowed to wear jeans." },
    { title: "أفعال Modal (النصيحة)", explanation: "تُستخدم لتقديم نصيحة أو توصية.", example: "You should take traveller's cheques." },
    { title: "صيغ المستقبل (going to)", explanation: "تُستخدم للتعبير عن خطة أو نية مستقبلية.", example: "I'm going to buy some." },
    { title: "صيغ المستقبل (will)", explanation: "تُستخدم للقرارات الفورية أو التنبؤات.", example: "I'll get a loaf of bread." },
    { title: "صيغ المستقبل (المضارع المستمر)", explanation: "استخدام المضارع المستمر للترتيبات المستقبلية المؤكدة.", example: "We're playing tennis this afternoon." },
    { title: "السؤال بـ 'like'", explanation: "يُستخدم للسؤال عن الوصف أو التفضيلات.", example: "What's she like? / What does she like doing?" },
    { title: "أنماط الأفعال (Verb Patterns)", explanation: "بعض الأفعال يتبعها صيغة -ing أو to-infinitive.", example: "I enjoyed meeting your friends." },
    { title: "زمن المضارع التام", explanation: "يُستخدم لربط الماضي بالحاضر.", example: "I've worked there for five years." },
    { title: "مقارنة بين المضارع التام والماضي البسيط", explanation: "متى نستخدم كل زمن؟ التركيز على الوقت المحدد مقابل التجربة.", example: "I've worked there for five years. (still there) / I worked for the BBC. (finished)" },
    { title: "المبني للمجهول في المضارع التام", explanation: "يُستخدم لحدث تم في الماضي وله أثر في الحاضر، مع التركيز على المفعول به.", example: "Two prizes have been awarded." },
    { title: "الأفعال المركبة (Phrasal Verbs)", explanation: "أفعال يتغير معناها بإضافة حرف جر.", example: "She looked out of the window." },
    { title: "الأفعال المركبة (القابلة للفصل وغير القابلة للفصل)", explanation: "بعض الأفعال المركبة يمكن فصلها بالضمير وبعضها لا يمكن.", example: "Turn it on. / Look after it." },
    { title: "الجمل الشرطية (النوع الأول)", explanation: "تُستخدم للتعبير عن موقف محتمل ونتيجته المحتملة.", example: "If I see Anna, I'll tell her." },
    { title: "الجمل الشرطية (النوع الثاني)", explanation: "تُستخدم للتعبير عن مواقف خيالية أو غير محتملة.", example: "If I had £5 million, I'd buy an island." },
    { title: "جمل الوقت (Time Clauses)", explanation: "تُستخدم لربط حدثين في المستقبل.", example: "When we get there, we'll call you." },
    { title: "أفعال Modal (الاحتمالية)", explanation: "تُستخدم للتعبير عن درجات اليقين.", example: "She might be in love." },
    { title: "الأفعال Modal في الماضي (الاحتمالية)", explanation: "تُستخدم للتعبير عن احتمالية في الماضي.", example: "It could have been her suitcase." },
    { title: "العلاقات والصفات الشخصية", explanation: "كلمات لوصف شخصية الناس.", example: "He is very reliable and sociable." },
    { title: "الموافقة والاختلاف", explanation: "عبارات مثل 'So do I' و 'Neither do I'.", example: "A: I love chocolate. B: So do I." },
    { title: "المضارع التام المستمر", explanation: "يُستخدم لفعل بدأ في الماضي وما زال مستمراً.", example: "I've been texting my friends all day." },
    { title: "التعبيرات الزمنية", explanation: "كلمات مثل 'since' و 'for' مع الأزمنة التامة.", example: "She's been living in Paris since she got married." },
    { title: "الأسئلة غير المباشرة", explanation: "طريقة مهذبة للسؤال.", example: "I wonder if you could help me." },
    { title: "الأسئلة المذيلة (Question Tags)", explanation: "أسئلة قصيرة في نهاية الجملة للتأكيد.", example: "It's a lovely day, isn't it?" },
    { title: "الكلام المنقول (Statements)", explanation: "نقل كلام شخص آخر.", example: "She said that they were married." },
    { title: "الكلام المنقول (Questions)", explanation: "نقل سؤال شخص آخر.", example: "He asked me how I knew them." },
    { title: "الكلام المنقول (Commands)", explanation: "نقل أمر أو طلب.", example: "He told them to stop making a noise." },
    { title: "الأسماء المركبة", explanation: "اسمان يكونان كلمة واحدة جديدة.", example: "He is a famous movie star." },
    { title: "التعابير الاصطلاحية (Idioms)", explanation: "عبارات لها معنى مختلف عن معنى كلماتها.", example: "Don't worry, it's a piece of cake." },
    { title: "المفردات: الولادة، الزواج، الموت", explanation: "كلمات تتعلق بأحداث الحياة الكبرى.", example: "They got engaged last year." },
    { title: "التعبير عن الكمية", explanation: "كلمات مثل 'much', 'many', 'a lot of'.", example: "How much coffee do you drink?" },
    { title: "الإنجليزية غير الرسمية", explanation: "عبارات عامية تُستخدم في المحادثات اليومية.", example: "What's up? / How's it going?" },
    { title: "الاعتذار", explanation: "طرق مختلفة لقول 'آسف'.", example: "I'm so sorry! / Excuse me!" },
    { title: "الأجوبة القصيرة", explanation: "استخدام الأفعال المساعدة للرد بإيجاز.", example: "A: Do you like tea? B: Yes, I do." },
    { title: "مفردات السفر", explanation: "كلمات تستخدم في المطار والفنادق.", example: "Could you tell me where Gate 23 is?" },
    { title: "وصف الطعام والمدن والأشخاص", explanation: "صفات متنوعة للوصف.", example: "The food was delicious and the city was historic." },
    { title: "التعبيرات الاجتماعية", explanation: "عبارات شائعة في المحادثات اليومية.", example: "Never mind. / Take care!" },
    { title: "الأرقام والتواريخ", explanation: "كيفية قول الأعداد والمال والتواريخ.", example: "It costs €9.40. The date is 15/7/94." },
    { title: "الطلبات والعروض", explanation: "كيفية طلب الأشياء أو عرض المساعدة بأدب.", example: "Could you help me? / Shall I help you?" },
    { title: "مفردات الطقس", explanation: "كلمات لوصف أحوال الطقس المختلفة.", example: "It's sunny today, but it might be windy tomorrow." },
    { title: "الصفات القوية والأساسية", explanation: "استخدام كلمات مثل 'good' مقابل 'wonderful'.", example: "The film wasn't just good, it was wonderful." },
    { title: "أجزاء الكلام", explanation: "فهم دور الكلمات (فعل، اسم، صفة).", example: "He was eating his popcorn loudly." },
    { title: "تكوين الكلمات", explanation: "إضافة لاحقات مثل -or, -ion, -ive.", example: "My brother is an actor." },
    { title: "الكلمات المتلازمة (Collocations)", explanation: "كلمات تأتي معًا بشكل شائع.", example: "You paint a picture, but read a poem." },
    { title: "كلمات الجنسية", explanation: "الفرق بين البلد والصفة والشعب.", example: "I am from France. I am French. The French love cheese." },
    { title: "تقديم الاقتراحات", explanation: "عبارات لتقديم الأفكار.", example: "Why don't you ask your parents?" },
    { title: "الأسماء والأفعال المتلازمة", explanation: "أفعال وأسماء معينة تستخدم معًا.", example: "You whistle a tune or lick an ice-cream." },
    { title: "تصحيح الأخطاء", explanation: "مهارة العثور على الأخطاء اللغوية وتصحيحها.", example: "Incorrect: I am liking this. Correct: I like this." },
    { title: "كتابة الرسائل ورسائل البريد الإلكتروني", explanation: "هياكل وعبارات للرسائل الرسمية وغير الرسمية.", example: "Dear Sir/Madam, I am writing to apply for..." },
    { title: "كتابة السرد (Narrative)", explanation: "كيفية سرد قصة بترتيب منطقي.", example: "First, we went to the park. Then, we saw a movie." },
    { title: "كتابة المقالات (For and Against)", explanation: "عرض الحجج المؤيدة والمعارضة لموضوع ما.", example: "On the one hand, technology connects us. On the other hand, it can isolate us." },
    { title: "وصف مكان أو شخص", explanation: "استخدام الصفات والتفاصيل لإنشاء صورة حية.", example: "New York is a bustling city with towering skyscrapers." },
    { title: "كتابة السيرة الذاتية (Biography)", explanation: "سرد قصة حياة شخص ما بترتيب زمني.", example: "Picasso was born in 1881 and showed genius from a young age." },
    { title: "ربط الأفكار", explanation: "استخدام كلمات الربط مثل 'and', 'but', 'so', 'because'.", example: "I was tired, so I went to bed early." },
    { title: "تقديم الآراء", explanation: "عبارات للتعبير عن رأيك في الأفلام والمسرحيات والطعام.", example: "What did you think of the play? It was really boring!" },
    { title: "مفردات الرياضة والترفيه", explanation: "استخدام play, go, do مع الأنشطة المختلفة.", example: "play football, go skiing, do aerobics" },
    { title: "مفردات الفن والأدب", explanation: "مصطلحات متعلقة بالرسم والكتابة.", example: "He is a painter. She wrote a novel." },
    { title: "استخدام 'is' أو 'has' المختصرة ('s)", explanation: "التمييز بين 'He's a doctor' و 'He's got a car'.", example: "He's running. (is) / He's gone home. (has)" },
    { title: "الظروف المعدلة (Modifying Adverbs)", explanation: "استخدام كلمات مثل 'very' و 'absolutely' لتقوية الصفات.", example: "very tired / absolutely wonderful" },
    { title: "الشرط الصفري (Zero Conditional)", explanation: "يُستخدم للحقائق العامة التي تكون صحيحة دائمًا.", example: "If you heat ice, it melts." },
    { title: "الجمل الاسمية (Participles)", explanation: "استخدام -ing و -ed كصفات بعد الأسماء.", example: "The woman driving the car is my aunt. / The book written by him is famous." },
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
                    <p className="text-2xl font-bold">14/20</p>
                </CardContent>
            </Card>
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="uppercase text-xs text-muted-foreground">الدروس المتبقية</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">6</p>
                </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
