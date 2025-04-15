import React, { useState } from "react";
import DropdownCustom from "./DropdownCustom";
import DropDownBox from "devextreme-react/drop-down-box";
import List from "devextreme-react/list";
import type { ItemClickEvent } from "devextreme/ui/list";

interface ThuocItem {
  id: number;
  tenThuoc: string;
}

interface Props {
  visible: boolean;
  mode: "create" | "edit";
  formData: { group: string; drugs: number[] };
  onClose: () => void;
  onSave: () => void;
  setFormData: (data: { group: string; drugs: number[] }) => void;
  danhMucThuoc: ThuocItem[];
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
  danhMucThuoc,
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
          <div className="field field-column">
            <div className="label-container">
              <label>Tên nhóm LASA</label>
              <span className="required-marker">*</span>
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

          <div className="field margin-top">
            <label>
              Thuốc LASA <span className="required-marker">*</span>
            </label>
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
              <div className="error-message">
                {error.drugs}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="save-btn action-btn" onClick={handleSave}>
            Lưu
          </button>
          <button className="cancel-btn action-btn" onClick={onClose}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default DropdownModal;
