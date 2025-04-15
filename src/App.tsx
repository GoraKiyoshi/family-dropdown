import React, { useState } from 'react';
import DropdownModal from './components/DropdownModal';
import DropdownTable from './components/DropdownTable';
import "./App.css";
import { GroupItem } from './data/groupData';
import { ThuocItem, danhMucThuoc } from './data/drugData';
import { DataItem } from './data/dataModel';

// Using shared interfaces from data files

// Using shared DataItem interface from data file

// Using drug data from shared file

const initialData: DataItem[] = [
  { id: 1, group: 1, drugs: [1, 2, 3] },
  { id: 2, group: 2, drugs: [1, 2] },
];

export default function App() {
  const [data, setData] = useState<DataItem[]>(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<{ group: number | null; drugs: number[] }>({ group: null, drugs: [] });
  const [editId, setEditId] = useState<number | null>(null);

  const openCreate = () => {
    setFormData({ group: null, drugs: [] });
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
    if (formData.group === null) {
      alert("Please select a group before saving.");
      return;
    }
  
    const newEntry: DataItem = {
      id: mode === 'create' ? data.length + 1 : editId!,
      group: formData.group,
      drugs: formData.drugs,
    };
  
    if (mode === 'create') {
      setData([...data, newEntry]);
    } else if (editId !== null) {
      setData(data.map(d => d.id === editId ? newEntry : d));
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
