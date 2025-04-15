import React from 'react';
import { groupOptions } from '../data/groupData';
import { ThuocItem } from '../data/drugData';
import { DataItem } from '../data/dataModel';

// Using shared ThuocItem interface from data file

// Using shared DataItem interface from data file

interface Props {
  data: DataItem[];
  danhMucThuoc: ThuocItem[];
  onDoubleClick: (item: DataItem) => void;
}

// Using group options from shared data file

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
            <td>{groupOptions.find(g => g.id === item.group)?.name}</td>
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
