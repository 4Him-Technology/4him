import moment from "moment";
import { useMemo } from "react";

const TYPE_COLOR = {
  "Ação":       "#3b82f6",
  "Audiência":  "#8b5cf6",
  "Recurso":    "#f59e0b",
  "Consulta":   "#14b8a6",
  "Reunião":    "#6366f1",
  "Prazo":      "#ef4444",
  "Diligência": "#10b981",
};

const STATUS_OPACITY = {
  "Realizado": 0.45,
  "Encerrado": 0.45,
  "Cancelado": 0.25,
};

const ROW_H = 36;
const LABEL_W = 180;
const DAY_W = 28;

export default function TimelineGantt({ cases }) {
  const { weeks, startDate, endDate, rows } = useMemo(() => {
    if (cases.length === 0) return { weeks: [], startDate: null, endDate: null, rows: [] };

    const dates = cases.map(c => moment(c.date));
    const minDate = moment.min(dates).startOf("week");
    const maxDate = moment.max(dates).endOf("week").add(1, "week");

    // Build week columns
    const weeks = [];
    let cur = minDate.clone();
    while (cur.isBefore(maxDate)) {
      weeks.push(cur.clone());
      cur.add(1, "week");
    }

    // Group by client
    const byClient = {};
    cases.forEach(c => {
      if (!byClient[c.client_name]) byClient[c.client_name] = [];
      byClient[c.client_name].push(c);
    });

    const rows = Object.entries(byClient).map(([client, items]) => ({
      client,
      items: items.sort((a, b) => a.date?.localeCompare(b.date)),
    }));

    return { weeks, startDate: minDate, endDate: maxDate, rows };
  }, [cases]);

  if (cases.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl flex items-center justify-center h-64 text-sm text-muted-foreground">
        Nenhum processo para exibir
      </div>
    );
  }

  const totalWeeks = weeks.length;
  const totalW = totalWeeks * DAY_W * 7;
  const today = moment();
  const todayOffset = today.diff(startDate, "days") * DAY_W;

  function dateToX(date) {
    return moment(date).diff(startDate, "days") * DAY_W;
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Gantt — Visão por Semana</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {moment(startDate).format("DD/MM/YY")} — {moment(endDate).format("DD/MM/YY")}
        </p>
      </div>

      <div className="overflow-auto max-h-[600px]">
        <div style={{ minWidth: LABEL_W + totalW + 16 }}>
          {/* Week headers */}
          <div className="flex sticky top-0 z-20 bg-muted/80 backdrop-blur border-b border-border">
            <div style={{ width: LABEL_W, minWidth: LABEL_W }} className="shrink-0 px-3 py-2 text-xs font-semibold text-muted-foreground border-r border-border">
              Cliente
            </div>
            <div className="flex">
              {weeks.map((w, i) => (
                <div
                  key={i}
                  style={{ width: DAY_W * 7, minWidth: DAY_W * 7 }}
                  className="border-r border-border px-1 py-2 text-center"
                >
                  <p className="text-[10px] font-bold text-muted-foreground">{w.format("DD/MM")}</p>
                  <div className="flex justify-around mt-1">
                    {["D","S","T","Q","Q","S","S"].map((d, di) => (
                      <span key={di} className="text-[9px] text-muted-foreground/60 w-full text-center">{d}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          {rows.map(({ client, items }) => (
            <div key={client} className="flex border-b border-border hover:bg-muted/10 transition-colors relative" style={{ height: ROW_H }}>
              {/* Label */}
              <div
                style={{ width: LABEL_W, minWidth: LABEL_W }}
                className="shrink-0 px-3 flex items-center border-r border-border"
              >
                <p className="text-xs font-medium text-foreground truncate">{client}</p>
              </div>

              {/* Gantt area */}
              <div className="flex-1 relative" style={{ width: totalW }}>
                {/* Weekend shading */}
                {weeks.map((w, wi) => (
                  [5, 6].map(dayOff => (
                    <div
                      key={`${wi}-${dayOff}`}
                      className="absolute inset-y-0 bg-muted/20"
                      style={{ left: (wi * 7 + dayOff) * DAY_W, width: DAY_W }}
                    />
                  ))
                ))}

                {/* Today line */}
                {todayOffset >= 0 && todayOffset < totalW && (
                  <div
                    className="absolute inset-y-0 w-px bg-red-400 z-10"
                    style={{ left: todayOffset }}
                  />
                )}

                {/* Event markers */}
                {items.map(item => {
                  const x = dateToX(item.date);
                  const color = TYPE_COLOR[item.type] || "#96682c";
                  const opacity = STATUS_OPACITY[item.status] || 1;
                  return (
                    <div
                      key={item.id}
                      className="absolute top-1/2 -translate-y-1/2 group"
                      style={{ left: x - 10, zIndex: 5 }}
                      title={`${item.type}: ${item.client_name}\n${moment(item.date).format("DD/MM/YYYY")} ${item.time || ""}\n${item.court || ""}`}
                    >
                      {/* Diamond marker */}
                      <div
                        className="w-4 h-4 rotate-45 cursor-pointer transition-transform group-hover:scale-125"
                        style={{ backgroundColor: color, opacity, borderRadius: 2 }}
                      />
                      {/* Tooltip */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block z-30 bg-popover border border-border rounded-lg shadow-lg px-3 py-2 text-xs whitespace-nowrap">
                        <p className="font-semibold text-foreground">{item.type}</p>
                        <p className="text-muted-foreground">{moment(item.date).format("DD/MM/YYYY")}{item.time && ` · ${item.time}`}</p>
                        {item.court && <p className="text-muted-foreground">{item.court}</p>}
                        <p className={`font-medium mt-0.5 ${item.status === "Realizado" ? "text-emerald-600" : item.date < moment().format("YYYY-MM-DD") && item.status !== "Realizado" ? "text-red-500" : "text-amber-600"}`}>
                          {item.status}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Week grid lines */}
                {weeks.map((_, wi) => (
                  <div
                    key={wi}
                    className="absolute inset-y-0 border-r border-border/50"
                    style={{ left: (wi + 1) * 7 * DAY_W }}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex flex-wrap gap-3 px-4 py-3 border-t border-border bg-muted/20">
            {Object.entries(TYPE_COLOR).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rotate-45 rounded-sm" style={{ backgroundColor: color }} />
                <span className="text-[10px] text-muted-foreground">{type}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 ml-2">
              <div className="w-3 h-3 bg-red-400 rounded-sm" />
              <span className="text-[10px] text-muted-foreground">Hoje</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}