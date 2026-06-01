import { useState, useEffect, useRef, useCallback } from "react";

const AGE_GROUPS = [
  "0-4","5-9","10-14","15-19","20-24","25-29","30-34","35-39",
  "40-44","45-49","50-54","55-59","60-64","65-69","70-74",
  "75-79","80-84","85-89","90-94","95+"
];

const POPULATION_DATA = {
  1945: { male:[3680,3420,3280,3100,2650,2100,1980,1820,1650,1420,1180,980,780,580,400,260,150,70,25,8], female:[3550,3320,3180,3020,2720,2400,2200,1960,1750,1520,1280,1060,850,640,460,310,190,95,38,12], type:"実績（概算）" },
  1950: { male:[4210,3650,3380,3180,2820,2300,1950,1820,1640,1400,1150,940,730,530,360,220,120,52,18,5], female:[4080,3540,3280,3100,2900,2600,2180,1960,1750,1510,1260,1030,810,600,430,280,165,78,30,8], type:"実績" },
  1955: { male:[4820,4180,3620,3340,3050,2750,2250,1910,1800,1620,1370,1100,880,670,460,290,155,62,20,5], female:[4640,4020,3510,3250,2980,2750,2380,2020,1890,1700,1450,1180,950,730,510,340,200,88,32,8], type:"実績" },
  1960: { male:[4760,4790,4150,3580,3250,2960,2690,2220,1880,1770,1590,1330,1050,820,590,380,195,72,22,5], female:[4560,4600,4010,3470,3190,2970,2750,2350,1980,1850,1680,1420,1140,900,660,440,245,100,35,8], type:"実績" },
  1965: { male:[4430,4720,4750,4110,3510,3140,2870,2630,2180,1850,1750,1560,1290,1000,760,500,300,110,36,8], female:[4230,4520,4560,3970,3430,3120,2930,2710,2270,1940,1840,1660,1390,1090,840,580,380,155,56,14], type:"実績" },
  1970: { male:[4670,4390,4680,4710,4050,3440,3060,2810,2580,2140,1820,1720,1520,1240,930,680,420,160,50,12], female:[4460,4200,4490,4520,3930,3420,3090,2880,2660,2240,1910,1810,1620,1340,1040,790,530,230,82,22], type:"実績" },
  1975: { male:[4710,4630,4350,4640,4640,3980,3380,3010,2770,2550,2110,1790,1680,1470,1170,840,560,220,68,15], female:[4490,4420,4160,4450,4500,3930,3380,3070,2840,2640,2210,1890,1790,1590,1290,970,700,315,108,28], type:"実績" },
  1980: { male:[3750,4670,4590,4310,4580,4580,3940,3350,2980,2750,2530,2090,1760,1640,1400,1080,720,380,120,28], female:[3570,4460,4390,4130,4420,4460,3940,3380,3050,2820,2620,2200,1860,1760,1530,1220,880,510,185,50], type:"実績" },
  1985: { male:[3290,3710,4630,4550,4260,4510,4510,3890,3320,2960,2730,2510,2070,1730,1590,1320,970,580,240,55], female:[3130,3540,4430,4360,4110,4380,4430,3910,3360,3010,2790,2600,2180,1840,1720,1460,1140,740,340,88], type:"実績" },
  1990: { male:[3110,3250,3670,4590,4500,4200,4440,4440,3840,3280,2930,2700,2480,2030,1670,1500,1200,810,390,85], female:[2960,3090,3510,4400,4340,4080,4350,4380,3880,3330,2990,2760,2570,2140,1800,1640,1380,1020,540,135], type:"実績" },
  1995: { male:[3060,3070,3210,3630,4540,4450,4140,4380,4380,3800,3250,2900,2670,2440,1970,1590,1380,1020,560,130], female:[2910,2920,3060,3480,4380,4330,4070,4330,4360,3860,3320,2970,2730,2530,2090,1740,1570,1260,760,200], type:"実績" },
  2000: { male:[2990,3020,3040,3180,3590,4490,4400,4090,4330,4320,3760,3220,2870,2640,2390,1880,1470,1190,760,175], female:[2840,2870,2900,3040,3470,4380,4330,4060,4310,4340,3830,3310,2960,2740,2510,2030,1680,1430,1020,280], type:"実績" },
  2005: { male:[2820,2960,2990,3010,3140,3550,4440,4350,4040,4280,4260,3720,3180,2840,2600,2310,1770,1300,940,240], female:[2680,2820,2850,2870,3020,3440,4350,4310,4040,4310,4330,3820,3300,2960,2710,2470,1950,1550,1250,385], type:"実績" },
  2010: { male:[2680,2790,2930,2960,2980,3100,3510,4380,4300,3990,4220,4200,3680,3140,2800,2540,2200,1580,1060,290], female:[2550,2660,2800,2830,2860,3000,3430,4320,4300,4040,4280,4310,3820,3300,2970,2730,2490,1920,1410,470], type:"実績" },
  2015: { male:[2620,2650,2760,2900,2920,2940,3060,3460,4310,4230,3930,4150,4120,3610,3090,2750,2450,1980,1310,390], female:[2490,2530,2640,2780,2810,2840,3000,3420,4300,4260,4010,4260,4280,3820,3330,3010,2770,2400,1720,620], type:"実績" },
  2020: { male:[2530,2590,2620,2730,2870,2890,2910,3030,3430,4260,4190,3900,4110,4080,3590,3070,2700,2290,1700,560], female:[2410,2470,2500,2620,2760,2800,2840,3010,3430,4300,4260,4020,4280,4290,3840,3350,3010,2700,2150,850], type:"実績" },
  2025: { male:[2240,2500,2560,2590,2700,2840,2860,2880,3000,3390,4210,4140,3860,4060,4020,3550,3010,2550,2010,720], female:[2130,2380,2440,2480,2610,2740,2790,2820,2990,3420,4270,4230,3990,4250,4270,3820,3320,2880,2440,1100], type:"推計" },
  2030: { male:[2000,2210,2470,2530,2560,2670,2810,2830,2850,2970,3350,4160,4090,3820,4010,3970,3510,2950,2390,840], female:[1900,2110,2360,2420,2450,2590,2730,2780,2800,2970,3400,4240,4200,3970,4230,4230,3780,3270,2760,1280], type:"推計" },
  2035: { male:[1850,1970,2180,2440,2500,2530,2640,2790,2810,2820,2940,3310,4110,4050,3790,3970,3930,3460,2840,1020], female:[1760,1880,2090,2340,2410,2440,2570,2720,2770,2790,2960,3380,4200,4170,3950,4200,4200,3760,3200,1510], type:"推計" },
  2040: { male:[1750,1820,1940,2150,2410,2470,2500,2610,2760,2780,2790,2910,3270,4060,4010,3760,3940,3890,3350,1230], female:[1660,1740,1860,2070,2330,2400,2430,2560,2710,2760,2780,2940,3360,4160,4140,3930,4170,4170,3690,1760], type:"推計" },
  2045: { male:[1680,1720,1790,1910,2120,2380,2440,2470,2580,2730,2750,2760,2880,3240,4020,3980,3740,3900,3810,1500], female:[1600,1640,1710,1840,2060,2310,2390,2420,2550,2700,2750,2770,2930,3340,4120,4110,3900,4130,4090,2060], type:"推計" },
  2050: { male:[1580,1650,1690,1760,1880,2090,2350,2410,2440,2550,2700,2720,2730,2850,3210,3980,3950,3710,3830,1780], female:[1500,1580,1620,1700,1830,2040,2300,2380,2420,2550,2700,2750,2770,2920,3320,4090,4080,3870,4060,2380], type:"推計" },
};

