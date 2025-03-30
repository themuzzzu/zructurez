
interface ProductSpecificationsProps {
  product: any;
}

export const ProductSpecifications = ({ product }: ProductSpecificationsProps) => {
  // Group specifications by category
  // In a real app, this would come from the database
  const specifications = {
    'General': [
      { name: 'Brand', value: product.brand_name || 'Generic' },
      { name: 'Model', value: product.model || 'Standard Model' },
      { name: 'Type', value: product.type || 'Regular' },
      { name: 'Color', value: product.color || 'Multiple Options' }
    ],
    'Physical Specifications': [
      { name: 'Dimensions', value: product.dimensions || '10 x 5 x 2 cm (approx)' },
      { name: 'Weight', value: product.weight || '150g (approx)' },
      { name: 'Material', value: product.material || 'Premium materials' }
    ],
    'Packaging Details': [
      { name: 'Package Contents', value: '1 x Product, User Manual' },
      { name: 'Box Dimensions', value: '12 x 7 x 4 cm (approx)' }
    ],
    'Warranty & Support': [
      { name: 'Warranty', value: product.warranty || '1 Year Manufacturer Warranty' },
      { name: 'Support', value: 'Customer Service Available 24/7' }
    ]
  };

  return (
    <div className="space-y-6">
      {Object.entries(specifications).map(([category, specs]) => (
        <div key={category}>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {specs.map((spec, index) => (
              <div key={index} className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-foreground">{spec.name}</span>
                <span className="font-medium text-foreground">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
