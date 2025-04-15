import React, { useState } from "react";
import DropdownCustom from "../components/DropdownCustom";
interface Props {
  visible: boolean;
  mode: "create" | "edit";
  formData: { group: string; drugs: number[] };
  onClose: () => void;
  onSave: () => void;
  setFormData: (data: { group: string; drugs: number[] }) => void;
}

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

    if (!formData.group.trim()) {
      newError.group = "Tên nhóm không được để trống.";
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
            <input
              type="text"
              value={formData.group}
              onChange={(e) => {
                setFormData({ ...formData, group: e.target.value });
                if (e.target.value.trim()) {
                  setError((prev) => ({ ...prev, group: undefined }));
                }
              }}
              placeholder="Nhập tên nhóm"
              style={{ flex: 1 }}
            />
            {error.group && (
              <div style={{ color: "red", fontSize: "0.875rem" }}>
                {error.group}
              </div>
            )}
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
