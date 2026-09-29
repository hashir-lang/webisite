import { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

type Variant = "primary" | "ghost" | "paper" | "outline";
type Size = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-smooth whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-aubergine text-white hover:bg-plum",
  ghost:   "text-ink hover:text-plum",
  paper:   "bg-white text-ink ring-1 ring-rule hover:ring-plum hover:text-plum",
  outline: "border border-current text-ink hover:bg-ink hover:text-paper",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-[13px]",
  lg: "px-7 py-3.5 text-[14px]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  children: ReactNode;
  className?: string;
};

type LinkLikeProps = CommonProps & { to: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | "href">;
type AnchorProps   = CommonProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | "href">;
type ButtonProps   = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps>;

const Arrow = () => (
  <ArrowUpRight
    className="h-4 w-4 transition-transform duration-300 ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    aria-hidden
  />
);

export function EditorialButton(props: LinkLikeProps | AnchorProps | ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    arrow = true,
    children,
    className = "",
    ...rest
  } = props as CommonProps & Record<string, unknown>;

  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {arrow && <Arrow />}
    </>
  );

  if ("to" in rest && typeof rest.to === "string") {
    const { to, ...anchorRest } = rest as LinkLikeProps;
    return <Link to={to} className={cls} {...(anchorRest as object)}>{content}</Link>;
  }
  if ("href" in rest && typeof rest.href === "string") {
    return <a className={cls} {...(rest as AnchorProps)}>{content}</a>;
  }
  return <button className={cls} {...(rest as ButtonProps)}>{content}</button>;
}

export default EditorialButton;
