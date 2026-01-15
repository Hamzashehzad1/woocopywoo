/**
 * AI Description Generator Service
 * Implements comprehensive prompt engineering for long-form product descriptions
 */

export const generateProductDescription = async (product, businessContext) => {
  const { name, categories, attributes, price, sku } = product;
  const { companyName, description, targetAudience, businessType, usps, writingTone } = businessContext;

  // Simulate AI generation (in production, this would call OpenAI/Anthropic/Gemini API)
  await new Promise(resolve => setTimeout(resolve, 2000));

  const longDescription = generateLongDescription(
    name,
    categories,
    attributes,
    businessType,
    companyName,
    description,
    targetAudience,
    usps,
    writingTone
  );

  const shortDescription = generateShortDescription(
    name,
    categories,
    businessType,
    writingTone
  );

  return {
    longDescription,
    shortDescription,
    wordCount: countWords(longDescription)
  };
};

const countWords = (html) => {
  // Strip HTML tags to count actual words
  const text = html.replace(/<[^>]*>/g, ' ');
  return text.trim().split(/\s+/).length;
};

const generateLongDescription = (
  title,
  categories,
  attributes,
  businessType,
  companyName,
  businessDesc,
  targetAudience,
  usps,
  tone
) => {
  const category = categories && categories.length > 0 ? categories[0].name : 'Product';

  return `<h2>Product Overview</h2>

<p>${title} is a premium ${category.toLowerCase()} designed specifically for ${targetAudience || 'professional use'}. As a leading ${businessType}, ${companyName || 'our company'} brings you this exceptional product that combines quality, reliability, and performance. ${businessDesc || 'We specialize in delivering superior products to meet your business needs.'}</p>

<p>This ${category.toLowerCase()} represents the pinnacle of manufacturing excellence, incorporating advanced materials and precision engineering to deliver outstanding results. Whether you're looking to enhance your product lineup or meet specific customer demands, ${title} provides the perfect solution for your business requirements.</p>

<h2>Key Features & Benefits</h2>

${generateFeaturesBullets(title, category, businessType)}

<h2>Technical Specifications</h2>

<table class="woocommerce-product-attributes shop_attributes" style="border-collapse: collapse; width: 100%;">
  <tbody>
    <tr><th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Feature</th><th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Details</th></tr>
    <tr><td style="border: 1px solid #ddd; padding: 8px;">Product Name</td><td style="border: 1px solid #ddd; padding: 8px;">${title}</td></tr>
    <tr><td style="border: 1px solid #ddd; padding: 8px;">Category</td><td style="border: 1px solid #ddd; padding: 8px;">${category}</td></tr>
    <tr><td style="border: 1px solid #ddd; padding: 8px;">Application</td><td style="border: 1px solid #ddd; padding: 8px;">${targetAudience || 'Professional & Commercial Use'}</td></tr>
    <tr><td style="border: 1px solid #ddd; padding: 8px;">Quality Standard</td><td style="border: 1px solid #ddd; padding: 8px;">Premium Grade</td></tr>
    <tr><td style="border: 1px solid #ddd; padding: 8px;">Packaging</td><td style="border: 1px solid #ddd; padding: 8px;">Industry Standard</td></tr>
    <tr><td style="border: 1px solid #ddd; padding: 8px;">Shelf Life</td><td style="border: 1px solid #ddd; padding: 8px;">Extended (See Product Label)</td></tr>
    <tr><td style="border: 1px solid #ddd; padding: 8px;">Origin</td><td style="border: 1px solid #ddd; padding: 8px;">${companyName || 'Quality Manufacturer'}</td></tr>
    ${attributes && Object.keys(attributes).length > 0 ? generateAttributeRows(attributes) : ''}
  </tbody>
</table>

<h2>Use Cases & Applications</h2>

${generateUseCases(title, category, businessType, targetAudience)}

<h2>Why Buy From ${companyName || 'Us'}</h2>

<p>As a trusted ${businessType}, we understand the unique needs of businesses like yours. When you choose ${title}, you're not just purchasing a product – you're partnering with a company committed to your success.</p>

${usps && usps.length > 0 ?
      `<ul>${usps.map(usp => `<li><strong>${usp}</strong>: We deliver on our promises with proven track record and customer satisfaction.</li>`).join('')}</ul>` :
      `<ul>
    <li><strong>Quality Assurance</strong>: Every product undergoes rigorous quality control</li>
    <li><strong>Competitive Pricing</strong>: Direct from manufacturer pricing for maximum value</li>
    <li><strong>Reliable Supply</strong>: Consistent inventory and fast shipping</li>
    <li><strong>Expert Support</strong>: Dedicated customer service team</li>
  </ul>`
    }

<p>Our ${businessType} model ensures you receive the best possible pricing without compromising on quality. We work directly with manufacturers and maintain strict quality standards to ensure every unit meets or exceeds industry expectations.</p>

<h2>Comparison: ${title} vs. Standard Alternatives</h2>

<table class="comparison-table" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Aspect</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">${title}</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Standard Market Options</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border: 1px solid #ddd; padding: 8px;">Quality</td><td style="border: 1px solid #ddd; padding: 8px;">Premium Grade</td><td style="border: 1px solid #ddd; padding: 8px;">Variable</td></tr>
    <tr><td style="border: 1px solid #ddd; padding: 8px;">Consistency</td><td style="border: 1px solid #ddd; padding: 8px;">Guaranteed</td><td style="border: 1px solid #ddd; padding: 8px;">Inconsistent</td></tr>
    <tr><td style="border: 1px solid #ddd; padding: 8px;">Support</td><td style="border: 1px solid #ddd; padding: 8px;">Full Technical Support</td><td style="border: 1px solid #ddd; padding: 8px;">Limited</td></tr>
    <tr><td style="border: 1px solid #ddd; padding: 8px;">Pricing</td><td style="border: 1px solid #ddd; padding: 8px;">Competitive ${businessType} Rates</td><td style="border: 1px solid #ddd; padding: 8px;">Retail Markup</td></tr>
    <tr><td style="border: 1px solid #ddd; padding: 8px;">Availability</td><td style="border: 1px solid #ddd; padding: 8px;">Reliable Stock</td><td style="border: 1px solid #ddd; padding: 8px;">Often Out of Stock</td></tr>
  </tbody>
</table>

<h2>Storage, Handling & Safety</h2>

<ul>
  <li>Store in a cool, dry place away from direct sunlight</li>
  <li>Keep in original packaging until ready to use</li>
  <li>Follow all manufacturer guidelines for handling</li>
  <li>Ensure proper ventilation in storage areas</li>
  <li>Check expiration dates and rotate stock accordingly</li>
  <li>Dispose of packaging materials according to local regulations</li>
  <li>Refer to Safety Data Sheet (SDS) for detailed safety information</li>
</ul>

<h2>Frequently Asked Questions</h2>

<div class="faq-section">
  <p><strong>Q: What makes ${title} different from similar products?</strong><br>
  A: ${title} is manufactured to the highest quality standards and backed by ${companyName || 'our company'}'s reputation as a leading ${businessType}. We ensure consistent quality, competitive pricing, and reliable availability.</p>

  <p><strong>Q: What is the minimum order quantity?</strong><br>
  A: As a ${businessType}, we offer flexible ordering options to meet your business needs. Contact our sales team for current MOQ and volume pricing.</p>

  <p><strong>Q: How quickly can you ship ${title}?</strong><br>
  A: We maintain robust inventory levels and typically ship within 1-3 business days. Expedited shipping options are available for urgent orders.</p>

  <p><strong>Q: Do you provide technical specifications or certificates?</strong><br>
  A: Yes, we provide complete technical documentation, certificates of analysis, and any required compliance documentation with each order.</p>

  <p><strong>Q: What is your return policy?</strong><br>
  A: We stand behind our products with a comprehensive satisfaction guarantee. Defective or damaged products can be returned within 30 days for full refund or replacement.</p>

  <p><strong>Q: Can I get samples before placing a bulk order?</strong><br>
  A: Absolutely! We encourage testing our products before committing to larger orders. Contact our sales team to arrange sample shipments.</p>
</div>

<h2>About ${companyName || 'Our Company'}</h2>

<p>${businessDesc || `We are a professional ${businessType} specializing in high-quality products for ${targetAudience || 'businesses'}. With years of experience in the industry, we've built our reputation on reliability, quality, and exceptional customer service.`}</p>

<p>Our commitment to excellence means you can trust ${title} to meet your exact specifications and deliver consistent performance. We work closely with our clients to understand their unique needs and provide tailored solutions that drive business success.</p>

<hr>

<p><em>For bulk pricing, technical specifications, or custom orders, please contact our sales team. We're here to help your business thrive.</em></p>
`;
};

const generateFeaturesBullets = (title, category, businessType) => {
  return `<ul>
    <li><strong>Premium Quality Construction</strong>: Manufactured to the highest industry standards, ensuring long-lasting performance and reliability for your business operations.</li>
    <li><strong>Consistent Performance</strong>: Every unit of ${title} delivers the same exceptional quality, eliminating variability and ensuring predictable results.</li>
    <li><strong>Cost-Effective Solution</strong>: Direct ${businessType} pricing means you get premium quality without the retail markup, maximizing your profit margins.</li>
    <li><strong>Ready for Immediate Use</strong>: Arrives properly packaged and ready to integrate into your product lineup or operations without delay.</li>
    <li><strong>Comprehensive Documentation</strong>: Includes all necessary technical specifications, safety information, and compliance certificates.</li>
    <li><strong>Scalable Ordering</strong>: Whether you need a single unit or bulk quantities, we accommodate orders of all sizes to match your business growth.</li>
    <li><strong>Expert Technical Support</strong>: Our knowledgeable team is available to answer questions and provide guidance on optimal usage and applications.</li>
    <li><strong>Industry Compliance</strong>: Meets or exceeds all relevant industry standards and regulations for ${category.toLowerCase()} products.</li>
  </ul>`;
};

const generateUseCases = (title, category, businessType, targetAudience) => {
  return `<ul>
    <li><strong>Retail Distribution</strong>: Perfect for retailers looking to stock high-quality ${category.toLowerCase()} products with reliable supply chains.</li>
    <li><strong>Professional Applications</strong>: Ideal for ${targetAudience || 'professional users'} who demand consistent quality and performance.</li>
    <li><strong>Bulk Operations</strong>: Suitable for businesses requiring large quantities with guaranteed availability and competitive pricing.</li>
    <li><strong>Resale Opportunities</strong>: Excellent margins for resellers and distributors looking to expand their product offerings.</li>
    <li><strong>Commercial Use</strong>: Designed to meet the demanding requirements of commercial and industrial applications.</li>
    <li><strong>Private Labeling</strong>: Available for private label programs – contact us for customization options.</li>
  </ul>`;
};

const generateAttributeRows = (attributes) => {
  return Object.entries(attributes)
    .map(([key, value]) => `<tr><td style="border: 1px solid #ddd; padding: 8px;">${key}</td><td style="border: 1px solid #ddd; padding: 8px;">${Array.isArray(value) ? value.join(', ') : value}</td></tr>`)
    .join('');
};

const generateShortDescription = (title, categories, businessType, tone) => {
  const category = categories && categories.length > 0 ? categories[0].name : 'product';

  const bullets = [
    `Premium ${category.toLowerCase()} from trusted ${businessType}`,
    `Guaranteed quality and consistent performance`,
    `Competitive pricing with bulk discounts available`,
    `Fast shipping and reliable inventory`,
    `Full technical support and documentation`,
    `Industry-compliant and safety-tested`
  ];

  return `<ul>${bullets.slice(0, 6).map(b => `<li>${b}</li>`).join('')}</ul>`;
};

// Batch generation
export const generateBatchDescriptions = async (products, businessContext, onProgress) => {
  const results = {};

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    results[product.id] = await generateProductDescription(product, businessContext);

    if (onProgress) {
      onProgress({
        current: i + 1,
        total: products.length,
        product: product.name
      });
    }
  }

  return results;
};
