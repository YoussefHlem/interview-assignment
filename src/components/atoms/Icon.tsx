import type { ElementType } from "react";
import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";

type SvgIconComponent = ElementType<SvgIconProps>;

export interface IconProps extends SvgIconProps {
  icon?: SvgIconComponent;
}

export function Icon({ icon: IconComponent = SvgIcon, ...props }: IconProps) {
  return <IconComponent {...props} />;
}
