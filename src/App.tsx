import React, { useRef, useState, useEffect } from "react";
import DataGrid, { Column, Editing, Popup, Form } from "devextreme-react/data-grid";
import { Item } from "devextreme-react/form";
import { TagBox } from "devextreme-react/tag-box";
import CustomStore from "devextreme/data/custom_store";
import "./App.css";

// Type definitions
interface Drug {
  id: number;
  name: string;
}

interface Group {
  name: string;
}

interface GroupDrugMapping {
  id: number;
  groupName: string;
  // drugNames: string[]; // Changed from drugIds to drugNames
  drugNames: string; // Changed from drugIds to drugNames
}

// CustomStore logic (no real backend)
const customStore = new CustomStore<GroupDrugMapping, number>({
  key: "id",
  load: async () => {
    const storedData = localStorage.getItem("groupDrugMappings");
    if (storedData) {
      const parsedData: GroupDrugMapping[] = JSON.parse(storedData);
      console.log("Loaded data:", parsedData); // Check what data is loaded
      return parsedData;
    }
    console.log("No data found in localStorage.");
    return []; // Return empty array if no data found
  },
  insert: async (values) => {
    const storedData = localStorage.getItem("groupDrugMappings");
    const data: GroupDrugMapping[] = storedData ? JSON.parse(storedData) : []; // Type assertion
    const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    const newItem = { ...values, id: newId };
    data.push(newItem);
    localStorage.setItem("groupDrugMappings", JSON.stringify(data)); // Save to localStorage
    return newItem;
  },
  update: async (key, values) => {
    const storedData = localStorage.getItem("groupDrugMappings");
    const data: GroupDrugMapping[] = storedData ? JSON.parse(storedData) : []; // Type assertion
    const index = data.findIndex((item) => item.id === key);
    if (index !== -1) {
      // Ensure drugNames is an array of names and handle changes
      const updatedValues = { ...data[index], ...values };
      updatedValues.drugNames = values.drugNames || data[index].drugNames; // Make sure drugNames is updated correctly
      data[index] = updatedValues;
      localStorage.setItem("groupDrugMappings", JSON.stringify(data)); // Save to localStorage
    }
  },
  remove: async (key) => {
    const storedData = localStorage.getItem("groupDrugMappings");
    const data: GroupDrugMapping[] = storedData ? JSON.parse(storedData) : []; // Type assertion
    const index = data.findIndex((item) => item.id === key);
    if (index !== -1) {
      data.splice(index, 1);
      localStorage.setItem("groupDrugMappings", JSON.stringify(data)); // Save to localStorage
    }
  },
});

const App = () => {
  const dataGridRef = useRef<any>(null);
  const [groupOptions, setGroupOptions] = useState<Group[]>([]);
  const [drugsData, setDrugsData] = useState<Drug[]>([]);

  // Load groups and drugs from public/data/
  useEffect(() => {
    const loadData = async () => {
      const groupsRes = await fetch("/data/groups.json");
      const drugsRes = await fetch("/data/drugs.json");

      const groupsJson = await groupsRes.json();
      const drugsJson = await drugsRes.json();

      setGroupOptions(groupsJson);
      setDrugsData(drugsJson);
    };

    loadData();
  }, []);

  // Double-click row to edit
  const handleRowDblClick = (e: any) => {
    dataGridRef.current?.instance?.editRow(e.rowIndex);
  };

  // Custom rendering for drug list tags
  const renderTagBox = (cellData: any) => {
    const names: string[] = cellData.value || [];
    const selectedDrugs = drugsData.filter((drug) => names.includes(drug.name));
    return (
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {selectedDrugs.map((drug) => (
          <span
            key={drug.id}
            style={{
              backgroundColor: "#d1d1d1",
              borderRadius: "8px",
              padding: "4px 10px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {drug.name}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: "30px" }}>
      <DataGrid
        ref={dataGridRef}
        dataSource={customStore}
        keyExpr="id"
        showBorders={true}
        onRowDblClick={handleRowDblClick}
      >
        <Editing
          mode="popup"
          allowAdding={true}
          startEditAction="dblClick"
          useIcons={true}
        >
          <Popup title="Thông tin" showTitle={true} width={500} height={300} />
          <Form colCount={1} labelLocation="top">
            <Item
              dataField="groupName"
              editorType="dxSelectBox"
              editorOptions={{
                items: groupOptions,
                valueExpr: "name",
                displayExpr: "name",
                placeholder: "Chọn nhóm...",
                searchEnabled: true,
              }}
            />
            <Item
              dataField="drugNames" // Change this field to drugNames
              editorType="dxTagBox"
              editorOptions={{
                items: drugsData,
                valueExpr: "name", // Use drug name instead of id
                displayExpr: "name",
                searchEnabled: true,
                showSelectionControls: true,
                applyValueMode: "useButtons",
                multiline: true,
                showDropDownButton: true,
                dropDownOptions: { height: 300 },
                placeholder: "Tìm và chọn thuốc...",
              }}
            />
          </Form>
        </Editing>

        <Column dataField="groupName" caption="Tên nhóm" />

        <Column
          dataField="drugNames" // Change this field to drugNames
          caption="Thuốc LASA"
          editCellRender={({ data, setValue }) => (
            <TagBox
              items={drugsData}
              value={data.drugNames || []} // Use drugNames instead of drugIds
              valueExpr="name" // Use drug name instead of id
              displayExpr="name"
              onValueChanged={(e) => setValue(e.value)}
              searchEnabled
              showSelectionControls
              multiline
              showDropDownButton
              placeholder="Tìm và chọn thuốc..."
              dropDownOptions={{ height: 300 }}
              onSelectionChanged={(e) => {
                if (e.addedItems.length > 0) {
                  (e.component.field() as HTMLInputElement).value = "";
                  e.component.close();
                }
              }}
            />
          )}
          cellRender={renderTagBox}
        />
      </DataGrid>
    </div>
  );
};

export default App;
