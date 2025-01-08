export interface Owner {
  name: string;
  role: string;
  position: string;
  experience: string;
  qualifications?: string;
  bio?: string;
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