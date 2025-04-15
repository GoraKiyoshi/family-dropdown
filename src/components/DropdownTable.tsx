import React from 'react';

interface ThuocItem {
  id: number;
  tenThuoc: string;
}

interface GroupItem {
  id: number;
  tenNhom: string;
}

interface DataItem {
  id: number;
  group: number;
  drugs: number[];
}

interface Props {
  data: DataItem[];
  danhMucThuoc: ThuocItem[];
  danhMucNhom?: GroupItem[];
  onDoubleClick: (item: DataItem) => void;
}

// Default group options for display
const defaultGroupOptions: GroupItem[] = [
  { id: 1, tenNhom: "Đọc giống - Nhìn giống" },
  { id: 2, tenNhom: "Đọc khác - nhìn khác" },
  { id: 3, tenNhom: "Nghe giống - Viết giống" }
];

function DropdownTable({ data, danhMucThuoc, danhMucNhom = defaultGroupOptions, onDoubleClick }: Props) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Tên nhóm LASA</th>
          <th>Thuốc LASA</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} onDoubleClick={() => onDoubleClick(item)}>
            <td>{danhMucNhom.find(g => g.id === item.group)?.tenNhom || `Group ${item.group}`}</td>
            <td>
              {item.drugs.map((id) => {
                const drug = danhMucThuoc.find((d) => d.id === id);
                return <span key={id} className="tag">{drug?.tenThuoc}</span>;
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DropdownTable
