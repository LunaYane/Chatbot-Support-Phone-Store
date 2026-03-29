function ProductCard({ product }) {
  return (
    <div className="w-full max-w-xs rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-32 w-full rounded-lg object-cover"
      />
      <h4 className="mt-3 font-semibold text-slate-800">{product.name}</h4>
      <p className="mt-1 text-sm text-slate-500">{product.brand?.toUpperCase()}</p>
      <p className="mt-2 text-sm text-slate-700">
        RAM {product.ram}GB • ROM {product.rom}GB
      </p>
      <p className="text-sm text-slate-700">Pin {product.battery}mAh • Camera {product.camera}MP</p>
      <p className="mt-3 font-bold text-emerald-600">{Number(product.price).toLocaleString('vi-VN')}đ</p>
    </div>
  );
}

export default ProductCard;
