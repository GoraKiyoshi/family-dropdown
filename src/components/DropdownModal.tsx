import React, { useState } from "react";
import DropdownCustom from "../components/DropdownCustom";
import DropDownBox from "devextreme-react/drop-down-box";
import List from "devextreme-react/list";
import type { ItemClickEvent } from "devextreme/ui/list";

interface Props {
  visible: boolean;
  mode: "create" | "edit";
  formData: { group: string; drugs: number[] };
  onClose: () => void;
  onSave: () => void;
  setFormData: (data: { group: string; drugs: number[] }) => void;
}

// Options for "Tên nhóm LASA"
const groupOptions = [
  "Đọc giống - Nhìn giống",
  "Đọc khác - nhìn khác",
  "Nghe giống - Viết giống",
  "Nhóm khác",
];

function DropdownModal({
  visible,
  mode,
  formData,
  onClose,
  onSave,
  setFormData,
}: Props) {
  const [error, setError] = useState<{ group?: string; drugs?: string }>({});

  if (!visible) return null;

  const handleSave = () => {
    const newError: { group?: string; drugs?: string } = {};
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
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <strong>{mode === "create" ? "Thêm mới" : "Chỉnh sửa"}</strong>
          <button
            className="w-8 h-8 border border-black rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition"
            onClick={onClose}
          >
            X
          </button>
        </div>

        <div className="modal-body">
          <div
            className="field"
            style={{ display: "flex", flexDirection: "column", gap: "4px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label style={{ whiteSpace: "nowrap" }}>Tên nhóm LASA</label>
              <span style={{ color: "red" }}>*</span>
            </div>
            <DropDownBox
              dataSource={groupOptions}
              value={formData.group}
              placeholder="Chọn tên nhóm"
              showClearButton={true}
              inputAttr={{ "aria-label": "Tên nhóm LASA" }}
              onValueChanged={(e) => {
                setFormData({ ...formData, group: e.value });
                if (!e.value) {
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
                  selectionMode="single"
                  selectedItems={[formData.group]}
                  onItemClick={(e: ItemClickEvent) => {
                    setFormData({ ...formData, group: e.itemData });
                    setError((prev) => ({ ...prev, group: undefined }));
                  }}
                />
              )}
            />
          </div>

          <div className="field" style={{ marginTop: "12px" }}>
            <label>
              Thuốc LASA <span style={{ color: "red" }}>*</span>
            </label>
            <DropdownCustom
              value={formData.drugs}
              onChange={(value) => {
                setFormData({ ...formData, drugs: value });
                if (value.length > 0) {
                  setError((prev) => ({ ...prev, drugs: undefined }));
                }
              }}
            />
            {error.drugs && (
              <div
                style={{ color: "red", fontSize: "0.875rem", marginTop: "5px" }}
              >
                {error.drugs}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="save-btn"
            onClick={handleSave}
            style={{ backgroundColor: "#36A1B6", color: "white" }}
          >
            Lưu
          </button>
          <button
            className="cancel-btn"
            onClick={onClose}
            style={{ backgroundColor: "#36A1B6", color: "white" }}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default DropdownModal;
