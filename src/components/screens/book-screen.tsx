import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';

const books = [
  { title: "فن التعلم", author: "جوش وايتزكين", hint: "abstract art" },
  { title: "التصميم من أجل التأثير", author: "تيم براون", hint: "modern design" },
  { title: "إتقان React", author: "جون دو", hint: "code computer" },
  { title: "قوانين البساطة", author: "جون مايدا", hint: "minimalist pattern" },
];

export function BookScreen() {
  return (
    <section>
      <h2 className="text-3xl font-bold tracking-tighter mb-6">مكتبتك</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book, i) => (
          <Card key={i} className="bg-card/80 backdrop-blur-sm overflow-hidden group transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/10">
            <CardContent className="p-0">
              <div className="flex items-center gap-4">
                <Image 
                  src={`https://placehold.co/200x300.png`} 
                  alt={book.title} 
                  width={80} 
                  height={120}
                  className="w-20 h-auto object-cover" 
                  data-ai-hint={book.hint}
                />
                <div className="py-4 pl-4">
                  <h3 className="font-semibold text-lg">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
