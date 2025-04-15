
import React, { useState } from 'react';
import DropdownModal from '../src/components/DropdownModal';
import DropdownTable from '../src/components/DropdownTable';
import "./App.css"

const danhMucThuoc = [
  { id: 1, tenThuoc: "ACUpan 20mg/2ml Inj" },
  { id: 2, tenThuoc: "Agimol 80mg Sachets" },
  { id: 3, tenThuoc: "Arcoxia 60mg" },
  { id: 4, tenThuoc: "Arcoxia 5mg" },
  { id: 5, tenThuoc: "Arcoxia 20mg" },
  { id: 6, tenThuoc: "Arcoxia 10mg" },
  { id: 7, tenThuoc: "Arcoxia 1000mg" },
];

const initialData = [
  { id: 1, group: "Đọc giống - Nhìn giống", drugs: [1, 2, 3] },
  { id: 2, group: "Đọc khác - nhìn khác", drugs: [1, 2] },
];

export default function App() {
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({ group: '', drugs: [] as number[] });
  const [editId, setEditId] = useState<number | null>(null);

  const openCreate = () => {
    setFormData({ group: '', drugs: [] });
    setMode('create');
    setModalOpen(true);
  };

  const openEdit = (item: typeof data[0]) => {
    setFormData({ group: item.group, drugs: item.drugs });
    setEditId(item.id);
    setMode('edit');
    setModalOpen(true);
  };

  const handleSave = () => {
    if (mode === 'create') {
      setData([...data, { ...formData, id: data.length + 1 }]);
    } else {
      setData(data.map(d => d.id === editId ? { ...formData, id: editId! } : d));
    }
    setModalOpen(false);
  };

  return (
    <div className="app-container">
      <DropdownTable data={data} danhMucThuoc={danhMucThuoc} onDoubleClick={openEdit} />
      <button className="create-button" onClick={openCreate}>Thêm mới</button>
      <DropdownModal
        visible={modalOpen}
        mode={mode}
        formData={formData}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        setFormData={setFormData}
      />
    </div>
  );
}
