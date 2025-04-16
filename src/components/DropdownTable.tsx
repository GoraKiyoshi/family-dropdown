import React, { useState } from 'react';
import { groupOptions } from '../data/groupData';
import { ThuocItem } from '../data/drugData';
import { DataItem } from '../data/dataModel';
import DataGrid, { Column, Paging, Lookup } from 'devextreme-react/data-grid';
import DropdownModal from './DropdownModal';

interface Props {
  data: DataItem[];
  danhMucThuoc: ThuocItem[];
  onDoubleClick: (item: DataItem) => void;
}

function DropdownTable({ data, danhMucThuoc, onDoubleClick }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<{ group: number | null; drugs: number[] }>({
    group: null,
    drugs: [],
  });

  const handleEdit = (item: DataItem) => {
    setFormData({
      group: item.group || null,
      drugs: item.drugs || [],
    });
    setMode('edit');
    setModalVisible(true);
  };

  const handleRowDoubleClick = (e: any) => {
    onDoubleClick(e.data);
  };

  return (
    <div id="data-grid-demo" style={{ width: '100%', maxWidth: '98%', margin: '0 auto', padding: '10px' }}>
      <DataGrid
        dataSource={data}
        keyExpr="id"
        showBorders
        hoverStateEnabled
        rowAlternationEnabled
        repaintChangesOnly
        allowColumnReordering
        allowColumnResizing
        focusedRowEnabled
        height="70vh"
        onRowDblClick={handleRowDoubleClick}
      >
        <Paging enabled={false} />
        <Column dataField="group" caption="Tên nhóm" width={200}>
          <Lookup
            dataSource={groupOptions}
            valueExpr="id"
            displayExpr="name"
          />
        </Column>
        <Column
          dataField="drugs"
          caption="Tên thuốc"
          width={250}
          cellRender={({ data }) => {
            const drugNames = data.drugs
              .map((drugId: number) => {
                const drug = danhMucThuoc.find((item) => item.id === drugId);
                return drug?.tenThuoc || '';
              })
              .filter(Boolean)
              .join(', ');
            return <span>{drugNames}</span>;
          }}
        />
      </DataGrid>
    </div>
  );
}

export default DropdownTable;

