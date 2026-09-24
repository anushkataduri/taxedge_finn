import React, { useState } from "react";
import {
  ProjectLocationCard,
  LandDetailsCard,
  LandParcelsCard,
  RightOfWayCard,
  UtilitiesCard,
  TechnicalDetailsCard,
} from "../index";
import {
  ProjectLocationForm,
  LandDetailsForm,
  LandParcelItem,
  RightOfWayForm,
  UtilitiesForm,
  TechnicalDetailsForm,
} from "../../types/projectFinance.types";

interface Step2LocationViewProps {
  projectLocation: ProjectLocationForm;
  onLocationChange: (field: keyof ProjectLocationForm, value: any) => void;
  landDetails: LandDetailsForm;
  onLandChange: (field: keyof LandDetailsForm, value: any) => void;
  parcels: LandParcelItem[];
  onAddParcel: () => void;
  onUpdateParcel: (id: string, field: keyof LandParcelItem, value: any) => void;
  onDeleteParcel: (id: string) => void;
  rightOfWay: RightOfWayForm;
  onRowChange: (field: keyof RightOfWayForm, value: any) => void;
  utilities: UtilitiesForm;
  onUtilitiesChange: (field: keyof UtilitiesForm, value: any) => void;
  technicalDetails: TechnicalDetailsForm;
  onTechnicalChange: (field: keyof TechnicalDetailsForm, value: any) => void;
}

export const Step2LocationView: React.FC<Step2LocationViewProps> = ({
  projectLocation,
  onLocationChange,
  landDetails,
  onLandChange,
  parcels,
  onAddParcel,
  onUpdateParcel,
  onDeleteParcel,
  rightOfWay,
  onRowChange,
  utilities,
  onUtilitiesChange,
  technicalDetails,
  onTechnicalChange,
}) => {
  const [expanded, setExpanded] = useState({
    location: true,
    land: true,
    parcels: true,
    row: true,
    utilities: true,
    technical: true,
  });

  return (
    <>
      <ProjectLocationCard
        data={projectLocation}
        onChange={onLocationChange}
        isExpanded={expanded.location}
        onToggleExpand={() =>
          setExpanded((p) => ({ ...p, location: !p.location }))
        }
      />
      <LandDetailsCard
        data={landDetails}
        onChange={onLandChange}
        isExpanded={expanded.land}
        onToggleExpand={() => setExpanded((p) => ({ ...p, land: !p.land }))}
      />
      <LandParcelsCard
        parcels={parcels}
        onAddParcel={onAddParcel}
        onUpdateParcel={onUpdateParcel}
        onDeleteParcel={onDeleteParcel}
        isExpanded={expanded.parcels}
        onToggleExpand={() =>
          setExpanded((p) => ({ ...p, parcels: !p.parcels }))
        }
      />
      <RightOfWayCard
        data={rightOfWay}
        onChange={onRowChange}
        isExpanded={expanded.row}
        onToggleExpand={() => setExpanded((p) => ({ ...p, row: !p.row }))}
      />
      <UtilitiesCard
        data={utilities}
        onChange={onUtilitiesChange}
        isExpanded={expanded.utilities}
        onToggleExpand={() =>
          setExpanded((p) => ({ ...p, utilities: !p.utilities }))
        }
      />
      <TechnicalDetailsCard
        data={technicalDetails}
        onChange={onTechnicalChange}
        isExpanded={expanded.technical}
        onToggleExpand={() =>
          setExpanded((p) => ({ ...p, technical: !p.technical }))
        }
      />
    </>
  );
};

export default Step2LocationView;
