import React from 'react';
import TagBox from 'devextreme-react/tag-box';
import ArrayStore from 'devextreme/data/array_store';

const danhMucThuoc = [
    { id: 1, tenThuoc: "ACUpan 20mg/2ml Inj" },
    { id: 2, tenThuoc: "Agimol 80mg Sachets" },
    { id: 3, tenThuoc: "Arcoxia 60mg" },
    { id: 4, tenThuoc: "Arcoxia 5mg" },
    { id: 5, tenThuoc: "Arcoxia 20mg" },
    { id: 6, tenThuoc: "Arcoxia 10mg" },
    { id: 7, tenThuoc: "Arcoxia 1000mg" },
    { id: 8, tenThuoc: "ACUpan 20mg/2ml Inj" },
    { id: 9, tenThuoc: "Agimol 80mg Sachets" },
    { id: 10, tenThuoc: "Arcoxia 60mg" },
    { id: 11, tenThuoc: "Arcoxia 5mg" },
    { id: 12, tenThuoc: "Arcoxia 20mg" },

];

const thuocStore = new ArrayStore({
  data: danhMucThuoc,
  key: 'id',
});

interface Props {
  value: number[];
  onChange: (value: number[]) => void;
}

function DropdownCustom({ value, onChange }: Props) {
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
      showSelectionControls={true} //select box

    />
  );
}
export default DropdownCustom
