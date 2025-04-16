import React, { useState } from "react";
import DataGrid, {
  Column,
  Editing,
  Popup,
  Paging,
  Lookup,
  Form,
} from "devextreme-react/data-grid";
import DropDownBox from "devextreme-react/drop-down-box";
import List from "devextreme-react/list";
import { Item } from "devextreme-react/form";
import { groupOptions } from "../data/groupData";
import { ThuocItem } from "../data/drugData";
import { DataItem } from "../data/dataModel";
import DropdownCustom from "./DropdownCustom";
import { ItemClickEvent } from "devextreme/ui/list";
import "../App.css";

interface Props {
  data: DataItem[];
  setData: React.Dispatch<React.SetStateAction<DataItem[]>>;
  danhMucThuoc: ThuocItem[];
  onDoubleClick: (item: DataItem) => void;
}

const DropdownDataGrid = ({
  data,
  setData,
  danhMucThuoc,
  onDoubleClick,
}: Props) => {
  const [formData, setFormData] = useState<{
    group: number | null;
    drugs: number[];
  }>({
    group: null,
    drugs: [],
  });

  const [error, setError] = useState<{ group?: string; drugs?: string }>({});

  const handleSaving = (e: any) => {
    const { group, drugs } = formData;
    const newError: typeof error = {};

    if (group === null) newError.group = "Tên nhóm không được để trống";
    if (!drugs || drugs.length === 0)
      newError.drugs = "Thuốc không được để trống";

    if (Object.keys(newError).length > 0) {
      setError(newError);
      e.cancel = true;
    } else {
      setError({});
      const change = e.changes?.[0];
      if (change) {
        const updatedData = { ...change.data, group, drugs };
        if (change.type === "insert") {
          setData((prevData) => [
            ...prevData,
            { id: prevData.length + 1, ...updatedData },
          ]);
        } else if (change.type === "update") {
          setData((prevData) =>
            prevData.map((item) =>
              item.id === change.key ? { ...item, ...updatedData } : item
            )
          );
        }
        e.changes = [];
        e.component.cancelEditData(); 
        console.log(updatedData)
      }
    }
  };

  const handleInitNewRow = () => {
    setFormData({ group: null, drugs: [] });
    setError({});
  };

  const handleEditingStart = (e: any) => {
    const { group, drugs } = e.data;
    setFormData({
      group: group || null,
      drugs: drugs || [],
    });
    setError({});
  };

  const handleRowDoubleClick = (e: any) => {
    onDoubleClick(e.data);
    e.component.editRow(e.rowIndex); // open popup editor
  };

  return (
    <div
      id="data-grid-demo"
      style={{
        width: "calc(100% - 20px)",
        margin: "10px",
        padding: "0",
        boxSizing: "border-box",
        border: "1px solid #ddd",
        overflow: "hidden",
      }}
    >
      <DataGrid
        dataSource={data}
        keyExpr="id"
        showBorders
        hoverStateEnabled
        rowAlternationEnabled
        repaintChangesOnly
        allowColumnReordering
        allowColumnResizing
        focusedRowEnabled
        height="90%"
        onSaving={handleSaving}
        onInitNewRow={handleInitNewRow}
        onEditingStart={handleEditingStart}
        onRowDblClick={handleRowDoubleClick}
      >
        <Paging enabled={false} />
        <Editing mode="popup" allowAdding>
          <Popup title="Nhóm LASA" showTitle width={700} height="auto" />
          <Form colCount={1} showColonAfterLabel>
            <Item
              label={{ text: "Tên nhóm LASA", requiredMark: true }}
              isRequired
              render={() => (
                <>
                  <DropDownBox
                    dataSource={groupOptions}
                    displayExpr="name"
                    valueExpr="id"
                    value={formData.group}
                    placeholder="Chọn tên nhóm"
                    showClearButton
                    onValueChanged={(e) => {
                      setFormData({ ...formData, group: e.value });
                      if (!e.value && e.value !== 0) {
                        setError((prev) => ({
                          ...prev,
                          group: "Tên nhóm không được để trống",
                        }));
                      } else {
                        setError((prev) => ({ ...prev, group: undefined }));
                      }
                    }}
                    contentRender={() => (
                      <List
                        dataSource={groupOptions}
                        displayExpr="name"
                        selectionMode="single"
                        selectedItemKeys={
                          formData.group !== null ? [formData.group] : []
                        }
                        onItemClick={(e: ItemClickEvent) => {
                          if (!e.itemData) return;
                          setFormData({ ...formData, group: e.itemData.id });
                          setError((prev) => ({ ...prev, group: undefined }));
                        }}
                      />
                    )}
                  />
                  {error.group && (
                    <div className="dx-field-error">{error.group}</div>
                  )}
                </>
              )}
            />

            <Item
              label={{ text: "Thuốc LASA", requiredMark: true }}
              isRequired
              render={() => (
                <>
                  <DropdownCustom
                    value={formData.drugs}
                    danhMucThuoc={danhMucThuoc}
                    onChange={(value) => {
                      setFormData({ ...formData, drugs: value });
                      if (value.length > 0) {
                        setError((prev) => ({ ...prev, drugs: undefined }));
                      }
                    }}
                  />
                  {error.drugs && (
                    <div className="dx-field-error">{error.drugs}</div>
                  )}
                </>
              )}
            />
          </Form>
        </Editing>

        <Column dataField="group" caption="Tên nhóm" width="30%">
          <Lookup dataSource={groupOptions} valueExpr="id" displayExpr="name" />
        </Column>

        <Column
          dataField="drugs"
          caption="Tên thuốc"
          width="70%"
          cellRender={({ data }) => {
            const drugNames = data.drugs
              .map(
                (id: number) => danhMucThuoc.find((d) => d.id === id)?.tenThuoc
              )
              .filter(Boolean);

            return (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {drugNames.map((name: string, index: number) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: "#d3d3d3",
                      padding: "4px 8px",
                      borderRadius: "8px",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            );
          }}
        />
      </DataGrid>
    </div>
  );
};

export default DropdownDataGrid;