const YEARS = Object.keys(POPULATION_DATA).map(Number).sort((a, b) => a - b);

const TFR_DATA = {
  1945:4.24, 1950:3.65, 1955:2.37, 1960:2.00, 1965:2.14,
  1970:2.13, 1975:1.91, 1980:1.75, 1985:1.76, 1990:1.54,
  1995:1.42, 2000:1.36, 2005:1.26, 2010:1.39, 2015:1.45,
  2020:1.33, 2025:1.24, 2030:1.24, 2035:1.26, 2040:1.29,
  2045:1.32, 2050:1.36,
};

const AGE_MIDPOINTS = [2,7,12,17,22,27,32,37,42,47,52,57,62,67,72,77,82,87,92,97];

function calcStats(data) {
  const totalM = data.male.reduce((a, b) => a + b, 0);
  const totalF = data.female.reduce((a, b) => a + b, 0);
  const total = totalM + totalF;
  const avgMale = data.male.reduce((a, v, i) => a + v * AGE_MIDPOINTS[i], 0) / totalM;
  const avgFemale = data.female.reduce((a, v, i) => a + v * AGE_MIDPOINTS[i], 0) / totalF;
  const elderly = data.male.slice(13).reduce((a,b)=>a+b,0) + data.female.slice(13).reduce((a,b)=>a+b,0);
  const young = data.male.slice(0,3).reduce((a,b)=>a+b,0) + data.female.slice(0,3).reduce((a,b)=>a+b,0);
  const working = data.male.slice(3,13).reduce((a,b)=>a+b,0) + data.female.slice(3,13).reduce((a,b)=>a+b,0);
  return {
    total: Math.round(total),
    totalM: Math.round(totalM),
    totalF: Math.round(totalF),
    avgMale: avgMale.toFixed(1),
    avgFemale: avgFemale.toFixed(1),
    elderlyRate: ((elderly/total)*100).toFixed(1),
    youngRate: ((young/total)*100).toFixed(1),
    workingRate: ((working/total)*100).toFixed(1),
  };
}

