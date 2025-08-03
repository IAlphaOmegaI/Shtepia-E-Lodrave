export default async function AuthorDetailPage({ params }: { params: Promise<{ author: string }> }) {
  const { author } = await params;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Author Detail</h1>
      <p className="text-gray-600">Author Detail page - author: {author}</p>
    </div>
  );
}