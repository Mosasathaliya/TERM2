
export default function LoadingLesson() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-primary/95 text-primary-foreground p-8">
      <div className="h-16 w-16 animate-spin rounded-full border-8 border-solid border-current border-r-transparent mb-6" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <p className="text-3xl font-bold mb-2 text-center">Loading Lesson</p>
      <p className="text-xl text-center text-primary-foreground/80">
        Our AI is preparing your personalized lesson content. This might take a moment.
      </p>
    </div>
  );
}
