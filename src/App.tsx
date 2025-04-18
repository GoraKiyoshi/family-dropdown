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
  drugIds: number[];
}

// Initial in-memory data
const initialData: GroupDrugMapping[] = [
  { id: 1, groupName: "Đọc giống - Nhìn giống", drugIds: [1, 2, 3] },
  { id: 2, groupName: "Đọc khác - nhìn khác", drugIds: [2, 4] },
];

// CustomStore logic (no real backend)
const customStore = new CustomStore<GroupDrugMapping, number>({
  key: "id",
  load: async () => initialData,
  insert: async (values) => {
    const newId = initialData.length ? Math.max(...initialData.map((d) => d.id)) + 1 : 1;
    const newItem = { ...values, id: newId };
    initialData.push(newItem);
    return newItem;
  },
  update: async (key, values) => {
    const index = initialData.findIndex((item) => item.id === key);
    if (index !== -1) {
      initialData[index] = { ...initialData[index], ...values };
    }
  },
  remove: async (key) => {
    const index = initialData.findIndex((item) => item.id === key);
    if (index !== -1) {
      initialData.splice(index, 1);
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
    const ids: number[] = cellData.value || [];
    const selectedDrugs = drugsData.filter((drug) => ids.includes(drug.id));
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
              dataField="drugIds"
              editorType="dxTagBox"
              editorOptions={{
                items: drugsData,
                valueExpr: "id",
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
          dataField="drugIds"
          caption="Thuốc LASA"
          editCellRender={({ data, setValue }) => (
            <TagBox
              items={drugsData}
              value={data.drugIds || []}
              valueExpr="id"
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
                //còn hiển thị giá trị search trên thanh input
                //custom xóa thì phải thao tác close dropdown
                //https://supportcenter.devexpress.com/ticket/details/t994950/tagbox-how-to-clear-the-search-text-after-selecting-an-item
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

