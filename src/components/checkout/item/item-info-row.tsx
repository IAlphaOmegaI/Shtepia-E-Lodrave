interface ItemInfoRowProps {
  title: string;
  value: string;
}
export const ItemInfoRow: React.FC<ItemInfoRowProps> = ({ title, value }) => (
  <div className="flex justify-between">
    <p className="text-sm text-gray-600">{title}</p>
    <span className="text-sm text-gray-600">{value}</span>
  </div>
);