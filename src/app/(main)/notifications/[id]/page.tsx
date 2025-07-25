export default function NotificationDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Notification Detail</h1>
      <p className="text-gray-600">Notification Detail page - id: {params.id}</p>
    </div>
  );
}