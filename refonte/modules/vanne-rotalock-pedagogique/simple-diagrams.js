"use strict";

(function init(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.RotalockSimpleDiagrams = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function factory() {
  const C = {
    paper: "#f7f1e7",
    white: "#fffdf8",
    navy: "#1b3a63",
    ink: "#10233c",
    muted: "#637285",
    line: "#aab9c5",
    body: "#dfe7ea",
    cavity: "#fffdf8",
    copper: "#c97545",
    orange: "#ff6b35",
    blue: "#3d7fca",
    red: "#c0392b",
    green: "#1e7e54",
    yellow: "#f2b544",
    closed: "#4f5f68"
  };

  function escapeXml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function multiline(x, y, lines, options = {}) {
    const size = options.size || 42;
    const weight = options.weight || 700;
    const fill = options.fill || C.ink;
    const anchor = options.anchor || "start";
    const gap = options.gap || Math.round(size * 1.18);
    return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${lines.map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : gap}">${escapeXml(line)}</tspan>`).join("")}</text>`;
  }

  function frame(step, title, subtitle, body, footer) {
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-labelledby="title desc" font-family="Calibri, Segoe UI, Arial, sans-serif">
  <title id="title">${escapeXml(title)}</title>
  <desc id="desc">${escapeXml(subtitle)} ${escapeXml(footer || "")}</desc>
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#1b3a63" flood-opacity=".14"/></filter>
    <pattern id="isolated-hatch" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="22" height="22" fill="#edf1f3"/><line x1="0" y1="0" x2="0" y2="22" stroke="#9aaab4" stroke-width="8"/></pattern>
    <marker id="arrow-ink" viewBox="0 0 50 50" refX="44" refY="25" markerWidth="50" markerHeight="50" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M3 4L47 25L3 46Z" fill="${C.ink}"/></marker>
    <marker id="arrow-blue" viewBox="0 0 50 50" refX="44" refY="25" markerWidth="50" markerHeight="50" markerUnits="userSpaceOnUse" orient="auto"><path d="M3 4L47 25L3 46Z" fill="${C.blue}"/></marker>
    <marker id="arrow-red" viewBox="0 0 50 50" refX="44" refY="25" markerWidth="50" markerHeight="50" markerUnits="userSpaceOnUse" orient="auto"><path d="M3 4L47 25L3 46Z" fill="${C.red}"/></marker>
  </defs>
  <rect width="1920" height="1080" fill="${C.paper}"/>
  <rect x="70" y="48" width="174" height="58" rx="29" fill="${C.navy}"/>
  <text x="157" y="88" font-size="30" font-weight="800" fill="${C.white}" text-anchor="middle" font-family="Trebuchet MS, Calibri, Arial, sans-serif">ÉTAPE ${step}</text>
  <text x="276" y="94" font-size="58" font-weight="850" fill="${C.navy}" font-family="Trebuchet MS, Calibri, Arial, sans-serif">${escapeXml(title)}</text>
  <text x="76" y="154" font-size="32" font-weight="600" fill="${C.muted}">${escapeXml(subtitle)}</text>
  ${body}
  ${footer ? `<rect x="70" y="963" width="1780" height="76" rx="22" fill="${C.white}" stroke="${C.line}" stroke-width="3"/><circle cx="112" cy="1001" r="16" fill="${C.orange}"/><text x="148" y="1012" font-size="34" font-weight="800" fill="${C.ink}">${escapeXml(footer)}</text>` : ""}
</svg>`;
  }

  function callout(x, y, w, title, detail, color, targetX, targetY, fromRight = true) {
    const startX = fromRight ? x + w : x;
    const bendX = fromRight ? startX + 70 : startX - 70;
    return `
      <path d="M${startX} ${y + 68} H${bendX} L${targetX} ${targetY}" fill="none" stroke="${color}" stroke-width="6" marker-end="url(#arrow-ink)"/>
      <rect x="${x}" y="${y}" width="${w}" height="136" rx="24" fill="${C.white}" stroke="${color}" stroke-width="5" filter="url(#shadow)"/>
      <text x="${x + 28}" y="${y + 52}" font-size="36" font-weight="850" fill="${color}">${escapeXml(title)}</text>
      <text x="${x + 28}" y="${y + 99}" font-size="28" font-weight="650" fill="${C.ink}">${escapeXml(detail)}</text>`;
  }

  function photoCard(photoDataUri) {
    return `<rect x="70" y="190" width="1780" height="742" rx="34" fill="${C.white}" filter="url(#shadow)"/>
      <image href="${photoDataUri}" x="88" y="208" width="1744" height="706" preserveAspectRatio="xMidYMid meet"/>`;
  }

  function recognition(photoDataUri) {
    const body = `${photoCard(photoDataUri)}
      ${callout(92, 272, 365, "TUYAUTERIE", "vers l’installation", C.blue, 545, 680, true)}
      ${callout(1228, 250, 540, "CAPUCHON DE TIGE", "le carré est dessous", C.orange, 1285, 310, false)}
      ${callout(1280, 720, 510, "RACCORD ROTALOCK", "vers le compresseur", C.green, 1000, 710, false)}`;
    return frame(1, "Voici la vanne de service", "Commence par reconnaître ses trois côtés.", body, "Pour la manœuvrer, on retire le capuchon noir puis on tourne le carré.");
  }

  function ports(photoDataUri) {
    const body = `${photoCard(photoDataUri)}
      <circle cx="708" cy="343" r="64" fill="none" stroke="${C.blue}" stroke-width="9"/>
      <circle cx="653" cy="806" r="64" fill="none" stroke="${C.red}" stroke-width="9" stroke-dasharray="18 13"/>
      ${callout(90, 255, 450, "VOIE DE SERVICE P", "flexible du manifold", C.blue, 708, 343, true)}
      ${callout(92, 686, 470, "PRISE P1", "prise du pressostat", C.red, 653, 806, true)}
      <rect x="1210" y="312" width="555" height="168" rx="26" fill="${C.white}" stroke="${C.orange}" stroke-width="5" filter="url(#shadow)"/>
      ${multiline(1240, 365, ["Le carré est sous", "ce capuchon noir."], { size: 34, gap: 44 })}
      <path d="M1210 396H1135L1260 318" fill="none" stroke="${C.orange}" stroke-width="6" marker-end="url(#arrow-ink)"/>`;
    return frame(2, "Deux raccordements, deux rôles", "Ne branche pas un flexible au hasard.", body, "P est la voie de service. La prise P1, plus loin du carré, reçoit le pressostat.");
  }

  function mechanism() {
    const body = `
      <rect x="105" y="218" width="1710" height="700" rx="42" fill="${C.white}" stroke="${C.line}" stroke-width="4" filter="url(#shadow)"/>
      <rect x="245" y="420" width="1295" height="280" rx="82" fill="${C.body}" stroke="${C.ink}" stroke-width="8"/>
      <rect x="320" y="500" width="1145" height="120" rx="60" fill="${C.cavity}" stroke="${C.line}" stroke-width="5"/>

      <path d="M1030 560L980 510H915L865 560L915 610H980Z" fill="${C.orange}" stroke="${C.ink}" stroke-width="8"/>
      <line x1="1030" y1="560" x2="1600" y2="560" stroke="${C.orange}" stroke-width="36"/>
      <rect x="1600" y="490" width="112" height="140" rx="13" fill="${C.orange}" stroke="${C.ink}" stroke-width="8"/>

      <rect x="1428" y="466" width="92" height="188" rx="24" fill="#b7c2c8" stroke="${C.ink}" stroke-width="8"/>
      <rect x="1450" y="478" width="48" height="164" rx="14" fill="${C.yellow}" stroke="${C.ink}" stroke-width="5"/>

      <path d="M760 350H1160" fill="none" stroke="${C.ink}" stroke-width="9" marker-start="url(#arrow-ink)" marker-end="url(#arrow-ink)"/>
      <text x="960" y="318" text-anchor="middle" font-size="42" font-weight="850" fill="${C.ink}">TOUT L’ENSEMBLE AVANCE OU RECULE</text>
      <path d="M1070 410H1580" fill="none" stroke="${C.orange}" stroke-width="6"/>
      <path d="M1070 392V428M1580 392V428" stroke="${C.orange}" stroke-width="6"/>
      <text x="1325" y="382" text-anchor="middle" font-size="31" font-weight="850" fill="#c9451a">TIGE : LONGUEUR CONSTANTE</text>

      <text x="947" y="750" text-anchor="middle" font-size="32" font-weight="850" fill="#c9451a">POINTEAU / BOISSEAU</text>
      <text x="1656" y="705" text-anchor="middle" font-size="31" font-weight="850" fill="${C.ink}">CARRÉ DE MANŒUVRE</text>
      <path d="M1570 315L1502 458" fill="none" stroke="${C.ink}" stroke-width="5" marker-end="url(#arrow-ink)"/>
      <text x="1570" y="292" text-anchor="middle" font-size="29" font-weight="850" fill="${C.ink}">PRESSE-ÉTOUPE FIXE</text>
      <path d="M1570 440C1740 355 1790 505 1700 530" fill="none" stroke="${C.orange}" stroke-width="10" marker-end="url(#arrow-ink)"/>

      <rect x="270" y="780" width="1380" height="90" rx="24" fill="#fff3df" stroke="${C.orange}" stroke-width="4"/>
      <text x="960" y="837" text-anchor="middle" font-size="36" font-weight="850" fill="${C.ink}">Pointeau + tige + carré = un seul ensemble rigide mobile</text>`;
    return frame(3, "Une seule tige mobile", "Le presse-étoupe reste fixe ; l’ensemble orange se déplace.", body, "Quand on tourne le carré, sa position longitudinale change avec celle du pointeau.");
  }

  function valveBody(position, options = {}) {
    const flow = options.flow || null;
    const fluid = options.fluid || "#84b7ec";
    const isolated = "url(#isolated-hatch)";
    const moving = position === "front"
      ? { path: "M800 545L845 500H905L950 545L905 590H845Z", headRight: 950, squareX: 1510 }
      : position === "back"
        ? { path: "M1070 545L1115 500H1175L1220 545L1175 590H1115Z", headRight: 1220, squareX: 1780 }
        : { path: "M935 545L980 500H1040L1085 545L1040 590H980Z", headRight: 1085, squareX: 1645 };
    const head = `<line x1="${moving.headRight}" y1="545" x2="${moving.squareX}" y2="545" stroke="${C.orange}" stroke-width="30"/><path d="${moving.path}" fill="${C.orange}" stroke="${C.ink}" stroke-width="8"/>`;
    const mainBore = position === "front"
      ? `<rect x="163" y="483" width="1324" height="124" rx="61" fill="${fluid}"/><path d="M224 483H800V607H224A61 61 0 0 1 163 546V544A61 61 0 0 1 224 483Z" fill="${isolated}"/>`
      : position === "back"
        ? `<rect x="163" y="483" width="1324" height="124" rx="61" fill="${fluid}"/><path d="M1220 483H1426A61 61 0 0 1 1487 544V546A61 61 0 0 1 1426 607H1220Z" fill="${isolated}"/>`
        : `<rect x="163" y="483" width="1324" height="124" rx="61" fill="${fluid}"/>`;
    const pFill = position === "back" ? isolated : fluid;
    const pLabel = position === "back"
      ? `<rect x="1220" y="185" width="260" height="94" rx="20" fill="#fbe7e4" stroke="${C.red}" stroke-width="6" stroke-dasharray="16 9"/><text x="1350" y="225" text-anchor="middle" font-size="31" font-weight="900" fill="${C.red}">P</text><text x="1350" y="260" text-anchor="middle" font-size="24" font-weight="850" fill="${C.red}">VOIE DE SERVICE FERMÉE</text>`
      : `<rect x="1220" y="185" width="260" height="94" rx="20" fill="${C.navy}"/><text x="1350" y="225" text-anchor="middle" font-size="31" font-weight="900" fill="${C.white}">P</text><text x="1350" y="260" text-anchor="middle" font-size="24" font-weight="850" fill="${C.white}">VOIE DE SERVICE</text>`;
    const squareLabelX = Math.min(moving.squareX + 55, 1830);
    const flowPath = flow === "bp"
      ? "M300 545H760C860 545 920 600 920 675V800"
      : "M920 800V675C920 600 860 545 760 545H300";
    const flowColor = flow === "hp" ? C.red : C.blue;
    const flowOverlay = flow
      ? `<path d="${flowPath}" fill="none" stroke="${C.white}" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/>
         <path d="${flowPath}" fill="none" stroke="${flowColor}" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" ${flow === "hp" ? 'stroke-dasharray="46 24"' : ""} marker-end="url(#arrow-${flow === "hp" ? "red" : "blue"})"/>`
      : "";
    const legend = flow
      ? `<rect x="205" y="772" width="52" height="34" rx="8" fill="${fluid}" stroke="${flowColor}" stroke-width="3"/><text x="278" y="800" font-size="27" font-weight="850" fill="${C.ink}">${flow === "hp" ? "FLUIDE HP" : "FLUIDE BP"}</text>`
      : `<rect x="205" y="750" width="52" height="34" rx="8" fill="${fluid}" stroke="${C.blue}" stroke-width="3"/><text x="278" y="778" font-size="27" font-weight="850" fill="${C.ink}">RELIÉ À C</text>
         <rect x="205" y="804" width="52" height="34" rx="8" fill="${isolated}" stroke="${C.closed}" stroke-width="3"/><text x="278" y="832" font-size="27" font-weight="850" fill="${C.ink}">ISOLÉ — PAS FORCÉMENT VIDE</text>`;
    return `
      <rect x="105" y="220" width="1710" height="695" rx="42" fill="${C.white}" stroke="${C.line}" stroke-width="4" filter="url(#shadow)"/>
      <rect x="140" y="455" width="710" height="180" rx="88" fill="${C.body}" stroke="${C.ink}" stroke-width="9"/>
      <rect x="850" y="630" width="140" height="250" rx="30" fill="${C.body}" stroke="${C.ink}" stroke-width="9"/>
      <rect x="995" y="210" width="130" height="250" rx="28" fill="${C.body}" stroke="${C.ink}" stroke-width="9"/>
      <rect x="1285" y="210" width="130" height="250" rx="28" fill="${C.body}" stroke="${C.ink}" stroke-width="9"/>
      <rect x="250" y="350" width="1290" height="400" rx="115" fill="${C.body}" stroke="${C.ink}" stroke-width="9"/>
      <rect x="160" y="480" width="1330" height="130" rx="65" fill="${C.cavity}" stroke="${C.ink}" stroke-width="6"/>
      ${mainBore}
      <rect x="887" y="545" width="66" height="312" fill="${fluid}"/>
      <rect x="1027" y="240" width="66" height="305" fill="${fluid}"/>
      <rect x="1317" y="240" width="66" height="305" fill="${pFill}"/>
      <path d="M800 476L838 510H800Z" fill="${C.closed}"/><path d="M800 614L838 580H800Z" fill="${C.closed}"/>
      <path d="M1220 476L1182 510H1220Z" fill="${C.closed}"/><path d="M1220 614L1182 580H1220Z" fill="${C.closed}"/>
      ${head}
      ${flowOverlay}
      <rect x="1435" y="455" width="90" height="180" rx="23" fill="#b7c2c8" stroke="${C.ink}" stroke-width="8"/>
      <rect x="1456" y="468" width="48" height="154" rx="13" fill="${C.yellow}" stroke="${C.ink}" stroke-width="5"/>
      <rect x="${moving.squareX}" y="480" width="110" height="130" rx="16" fill="${C.orange}" stroke="${C.ink}" stroke-width="9"/>
      <text x="${squareLabelX}" y="688" text-anchor="middle" font-size="27" font-weight="850" fill="${C.ink}">CARRÉ</text>
      <text x="1480" y="416" text-anchor="middle" font-size="24" font-weight="850" fill="${C.ink}">PRESSE-ÉTOUPE FIXE</text>
      <path d="M1480 426V451" stroke="${C.ink}" stroke-width="4" marker-end="url(#arrow-ink)"/>
      <rect x="147" y="475" width="110" height="78" rx="20" fill="${C.navy}"/><text x="202" y="529" text-anchor="middle" font-size="43" font-weight="900" fill="${C.white}">T</text>
      <rect x="865" y="812" width="110" height="78" rx="20" fill="${C.navy}"/><text x="920" y="866" text-anchor="middle" font-size="43" font-weight="900" fill="${C.white}">C</text>
      <rect x="975" y="185" width="170" height="94" rx="20" fill="${C.navy}"/><text x="1060" y="225" text-anchor="middle" font-size="31" font-weight="900" fill="${C.white}">P1</text><text x="1060" y="260" text-anchor="middle" font-size="23" font-weight="800" fill="${C.white}">PRESSOSTAT</text>
      ${pLabel}
      ${legend}
      ${position === "back" ? `<circle cx="1220" cy="545" r="58" fill="none" stroke="${C.red}" stroke-width="7" stroke-dasharray="14 9"/><path d="M1268 656L1232 597" fill="none" stroke="${C.red}" stroke-width="7" marker-end="url(#arrow-red)"/><text x="1265" y="697" font-size="27" font-weight="900" fill="${C.red}">CONTACT ÉTANCHE</text><rect x="1080" y="760" width="480" height="100" rx="24" fill="#e3f5ec" stroke="${C.green}" stroke-width="6"/><text x="1320" y="801" text-anchor="middle" font-size="30" font-weight="850" fill="${C.green}">T ↔ C : OUVERT</text><text x="1320" y="840" text-anchor="middle" font-size="30" font-weight="850" fill="${C.red}">P : ISOLÉE</text>` : ""}
      ${position === "mid" && !flow ? `<rect x="1080" y="760" width="480" height="100" rx="24" fill="#edf5fd" stroke="${C.blue}" stroke-width="5"/><text x="1320" y="822" text-anchor="middle" font-size="33" font-weight="850" fill="${C.blue}">TOUT COMMUNIQUE</text>` : ""}
      ${position === "front" ? `<circle cx="800" cy="545" r="58" fill="none" stroke="${C.red}" stroke-width="7" stroke-dasharray="14 9"/><rect x="1080" y="760" width="480" height="100" rx="24" fill="#fbe7e4" stroke="${C.red}" stroke-width="6" stroke-dasharray="18 10"/><text x="1320" y="801" text-anchor="middle" font-size="30" font-weight="850" fill="${C.red}">T : ISOLÉE</text><text x="1320" y="840" text-anchor="middle" font-size="30" font-weight="850" fill="${C.blue}">C ↔ P ↔ P1</text>` : ""}`;
  }

  function positionImage(position) {
    if (position === "back") {
      return frame(4, "Fermée sur l’arrière", "Le pointeau recule et ferme uniquement la voie de service P.", valveBody("back"), "La ligne reste ouverte : T communique avec C. P1 reste reliée à C.");
    }
    if (position === "mid") {
      return frame(5, "Position intermédiaire", "Le pointeau ne touche aucun siège.", valveBody("mid"), "T, C, P et P1 communiquent. Le raccordement de service est possible sur P.");
    }
    return frame(6, "Fermée sur l’avant", "Le pointeau avance et obture la tuyauterie T.", valveBody("front"), "T est isolée. Le compresseur C reste relié à la voie de service P et à P1.");
  }

  function p1Safety() {
    const body = `
      <rect x="105" y="218" width="1710" height="700" rx="42" fill="${C.white}" stroke="${C.line}" stroke-width="4" filter="url(#shadow)"/>
      <rect x="270" y="355" width="1020" height="390" rx="90" fill="${C.body}" stroke="${C.ink}" stroke-width="9"/>
      <circle cx="800" cy="550" r="150" fill="${C.cavity}" stroke="${C.line}" stroke-width="6"/>
      <path d="M800 700V855" stroke="${C.red}" stroke-width="78"/>
      <path d="M800 550H1180V795" fill="none" stroke="${C.red}" stroke-width="72" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="729" y="816" width="142" height="76" rx="20" fill="${C.ink}"/><text x="800" y="868" text-anchor="middle" font-size="40" font-weight="900" fill="${C.white}">C</text>
      <rect x="1110" y="746" width="142" height="76" rx="20" fill="${C.red}"/><text x="1181" y="798" text-anchor="middle" font-size="40" font-weight="900" fill="${C.white}">P1</text>
      <rect x="1328" y="300" width="390" height="510" rx="34" fill="#fff0ee" stroke="${C.red}" stroke-width="6"/>
      <circle cx="1523" cy="420" r="72" fill="${C.red}"/>
      <text x="1523" y="444" text-anchor="middle" font-size="68" font-weight="900" fill="${C.white}">!</text>
      ${multiline(1523, 548, ["P1 reste reliée", "au compresseur", "dans toutes les", "positions."], { size: 38, gap: 50, anchor: "middle", fill: C.red })}
      <path d="M1180 680H1405" fill="none" stroke="${C.red}" stroke-width="7" marker-end="url(#arrow-red)"/>
      <text x="765" y="305" text-anchor="middle" font-size="38" font-weight="850" fill="${C.ink}">Le pointeau ne coupe jamais ce passage.</text>`;
    return frame(7, "Le danger de la prise P1", "Le carré ne peut jamais isoler P1 du compresseur.", body, "Installation chargée : ne jamais défaire le bouchon P1.");
  }

  function direction(kind) {
    const isBp = kind === "bp";
    const title = isBp ? "BP : le compresseur aspire" : "HP : le compresseur refoule";
    const subtitle = isBp ? "Dans la vanne BP, le fluide va de T vers C." : "Dans la vanne HP, le fluide va de C vers T.";
    const color = isBp ? C.blue : C.red;
    const body = `${valveBody("mid", { flow: kind, fluid: isBp ? "#84b7ec" : "#efaaa3" })}
      <rect x="1070" y="752" width="510" height="112" rx="25" fill="${isBp ? "#edf5fd" : "#fbe7e4"}" stroke="${color}" stroke-width="6" ${isBp ? "" : 'stroke-dasharray="18 10"'}/>
      <text x="1325" y="798" text-anchor="middle" font-size="29" font-weight="850" fill="${color}">${isBp ? "ASPIRATION · CÔTÉ BP" : "REFOULEMENT · CÔTÉ HP"}</text>
      <text x="1325" y="842" text-anchor="middle" font-size="38" font-weight="900" fill="${color}">${isBp ? "T  →  C" : "C  →  T"}</text>`;
    return frame(isBp ? 8 : 9, title, subtitle, body, isBp ? "BP : aspiration. Le fluide entre par T et rejoint le compresseur par C." : "HP : refoulement. Le fluide sort du compresseur par C et rejoint la tuyauterie T.");
  }

  function connection(photoDataUri) {
    const body = `${photoCard(photoDataUri)}
      <path d="M710 344C420 370 415 530 355 620" fill="none" stroke="${C.blue}" stroke-width="24"/>
      <rect x="100" y="604" width="430" height="210" rx="34" fill="#eaf3fb" stroke="${C.blue}" stroke-width="6" filter="url(#shadow)"/>
      <text x="315" y="664" text-anchor="middle" font-size="39" font-weight="900" fill="${C.blue}">FLEXIBLE</text>
      <text x="315" y="716" text-anchor="middle" font-size="32" font-weight="750" fill="${C.ink}">sur la voie de service P</text>
      <text x="315" y="765" text-anchor="middle" font-size="28" font-weight="650" fill="${C.muted}">bleu en BP · rouge en HP</text>
      <path d="M653 806C855 890 1100 870 1260 792" fill="none" stroke="${C.red}" stroke-width="22" stroke-dasharray="22 14"/>
      <rect x="1240" y="650" width="515" height="210" rx="34" fill="#fff0ee" stroke="${C.red}" stroke-width="6" filter="url(#shadow)"/>
      <text x="1498" y="712" text-anchor="middle" font-size="39" font-weight="900" fill="${C.red}">PRESSOSTAT</text>
      <text x="1498" y="765" text-anchor="middle" font-size="32" font-weight="750" fill="${C.ink}">sur la prise P1</text>
      <text x="1498" y="814" text-anchor="middle" font-size="28" font-weight="650" fill="${C.muted}">pas de flexible de service ici</text>`;
    return frame(10, "Chaque raccord à sa place", "Repère d’abord le carré, puis choisis le bon raccordement.", body, "P = voie de service pour le manifold. P1 = pressostat permanent.");
  }

  function generateAll(photoDataUri) {
    return [
      { name: "01-voici-la-vanne", title: "Voici la vanne", svg: recognition(photoDataUri) },
      { name: "02-deux-prises", title: "Deux prises", svg: ports(photoDataUri) },
      { name: "03-clapet-mobile", title: "Le pointeau mobile", svg: mechanism() },
      { name: "04-position-arriere", title: "Position arrière", svg: positionImage("back") },
      { name: "05-position-intermediaire", title: "Position intermédiaire", svg: positionImage("mid") },
      { name: "06-position-avant", title: "Position avant", svg: positionImage("front") },
      { name: "07-danger-p1", title: "Danger P1", svg: p1Safety() },
      { name: "08-sens-bp", title: "Sens BP", svg: direction("bp") },
      { name: "09-sens-hp", title: "Sens HP", svg: direction("hp") },
      { name: "10-raccordements", title: "Raccordements", svg: connection(photoDataUri) }
    ];
  }

  return { generateAll };
});
