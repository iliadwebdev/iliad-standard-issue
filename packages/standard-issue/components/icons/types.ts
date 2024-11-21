export type IliadIconProps<T = {}> = ComponentBaseProps<"svg"> &
  Partial<{
    color: string;
    size: number;
    title: string;
  }> &
  T;
