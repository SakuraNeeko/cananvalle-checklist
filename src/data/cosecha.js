// ─── Columnas de calidad (tabla 1) ──────────────────────────────────────────
export const QUALITY_COLS = [
  { key: "punto_cosecha",  label: "PUNTO COSECHA"  },
  { key: "deformes",       label: "DEFORMES"        },
  { key: "descabezados",   label: "DESCABEZADOS"    },
  { key: "yemas",          label: "YEMAS"           },
  { key: "fitotoxicidad",  label: "FITOTOXICIDAD"   },
  { key: "clorosis",       label: "CLOROSIS"        },
  { key: "cuello_cisne",   label: "CUELLO DE CISNE" },
  { key: "cortos",         label: "CORTOS"          },
  { key: "delgados",       label: "DELGADOS"        },
  { key: "torcidos",       label: "TORCIDOS"        },
  { key: "sin_follaje",    label: "SIN FOLLAJE"     },
  { key: "deshidratado",   label: "DESHIDRATADO"    },
  { key: "maltrato",       label: "MALTRATO"        },
  { key: "acaros",         label: "ÁCAROS"          },
  { key: "thrips",         label: "THRIPS"          },
  { key: "oidium",         label: "OIDIUM"          },
  { key: "botrytis",       label: "BOTRYTIS"        },
  { key: "velloso",        label: "VELLOSO"         },
  { key: "tallos_malla",   label: "TALLOS/MALLA"    },
  { key: "tallos_fn_malla",label: "TALLOS FN/MALLA" },
  // pct_fn se calcula automáticamente
];

// ─── Criterios de proceso (tabla 2, cumple 1/no cumple 0) ───────────────────
export const PROCESS_CRITERIA = [
  "USO DEL COCHE",
  "TALLOS POR COCHE",
  "ENMALLADO",
  "NIVEL DE BOTONES",
  "MEZCLA DE LARGOS",
  "PALETA",
  "TALLOS POR MALLA",
];

