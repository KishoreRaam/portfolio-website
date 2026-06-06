import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
  title: string;
  description: string;
  tag?: string;
  year?: string;
  link: string;
  linkText?: string;
}

const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ className, imgSrc, title, description, tag, year, link, linkText = "View Project", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#161616] text-white shadow-sm transition-all duration-500 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:border-white/20",
          className
        )}
        {...props}
      >
        {/* Image */}
        <div className="aspect-video overflow-hidden">
          <img
            src={imgSrc}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          {(tag || year) && (
            <div className="mb-3 flex items-center justify-between">
              {tag && (
                <span className="text-[11px] font-mono tracking-widest uppercase text-[#D5E636]">
                  {tag}
                </span>
              )}
              {year && (
                <span className="text-[11px] font-mono text-white/30">{year}</span>
              )}
            </div>
          )}

          <h3 className="text-lg font-semibold leading-tight transition-colors duration-300 group-hover:text-[#D5E636]" style={{ fontFamily: "'Young Serif', serif" }}>
            {title}
          </h3>

          <p className="mt-2 flex-1 text-sm leading-relaxed text-white/50" style={{ fontFamily: "Inter, sans-serif" }}>
            {description}
          </p>

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-all duration-300 hover:text-[#D5E636]"
            style={{ fontFamily: "Inter, sans-serif", letterSpacing: "0.05em" }}
            onClick={(e) => e.stopPropagation()}
          >
            {linkText}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </a>
        </div>
      </div>
    );
  }
);
ProjectCard.displayName = "ProjectCard";

export { ProjectCard };
