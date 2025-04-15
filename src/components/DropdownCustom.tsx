import React from 'react';
import TagBox from 'devextreme-react/tag-box';
import ArrayStore from 'devextreme/data/array_store';
import { ThuocItem } from '../types/interfaces';

interface Props {
  value: number[];
  onChange: (value: number[]) => void;
  danhMucThuoc: ThuocItem[];
}

function DropdownCustom({ value, onChange, danhMucThuoc }: Props): React.ReactElement {
  const thuocStore = new ArrayStore({
    data: danhMucThuoc,
    key: 'id',
  });
  
  return (
    <TagBox
      dataSource={thuocStore}
      inputAttr={{ 'aria-label': 'Thuốc LASA' }}
      displayExpr="tenThuoc"
      valueExpr="id"
      searchEnabled
      value={value}
      onValueChanged={(e) => onChange(e.value)}
      placeholder="Tìm và chọn thuốc..."
      showClearButton
      showSelectionControls={true}
    />
  );
}

export default DropdownCustom;
