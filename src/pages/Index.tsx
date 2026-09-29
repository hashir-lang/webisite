import PageLayout from "@/components/layout/PageLayout";
import Hero from "@/components/sections/Hero";
import ValueCards from "@/components/sections/ValueCards";
import PartnersMarquee from "@/components/sections/PartnersMarquee";
import FeaturedCourses from "@/components/sections/FeaturedCourses";
import WhyStudy from "@/components/sections/WhyStudy";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import Seo from "@/seo/Seo";
import { PAGE_META, organizationSchema, websiteSchema } from "@/seo/siteMeta";

const Index = () => {
  return (
    <PageLayout>
      <Seo
        title={PAGE_META.home.title}
        description={PAGE_META.home.description}
        keywords={PAGE_META.home.keywords}
        canonicalPath={PAGE_META.home.path}
        schema={[organizationSchema, websiteSchema]}
      />
      <Hero />
      <PartnersMarquee />
      <ValueCards />
      <FeaturedCourses />
      <WhyStudy />
      <Testimonials />
      <FAQ />
    </PageLayout>
  );
};

export default Index;
