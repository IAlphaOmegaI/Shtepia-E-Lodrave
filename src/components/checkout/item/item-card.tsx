interface Props {
  item: any;
  notAvailable?: boolean;
}

const ItemCard = ({ item, notAvailable }: Props) => {
  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(item.itemTotal || item.price * item.quantity);
  
  return (
    <div className="flex justify-between py-2">
      <div className="flex items-center justify-between text-base">
        <span
          className={`text-sm ${notAvailable ? 'text-red-500' : 'text-gray-600'}`}
        >
          <span
            className={`text-sm font-bold ${
              notAvailable ? 'text-red-500' : 'text-gray-900'
            }`}
          >
            {item.quantity}
          </span>
          <span className="mx-2">x</span>
          <span>{item.name}</span> | <span>{item.unit || 'piece'}</span>{' '}
          <span> {item?.in_flash_sale ? '(On Sale)' : ''} </span>
        </span>
      </div>
      <span
        className={`text-sm ${notAvailable ? 'text-red-500' : 'text-gray-600'}`}
      >
        {!notAvailable ? price : 'Unavailable'}
      </span>
    </div>
  );
};

export default ItemCard;