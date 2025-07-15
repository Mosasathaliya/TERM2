import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';

const books = [
  { title: "The Art of Learning", author: "Josh Waitzkin", hint: "abstract art" },
  { title: "Designing for Impact", author: "Tim Brown", hint: "modern design" },
  { title: "Mastering React", author: "John Doe", hint: "code computer" },
  { title: "The Laws of Simplicity", author: "John Maeda", hint: "minimalist pattern" },
];

export function BookScreen() {
  return (
    <section>
      <h2 className="text-3xl font-bold tracking-tighter mb-6">Your Library</h2>
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
                <div className="py-4 pr-4">
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
