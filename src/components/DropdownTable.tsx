import React from 'react';

interface Props {
  data: { id: number; group: string; drugs: number[] }[];
  danhMucThuoc: { id: number; tenThuoc: string }[];
  onDoubleClick: (item: any) => void;
}

function DropdownTable({ data, danhMucThuoc, onDoubleClick }: Props) {
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
            <td>{item.group}</td>
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
