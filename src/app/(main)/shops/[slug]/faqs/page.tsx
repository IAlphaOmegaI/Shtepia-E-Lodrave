export default async function ShopFAQsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Shop FAQs</h1>
      <p className="text-gray-600">Shop FAQs page - slug: {slug}</p>
    </div>
  );
}