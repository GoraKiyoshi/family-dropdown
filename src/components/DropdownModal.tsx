import React, { useState } from "react";
import DropdownCustom from "./DropdownCustom";
import Popup from "devextreme-react/popup";
import Form, { Item } from "devextreme-react/form";
import DropDownBox from "devextreme-react/drop-down-box";
import List from "devextreme-react/list";
import type { ItemClickEvent } from "devextreme/ui/list";
import { groupOptions } from "../data/groupData";
import "../App.css";
import { ThuocItem } from "../data/drugData";

interface Props {
  visible: boolean;
  mode: "create" | "edit";
  formData: { group: number | null; drugs: number[] };
  onClose: () => void;
  onSave: () => void;
  setFormData: (data: { group: number | null; drugs: number[] }) => void;
  danhMucThuoc: ThuocItem[];
}

function DropdownModal({
  visible,
  mode,
  formData,
  onClose,
  onSave,
  setFormData,
  danhMucThuoc,
}: Props) {
  const [error, setError] = useState<{ group?: string; drugs?: string }>({});

  const handleSave = () => {
    const newError: { group?: string; drugs?: string } = {};

    if (formData.group === null) {
      newError.group = "Tên nhóm không được để trống";
    }

    if (!formData.drugs || formData.drugs.length === 0) {
      newError.drugs = "Thuốc không được để trống";
    }

    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    setError({});
    onSave();
  };

  return (
    <Popup
      visible={visible}
      onHiding={onClose}
      dragEnabled
      closeOnOutsideClick
      showTitle
      title={mode === "create" ? "Thêm mới" : "Chỉnh sửa"}
      width={600}
      height="auto"
    >
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
                showClearButton={true}
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

        <Item
          render={() => (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                marginTop: "16px",
              }}
            >
              <button className="save-btn action-btn" onClick={handleSave}>
                Lưu
              </button>
              <button className="cancel-btn action-btn" onClick={onClose}>
                Hủy
              </button>
            </div>
          )}
        />
      </Form>
    </Popup>
  );
}

export default DropdownModal;
