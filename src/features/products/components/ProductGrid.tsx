import { ProductCard } from '../../../components/shared/ProductCard'
import { useProducts } from '../hooks/useProducts'

export function ProductGrid() {
    const { data } = useProducts()
    const products = data?.products ?? []

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}