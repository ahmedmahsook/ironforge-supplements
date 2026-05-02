import PageContainer from "../components/layout/PageContainer"
import HeroSection from "../Home/HeroSection"
import FeaturedProducts from "../Home/FeaturedProducts"
import CategoryGrid from "../Home/CategoryGrid"
import WhyChooseUs from "../Home/WhyChooseUs"

export default function Home() {
  return (
    <PageContainer>
      <HeroSection />
      <FeaturedProducts />
      <CategoryGrid />
      <WhyChooseUs />
    </PageContainer>
  )
}
