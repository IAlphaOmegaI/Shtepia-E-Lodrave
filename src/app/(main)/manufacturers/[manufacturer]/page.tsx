export default function ManufacturerDetailPage({ params }: { params: { manufacturer: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Manufacturer Detail</h1>
      <p className="text-gray-600">Manufacturer Detail page - manufacturer: {params.manufacturer}</p>
    </div>
  );
}