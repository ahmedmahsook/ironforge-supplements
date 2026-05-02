// pages/OrderSuccess.jsx
import { Link } from "react-router-dom"
import PageContainer from "../components/layout/PageContainer"

export default function OrderSuccess() {
  return (
    <PageContainer>
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-green-500">
          Order Placed Successfully 🎉
        </h2>

        <p className="text-[#8a8a8a] mt-4">
          Thank you for shopping with IronForge.
        </p>

        <Link
          to="/products"
          className="inline-block mt-8 bg-green-600
                     hover:bg-green-700 text-black
                     px-6 py-3 rounded-md font-semibold"
        >
          Continue Shopping
        </Link>
      </div>
    </PageContainer>
  )
}