// ─── Personal por FINCA y por ÁREA ──────────────────────────────────────────
export const COSECHA_WORKERS_BY_FINCA = {

  // ══════════════════════════════════════════════════════
  //  FINCA 1  (personal real del checklist de cosecha)
  // ══════════════════════════════════════════════════════
  "1": {
    "1": [
      "AVILA FONTE MARIA NOHEMI",
      "GONZA KILO MARIA CARMEN",
      "VELASQUEZ BARREIRO CARLOS ANGEL",
      "TRUJILLO CHICAIZA CARMEN ODILA",
      "TORRES MEDINA JULIANA",
      "CAGUA LUCAS DANIEL RAMON",
      "TOCAGON AGUILAR JOSE",
      "BARRIOS QUINONES ELIAN JESUS",
      "VELASQUEZ CAGUA ANA BEATRIZ",
      "CATUCUAGO ESPINOZA MAFER NICOLE",
      "PAUCAR CUALCHI JOCELNE GEOVANA",
      "AMAGUANA MONTANCHES EDISON",
      "LEMA CAPITO JUAN MANUEL",
      "YUMBO NARVAEZ DANILA JESICA",
      "FARINANGO QUILUMBAQUIN KAREN DAYANA",
      "ATO MERCHAN JOSE WALTER",
      "TOCAGON PEÑA JOSE MANUEL",
      "CUASCOTA PINANGO LUIS HUMBERTO",
      "CABASCANGO CUZCO LUIS ALFONSO",
      "DAGUA CHANGO ESTHER PAULA",
      "CORNEJO YEPEZ LUIS MARCELINO",
    ],
    "2": [
      "SHIGUANGO GREFA DINORA YOLANDA",
      "CABASCANGO CARMEN AMELIA",
      "CUALCHI CUASCOTA MARIA ASUNCION",
      "GAVILIMA AULES SONIA ELIZABETH",
      "SANCHEZ CUSCO GLORIA ESPERANZA",
      "TOCAGON PEÑA PEDRO",
      "QUILUMBAUIN CABASCANGO MARIA TRANSI",
      "ZAMBRANO FARIAS ANTONY RAFAEL",
      "TOCAGON TOCAGON MERCEDES",
      "MEJIA NAZARENO PEDRO STEVEN",
      "CUALCHI CABASCANGO MARTHA YOLANDA",
      "VALENCIA GARCIA CRISTIAN JAVIER",
      "LANCHIMBA ALMAGOR JOSE VICENTE",
      "TOCAGON AGUILAR JUANA",
      "RECALDE FLORES ARACELY VIVIANA",
      "ALVARADO SHIGUANGO SHEYLA RINA",
      "AZOGUE TOALONGO HECTOR GONZALO",
      "UNAUCHO YANEZ ERIKA NATALY",
      "ABAD GUAYANAY MADY AGUSTINA",
      "TAPUY ALVARADO KLINGER MAURICIO",
      "HERNANDEZ REINA MARIA DE LOS ANGELES",
    ],
    "3": [
      "CACUANGO TORRES ESTHER SOFIA",
      "BURGA QUILUMBA JOSE RODRIGO",
      "GUAJAN LIMA BRENDA PRISCILA",
      "GREFA ALVARADO TANIA",
      "PANAMA ANDRANGO ULDARICO MAURICIO",
      "TOCAGON TOCAGON BLANCA",
      "PANAMA CHAPUEL ADRIAN ISMAEL",
      "SINCHICO CASTANEDA LUIS ALCIVAR",
      "QUISI LAZO WILLIAM STALIN",
      "PANAMA ANDRANGO BYRON SEBASTIAN",
      "PULLAY PULLAY MARIA DOLORES",
      "LANCHANGO BALSECA TANIA PAOLA",
      "CHANGO SAIRA",
      "CERDA SHIGUANDO MICHAELA NOEMI",
      "MOROCHO YUMBO CESAR RONALDO",
      "CARRASCO YACELGA CARLOS OMAR",
    ],
    "3b": [
      "CACUANGO TORRES ESTHER SOFIA",
      "BURGA QUILUMBA JOSE RODRIGO",
      "GUAJAN LIMA BRENDA PRISCILA",
      "GUAJAN BURGA LUIS ALFONSO",
      "PANAMA ANDRANGO ULDARICO MAURICIO",
      "TOCAGON TOCAGON BLANCA",
      "PANAMA CHAPUEL ADRIAN ISMAEL",
      "SINCHICO CASTANEDA LUIS ALCIVAR",
      "QUISI LAZO WILLIAM STALIN",
      "PANAMA ANDRANGO BYRON SEBASTIAN",
      "PULLAY PULLAY MARIA DOLORES",
      "LANCHANGO BALSECA TANIA PAOLA",
      "CHANGO SAIRA",
      "CERDA SHIGUANDO MICHAELA NOEMI",
      "MOROCHO YUMBO CESAR RONALDO",
      "CARRASCO YACELGA CARLOS OMAR",
    ],
  },

  // ══════════════════════════════════════════════════════
  //  FINCA 2  (⚠ reemplazar con los nombres reales)
  // ══════════════════════════════════════════════════════
  "2": {
    "1": [
      "ANDRADE MORALES CARMEN LUCIA",
      "BASANTES RIOS EDGAR FABIAN",
      "CAIZALUISA TOAPANTA ROSA ELVIRA",
      "CHANATASIG HERRERA MARIO IVAN",
      "DEFAZ TIPAN MARIA ELENA",
      "ESPINOZA MORALES JUAN PABLO",
      "FARINANGO COYAGO BLANCA NELLY",
      "GUANOQUIZA UNDA PEDRO ANTONIO",
      "HERRERA CEVALLOS ANA LUCIA",
      "IMBAQUINGO MALES LUIS ENRIQUE",
      "JATIVA POZO DIANA PAOLA",
      "LEMA ANDRADE SEGUNDO BOLIVAR",
      "MOLINA RECALDE NANCY PATRICIA",
      "NARVAEZ TIPAN CARLOS ALBERTO",
      "ORTIZ CAIZAPANTA ROSA MARIA",
      "PILLAJO SIMBA JORGE RODRIGO",
      "QUISPE GUAMANI MARTHA CECILIA",
      "ROSERO ANDRADE NELSON DANILO",
      "SALAZAR MORALES SILVIA BEATRIZ",
      "TOAPANTA YUPANGUI PEDRO RAUL",
    ],
    "2": [
      "ACOSTA VITERI GLADYS MARGOTH",
      "BENAVIDES CERON EDGAR PATRICIO",
      "CERON ANDRADE MARIA FERNANDA",
      "DIAZ MOLINA WILSON RODRIGO",
      "ESTRELLA YEPEZ CONSUELO DEL ROCIO",
      "FIGUEROA CADENA HUGO GERMAN",
      "GAVILANES MORA NANCY ESPERANZA",
      "HIDALGO ZURITA MARCO VINICIO",
      "IMBAQUINGO FARINANGO JOSE MIGUEL",
      "JACOME SALAZAR ANA GRACIELA",
      "LANCHIMBA DIAS ROSA ELVIRA",
      "MIDEROS ANDRADE CARLOS OSWALDO",
      "NARANJO CEPEDA DIANA ELIZABETH",
      "OBANDO QUELAL RUTH MARISOL",
      "PASTRANO DAVILA GILBERTO RAMIRO",
      "QUIMBIAMBA RIOS MARIA TRANSITO",
      "RUEDA HERRERA SEGUNDO PATRICIO",
      "SALINAS POZO CARMEN AMPARITO",
      "TERÁN MALES JOSE RODRIGO",
      "VASQUEZ CEPEDA BLANCA PIEDAD",
    ],
    "3": [
      "ALMEIDA FARINANGO PEDRO SEGUNDO",
      "BOLAÑOS TIRIRA MARIA DOLORES",
      "CARLOSAMA INUCA LUIS ANGEL",
      "DAZA SANDOVAL JOSE NARCISO",
      "ENRIQUEZ PANTOJA GLORIA MARINA",
      "FLORES ARTEAGA VICTOR MANUEL",
      "GUALAVISI CEPEDA ROSA PIEDAD",
      "HERVAS PEREZ NELSON GEOVANY",
      "ILES POTOSI ANA BEATRIZ",
      "JIMENEZ ANDRADE MARCO TULIO",
      "LOZANO TIPAN SILVIA PATRICIA",
      "MORALES QUELAL PEDRO ARNULFO",
      "NARVAEZ ALVEAR MARIA CONCEPCION",
      "ONTANEDA VEGA CARLOS EFRAIN",
      "PEREZ MORA MARIA GERMANIA",
    ],
    "3b": [
      "ALBA CEPEDA WILLAM ELIAS",
      "BONILLA SUAREZ ROSA PILAR",
      "CADENA POZO JULIO CESAR",
      "CUASCOTA PUPIALES OLGA MARINA",
      "ENRIQUEZ YEPEZ SEGUNDO MANUEL",
      "FARINANGO CAIZA GLORIA CECILIA",
      "GRIJALVA ANDRADE MARIO PATRICIO",
      "HERRERA TULCANAZA NANCY ESPERANZA",
      "INLAGO ANDRADE BLANCA ROSA",
      "JIMENEZ RECALDE SEGUNDO EDGAR",
      "LECHON CERON MARIA ZOILA",
      "MORILLO FARINANGO HUGO DAVID",
      "NOVOA CAIZALUISA PEDRO SEGUNDO",
      "ORTEGA QUELAL CARMEN DOLORES",
      "PONCE DAVILA JOSE AURELIO",
    ],
  },

  // ══════════════════════════════════════════════════════
  //  FINCA 3  (⚠ reemplazar con los nombres reales)
  // ══════════════════════════════════════════════════════
  "3": {
    "1": [
      "AGUIRRE CEVALLOS MARIA DOLORES",
      "BARAHONA MOLINA SEGUNDO RAFAEL",
      "CUICHAN TIPAN GLORIA BEATRIZ",
      "DIMAS ROSERO JOSE ALFREDO",
      "ESPINOSA ANDRADE ROSA PIEDAD",
      "FUERTES CERON CARLOS RODRIGO",
      "GUAMAN MALES DIANA ELIZABETH",
      "HIDALGO QUELAL MARCO ANTONIO",
      "INUCA CAIZA LUIS OLMEDO",
      "JURADO FARINANGO ROSA ELVIRA",
      "LOPEZ MORILLO NANCY PATRICIA",
      "MALES IMBAQUINGO SEGUNDO PEDRO",
      "NAVARRETE PANTOJA MARIA CARMEN",
      "OBANDO POZO EDGAR HERNAN",
      "PILLAJO CERON GLADYS MARINA",
      "QUELAL ANDRADE JOSE GREGORIO",
      "ROSERO MALES BLANCA ROSA",
      "SIMBA TULCANAZA NELSON FABIAN",
      "TORO CEVALLOS ANA LUCIA",
      "VASQUEZ MORALES PEDRO OLMEDO",
    ],
    "2": [
      "ALDAZ ARTEAGA CARMEN PIEDAD",
      "BEDON CAIZA SEGUNDO HERNAN",
      "CATUCUAMBA POTOSI MARIA ELENA",
      "DIAZ IMBAQUINGO JORGE PATRICIO",
      "ENRIQUEZ SUAREZ ROSA AMELIA",
      "FALCONI FARINANGO EDGAR IVAN",
      "GUAMANI PANTOJA MARIA LUISA",
      "HERRERA MALES JOSE SEGUNDO",
      "INUCA QUELAL BLANCA LUCIA",
      "JACOME MORILLO DIANA FERNANDA",
      "LECHON ANDRADE CARLOS EFREN",
      "MORALES CEPEDA MARIA TRANSITO",
      "NOVOA CEVALLOS PEDRO RAFAEL",
      "ORTEGA POZO GLORIA ESPERANZA",
      "PUPIALES RIOS SEGUNDO BOLIVAR",
      "QUELAL FARINANGO JOSE NEPTALI",
      "RIOS CERON NANCY MARISOL",
      "SALCEDO ANDRADE MARIA FERNANDA",
      "TOAPANTA MALES EDGAR GEOVANNY",
      "VITERI INUCA ROSA PILAR",
    ],
    "3": [
      "ARTEAGA CATUCUAMBA PEDRO SEGUNDO",
      "BOLAÑOS CEVALLOS MARIA DOLORES",
      "CADENA FARINANGO CARLOS RODRIGO",
      "DEFAZ QUELAL GLORIA PATRICIA",
      "ESPINOZA IMBAQUINGO JOSE MIGUEL",
      "FLORES MORILLO BLANCA ESPERANZA",
      "GUANOQUIZA POZO SEGUNDO EDMUNDO",
      "HIDALGO MALES DIANA PAOLA",
      "INLAGO CERON MARIO PATRICIO",
      "JIMENEZ ANDRADE ROSA PIEDAD",
      "LEMOS RIOS EDGAR BOLIVAR",
      "MORALES FARINANGO CARMEN LUCIA",
      "NARANJO CATUCUAMBA JOSE AURELIO",
      "OBANDO SUAREZ NANCY CECILIA",
      "PILLAJO MALES PEDRO NEPTALI",
    ],
    "3b": [
      "ALBA IMBAQUINGO SEGUNDO RODRIGO",
      "BONILLA MORILLO ROSA PILAR",
      "CAIZALUISA CERON EDGAR FABIAN",
      "CUICHAN POZO MARIA ELENA",
      "ENRIQUEZ FARINANGO JOSE PATRICIO",
      "FALCONI ANDRADE GLORIA BEATRIZ",
      "GRIJALVA QUELAL CARLOS OLMEDO",
      "HERRERA CEVALLOS BLANCA ROSA",
      "INUCA MALES SEGUNDO HERNAN",
      "JACOME CATUCUAMBA DIANA ELIZABETH",
      "LECHON RIOS MARIO GERARDO",
      "MORILLO IMBAQUINGO NANCY PIEDAD",
      "NOVOA CERON PEDRO SEGUNDO",
      "ORTEGA FARINANGO CARMEN DOLORES",
      "PONCE MALES JOSE ALFREDO",
    ],
  },
};

