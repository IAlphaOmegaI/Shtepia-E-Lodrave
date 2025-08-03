export default async function OrderPaymentPage({ params }: { params: Promise<{ tracking_number: string }> }) {
  const { tracking_number } = await params;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Order Payment</h1>
      <p className="text-gray-600">Order Payment page - tracking_number: {tracking_number}</p>
    </div>
  );
}