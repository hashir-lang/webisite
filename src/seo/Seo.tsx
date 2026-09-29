import { Helmet } from "react-helmet-async";
import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_DESCRIPTION,
  absoluteUrl,
} from "./siteMeta";
import { useMetaOverride } from "@/cms/useContent";

type JsonLd = Record<string, unknown>;

interface SeoProps {
  /** Full <title> for the page (already includes the brand where relevant). */
  title: string;
  description?: string;
  keywords?: string;
  /** Route path for the canonical URL, e.g. "/about-us". Defaults to the current pathname. */
  canonicalPath?: string;
  /** Absolute or root-relative image URL for social sharing. */
  image?: string;
  /** og:type — "website" for most pages, "article" for blog posts. */
  type?: "website" | "article";
  /** Discourage indexing (e.g. admin, thank-you, 404 pages). */
  noindex?: boolean;
  /** One or more JSON-LD structured-data objects to inject. */
  schema?: JsonLd | JsonLd[];
}

/**
 * Per-page SEO tags via react-helmet-async: title, description, keywords,
 * canonical, Open Graph, Twitter Card and optional JSON-LD structured data.
 * Rendered inside any page component; the tags are hoisted into <head> and
 * captured by the prerenderer so crawlers receive fully-formed metadata.
 *
 * The props are the compiled defaults. Anything an admin has set for this
 * route in the CMS (/admin/seo) wins over them — looked up by the canonical
 * path, so every route is covered without each page knowing about the CMS.
 */
const Seo = (props: SeoProps) => {
  const path =
    props.canonicalPath ??
    (typeof window !== "undefined" ? window.location.pathname : "/");
  const override = useMetaOverride(path);

  const title = override?.title || props.title;
  const description = override?.description || props.description || DEFAULT_DESCRIPTION;
  const keywords = override?.keywords || props.keywords;
  const image = override?.ogImage || props.image || DEFAULT_OG_IMAGE;
  const type = props.type ?? "website";
  const noindex = override?.noindex ?? props.noindex ?? false;
  const { schema } = props;

  const canonical = absoluteUrl(path);
  const ogImage = image.startsWith("http") ? image : absoluteUrl(image);
  const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />
      {noindex ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="en_GB" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {schemas.map((s, i) => (
        <script type="application/ld+json" key={i}>
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
