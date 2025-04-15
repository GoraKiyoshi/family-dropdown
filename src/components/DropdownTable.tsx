import React from 'react';
import { ThuocItem, GroupItem, DataItem } from '../types/interfaces';

interface Props {
  data: DataItem[];
  danhMucThuoc: ThuocItem[];
  danhMucNhom?: GroupItem[];
  onDoubleClick: (item: DataItem) => void;
}



function DropdownTable({ data, danhMucThuoc, danhMucNhom = [], onDoubleClick }: Props): React.ReactElement {
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

export default DropdownTable;
