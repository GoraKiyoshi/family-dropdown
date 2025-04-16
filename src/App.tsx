import React, { useState } from "react";
import DropdownDataGrid from "./components/DropdownDataGrid"; // This is your new merged file
import "./lasa-style.css";
import { danhMucThuoc } from "./data/drugData";
import { DataItem } from "./data/dataModel";

const initialData: DataItem[] = [
  { id: 1, group: 1, drugs: [1, 2, 3] },
  { id: 2, group: 2, drugs: [1, 2] },
];

export default function App() {
  const [data, setData] = useState<DataItem[]>(initialData);

  const handleRowDoubleClick = (item: DataItem) => {
    console.log('Row double-clicked:', item);
  };

  return (
    <div className="app-container" style={{ width: "100%", height: "100vh", padding: 0, margin: 0, boxSizing: "border-box", background: "#f5f5f5" }}>
      <DropdownDataGrid
        data={data}
        setData={setData}
        danhMucThuoc={danhMucThuoc}
        onDoubleClick={handleRowDoubleClick} // Pass the function here
      />
    </div>
  );
}