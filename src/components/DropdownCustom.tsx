import React, { useMemo } from 'react';
import TagBox from 'devextreme-react/tag-box';
import ArrayStore from 'devextreme/data/array_store';
import { ThuocItem } from '../data/drugData';

interface Props {
  value: number[];
  onChange: (value: number[]) => void;
  danhMucThuoc: ThuocItem[];
}

function DropdownCustom({ value, onChange, danhMucThuoc }: Props) {
  // Memoize ArrayStore to prevent unnecessary recreation
  const thuocStore = useMemo(
    () =>
      new ArrayStore({
        data: danhMucThuoc,
        key: 'id',
      }),
    [danhMucThuoc]
  );

  return (
    <TagBox
      dataSource={thuocStore}
      inputAttr={{ 'aria-label': 'Thuốc LASA' }}
      displayExpr="tenThuoc"
      valueExpr="id"
      searchEnabled
      value={Array.isArray(value) ? value : []} // Ensure value is an array
      onValueChanged={(e) => {
        const newValue = Array.isArray(e.value) ? e.value : [];
        console.log('DropdownCustom value changed:', newValue);
        onChange(newValue);
      }}
      placeholder="Tìm và chọn thuốc..."
      showClearButton
      showSelectionControls={true}
    />
  );
}

export default DropdownCustom;