export default async function FlashSaleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Flash Sale Detail</h1>
      <p className="text-gray-600">Flash Sale Detail page - slug: {slug}</p>
    </div>
  );
}