export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Product Detail: {params.slug}</h1>
      <p className="text-gray-600">Individual product details will be here</p>
    </div>
  );
}