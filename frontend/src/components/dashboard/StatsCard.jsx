import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const StatsCard = ({ title, value, icon: Icon, trend, color = "primary" }) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  };

  return (
    <Card className="p-6 hover:shadow-elegant transition-all duration-300 animate-fade-in bg-gradient-card border-border/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2 text-foreground">{value}</h3>
          {trend && (
            <p
              className={cn(
                "text-sm mt-2 font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {trend.value}
              <span className="text-muted-foreground ml-1">vs last month</span>
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