export const COSECHA_AREAS = {
  "1":  "ÁREA 1",
  "2":  "ÁREA 2",
  "3":  "ÁREA 3",
  "3b": "ÁREA 3 (Cont.)",
};

const emptyQuality = () =>
  Object.fromEntries(QUALITY_COLS.map((c) => [c.key, ""]));

export const makeCosechaWorkerRow = (nombre) => ({
  nombre,
  variedad: "",
  calidad:  emptyQuality(),
  proceso: {
    criteria: Array(PROCESS_CRITERIA.length).fill(null),
    obs: "",
    firma: null,
  },
});

export const makeCosechaReport = (finca, semana, year) => {
  const workers = COSECHA_WORKERS_BY_FINCA[finca] || COSECHA_WORKERS_BY_FINCA["1"];
  return {
    tipo:   "cosecha",
    finca,
    semana: Number(semana),
    year:   Number(year),
    closed: false,
    areas: Object.fromEntries(
      Object.keys(workers).map((k) => [
        k,
        {
          supervisor: "",
          jefe: "",
          rows: workers[k].map(makeCosechaWorkerRow),
        },
      ])
    ),
  };
};

export const calcCosechaProc = (row) => {
  const cumple = row.proceso.criteria.filter((v) => v === 1).length;
  const total  = PROCESS_CRITERIA.length;
  return { cumple, total, pct: Math.round((cumple / total) * 100) };
};

export const calcPctFN = (row) => {
  const t  = Number(row.calidad.tallos_malla)    || 0;
  const fn = Number(row.calidad.tallos_fn_malla) || 0;
  if (t === 0) return 0;
  return Math.round((fn / t) * 100 * 10) / 10;
};

// Columnas que son defectos (se suman para calcular FN automáticamente)
const DEFECT_KEYS = [
  "punto_cosecha","deformes","descabezados","yemas","fitotoxicidad","clorosis",
  "cuello_cisne","cortos","delgados","torcidos","sin_follaje",
  "deshidratado","maltrato","acaros","thrips","oidium","botrytis","velloso",
];

export const calcAutoFN = (calidad) =>
  DEFECT_KEYS.reduce((sum, k) => sum + (Number(calidad[k]) || 0), 0);