
declare module 'lucide-react' {
  import { SVGProps, ForwardRefExoticComponent, RefAttributes } from 'react';

  export interface IconNode {
    tag: string;
    attrs: Record<string, any>;
    children?: IconNode[];
  }

  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
    color?: string;
  }

  export type LucideIcon = ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;

  // Common icons (existing)
  export const Menu: LucideIcon;
  export const Search: LucideIcon;
  export const Heart: LucideIcon;
  export const MapPin: LucideIcon;
  export const Navigation: LucideIcon;
  export const Locate: LucideIcon;
  export const Map: LucideIcon;
  export const Phone: LucideIcon;
  export const Video: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const Clock: LucideIcon;
  export const MoreVertical: LucideIcon;
  export const Eye: LucideIcon;
  export const MessageCircle: LucideIcon;
  export const Repeat2: LucideIcon;
  export const X: LucideIcon;
  export const Plus: LucideIcon;
  export const Camera: LucideIcon;
  export const Image: LucideIcon;
  export const FileText: LucideIcon;
  export const Users: LucideIcon;
  export const BarChart2: LucideIcon;
  export const Pencil: LucideIcon;
  export const Send: LucideIcon;
  export const Smile: LucideIcon;
  export const Home: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const Share2: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const Loader2: LucideIcon;
  export const Settings: LucideIcon;
  export const User: LucideIcon;
  export const Folder: LucideIcon;
  export const Settings2: LucideIcon;
  export const UserPlus: LucideIcon;
  export const UserMinus: LucideIcon;
  export const Check: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Info: LucideIcon;
  export const Bell: LucideIcon;
  export const Calendar: LucideIcon;
  export const CreditCard: LucideIcon;
  export const Package: LucideIcon;
  export const Truck: LucideIcon;
  export const Activity: LucideIcon;
  export const BarChart: LucideIcon;
  export const LineChart: LucideIcon;
  export const PieChart: LucideIcon;
  export const Flag: LucideIcon;
  export const Gift: LucideIcon;
  export const LogOut: LucideIcon;
  export const Download: LucideIcon;
  export const Trash: LucideIcon;
  export const Trash2: LucideIcon;
  export const Edit: LucideIcon;
  export const Edit2: LucideIcon;
  export const Edit3: LucideIcon;
  export const Share: LucideIcon;
  export const Star: LucideIcon;
  export const Upload: LucideIcon;
  export const Circle: LucideIcon;
  export const CircleCheck: LucideIcon;
  export const CircleDashed: LucideIcon;
  export const CirclePlus: LucideIcon;
  export const Lock: LucideIcon;
  export const Unlock: LucideIcon;
  export const Filter: LucideIcon;
  export const FilterX: LucideIcon;
  export const ArrowUpRight: LucideIcon;
  export const ArrowDownLeft: LucideIcon;
  export const ArrowDownRight: LucideIcon;
  export const ArrowUpLeft: LucideIcon;
  export const ArrowUp: LucideIcon;
  export const ArrowDown: LucideIcon;
  export const Copy: LucideIcon;
  export const PenTool: LucideIcon;
  export const Save: LucideIcon;
  export const Link: LucideIcon;
  export const LinkIcon: LucideIcon;

  // Additional icons needed by components
  export const Hospital: LucideIcon;
  export const Car: LucideIcon;
  export const UtensilsCrossed: LucideIcon;
  export const Briefcase: LucideIcon;
  export const Scissors: LucideIcon;
  export const GraduationCap: LucideIcon;
  export const Building2: LucideIcon;
  export const ShoppingBag: LucideIcon;
  export const Dumbbell: LucideIcon;
  export const Home: LucideIcon;
  export const Wrench: LucideIcon;
  export const Tag: LucideIcon;
  export const ListChecks: LucideIcon;
  export const Archive: LucideIcon;
  export const Forward: LucideIcon;
  export const ThumbsUp: LucideIcon;
  export const SmilePlus: LucideIcon;
  export const Grid3X3: LucideIcon;
  export const Grid2X2: LucideIcon;
  export const LayoutList: LucideIcon;
  export const Zap: LucideIcon;
  export const Computer: LucideIcon;
  export const PaintBucket: LucideIcon;
  export const Bug: LucideIcon;
  export const Shirt: LucideIcon;
  export const Dog: LucideIcon;
  export const BookOpen: LucideIcon;
  export const Wifi: LucideIcon;
  export const Baby: LucideIcon;
  export const Flower2: LucideIcon;
  export const Music2: LucideIcon;
  export const Stethoscope: LucideIcon;
  export const Store: LucideIcon;
  export const CalendarDays: LucideIcon;
  export const Megaphone: LucideIcon;
  export const PiggyBank: LucideIcon;
  export const Building: LucideIcon;
  export const MousePointer: LucideIcon;
  export const Trash2Icon: LucideIcon;
  export const PlusCircleIcon: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Award: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const DollarSign: LucideIcon;
  export const Target: LucideIcon;
  export const ShoppingCart: LucideIcon;
  export const CalendarIcon: LucideIcon;
  export const ClockIcon: LucideIcon;
  export const ChevronRightIcon: LucideIcon;
  export const EyeIcon: LucideIcon;
  export const MousePointerClickIcon: LucideIcon;
  export const ActivityIcon: LucideIcon;
  export const CircleDollarSign: LucideIcon;
  export const Bot: LucideIcon;
  export const Minimize2: LucideIcon;
  export const Maximize2: LucideIcon;
  export const DownloadCloud: LucideIcon;
  export const Reply: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Mail: LucideIcon;
  export const Globe: LucideIcon;

  // Export the icon function
  export function Icon(props: { icon: IconNode } & LucideProps): JSX.Element;
  
  // Export the dynamic icon imports
  export const icons: Record<string, LucideIcon>;
  export const dynamicIconImports: Record<string, () => Promise<{ default: LucideIcon }>>;
}
