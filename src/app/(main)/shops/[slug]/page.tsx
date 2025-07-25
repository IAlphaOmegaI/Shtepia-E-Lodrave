export default function ShopDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Shop Detail</h1>
      <p className="text-gray-600">Shop Detail page - slug: {params.slug}</p>
    </div>
  );
}