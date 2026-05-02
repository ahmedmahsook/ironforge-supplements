export default function PageContainer({ children }) {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">

      <div className="pt-[72px]">
        <div
          className="
            max-w-7xl
            mx-auto
            px-4 sm:px-6 lg:px-8
            py-6 sm:py-8
          "
        >
          {children}
        </div>
      </div>
    </div>
  )
}
