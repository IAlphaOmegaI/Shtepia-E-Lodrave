export default function ShopFAQsPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Shop FAQs</h1>
      <p className="text-gray-600">Shop FAQs page - slug: {params.slug}</p>
    </div>
  );
}