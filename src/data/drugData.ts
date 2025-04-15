export interface ThuocItem {
  id: number;
  tenThuoc: string;
}

// Use unique drug items to avoid duplication
export const danhMucThuoc: ThuocItem[] = [
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
