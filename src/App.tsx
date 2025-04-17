import React, { useRef, useState } from "react";
import DataGrid, {
  Column,
  Editing,
  Popup,
  Form,
} from "devextreme-react/data-grid";
import { Item } from "devextreme-react/form";
import { TagBox } from "devextreme-react/tag-box";
import groups from "../src/data/groups.json";
import drugs from "../src/data/drugs.json";

import "./App.css"; // 👈 import custom CSS để điều chỉnh spacing

const initialData = [
  {
    id: 1,
    groupName: "Nhóm 1",
    drugIds: [1, 2, 3],
  },
  {
    id: 2,
    groupName: "Nhóm 2",
    drugIds: [2, 4],
  },
];

const App = () => {
  const [data, setData] = useState(initialData);
  const dataGridRef = useRef<any>(null);

  const groupOptions = groups;
  const drugsData = drugs;

  const handleRowUpdating = (e: any) => {
    const updatedRow = { ...e.oldData, ...e.newData };
    setData((prev) =>
      prev.map((item) => (item.id === updatedRow.id ? updatedRow : item))
    );
  };

  const handleRowInserting = (e: any) => {
    const newId = data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    const newRow = { ...e.data, id: newId };
    setData((prev) => [...prev, newRow]);
  };

  const handleRowDblClick = (e: any) => {
    dataGridRef.current?.instance?.editRow(e.rowIndex);
  };

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
        dataSource={data}
        keyExpr="id"
        showBorders={true}
        onRowUpdating={handleRowUpdating}
        onRowInserting={handleRowInserting}
        onRowDblClick={handleRowDblClick}
      >
        <Editing
          mode="popup"
          allowAdding={true}
          allowUpdating={true}
          startEditAction="dblClick"
          useIcons={true}
        >
          <Popup
            title="Thông tin nhóm thuốc"
            showTitle={true}
            width={500}
            height={300}
          />

          <Form colCount={1} labelLocation="top" cssClass="compact-form">
            <Item
              dataField="groupName"
              editorType="dxSelectBox"
              editorOptions={{
                items: groupOptions,
                valueExpr: "name",
                displayExpr: "name",
                placeholder: "Chọn nhómn...",
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
              applyValueMode="useButtons"
              multiline
              showDropDownButton
              placeholder="Tìm và chọn thuốc..."
              dropDownOptions={{ height: 300 }}
            />
          )}
          cellRender={renderTagBox}
        />
      </DataGrid>
    </div>
  );
};

export default App;
