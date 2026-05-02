import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../api/api"
import PageContainer from "../components/layout/PageContainer"
import ProductImage from "../Products/ProductImage"
import ProductInfo from "../Products/ProductInfo"
import ProductActions from "../Products/ProductActions"

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`)
        setProduct(data)
      } catch {
        navigate("/products")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, navigate])

  if (loading) {
    return (
      <PageContainer>
        <div className="py-32 flex justify-center">
          <p className="text-gray-400 text-sm">Loading product...</p>
        </div>
      </PageContainer>
    )
  }

  if (!product) return null

  return (
    <PageContainer>

      <div className="max-w-6xl mx-auto py-14">

        {/* MAIN WRAPPER */}
        <div className="
          bg-[#111]
          border border-[#222]
          rounded-2xl
          p-6 md:p-10
        ">

          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* IMAGE */}
            <div className="flex justify-center">

              <div className="
                relative
                w-full max-w-sm
                flex items-center justify-center
              ">

                {/* subtle glow */}
                <div className="absolute w-64 h-64 bg-green-500/10 blur-2xl"></div>

                <div className="
                  relative
                  bg-white
                  rounded-2xl
                  p-6
                ">
                  <ProductImage product={product} />
                </div>

              </div>

            </div>

            {/* INFO */}
            <div className="space-y-8">

              <ProductInfo product={product} />

              <div className="pt-6 border-t border-[#222]">
                <ProductActions
                  product={product}
                  from={location.pathname}
                />
              </div>

            </div>

          </div>

        </div>

      </div>

    </PageContainer>
  )
}