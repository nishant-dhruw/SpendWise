import type { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import "./SummaryCard.css";

interface SummaryCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  type: "balance" | "income" | "expense" | "savings";
}

function SummaryCard({
  title,
  value,
  description,
  icon,
  type,
}: SummaryCardProps) {
  return (
    <article className={`summary-card ${type}`}>

      <div className="summary-card-top">

        <div>
          <p className="summary-card-title">
            {title}
          </p>

          <h3 className="summary-card-value">
            {value}
          </h3>
        </div>

        <div className="summary-card-icon">
          {icon}
        </div>

      </div>

      <div className="summary-card-description">

        {type === "expense" ? (
          <ArrowDownRight size={14} />
        ) : (
          <ArrowUpRight size={14} />
        )}

        <span>
          {description}
        </span>

      </div>

    </article>
  );
}

export default SummaryCard;