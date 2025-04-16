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
import { ItemClickEvent } from 'devextreme/ui/list';
import "../App.css";

interface Props {
    data: DataItem[];
    setData: React.Dispatch<React.SetStateAction<DataItem[]>>;
    danhMucThuoc: ThuocItem[];
    onDoubleClick: (item: DataItem) => void;  
  }  

const DropdownDataGrid = ({ data, danhMucThuoc, onDoubleClick }: Props) => {
  const [formData, setFormData] = useState<{ group: number | null; drugs: number[] }>({
    group: null,
    drugs: [],
  });

  const [error, setError] = useState<{ group?: string; drugs?: string }>({});

  const handleSaving = (e: any) => {
    const { group, drugs } = formData;

    const newError: typeof error = {};
    if (group === null) newError.group = "Tên nhóm không được để trống";
    if (!drugs || drugs.length === 0) newError.drugs = "Thuốc không được để trống";

    if (Object.keys(newError).length > 0) {
      setError(newError);
      e.cancel = true;
    } else {
      setError({});
      e.data.group = group;
      e.data.drugs = drugs;
    }
  };

  const handleRowDoubleClick = (e: any) => {
    onDoubleClick(e.data);
  };

  const handleInitNewRow = (e: any) => {
    setFormData({ group: null, drugs: [] });
    setError({});
  };

  const handleEditingStart = (e: any) => {
    const { data } = e;
    setFormData({
      group: data.group || null,
      drugs: data.drugs || [],
    });
    setError({});
  };

  return (
    <div id="data-grid-demo" style={{ width: "100%", maxWidth: "98%", margin: "0 auto", padding: "10px" }}>
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
        height="70vh"
        onRowDblClick={(e) => onDoubleClick(e.data)}
        onSaving={handleSaving}
        onInitNewRow={handleInitNewRow}
        onEditingStart={handleEditingStart}
      >
        <Paging enabled={false} />
        <Editing
          mode="popup"
          allowUpdating
          allowAdding
          allowDeleting
        >
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
                        setError((prev) => ({ ...prev, group: "Tên nhóm không được để trống" }));
                      } else {
                        setError((prev) => ({ ...prev, group: undefined }));
                      }
                    }}
                    contentRender={() => (
                      <List
                        dataSource={groupOptions}
                        displayExpr="name"
                        selectionMode="single"
                        selectedItemKeys={formData.group !== null ? [formData.group] : []}
                        onItemClick={(e: ItemClickEvent) => {
                            if (!e.itemData) return; // 👈 Guard against undefined
                            setFormData({ ...formData, group: e.itemData.id });
                            setError((prev) => ({ ...prev, group: undefined }));
                          }}
                          
                      />
                    )}
                  />
                  {error.group && <div className="dx-field-error">{error.group}</div>}
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
                  {error.drugs && <div className="dx-field-error">{error.drugs}</div>}
                </>
              )}
            />
          </Form>
        </Editing>

        <Column dataField="group" caption="Tên nhóm" width={200}>
          <Lookup dataSource={groupOptions} valueExpr="id" displayExpr="name" />
        </Column>
        <Column
          dataField="drugs"
          caption="Tên thuốc"
          width={250}
          cellRender={({ data }) => {
            const drugNames = data.drugs
              .map((drugId: number) => {
                const drug = danhMucThuoc.find((item) => item.id === drugId);
                return drug?.tenThuoc || "";
              })
              .filter(Boolean)
              .join(", ");
            return <span>{drugNames}</span>;
          }}
        />
      </DataGrid>
    </div>
  );
};

export default DropdownDataGrid;
