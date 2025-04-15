export interface ThuocItem {
  id: number;
  tenThuoc: string;
}

export interface GroupItem {
  id: number;
  tenNhom: string;
}

export interface DataItem {
  id: number;
  group: number;
  drugs: number[];
}