function StatCard({ label, value, sub, color, small }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 10,
      padding: small ? "8px 12px" : "10px 14px",
      textAlign: "center",
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{ fontSize: 9, color: "#6b7db3", marginBottom: 3, letterSpacing: "0.08em", fontFamily: "monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {label}
      </div>
      <div style={{ fontSize: small ? 16 : 18, fontWeight: 700, color: color || "#c8d4f0", fontFamily: "monospace", lineHeight: 1.2 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 9, color: "#4a5570", marginTop: 2, fontFamily: "monospace" }}>{sub}</div>}
    </div>
  );
}

export default function PopulationPyramid() {
  const [yearIndex, setYearIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pendingPlay, setPendingPlay] = useState(false);
  const intervalRef = useRef(null);
  const prevDataRef = useRef(null);

  const year = YEARS[yearIndex];
  const data = POPULATION_DATA[year];
  const stats = calcStats(data);
  const tfr = TFR_DATA[year];
  const isEstimate = data.type.includes("推計");

  const maxVal = Math.max(
    ...Object.values(POPULATION_DATA).flatMap(d => [...d.male, ...d.female])
  );

  const tick = useCallback(() => {
    setYearIndex(i => {
      if (i >= YEARS.length - 1) { setPlaying(false); return i; }
      return i + 1;
    });
  }, []);

  useEffect(() => {
    if (pendingPlay && yearIndex === 0) { setPendingPlay(false); setPlaying(true); }
  }, [pendingPlay, yearIndex]);

  useEffect(() => {
    if (playing) { intervalRef.current = setInterval(tick, 600); }
    else { clearInterval(intervalRef.current); }
    return () => clearInterval(intervalRef.current);
  }, [playing, tick]);

  useEffect(() => { prevDataRef.current = data; });

  const barWidth = (val) => `${(val / maxVal) * 100}%`;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0e1a",
      color: "#e8eaf2",
      fontFamily: "'Georgia', 'Noto Serif JP', serif",
      padding: "20px 14px",
      boxSizing: "border-box",
    }}>
      {/* ヘッダー */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.25em", color: "#6b7db3", textTransform: "uppercase", marginBottom: 4, fontFamily: "monospace" }}>
          Japan Population Structure
        </div>
        <h1 style={{ margin: 0, fontSize: "clamp(18px, 4vw, 28px)", fontWeight: 400, letterSpacing: "0.05em", color: "#c8d4f0" }}>
          日本の人口ピラミッド
        </h1>
        <div style={{ marginTop: 4, fontSize: 10, color: "#4a5570", fontFamily: "monospace" }}>
          出典：国勢調査 / 社人研2023年推計
        </div>
      </div>

      {/* 年表示 */}
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <span style={{
          fontSize: "clamp(42px, 10vw, 70px)", fontWeight: 700, letterSpacing: "-0.03em",
          color: isEstimate ? "#f0a050" : "#7eb8f7", fontFamily: "'Georgia', serif", lineHeight: 1, transition: "color 0.4s",
        }}>{year}</span>
        <span style={{
          display: "inline-block", marginLeft: 8, fontSize: 11, padding: "3px 10px", borderRadius: 20,
          background: isEstimate ? "rgba(240,160,80,0.15)" : "rgba(126,184,247,0.15)",
          color: isEstimate ? "#f0a050" : "#7eb8f7",
          border: `1px solid ${isEstimate ? "rgba(240,160,80,0.3)" : "rgba(126,184,247,0.3)"}`,
          verticalAlign: "middle", fontFamily: "monospace", transition: "all 0.4s",
        }}>{data.type}</span>
      </div>

      {/* 統計パネル 上段 */}
      <div style={{ maxWidth: 680, margin: "0 auto 8px", display: "flex", gap: 6 }}>
        {/* 総人口（男女2段） */}
        <div style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10, padding: "8px 12px", flex: 1.2, textAlign: "center",
        }}>
          <div style={{ fontSize: 9, color: "#6b7db3", marginBottom: 4, letterSpacing: "0.08em", fontFamily: "monospace" }}>総人口</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#c8d4f0", fontFamily: "monospace", lineHeight: 1.1 }}>
            {Math.round(stats.total * 10).toLocaleString()}<span style={{ fontSize: 10, fontWeight: 400 }}> 万人</span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 5 }}>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: "#7eb8f7" }}>
              ♂ {Math.round(stats.totalM * 10).toLocaleString()}万
            </div>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: "#f48fb1" }}>
              ♀ {Math.round(stats.totalF * 10).toLocaleString()}万
            </div>
          </div>
        </div>

        {/* 平均年齢（男女2段） */}
        <div style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10, padding: "8px 12px", flex: 1.2, textAlign: "center",
        }}>
          <div style={{ fontSize: 9, color: "#6b7db3", marginBottom: 4, letterSpacing: "0.08em", fontFamily: "monospace" }}>平均年齢</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#7eb8f7", fontFamily: "monospace" }}>男性</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#7eb8f7", fontFamily: "monospace" }}>{stats.avgMale}</div>
            </div>
            <div style={{ color: "#3a4560", fontSize: 20, lineHeight: "36px" }}>|</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#f48fb1", fontFamily: "monospace" }}>女性</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#f48fb1", fontFamily: "monospace" }}>{stats.avgFemale}</div>
            </div>
          </div>
        </div>

        {/* 合計特殊出生率 */}
        <div style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10, padding: "8px 12px", flex: 1, textAlign: "center",
        }}>
          <div style={{ fontSize: 9, color: "#6b7db3", marginBottom: 4, letterSpacing: "0.08em", fontFamily: "monospace" }}>合計特殊出生率</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: tfr >= 2.07 ? "#81c784" : tfr >= 1.5 ? "#ffcc80" : "#ef9a9a", fontFamily: "monospace", lineHeight: 1.1 }}>
            {tfr.toFixed(2)}
          </div>
          <div style={{ fontSize: 9, color: "#4a5570", marginTop: 4, fontFamily: "monospace" }}>
            {tfr >= 2.07 ? "維持水準↑" : tfr >= 1.5 ? "低下傾向" : "超少子化"}
          </div>
        </div>
      </div>

      {/* 統計パネル 下段 */}
      <div style={{ maxWidth: 680, margin: "0 auto 16px", display: "flex", gap: 6 }}>
        <StatCard label="年少人口率 (0-14歳)" value={`${stats.youngRate}%`} color="#81c784" small />
        <StatCard label="生産年齢人口 (15-64歳)" value={`${stats.workingRate}%`} color="#80cbc4" small />
        <StatCard label="高齢化率 (65歳+)" value={`${stats.elderlyRate}%`} color="#ff8a65" small />
      </div>

      {/* ピラミッド本体 */}
      <div style={{ maxWidth: 680, margin: "0 auto 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, paddingLeft: 52 }}>
          <span style={{ fontSize: 11, color: "#7eb8f7", letterSpacing: "0.1em", fontFamily: "monospace" }}>← 男性</span>
          <span style={{ fontSize: 11, color: "#f48fb1", letterSpacing: "0.1em", fontFamily: "monospace" }}>女性 →</span>
        </div>
        {[...AGE_GROUPS].reverse().map((ag, ri) => {
          const i = AGE_GROUPS.length - 1 - ri;
          const mVal = data.male[i];
          const fVal = data.female[i];
          return (
            <div key={ag} style={{ display: "flex", alignItems: "center", marginBottom: 2, gap: 4 }}>
              <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                <div
                  title={`男性 ${ag}歳：${(mVal / 10).toFixed(1)}万人`}
                  style={{
                    width: barWidth(mVal), height: 13,
                    background: isEstimate ? "linear-gradient(to left, #5b8dd9, #3a6bc4)" : "linear-gradient(to left, #7eb8f7, #5590e0)",
                    borderRadius: "3px 0 0 3px", transition: "width 0.45s cubic-bezier(0.4,0,0.2,1)", opacity: 0.85,
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "0.85"}
                />
              </div>
              <div style={{ width: 44, textAlign: "center", fontSize: 9, color: "#6b7db3", flexShrink: 0, fontFamily: "monospace" }}>
                {ag}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  title={`女性 ${ag}歳：${(fVal / 10).toFixed(1)}万人`}
                  style={{
                    width: barWidth(fVal), height: 13,
                    background: isEstimate ? "linear-gradient(to right, #c2637a, #a0415e)" : "linear-gradient(to right, #f48fb1, #e06090)",
                    borderRadius: "0 3px 3px 0", transition: "width 0.45s cubic-bezier(0.4,0,0.2,1)", opacity: 0.85,
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "0.85"}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* スライダー */}
      <div style={{ maxWidth: 680, margin: "0 auto 14px", padding: "0 4px" }}>
        <input
          type="range" min={0} max={YEARS.length - 1} value={yearIndex}
          onChange={e => setYearIndex(Number(e.target.value))}
          style={{ width: "100%", accentColor: isEstimate ? "#f0a050" : "#7eb8f7", height: 4, cursor: "pointer" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: "#4a5570", fontFamily: "monospace", marginTop: 4 }}>
          {YEARS.map(y => <span key={y}>{y}</span>)}
        </div>
      </div>

      {/* 再生コントロール */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 18 }}>
        <button onClick={() => setYearIndex(0)} style={btnStyle("#2a3550")}>⏮ 最初へ</button>
        <button
          onClick={() => {
            if (playing) { setPlaying(false); }
            else if (yearIndex >= YEARS.length - 1) { setYearIndex(0); setPendingPlay(true); }
            else { setPlaying(true); }
          }}
          style={btnStyle(playing ? "#1a3a6a" : "#163560", playing ? "#7eb8f7" : "#c8d4f0")}
        >{playing ? "⏸ 停止" : "▶ 再生"}</button>
        <button onClick={() => setYearIndex(YEARS.length - 1)} style={btnStyle("#2a3550")}>⏭ 最後へ</button>
      </div>

      {/* 凡例 */}
      <div style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: 20 }}>
        {[
          { color: "#7eb8f7", label: "実績値（国勢調査）" },
          { color: "#f0a050", label: "推計値（社人研2023）" },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: l.color }} />
            <span style={{ fontSize: 11, color: "#6b7db3", fontFamily: "monospace" }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function btnStyle(bg, color = "#c8d4f0") {
  return {
    background: bg, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
    color, padding: "8px 18px", fontSize: 13, cursor: "pointer",
    fontFamily: "monospace", letterSpacing: "0.05em", transition: "all 0.2s",
  };
}
