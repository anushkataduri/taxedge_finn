import React, { useState } from "react";
import {
  ProductsServicesCard,
  MarketDetailsCard,
  CustomersOfftakersCard,
  RevenueProjectionsCard,
  SensitivityAnalysisCard,
} from "../index";
import {
  ProductServiceItem,
  MarketDetailsForm,
  CustomerOfftakerItem,
  RevenueProjectionYear,
  SensitivityAnalysisForm,
} from "../../types/projectFinance.types";

interface Step4MarketFinancialsViewProps {
  products: ProductServiceItem[];
  onAddProduct: (item: ProductServiceItem) => void;
  onUpdateProduct: (item: ProductServiceItem) => void;
  onDeleteProduct: (id: string) => void;
  marketDetails: MarketDetailsForm;
  onMarketChange: (field: keyof MarketDetailsForm, value: any) => void;
  customers: CustomerOfftakerItem[];
  onAddCustomer: (item: CustomerOfftakerItem) => void;
  onUpdateCustomer: (item: CustomerOfftakerItem) => void;
  onDeleteCustomer: (id: string) => void;
  revenueProjections: RevenueProjectionYear[];
  onChangeProjection: (index: number, field: keyof RevenueProjectionYear, value: string) => void;
  sensitivityAnalysis: SensitivityAnalysisForm;
  onSensitivityChange: (field: keyof SensitivityAnalysisForm, value: any) => void;
}

export const Step4MarketFinancialsView: React.FC<Step4MarketFinancialsViewProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  marketDetails,
  onMarketChange,
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  revenueProjections,
  onChangeProjection,
  sensitivityAnalysis,
  onSensitivityChange,
}) => {
  const [expanded, setExpanded] = useState({
    products: true,
    market: true,
    customers: true,
    revenue: true,
    sensitivity: true,
  });

  return (
    <>
      <ProductsServicesCard
        products={products}
        onAddProduct={onAddProduct}
        onUpdateProduct={onUpdateProduct}
        onDeleteProduct={onDeleteProduct}
        isExpanded={expanded.products}
        onToggleExpand={() =>
          setExpanded((p) => ({ ...p, products: !p.products }))
        }
      />
      <MarketDetailsCard
        data={marketDetails}
        onChange={onMarketChange}
        isExpanded={expanded.market}
        onToggleExpand={() => setExpanded((p) => ({ ...p, market: !p.market }))}
      />
      <CustomersOfftakersCard
        customers={customers}
        onAddCustomer={onAddCustomer}
        onUpdateCustomer={onUpdateCustomer}
        onDeleteCustomer={onDeleteCustomer}
        isExpanded={expanded.customers}
        onToggleExpand={() =>
          setExpanded((p) => ({ ...p, customers: !p.customers }))
        }
      />
      <RevenueProjectionsCard
        projections={revenueProjections}
        onChangeProjection={onChangeProjection}
        isExpanded={expanded.revenue}
        onToggleExpand={() => setExpanded((p) => ({ ...p, revenue: !p.revenue }))}
      />
      <SensitivityAnalysisCard
        data={sensitivityAnalysis}
        onChange={onSensitivityChange}
        isExpanded={expanded.sensitivity}
        onToggleExpand={() =>
          setExpanded((p) => ({ ...p, sensitivity: !p.sensitivity }))
        }
      />
    </>
  );
};

export default Step4MarketFinancialsView;
