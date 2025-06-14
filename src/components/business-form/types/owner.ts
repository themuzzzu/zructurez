
export interface Owner {
  id?: string;
  name: string;
  email?: string;
  role: string;
  position: string;
  experience: string;
  qualifications?: string;
  bio?: string;
  image_url?: string | null;
}

export interface OwnerFormProps {
  owner: Owner;
  onUpdate: (field: keyof Owner, value: string) => void;
  onRemove?: () => void;
}

export interface NewOwnerFormProps {
  onAdd: (owner: Owner) => void;
  onCancel: () => void;
}
