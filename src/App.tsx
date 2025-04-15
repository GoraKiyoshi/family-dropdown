import React, { useState } from 'react';
import DropdownModal from './components/DropdownModal';
import DropdownTable from './components/DropdownTable';
import "./App.css"

// Define the interface for drug items
interface ThuocItem {
  id: number;
  tenThuoc: string;
}

// Define the interface for data items
interface DataItem {
  id: number;
  group: string;
  drugs: number[];
}

// Use unique drug items to avoid duplication
const danhMucThuoc: ThuocItem[] = [
  { id: 1, tenThuoc: "ACUpan 20mg/2ml Inj" },
  { id: 2, tenThuoc: "Agimol 80mg Sachets" },
  { id: 3, tenThuoc: "Arcoxia 60mg" },
  { id: 4, tenThuoc: "Arcoxia 5mg" },
  { id: 5, tenThuoc: "Arcoxia 20mg" },
  { id: 6, tenThuoc: "Arcoxia 10mg" },
  { id: 7, tenThuoc: "Arcoxia 1000mg" },
  { id: 8, tenThuoc: "ACUpan 20mg/2ml Inj" },
  { id: 9, tenThuoc: "Agimol 80mg Sachets" },
  { id: 10, tenThuoc: "Arcoxia 60mg" },
  { id: 11, tenThuoc: "Arcoxia 5mg" },
  { id: 12, tenThuoc: "Arcoxia 20mg" },
];

const initialData: DataItem[] = [
  { id: 1, group: "Đọc giống - Nhìn giống", drugs: [1, 2, 3] },
  { id: 2, group: "Đọc khác - nhìn khác", drugs: [1, 2] },
];

export default function App() {
  const [data, setData] = useState<DataItem[]>(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<{ group: string; drugs: number[] }>({ group: '', drugs: [] });
  const [editId, setEditId] = useState<number | null>(null);

  const openCreate = () => {
    setFormData({ group: '', drugs: [] });
    setMode('create');
    setModalOpen(true);
  };

  const openEdit = (item: DataItem) => {
    setFormData({ group: item.group, drugs: item.drugs });
    setEditId(item.id);
    setMode('edit');
    setModalOpen(true);
  };

  const handleSave = () => {
    if (mode === 'create') {
      setData([...data, { ...formData, id: data.length + 1 }]);
    } else if (editId !== null) {
      setData(data.map(d => d.id === editId ? { ...formData, id: editId } : d));
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
        danhMucThuoc={danhMucThuoc}
      />
    </div>
  );
}
