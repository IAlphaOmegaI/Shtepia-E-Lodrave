export default function AuthorDetailPage({ params }: { params: { author: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Author Detail</h1>
      <p className="text-gray-600">Author Detail page - author: {params.author}</p>
    </div>
  );
}