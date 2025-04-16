

import React from 'react';
import DataGrid, {
  Column,
  Editing,
  Popup,
  Paging,
  Lookup,
  Form as DataGridForm,
  RequiredRule,
  CustomRule,
} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import { groupOptions } from '../data/groupData';
import { ThuocItem } from '../data/drugData';
import { DataItem } from '../data/dataModel';
import DropdownCustom from './DropdownCustom';
import '../App.css';

// Define interface for render function's itemData
interface RenderItemData {
  dataField?: string;
  component?: any;
}

interface Props {
  data: DataItem[];
  setData: React.Dispatch<React.SetStateAction<DataItem[]>>;
  danhMucThuoc: ThuocItem[];
  onDoubleClick: (item: DataItem) => void;
}

const DropdownDataGrid = ({
  data,
  setData,
  danhMucThuoc,
  onDoubleClick,
}: Props) => {
  // Handle saving changes (insert or update)
  const handleSaving = (e: any) => {
    const change = e.changes?.[0];
    if (change) {
      console.log('Change data:', change.data);
      const existingItem: DataItem = change.key
        ? data.find((item: DataItem) => item.id === change.key) || { id: 0, group: 0, drugs: [] }
        : { id: 0, group: 0, drugs: [] };
  
      const updatedItemData = { ...existingItem, ...change.data };
  
      // Ensure drugs is always an array, even if undefined
      updatedItemData.drugs = Array.isArray(updatedItemData.drugs)
        ? updatedItemData.drugs
        : existingItem.drugs || [];
  
      console.log('Updated item data:', updatedItemData);
  
      if (change.type === 'insert') {
        const newId = data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;
        setData((prevData) => {
          const newData = [...prevData, { id: newId, ...updatedItemData }];
          console.log('New state after insert:', newData);
          return newData;
        });
        console.log('Inserted item with ID:', newId, updatedItemData);
      } else if (change.type === 'update') {
        setData((prevData) => {
          const newData = prevData.map((item) =>
            item.id === change.key ? { ...item, ...updatedItemData } : item
          );
          console.log('New state after update:', newData);
          return newData;
        });
        console.log('Updated item with ID:', change.key, updatedItemData);
      }
  
      e.cancel = true;
      e.component.cancelEditData();
    } else {
      console.log('No changes detected or save cancelled.');
    }
  };

  // Initialize new row with default values
  const handleInitNewRow = (e: any) => {
    e.data.group = null;
    e.data.drugs = [];
    console.log('Initialized new row:', e.data);
  };

  // Handle double-click to trigger onDoubleClick and enter edit mode
  const handleRowDoubleClick = (e: any) => {
    onDoubleClick(e.data);
    e.component.editRow(e.rowIndex);
  };

  // Render custom TagBox for drugs field
  const renderDrugsDropdown = (itemData: RenderItemData) => {
    const onCustomChange = (newValue: number[]) => {
      if (itemData.dataField) {
        console.log('Drugs dropdown changed:', newValue);
        const valueToUpdate = Array.isArray(newValue) ? newValue : [];
        itemData.component?.updateData(itemData.dataField, valueToUpdate);
        itemData.component?.option('formData', {
          ...itemData.component.option('formData'),
          [itemData.dataField]: valueToUpdate,
        });
      }
    };
  
    const formData = itemData.component?.option('formData') || {};
    // Ensure dataField is defined before accessing formData
    const currentValue = itemData.dataField && Array.isArray(formData[itemData.dataField])
      ? formData[itemData.dataField]
      : Array.isArray(itemData.component?.option('data')?.drugs)
      ? itemData.component?.option('data')?.drugs
      : [];
  
    console.log('Form data:', formData);
    console.log('Row data drugs:', itemData.component?.option('data')?.drugs);
    console.log('Final currentValue:', currentValue);
  
    return (
      <DropdownCustom
        value={currentValue}
        danhMucThuoc={danhMucThuoc}
        onChange={onCustomChange}
      />
    );
  };

  return (
    <div
      id="data-grid-demo"
      style={{
        width: 'calc(100% - 20px)',
        margin: '10px',
        padding: '0',
        boxSizing: 'border-box',
        border: '1px solid #ddd',
        overflow: 'hidden',
      }}
    >
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
        height="90%"
        onSaving={handleSaving}
        onInitNewRow={handleInitNewRow}
        onRowDblClick={handleRowDoubleClick}
      >
        <Paging enabled={false} />
        <Editing
          mode="popup"
          allowAdding
          allowUpdating
          refreshMode="reshape"
          useIcons
        >
          <Popup title="Nhóm LASA" showTitle width={700} height="auto" />
          <DataGridForm colCount={1} showColonAfterLabel>
            <Item
              dataField="group"
              editorType="dxSelectBox"
              label={{ text: 'Tên nhóm LASA' }}
              editorOptions={{
                dataSource: groupOptions,
                displayExpr: 'name',
                valueExpr: 'id',
                placeholder: 'Chọn tên nhóm',
                showClearButton: true,
                searchEnabled: true,
              }}
            >
              <RequiredRule message="Tên nhóm không được để trống" />
            </Item>
            <Item
              dataField="drugs"
              label={{ text: 'Thuốc LASA' }}
              render={renderDrugsDropdown}
            >
              <RequiredRule message="Thuốc không được để trống" />
              <CustomRule
                message="Phải chọn ít nhất một thuốc"
                validationCallback={(value: number[]) =>
                  Array.isArray(value) && value.length > 0
                }
              />
            </Item>
          </DataGridForm>
        </Editing>
        <Column dataField="group" caption="Tên nhóm" width="30%">
          <Lookup dataSource={groupOptions} valueExpr="id" displayExpr="name" />
        </Column>
        <Column
          dataField="drugs"
          caption="Tên thuốc"
          width="70%"
          cellRender={({ data }) => {
            const drugIds = Array.isArray(data.drugs) ? data.drugs : [];
            const drugNames = drugIds
              .map((id: number) => danhMucThuoc.find((d) => d.id === id)?.tenThuoc)
              .filter(Boolean);

            return (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {drugNames.length > 0 ? (
                  drugNames.map((name: string, index: number) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#e0e0e0',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontWeight: '500',
                        fontSize: '13px',
                        whiteSpace: 'nowrap',
                        margin: '2px 0',
                      }}
                    >
                      {name}
                    </span>
                  ))
                ) : (
                  <span style={{ color: '#999' }}>No drugs selected</span>
                )}
              </div>
            );
          }}
        />
      </DataGrid>
    </div>
  );
};

export default DropdownDataGrid;

