export default function OrderThankYouPage({ params }: { params: { tracking_number: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Order Thank You</h1>
      <p className="text-gray-600">Order Thank You page - tracking_number: {params.tracking_number}</p>
    </div>
  );
}