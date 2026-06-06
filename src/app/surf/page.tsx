'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ── Shared ─────────────────────────────────────────────────────────────────

type SurfTab = 'surf' | 'skate' | 'breathing'

function VideoBtn({ query }: { query: string }) {
  return (
    <a
      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[10px] font-bold text-coral/80 hover:text-coral bg-coral/10 hover:bg-coral/20 px-2 py-0.5 rounded-full transition-all"
    >
      ▶ Vídeo
    </a>
  )
}

// ── Cities ────────────────────────────────────────────────────────────────

interface City {
  id: string
  name: string
  state: string
  spot: string
  lat: number
  lon: number
  beachFacing: number  // grau para onde a praia "olha" (90=leste, 180=sul, 270=oeste, 0=norte)
  windguruId?: number  // ID da estação no Windguru (quando conhecido)
}

const CITIES: City[] = [
  // ── Rio Grande do Sul ─────────────────────────────────────────────────────
  { id: 'torres',   name: 'Torres',              state: 'RS', spot: 'Prainha',          lat: -29.334,  lon: -49.726,  beachFacing: 90,  windguruId: 5974  },
  { id: 'tramand',  name: 'Tramandaí',           state: 'RS', spot: 'Tramandaí',        lat: -29.985,  lon: -50.133,  beachFacing: 90                     },
  { id: 'capao',    name: 'Capão da Canoa',      state: 'RS', spot: 'Atlântida',        lat: -29.743,  lon: -50.012,  beachFacing: 90                     },
  { id: 'cassino',  name: 'Rio Grande',          state: 'RS', spot: 'Cassino',          lat: -32.170,  lon: -52.170,  beachFacing: 90                     },
  // ── Santa Catarina ────────────────────────────────────────────────────────
  { id: 'sfranc',   name: 'São Francisco do Sul',state: 'SC', spot: 'Praia do Ervino',  lat: -26.248,  lon: -48.640,  beachFacing: 90                     },
  { id: 'penha',    name: 'Penha',               state: 'SC', spot: 'Praia Vermelha',   lat: -26.771,  lon: -48.648,  beachFacing: 90                     },
  { id: 'itapema',  name: 'Itapema',             state: 'SC', spot: 'Meia Praia',       lat: -27.089,  lon: -48.614,  beachFacing: 90                     },
  { id: 'bc',       name: 'Balneário Camboriú',  state: 'SC', spot: 'Barra Norte',      lat: -26.9965, lon: -48.635,  beachFacing: 90,  windguruId: 10376 },
  { id: 'bombinhas',name: 'Bombinhas',           state: 'SC', spot: 'Mariscal',         lat: -27.148,  lon: -48.482,  beachFacing: 90                     },
  { id: 'flori',    name: 'Florianópolis',       state: 'SC', spot: 'Joaquina',         lat: -27.6239, lon: -48.443,  beachFacing: 90,  windguruId: 64    },
  { id: 'florip2',  name: 'Florianópolis',       state: 'SC', spot: 'Campeche',         lat: -27.696,  lon: -48.487,  beachFacing: 90                     },
  { id: 'garop',    name: 'Garopaba',            state: 'SC', spot: 'Ferrugem',         lat: -28.025,  lon: -48.614,  beachFacing: 90,  windguruId: 147773},
  { id: 'imbit',    name: 'Imbituba',            state: 'SC', spot: 'Praia da Rosa',    lat: -28.127,  lon: -48.656,  beachFacing: 90                     },
  { id: 'laguna',   name: 'Laguna',              state: 'SC', spot: 'Mar Grosso',       lat: -28.489,  lon: -48.781,  beachFacing: 90                     },
  // ── Paraná ───────────────────────────────────────────────────────────────
  { id: 'matinhos', name: 'Matinhos',            state: 'PR', spot: 'Caiobá',           lat: -25.818,  lon: -48.535,  beachFacing: 135                    },
  { id: 'guaratuba',name: 'Guaratuba',           state: 'PR', spot: 'Praia Central',    lat: -25.887,  lon: -48.579,  beachFacing: 135                    },
  { id: 'pontal',   name: 'Pontal do Paraná',    state: 'PR', spot: 'Praia de Leste',   lat: -25.676,  lon: -48.498,  beachFacing: 135                    },
  // ── São Paulo ─────────────────────────────────────────────────────────────
  { id: 'camburi',  name: 'São Sebastião',       state: 'SP', spot: 'Camburi',          lat: -23.358,  lon: -44.973,  beachFacing: 135                    },
  { id: 'boicuc',   name: 'Boiçucanga',          state: 'SP', spot: 'Boiçucanga',       lat: -23.644,  lon: -45.266,  beachFacing: 180                    },
  { id: 'mare',     name: 'Maresias',            state: 'SP', spot: 'Maresias',         lat: -23.773,  lon: -45.559,  beachFacing: 180, windguruId: 5972  },
  { id: 'ubat',     name: 'Ubatuba',             state: 'SP', spot: 'Itamambuca',       lat: -23.433,  lon: -45.084,  beachFacing: 135, windguruId: 5973  },
  { id: 'cara',     name: 'Caraguatatuba',       state: 'SP', spot: 'Indaiá',           lat: -23.614,  lon: -45.411,  beachFacing: 135                    },
  { id: 'bertioga', name: 'Bertioga',            state: 'SP', spot: 'Boracéia',         lat: -23.857,  lon: -46.138,  beachFacing: 135                    },
  { id: 'guaruj',   name: 'Guarujá',             state: 'SP', spot: 'Tombo',            lat: -23.993,  lon: -46.257,  beachFacing: 135                    },
  { id: 'peruibe',  name: 'Peruíbe',             state: 'SP', spot: 'Praia de Peruíbe', lat: -24.317,  lon: -47.002,  beachFacing: 180                    },
  // ── Rio de Janeiro ────────────────────────────────────────────────────────
  { id: 'angra',    name: 'Paraty',              state: 'RJ', spot: 'Trindade',         lat: -23.370,  lon: -44.714,  beachFacing: 135                    },
  { id: 'prainha',  name: 'Rio de Janeiro',      state: 'RJ', spot: 'Prainha',          lat: -23.058,  lon: -43.596,  beachFacing: 180, windguruId: 66    },
  { id: 'recreio',  name: 'Rio de Janeiro',      state: 'RJ', spot: 'Macumba / Recreio',lat: -23.020,  lon: -43.494,  beachFacing: 180                    },
  { id: 'marica',   name: 'Maricá',              state: 'RJ', spot: 'Ponta Negra',      lat: -22.924,  lon: -42.833,  beachFacing: 135                    },
  { id: 'saqu',     name: 'Saquarema',           state: 'RJ', spot: 'Itaúna',           lat: -22.919,  lon: -42.509,  beachFacing: 135, windguruId: 66    },
  { id: 'arraial',  name: 'Arraial do Cabo',     state: 'RJ', spot: 'Praia do Forno',   lat: -22.969,  lon: -42.027,  beachFacing: 135                    },
  { id: 'cabo',     name: 'Cabo Frio',           state: 'RJ', spot: 'Praia do Pero',    lat: -22.769,  lon: -41.866,  beachFacing: 135                    },
  { id: 'buzios',   name: 'Búzios',              state: 'RJ', spot: 'Geriba',           lat: -22.744,  lon: -41.881,  beachFacing: 180                    },
  // ── Espírito Santo ────────────────────────────────────────────────────────
  { id: 'itaunas',  name: 'Conceição da Barra',  state: 'ES', spot: 'Itaúnas',          lat: -18.417,  lon: -39.737,  beachFacing: 90                     },
  { id: 'marataiz', name: 'Marataízes',          state: 'ES', spot: 'Marataízes',       lat: -21.047,  lon: -40.828,  beachFacing: 90                     },
  { id: 'guarapari',name: 'Guarapari',           state: 'ES', spot: 'Meaípe',           lat: -20.639,  lon: -40.489,  beachFacing: 90                     },
  // ── Bahia ─────────────────────────────────────────────────────────────────
  { id: 'itacare',  name: 'Itacaré',             state: 'BA', spot: 'Jeribucaçu',       lat: -14.279,  lon: -38.996,  beachFacing: 90,  windguruId: 147760},
  { id: 'salv',     name: 'Salvador',            state: 'BA', spot: 'Stella Maris',     lat: -12.893,  lon: -38.316,  beachFacing: 90                     },
  { id: 'conde',    name: 'Conde',               state: 'BA', spot: 'Sítio do Conde',   lat: -11.814,  lon: -37.673,  beachFacing: 90                     },
  { id: 'porto',    name: 'Porto Seguro',         state: 'BA', spot: 'Coroa Vermelha',   lat: -16.445,  lon: -39.066,  beachFacing: 90                     },
  { id: 'caraiva',  name: 'Porto Seguro',         state: 'BA', spot: 'Caraíva',          lat: -16.880,  lon: -39.164,  beachFacing: 90                     },
  { id: 'trancoso', name: 'Porto Seguro',         state: 'BA', spot: 'Trancoso',         lat: -16.596,  lon: -39.097,  beachFacing: 90                     },
  // ── Sergipe ───────────────────────────────────────────────────────────────
  { id: 'aracaju',  name: 'Aracaju',             state: 'SE', spot: 'Praia de Atalaia',  lat: -11.005,  lon: -37.022,  beachFacing: 90                     },
  // ── Alagoas ───────────────────────────────────────────────────────────────
  { id: 'maceio',   name: 'Maceió',              state: 'AL', spot: 'Pajuçara',          lat: -9.666,   lon: -35.716,  beachFacing: 90                     },
  { id: 'sjmilag',  name: 'São Miguel dos Milagres',state:'AL',spot: 'Tatuamunha',       lat: -9.281,   lon: -35.459,  beachFacing: 90                     },
  { id: 'mara',     name: 'Maragogi',            state: 'AL', spot: 'Maragogi',          lat: -9.009,   lon: -35.218,  beachFacing: 90                     },
  // ── Pernambuco ────────────────────────────────────────────────────────────
  { id: 'maracaipe',name: 'Ipojuca',             state: 'PE', spot: 'Maracaípe',         lat: -8.760,   lon: -35.056,  beachFacing: 90                     },
  { id: 'pgar',     name: 'Porto de Galinhas',   state: 'PE', spot: 'Muro Alto',         lat: -8.705,   lon: -35.015,  beachFacing: 90,  windguruId: 64596 },
  { id: 'tamandar', name: 'Tamandaré',           state: 'PE', spot: 'Carneiros',         lat: -8.748,   lon: -35.113,  beachFacing: 90                     },
  { id: 'noron',    name: 'Fernando de Noronha', state: 'PE', spot: 'Cacimba do Padre',  lat: -3.854,   lon: -32.425,  beachFacing: 270, windguruId: 147802},
  // ── Paraíba ───────────────────────────────────────────────────────────────
  { id: 'jacuma',   name: 'Conde',               state: 'PB', spot: 'Jacumã',            lat: -7.266,   lon: -34.808,  beachFacing: 90                     },
  { id: 'joaopessoa',name:'João Pessoa',         state: 'PB', spot: 'Tambaú',            lat: -7.125,   lon: -34.824,  beachFacing: 90                     },
  { id: 'arau',     name: 'Araruna',             state: 'PB', spot: 'Coqueirinho',       lat: -6.836,   lon: -34.835,  beachFacing: 90                     },
  // ── Rio Grande do Norte ───────────────────────────────────────────────────
  { id: 'pipa',     name: 'Tibau do Sul',        state: 'RN', spot: 'Praia da Pipa',     lat: -6.227,   lon: -35.129,  beachFacing: 135, windguruId: 64596 },
  { id: 'natal',    name: 'Natal',               state: 'RN', spot: 'Ponta Negra',       lat: -5.873,   lon: -35.179,  beachFacing: 90                     },
  { id: 'sgostoso', name: 'São Miguel do Gostoso',state:'RN',  spot: 'São Miguel do Gostoso',lat:-5.124,lon:-35.632,   beachFacing: 45                     },
  // ── Ceará ────────────────────────────────────────────────────────────────
  { id: 'cumbuco',  name: 'Caucaia',             state: 'CE', spot: 'Cumbuco',           lat: -3.638,   lon: -38.764,  beachFacing: 315, windguruId: 64545 },
  { id: 'paracuru', name: 'Paracuru',            state: 'CE', spot: 'Paracuru',          lat: -3.411,   lon: -39.038,  beachFacing: 315                    },
  { id: 'lagoinha', name: 'Paraipaba',           state: 'CE', spot: 'Lagoinha',          lat: -3.083,   lon: -39.454,  beachFacing: 315                    },
  { id: 'flecheiras',name:'Trairi',              state: 'CE', spot: 'Flecheiras',        lat: -3.100,   lon: -39.350,  beachFacing: 315                    },
  { id: 'taiba',    name: 'São Gonçalo do Amarante',state:'CE',spot:'Taíba',             lat: -3.513,   lon: -38.908,  beachFacing: 315                    },
  { id: 'jeri',     name: 'Jericoacoara',        state: 'CE', spot: 'Jericoacoara',      lat: -2.796,   lon: -40.513,  beachFacing: 315, windguruId: 10375 },
  { id: 'canoa',    name: 'Aracati',             state: 'CE', spot: 'Canoa Quebrada',    lat: -4.352,   lon: -37.716,  beachFacing: 45                     },
  // ── Piauí ────────────────────────────────────────────────────────────────
  { id: 'bgrande',  name: 'Cajueiro da Praia',   state: 'PI', spot: 'Barra Grande',      lat: -2.824,   lon: -41.638,  beachFacing: 0                      },
  { id: 'luiscorr', name: 'Luís Correia',        state: 'PI', spot: 'Atalaia',           lat: -2.878,   lon: -41.664,  beachFacing: 0                      },
  // ── Maranhão ─────────────────────────────────────────────────────────────
  { id: 'saoaluis', name: 'São Luís',            state: 'MA', spot: 'Calhau',            lat: -2.479,   lon: -44.260,  beachFacing: 0                      },
  // ── Pará ─────────────────────────────────────────────────────────────────
  { id: 'salinop',  name: 'Salinópolis',         state: 'PA', spot: 'Atalaia',           lat: -0.614,   lon: -47.352,  beachFacing: 0                      },
  // ── Internacional ────────────────────────────────────────────────────────
  { id: 'hoss',     name: 'Hossegor',            state: 'França',        spot: 'La Gravière',     lat: 43.664,  lon: -1.440,   beachFacing: 270, windguruId: 558   },
  { id: 'pipe',     name: 'Pipeline',            state: 'Havaí',         spot: 'Banzai Pipeline', lat: 21.664,  lon: -158.053, beachFacing: 0,   windguruId: 1399  },
  { id: 'jbay',     name: "Jeffrey's Bay",       state: 'África do Sul', spot: 'Supertubes',      lat: -34.049, lon: 24.929,   beachFacing: 270, windguruId: 3327  },
  { id: 'uluw',     name: 'Uluwatu',             state: 'Bali',          spot: 'Uluwatu',         lat: -8.819,  lon: 115.084,  beachFacing: 225, windguruId: 4190  },
  { id: 'tahi',     name: "Teahupo'o",           state: 'Taiti',         spot: "Teahupo'o",       lat: -17.856, lon: -149.261, beachFacing: 270                    },
]

// ── Live conditions hook ───────────────────────────────────────────────────

interface Conditions {
  waveHeight: number
  wavePeriod: number
  waveDir: number
  swellHeight: number
  swellPeriod: number
  windSpeed: number
  windDir: number
  windGusts: number
  temp: number
  updatedAt: Date
}

function degToCompass(deg: number): string {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
  return dirs[Math.round(deg / 22.5) % 16]
}

function mToFt(m: number): string {
  const ft = m * 3.281
  if (ft < 1) return `${(ft * 12).toFixed(0)} pol`
  return `${ft.toFixed(1)} ft`
}

// Offshore quando vento vem da direção oposta à praia (beachFacing + 180°)
function windType(windDir: number, beachFacing: number): { label: string; color: string } {
  const offshoreSource = (beachFacing + 180) % 360
  const diff = Math.abs(((windDir - offshoreSource) + 180) % 360 - 180)
  if (diff < 60)  return { label: 'Offshore', color: '#22D68A' }
  if (diff < 100) return { label: 'Side-off', color: '#F5C518' }
  if (diff < 130) return { label: 'Side-on',  color: '#F5C518' }
  return               { label: 'Onshore',  color: '#FF6B6B' }
}

function surfRating(c: Conditions, beachFacing: number): number {
  let score = 5

  // Altura do swell (principal fator)
  if      (c.swellHeight >= 0.6 && c.swellHeight <= 2.0) score += 2
  else if (c.swellHeight >= 0.3 && c.swellHeight <  0.6) score += 0
  else if (c.swellHeight >  2.0 && c.swellHeight <= 3.5) score += 1
  else if (c.swellHeight >  3.5)                         score -= 1  // muito pesado
  else                                                    score -= 2  // flat

  // Período — o mais importante para qualidade da onda
  if      (c.swellPeriod >= 16) score += 3  // groundswell perfeito
  else if (c.swellPeriod >= 13) score += 2  // excelente
  else if (c.swellPeriod >= 10) score += 1  // bom
  else if (c.swellPeriod >=  8) score += 0  // aceitável
  else if (c.swellPeriod >=  6) score -= 2  // wind chop, ruim
  else                          score -= 4  // < 6s = bagunçado, sem qualidade

  // Vento
  const wt = windType(c.windDir, beachFacing)
  if      (wt.label === 'Offshore') score += 2
  else if (wt.label === 'Side-off') score += 1
  else if (wt.label === 'Side-on')  score -= 1
  else                              score -= 2  // onshore destroça a onda

  // Intensidade do vento
  if      (c.windSpeed > 28) score -= 2
  else if (c.windSpeed > 20) score -= 1
  else if (c.windSpeed <  8) score += 1  // vento fraco = superfície lisa

  return Math.max(1, Math.min(10, Math.round(score)))
}

function useConditions(city: City) {
  const [data, setData] = useState<Conditions | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const [weatherRes, marineRes] = await Promise.all([
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}` +
          `&current=wind_speed_10m,wind_direction_10m,wind_gusts_10m,temperature_2m` +
          `&wind_speed_unit=kn&timezone=America%2FSao_Paulo`
        ),
        fetch(
          `https://marine-api.open-meteo.com/v1/marine?latitude=${city.lat}&longitude=${city.lon}` +
          `&current=wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_direction,swell_wave_period`
        ),
      ])
      if (!weatherRes.ok || !marineRes.ok) throw new Error('fetch failed')
      const w = await weatherRes.json()
      const m = await marineRes.json()
      setData({
        waveHeight:  m.current.wave_height,
        wavePeriod:  m.current.wave_period,
        waveDir:     m.current.wave_direction,
        swellHeight: m.current.swell_wave_height,
        swellPeriod: m.current.swell_wave_period,
        windSpeed:   w.current.wind_speed_10m,
        windDir:     w.current.wind_direction_10m,
        windGusts:   w.current.wind_gusts_10m,
        temp:        w.current.temperature_2m,
        updatedAt:   new Date(),
      })
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [city.lat, city.lon])

  useEffect(() => {
    fetch_()
    const id = setInterval(fetch_, 10 * 60 * 1000)
    return () => clearInterval(id)
  }, [fetch_])

  return { data, loading, error, refresh: fetch_ }
}

// ── SURF TAB ───────────────────────────────────────────────────────────────

const MANEUVERS = [
  { icon: '🌊', name: 'Rasgada', status: 'mastered', yt: 'como fazer rasgada surf' },
  { icon: '⚡', name: 'Batida / Snap', status: 'target', yt: 'como fazer snap surf' },
  { icon: '🔄', name: 'Cutback', status: 'progress', yt: 'como fazer cutback surf' },
  { icon: '🚀', name: 'Floater', status: 'progress', yt: 'como fazer floater surf' },
  { icon: '✈️', name: 'Aéreo', status: 'future', yt: 'como fazer aéreo surf' },
  { icon: '🌀', name: 'Tubo', status: 'future', yt: 'como fazer tubo surf' },
]

const M_STYLE: Record<string, string> = {
  mastered: 'bg-green/8 border-green/30',
  target: 'bg-cyan/8 border-cyan/30',
  progress: 'bg-card border-white/[0.07]',
  future: 'bg-card border-white/[0.07] opacity-50',
}
const M_STATUS: Record<string, string> = {
  mastered: 'text-green', target: 'text-cyan', progress: 'text-t3', future: 'text-t3',
}
const M_LABEL: Record<string, string> = {
  mastered: '✓ Dominada', target: '🎯 Meta atual', progress: 'Em progresso', future: 'Futura meta',
}

function ConditionsSkeleton() {
  return (
    <div className="mx-5 rounded-2xl p-4 animate-pulse" style={{
      background: 'rgba(17,24,39,0.8)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="h-4 w-36 bg-white/[0.08] rounded-lg mb-1.5" />
          <div className="h-2.5 w-24 bg-white/[0.05] rounded-lg" />
        </div>
        <div className="h-3 w-16 bg-white/[0.05] rounded-lg" />
      </div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {[0,1,2,3].map(i => (
          <div key={i} className="text-center">
            <div className="h-4 w-full bg-white/[0.07] rounded mb-1 mx-auto" />
            <div className="h-2 w-10 bg-white/[0.04] rounded mx-auto" />
          </div>
        ))}
      </div>
      <div className="h-1.5 w-full bg-white/[0.05] rounded-full" />
    </div>
  )
}

function SurfSection() {
  // ── city selection persisted in localStorage ──
  const [cityId, setCityId] = useState<string>('bc')
  const [showPicker, setShowPicker] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('waveform-surf-city')
    if (saved && CITIES.find(c => c.id === saved)) setCityId(saved)
  }, [])

  const selectCity = (id: string) => {
    setCityId(id)
    localStorage.setItem('waveform-surf-city', id)
    setShowPicker(false)
  }

  const city = CITIES.find(c => c.id === cityId) ?? CITIES[0]
  const { data: cond, loading, error, refresh } = useConditions(city)

  const wt         = cond ? windType(cond.windDir, city.beachFacing) : null
  const score      = cond ? surfRating(cond, city.beachFacing) : 0
  const scoreColor = score >= 7 ? '#22D68A' : score >= 5 ? '#F5C518' : '#FF6B6B'
  const scoreLabel = score >= 8 ? 'Ótima' : score >= 6 ? 'Boa' : score >= 4 ? 'Razoável' : 'Fraca'

  return (
    <div className="flex flex-col gap-4">

      {/* ── City picker modal ── */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-bg rounded-t-3xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', maxHeight: '75vh' }}>
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Title */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
              <h3 className="font-syne font-bold text-t1 text-base">Escolha o spot</h3>
              <button onClick={() => setShowPicker(false)} className="text-t3 hover:text-t1 text-lg px-1">✕</button>
            </div>

            {/* List with region groups */}
            <div className="overflow-y-auto scrollbar-thin pb-8" style={{ maxHeight: 'calc(75vh - 80px)' }}>
              {[
                { label: '🌊 RS',              ids: ['torres','tramand','capao','cassino'] },
                { label: '🌊 SC',              ids: ['sfranc','penha','itapema','bc','bombinhas','flori','florip2','garop','imbit','laguna'] },
                { label: '🌊 PR',              ids: ['matinhos','guaratuba','pontal'] },
                { label: '🌊 SP',              ids: ['camburi','boicuc','mare','ubat','cara','bertioga','guaruj','peruibe'] },
                { label: '🌊 RJ',              ids: ['angra','prainha','recreio','marica','saqu','arraial','cabo','buzios'] },
                { label: '🌊 ES',              ids: ['itaunas','marataiz','guarapari'] },
                { label: '🌊 BA',              ids: ['itacare','salv','conde','porto','caraiva','trancoso'] },
                { label: '🌊 SE / AL',         ids: ['aracaju','maceio','sjmilag','mara'] },
                { label: '🌊 PE',              ids: ['maracaipe','pgar','tamandar','noron'] },
                { label: '🌊 PB / RN',         ids: ['jacuma','joaopessoa','arau','pipa','natal','sgostoso'] },
                { label: '🌊 CE / PI / MA',    ids: ['cumbuco','paracuru','lagoinha','flecheiras','taiba','jeri','canoa','bgrande','luiscorr','saoaluis'] },
                { label: '🌊 PA',              ids: ['salinop'] },
                { label: '🌍 Internacional',   ids: ['hoss','pipe','jbay','uluw','tahi'] },
              ].map(group => (
                <div key={group.label}>
                  <div className="px-5 py-2 sticky top-0" style={{ background: 'rgba(8,11,20,0.95)', backdropFilter: 'blur(12px)' }}>
                    <p className="text-[10px] font-bold text-t3 uppercase tracking-widest">{group.label}</p>
                  </div>
                  {CITIES.filter(ct => group.ids.includes(ct.id)).map((ct) => {
                    const active = ct.id === cityId
                    return (
                      <button
                        key={ct.id}
                        onClick={() => selectCity(ct.id)}
                        className="w-full flex items-center gap-3 px-5 py-3 transition-all text-left"
                        style={{
                          background: active ? 'rgba(6,214,232,0.08)' : 'transparent',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                        }}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                          style={{
                            background: active
                              ? 'linear-gradient(135deg, rgba(6,214,232,0.2), rgba(6,214,232,0.08))'
                              : 'rgba(255,255,255,0.04)',
                            border: active ? '1px solid rgba(6,214,232,0.3)' : '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          🌊
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-syne font-bold text-sm truncate" style={{ color: active ? '#06D6E8' : '#EDF1FA' }}>
                            {ct.name}
                          </p>
                          <p className="text-xs text-t3 mt-0.5">{ct.spot} · {ct.state}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {ct.windguruId && (
                            <span className="text-[9px] text-t3 font-mono">WG</span>
                          )}
                          {active && <span className="text-cyan font-bold text-sm">✓</span>}
                        </div>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Conditions card ── */}
      {loading && <ConditionsSkeleton />}

      {error && !loading && (
        <div className="mx-5 rounded-2xl p-4 text-center" style={{
          background: 'rgba(255,107,107,0.06)',
          border: '1px solid rgba(255,107,107,0.2)',
        }}>
          <p className="text-coral text-sm font-semibold mb-1">Sem conexão com os dados</p>
          <p className="text-t3 text-xs mb-3">Verifique sua internet e tente novamente.</p>
          <button onClick={refresh} className="text-xs text-cyan font-bold px-4 py-1.5 rounded-full" style={{ background: 'rgba(6,214,232,0.1)', border: '1px solid rgba(6,214,232,0.2)' }}>
            ↺ Tentar novamente
          </button>
        </div>
      )}

      {!loading && (
        <div className="mx-5 rounded-2xl p-4" style={{
          background: wt ? `linear-gradient(135deg, ${wt.color}12, rgba(6,214,232,0.05))` : 'rgba(17,24,39,0.8)',
          border: wt ? `1px solid ${wt.color}28` : '1px solid rgba(255,255,255,0.07)',
          boxShadow: wt ? `0 4px 24px ${wt.color}10, inset 0 1px 0 ${wt.color}14` : 'none',
        }}>
          {/* Header with city switcher */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <button
                onClick={() => setShowPicker(true)}
                className="flex items-center gap-2 group mb-0.5"
              >
                <h2 className="font-syne font-bold text-t1 text-base leading-tight truncate">
                  🌊 {city.spot}
                </h2>
                <span
                  className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full transition-all"
                  style={{
                    color: '#06D6E8',
                    background: 'rgba(6,214,232,0.12)',
                    border: '1px solid rgba(6,214,232,0.2)',
                  }}
                >
                  {city.name} ↕
                </span>
              </button>
              <p className="text-[10px] text-t3 uppercase tracking-widest">{city.spot} · {city.state}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
              {cond && wt ? (
                <>
                  <button onClick={refresh} className="flex items-center gap-1 text-[10px] font-bold" style={{ color: wt.color }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: wt.color }} />
                    AO VIVO
                  </button>
                  <p className="text-[10px] text-t3">
                    {cond.updatedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </>
              ) : (
                <button onClick={refresh} className="text-[10px] text-t3">↺ recarregar</button>
              )}
            </div>
          </div>

          {cond && wt && (
            <>
              {/* Main metrics */}
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {/* Swell — mostra altura + direção */}
                <div className="text-center rounded-xl py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p className="font-mono font-bold text-xs leading-tight" style={{ color: wt.color, textShadow: `0 0 8px ${wt.color}60` }}>
                    {mToFt(cond.swellHeight)}
                  </p>
                  <p className="text-[9px] text-t3 uppercase tracking-widest mt-0.5">Swell</p>
                  <p className="text-[9px] font-mono font-bold mt-0.5" style={{ color: wt.color }}>
                    {degToCompass(cond.waveDir)}
                  </p>
                </div>
                {/* Vento */}
                <div className="text-center rounded-xl py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p className="font-mono font-bold text-xs leading-tight" style={{ color: wt.color, textShadow: `0 0 8px ${wt.color}60` }}>
                    {wt.label}
                  </p>
                  <p className="text-[9px] text-t3 uppercase tracking-widest mt-0.5">Vento</p>
                  <p className="text-[9px] font-mono font-bold mt-0.5" style={{ color: wt.color }}>
                    {degToCompass(cond.windDir)}
                  </p>
                </div>
                {/* Período */}
                <div className="text-center rounded-xl py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p className="font-mono font-bold text-xs leading-tight" style={{ color: '#06D6E8', textShadow: '0 0 8px rgba(6,214,232,0.6)' }}>
                    {cond.swellPeriod.toFixed(0)}s
                  </p>
                  <p className="text-[9px] text-t3 uppercase tracking-widest mt-0.5">Período</p>
                  <p className="text-[9px] mt-0.5" style={{
                    color: cond.swellPeriod >= 13 ? '#22D68A' : cond.swellPeriod >= 8 ? '#F5C518' : '#FF6B6B',
                  }}>
                    {cond.swellPeriod >= 13 ? 'ótimo' : cond.swellPeriod >= 8 ? 'ok' : 'fraco'}
                  </p>
                </div>
                {/* Condição */}
                <div className="text-center rounded-xl py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p className="font-mono font-bold text-xs leading-tight" style={{ color: scoreColor, textShadow: `0 0 8px ${scoreColor}60` }}>
                    {scoreLabel}
                  </p>
                  <p className="text-[9px] text-t3 uppercase tracking-widest mt-0.5">Condição</p>
                  <p className="text-[9px] font-mono font-bold mt-0.5" style={{ color: scoreColor }}>
                    {score}/10
                  </p>
                </div>
              </div>

              {/* Secondary metrics */}
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                {[
                  { v: `${cond.windSpeed.toFixed(0)} kn`, l: 'Velocidade' },
                  { v: degToCompass(cond.windDir),         l: 'Dir. vento' },
                  { v: degToCompass(cond.waveDir),         l: 'Dir. ondas' },
                ].map(({ v, l }) => (
                  <div key={l} className="text-center rounded-xl py-1.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="font-mono font-bold text-cyan text-xs">{v}</p>
                    <p className="text-[9px] text-t3 uppercase tracking-widest mt-0.5">{l}</p>
                  </div>
                ))}
              </div>

              {/* Rajadas + temp */}
              <div className="flex items-center gap-3 mb-3 text-xs text-t3">
                <span>💨 Rajadas: <span className="text-t2 font-mono font-bold">{cond.windGusts.toFixed(0)} kn</span></span>
                <span>🌡️ <span className="text-t2 font-mono font-bold">{cond.temp.toFixed(0)}°C</span></span>
              </div>

              {/* Rating bar */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] text-t3 uppercase tracking-widest flex-shrink-0">Rating</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{
                    width: `${score * 10}%`,
                    background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}aa)`,
                    boxShadow: `0 0 8px ${scoreColor}80`,
                  }} />
                </div>
                <span className="font-mono font-bold text-xs flex-shrink-0" style={{ color: scoreColor }}>
                  {score}/10
                </span>
              </div>
            </>
          )}

          {/* Windguru link — dinâmico por cidade */}
          <a
            href={
              city.windguruId
                ? `https://www.windguru.cz/${city.windguruId}`
                : `https://www.windguru.cz/map/#${city.lat},${city.lon},12`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full transition-all"
            style={{ color: 'rgba(6,214,232,0.9)', background: 'rgba(6,214,232,0.1)', border: '1px solid rgba(6,214,232,0.2)' }}
          >
            🌐 Previsão completa — Windguru{city.windguruId ? '' : ' (mapa)'}
          </a>
        </div>
      )}

      <div className="px-5">
        <button className="w-full py-3.5 rounded-2xl font-syne font-bold text-sm text-bg transition-all active:scale-[0.98]" style={{
          background: 'linear-gradient(135deg, #06D6E8, #00AACC)',
          boxShadow: '0 4px 16px rgba(6,214,232,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
        }}>
          📍 Registrar sessão de surf
        </button>
      </div>

      {/* Maneuvers */}
      <div className="px-5">
        <h2 className="font-syne font-bold text-t1 text-sm mb-3">Manobras</h2>
        <div className="grid grid-cols-2 gap-2">
          {MANEUVERS.map((m) => (
            <div key={m.name} className={`border rounded-2xl p-3 ${M_STYLE[m.status]}`}>
              <div className="flex items-start justify-between mb-1">
                <span className="text-2xl">{m.icon}</span>
                <VideoBtn query={m.yt} />
              </div>
              <p className="text-sm font-semibold text-t1 mb-0.5">{m.name}</p>
              <p className={`text-xs ${M_STATUS[m.status]}`}>{M_LABEL[m.status]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 grid grid-cols-3 gap-2">
        {[['12','Sessões','#06D6E8'],['18h','No mar','#06D6E8'],['7.2','Média /10','#06D6E8']].map(([v,l,c]) => (
          <div key={l} className="bg-card border border-white/[0.07] rounded-2xl p-3 text-center">
            <p className="font-mono font-bold text-xl" style={{ color: c }}>{v}</p>
            <p className="text-[10px] text-t3 uppercase tracking-widest mt-1">{l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SKATE TAB ─────────────────────────────────────────────────────────────

const SKATE_EXERCISES = [
  {
    icon: '🏄', name: 'Compressão baixa em linha reta',
    how: 'Dobre os joelhos até ~90°, peso centralizado sobre o shape, olhos no horizonte. Mantenha por 60s sem perder equilíbrio.',
    detail: '3 × 60s', yt: 'surfskate compressão exercício',
  },
  {
    icon: '⚡', name: 'Pump básico — ativação do truck',
    how: 'Pressione o pé dianteiro para baixo enquanto inclina o corpo para frente. Sinta o truck front girar. Repita o movimento ritmicamente para ganhar velocidade.',
    detail: '4 × 10 pumps', yt: 'como fazer pump surfskate iniciante',
  },
  {
    icon: '↔️', name: 'Transferência heel → toe',
    how: 'Inicie com peso no heel (calcanhar). Transfira suavemente para o toe (ponta do pé) fazendo a prancha inclinar de rail. Controle a velocidade da transferência.',
    detail: '4 × 30s', yt: 'surfskate mudança de rail heel toe',
  },
  {
    icon: '🌊', name: 'Curva frontside aberta',
    how: 'Ombro dianteiro lidera a curva. Olhe para onde vai virar. Joelhos dobrados na compressão, estenda na saída da curva. Simula o bottom turn no surf.',
    detail: '4 × 10 curvas', yt: 'surfskate curva frontside como fazer',
  },
  {
    icon: '🔄', name: 'Curva backside aberta',
    how: 'Mesma mecânica do frontside, mas virado para o outro lado. Ombro traseiro puxa a curva. Visão sempre para onde vai. Simula o cutback.',
    detail: '4 × 10 curvas', yt: 'surfskate curva backside como fazer',
  },
]

const TRANSFERS = [
  { sk: 'Compressão no bottom turn', surf: 'Projeção para o lip', yt: 'bottom turn surf como executar' },
  { sk: 'Pump = geração de velocidade', surf: 'Pumping entre seções', yt: 'pumping surf velocidade' },
  { sk: 'Snap de quadril no cutback', surf: 'Batida no topo da onda', yt: 'cutback surf snap hip' },
]

function SkateSection() {
  const [done, setDone] = useState<Set<number>>(new Set())
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-4">
      {/* Level */}
      <div className="mx-5 bg-gradient-to-br from-gold/12 to-gold/4 border border-gold/25 rounded-2xl p-4">
        <div className="inline-flex items-center gap-1.5 bg-gold/15 rounded-full px-3 py-1 text-xs font-bold text-gold uppercase tracking-widest mb-3">
          🛹 Iniciante
        </div>
        <h2 className="font-syne font-extrabold text-t1 text-lg mb-1">Semana 3 — Fundamentos</h2>
        <p className="text-t2 text-xs mb-3">Compressão, extensão e geração de velocidade.</p>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-t2">Progresso</span>
          <span className="font-mono text-xs text-gold">25%</span>
        </div>
        <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: '25%', background: '#F5C518' }} />
        </div>
      </div>

      {/* Como funciona */}
      <div className="mx-5 bg-card2 border border-white/[0.07] rounded-2xl px-4 py-3">
        <p className="text-xs font-bold text-t3 uppercase tracking-widest mb-2">Como executar a sessão</p>
        <ol className="flex flex-col gap-1.5">
          {['Aqueça 5min andando normal no skate','Execute cada exercício na ordem abaixo','Leia as instruções antes de começar (toque ▼)','Marque ✓ quando concluir cada exercício'].map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-t2">
              <span className="font-mono text-cyan font-bold">{i+1}.</span>{s}
            </li>
          ))}
        </ol>
        <div className="mt-3">
          <VideoBtn query="surfskate treino completo iniciante tutorial" />
        </div>
      </div>

      {/* Exercises */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-syne font-bold text-t1 text-sm">Sessão de Hoje · 25 min</h2>
          <span className="text-xs text-t2">{done.size}/{SKATE_EXERCISES.length} feitos</span>
        </div>
        <div className="flex flex-col gap-2">
          {SKATE_EXERCISES.map((ex, i) => (
            <div key={i} className={`bg-card border rounded-2xl overflow-hidden transition-all ${done.has(i) ? 'border-green/30 bg-green/5' : 'border-white/[0.07]'}`}>
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-xl w-8 text-center">{ex.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-t1">{ex.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-t2">{ex.detail}</span>
                    <VideoBtn query={ex.yt} />
                  </div>
                </div>
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="text-t3 text-xs px-2"
                >
                  {expanded === i ? '▲' : '▼'}
                </button>
                <button
                  onClick={() => setDone((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n })}
                  className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all ${done.has(i) ? 'bg-green border-green text-bg' : 'border-white/[0.07] text-transparent'}`}
                >
                  ✓
                </button>
              </div>
              {expanded === i && (
                <div className="px-4 pb-3 pt-0">
                  <div className="bg-card2 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-t3 uppercase tracking-widest mb-1">Como executar</p>
                    <p className="text-xs text-t2 leading-relaxed">{ex.how}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {done.size === SKATE_EXERCISES.length && (
          <div className="mt-3 bg-green/10 border border-green/30 rounded-2xl px-4 py-3 text-center">
            <p className="text-green font-bold text-sm">🎉 Sessão completa!</p>
          </div>
        )}
      </div>

      {/* Transfers */}
      <div className="mx-5 bg-card border border-white/[0.07] rounded-2xl p-4">
        <h2 className="text-xs font-bold text-t2 uppercase tracking-widest mb-3">Transferência → Mar 🌊</h2>
        <div className="flex flex-col gap-3">
          {TRANSFERS.map((t, i) => (
            <div key={i} className="pb-3 border-b border-white/[0.04] last:border-0 last:pb-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gold">{t.sk}</p>
                  <p className="text-xs text-t3 my-0.5">→ no mar:</p>
                  <p className="text-sm text-cyan">{t.surf}</p>
                </div>
                <VideoBtn query={t.yt} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 grid grid-cols-3 gap-2">
        {[['2','Esta sem.'],['8','Total'],['160min','Acum.']].map(([v,l]) => (
          <div key={l} className="bg-card border border-white/[0.07] rounded-2xl p-3 text-center">
            <p className="font-mono font-bold text-xl text-gold">{v}</p>
            <p className="text-[10px] text-t3 uppercase tracking-widest mt-1">{l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── BREATHING TAB ─────────────────────────────────────────────────────────

type BreathTech = 'apnea' | 'box' | 'co2' | 'o2'
type Phase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out' | 'idle'

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

interface BreathRecord { id: string; date: string; seconds: number }

function useLS<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init)
  useEffect(() => { try { const s = localStorage.getItem(key); if (s) setV(JSON.parse(s)) } catch {} }, [key])
  const save = useCallback((val: T) => { setV(val); localStorage.setItem(key, JSON.stringify(val)) }, [key])
  return [v, save] as const
}

const PHASE_COLOR: Record<Phase, string> = {
  inhale: '#06D6E8', 'hold-in': '#A78BFA', exhale: '#22D68A', 'hold-out': '#F5C518', idle: '#4A5568',
}
const PHASE_LABEL: Record<Phase, string> = {
  inhale: 'Inspire', 'hold-in': 'Segure', exhale: 'Expire', 'hold-out': 'Segure', idle: 'Pronto',
}

function BreathCircle({ phase, countdown, round, totalRounds }: { phase: Phase; countdown: number; round: number; totalRounds: number }) {
  const scale = phase === 'inhale' || phase === 'hold-in' ? 1 : 0.6
  const color = PHASE_COLOR[phase]
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      {totalRounds > 0 && <p className="text-xs font-mono text-t3">Rodada {round} / {totalRounds}</p>}
      <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
        <div className="absolute rounded-full transition-all duration-1000" style={{ width: scale*180, height: scale*180, background: `radial-gradient(circle, ${color}22, transparent)`, border: `2px solid ${color}44` }} />
        <div className="absolute rounded-full transition-all duration-1000 flex items-center justify-center" style={{ width: scale*120, height: scale*120, background: `radial-gradient(circle, ${color}25, ${color}08)`, border: `2px solid ${color}`, boxShadow: `0 0 24px ${color}40` }}>
          <div className="text-center">
            {countdown > 0 && <div className="font-mono font-bold text-3xl" style={{ color }}>{countdown}</div>}
            <div className="text-sm font-semibold text-t1 mt-1">{PHASE_LABEL[phase]}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const BREATH_TECHS = [
  {
    id: 'apnea' as BreathTech, icon: '🫁', label: 'Apneia',
    desc: 'Segure a respiração o máximo que conseguir. Treina tolerância e calma.',
    steps: ['Respire fundo e lento por 2 min (fase de preparo)','Faça uma inspiração profunda — encha os pulmões','Pressione START e segure a respiração','Quando precisar respirar, pressione PAREI','Descanse 2 min antes de repetir'],
    yt: 'apneia estática treino iniciante como fazer',
  },
  {
    id: 'box' as BreathTech, icon: '📦', label: 'Box',
    desc: '4s inspire · 4s segure · 4s expire · 4s segure. Reduz ansiedade antes de ondas grandes.',
    steps: ['Sente ou deite em posição confortável','Inspire pelo nariz por 4 segundos','Segure o ar por 4 segundos','Expire pela boca por 4 segundos','Segure sem ar por 4 segundos — repita'],
    yt: 'box breathing técnica respiração como fazer',
  },
  {
    id: 'co2' as BreathTech, icon: '💨', label: 'CO₂',
    desc: '8 rodadas: apneia fixa + descanso decrescente. Treina tolerância ao CO₂ (sensação de wipeout).',
    steps: ['Descanse o tempo indicado no timer (linha verde)','Quando o timer mudar: segure a respiração (linha roxa)','Repita por 8 rodadas — descanso diminui a cada vez','O desconforto é normal — é exatamente o que treina','Nunca pratique sozinho em água'],
    yt: 'tabela CO2 apneia treino freediving',
  },
  {
    id: 'o2' as BreathTech, icon: '⭕', label: 'O₂',
    desc: '8 rodadas: descanso fixo + apneia crescente. Aumenta o tempo máximo de apneia.',
    steps: ['Descanse 2 minutos (linha verde)','Segure a respiração pelo tempo indicado (aumenta a cada rodada)','O objetivo é completar todas as 8 rodadas','Se não conseguir, pare — não force além do limite','Pratique 3× por semana para evoluir'],
    yt: 'tabela O2 apneia treino aumento tempo',
  },
]

function BoxBreathing() {
  const PHASES: {phase:Phase; dur:number}[] = [
    {phase:'inhale',dur:4},{phase:'hold-in',dur:4},{phase:'exhale',dur:4},{phase:'hold-out',dur:4}
  ]
  const [running, setRunning] = useState(false)
  const [pIdx, setPIdx] = useState(0)
  const [cd, setCd] = useState(4)
  const [round, setRound] = useState(1)
  const ref = useRef<ReturnType<typeof setInterval>|null>(null)

  useEffect(() => {
    if (!running) return
    let cur = { idx: pIdx, cd: cd }
    ref.current = setInterval(() => {
      cur.cd--
      if (cur.cd <= 0) {
        cur.idx = (cur.idx + 1) % 4
        if (cur.idx === 0) setRound(r => { if(r>=8){setRunning(false);return r} return r+1 })
        cur.cd = PHASES[cur.idx].dur
        setPIdx(cur.idx)
      }
      setCd(cur.cd)
    }, 1000)
    return () => { if(ref.current) clearInterval(ref.current) }
  }, [running])

  return (
    <div className="flex flex-col items-center">
      <BreathCircle phase={running ? PHASES[pIdx].phase : 'idle'} countdown={cd} round={round} totalRounds={8} />
      <button onClick={() => { if(running){setRunning(false);setPIdx(0);setCd(4);setRound(1)}else setRunning(true) }}
        className={`px-8 py-3 rounded-2xl font-syne font-bold text-sm ${running ? 'bg-coral/20 border border-coral text-coral' : 'bg-cyan text-bg'}`}>
        {running ? '■ Parar' : '▶ Iniciar — 8 rodadas'}
      </button>
    </div>
  )
}

function StaticApnea({ records, onNew }: { records: BreathRecord[]; onNew: (r: BreathRecord) => void }) {
  const [phase, setPhase] = useState<'idle'|'breathe-up'|'holding'|'done'>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [bu, setBu] = useState(120)
  const ref = useRef<ReturnType<typeof setInterval>|null>(null)
  const startRef = useRef(0)
  const pr = records.length > 0 ? Math.max(...records.map(r=>r.seconds)) : 0

  const stopAll = () => { if(ref.current) clearInterval(ref.current) }

  const startBU = () => {
    setPhase('breathe-up'); setBu(120)
    ref.current = setInterval(() => setBu(v => { if(v<=1){clearInterval(ref.current!); return 0} return v-1 }), 1000)
  }
  const startHold = () => {
    stopAll(); setPhase('holding'); setElapsed(0); startRef.current = Date.now()
    ref.current = setInterval(() => setElapsed(Math.floor((Date.now()-startRef.current)/1000)), 100)
  }
  const stopHold = () => {
    stopAll()
    const secs = Math.floor((Date.now()-startRef.current)/1000)
    setElapsed(secs); setPhase('done')
    if(secs > 5) onNew({ id: Math.random().toString(36).slice(2), date: new Date().toISOString(), seconds: secs })
  }

  if (phase === 'idle') return (
    <div className="flex flex-col items-center gap-4 py-6">
      {pr > 0 && <div className="bg-gold/10 border border-gold/30 rounded-2xl px-6 py-2 text-center"><p className="text-xs text-t3">Seu PR</p><p className="font-mono font-bold text-2xl text-gold">{fmt(pr)}</p></div>}
      <button onClick={startBU} className="px-8 py-3 bg-cyan text-bg rounded-2xl font-syne font-bold text-sm">▶ Começar preparo (2 min)</button>
    </div>
  )

  if (phase === 'breathe-up') return (
    <div className="flex flex-col items-center gap-4">
      <BreathCircle phase="inhale" countdown={bu} round={0} totalRounds={0} />
      <p className="text-t2 text-sm text-center px-6">Respire lento e profundo... Encha os pulmões.</p>
      <button onClick={startHold} className="px-8 py-3 bg-purple text-bg rounded-2xl font-syne font-bold text-sm">🫁 Segure agora</button>
    </div>
  )

  if (phase === 'holding') return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="relative flex items-center justify-center" style={{width:180,height:180}}>
        <div className="absolute rounded-full" style={{width:180,height:180,background:'radial-gradient(circle,rgba(167,139,250,0.15),transparent)',border:'2px solid rgba(167,139,250,0.3)'}}/>
        <div className="text-center">
          <div className="font-mono font-bold text-5xl text-purple">{fmt(elapsed)}</div>
          <div className="text-t2 text-sm mt-2">Segurando...</div>
          {pr > 0 && <div className="text-xs text-t3 mt-1">{elapsed>=pr?'🏆 Novo PR!':fmt(pr)}</div>}
        </div>
      </div>
      <button onClick={stopHold} className="px-8 py-3 bg-coral text-bg rounded-2xl font-syne font-bold text-sm">😮‍💨 Respirei</button>
    </div>
  )

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <p className="font-mono font-bold text-5xl text-green">{fmt(elapsed)}</p>
      {pr > 0 && elapsed >= pr && <p className="text-gold font-bold text-sm">🏆 Novo recorde!</p>}
      <div className="flex gap-3">
        <button onClick={startBU} className="px-6 py-2.5 bg-cyan text-bg rounded-2xl font-syne font-bold text-sm">▶ Repetir</button>
        <button onClick={() => setPhase('idle')} className="px-6 py-2.5 bg-card border border-white/[0.07] text-t2 rounded-2xl font-syne font-bold text-sm">Encerrar</button>
      </div>
      {records.slice(0,4).length > 0 && (
        <div className="w-full px-4">
          {records.slice(0,4).map(r => (
            <div key={r.id} className="flex justify-between py-1.5 border-b border-white/[0.04]">
              <span className="text-xs text-t3">{new Date(r.date).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})}</span>
              <span className="font-mono text-sm font-bold text-t1">{fmt(r.seconds)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TableSession({ type }: { type: 'co2' | 'o2' }) {
  const table = type === 'co2'
    ? Array.from({length:8},(_,i)=>({hold:60, rest:Math.max(30,120-i*15)}))
    : Array.from({length:8},(_,i)=>({hold:30+i*15, rest:120}))
  const [running, setRunning] = useState(false)
  const [rIdx, setRIdx] = useState(0)
  const [isHold, setIsHold] = useState(false)
  const [cd, setCd] = useState(table[0].rest)
  const ref = useRef<ReturnType<typeof setInterval>|null>(null)

  useEffect(() => {
    if (!running) return
    ref.current = setInterval(() => {
      setCd(v => {
        if (v <= 1) {
          setIsHold(h => {
            const next = !h
            setRIdx(r => {
              const row = table[next ? r : r+1 >= table.length ? r : r+1]
              if (!h && r+1 >= table.length) { setRunning(false); return r }
              const newR = !h ? r : r+1 >= table.length ? r : r+1
              setCd(next ? table[newR].hold : table[newR].rest)
              return newR
            })
            return next
          })
          return 0
        }
        return v-1
      })
    }, 1000)
    return () => { if(ref.current) clearInterval(ref.current) }
  }, [running])

  const start = () => { setRIdx(0); setIsHold(false); setCd(table[0].rest); setRunning(true) }
  const stop = () => { setRunning(false); if(ref.current) clearInterval(ref.current); setRIdx(0); setIsHold(false) }

  return (
    <div className="flex flex-col items-center gap-4">
      <BreathCircle phase={!running ? 'idle' : isHold ? 'hold-in' : 'exhale'} countdown={cd} round={rIdx+1} totalRounds={8} />
      <div className="w-full px-4">
        <div className="grid grid-cols-4 gap-1 mb-3">
          {table.map((row, i) => (
            <div key={i} className={`rounded-lg p-1.5 text-center border transition-all ${i===rIdx&&running?'border-cyan bg-cyan/10':i<rIdx?'border-green/30 bg-green/5':'border-white/[0.07]'}`}>
              <div className="text-[9px] text-t3">R{i+1}</div>
              <div className="font-mono text-[10px] text-t1">{fmt(row.hold)}</div>
              <div className="text-[9px] text-t3">{fmt(row.rest)}</div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-t3 text-center mb-3">linha topo = apneia · linha baixo = descanso</p>
      </div>
      {running
        ? <button onClick={stop} className="px-8 py-3 bg-coral/20 border border-coral text-coral rounded-2xl font-syne font-bold text-sm">■ Parar</button>
        : <button onClick={start} className="px-8 py-3 bg-cyan text-bg rounded-2xl font-syne font-bold text-sm">▶ Iniciar tabela</button>
      }
    </div>
  )
}

function BreathingSection() {
  const [tech, setTech] = useState<BreathTech>('apnea')
  const [records, setRecords] = useLS<BreathRecord[]>('waveform-breath', [])
  const current = BREATH_TECHS.find(t => t.id === tech)!

  return (
    <div className="flex flex-col gap-4">
      {/* Why */}
      <div className="mx-5 bg-cyan/8 border border-cyan/20 rounded-2xl px-4 py-3 flex items-start gap-3">
        <span className="text-xl">🌊</span>
        <p className="text-xs text-t2 leading-relaxed">Controle respiratório é essencial para segurança e performance no surf. Treinar 3× por semana faz diferença real em wipeouts.</p>
      </div>

      {/* Selector */}
      <div className="px-5">
        <div className="grid grid-cols-4 gap-2">
          {BREATH_TECHS.map(t => (
            <button key={t.id} onClick={() => setTech(t.id)}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-2xl border transition-all ${tech===t.id?'bg-cyan/10 border-cyan':'bg-card border-white/[0.07]'}`}>
              <span className="text-xl">{t.icon}</span>
              <span className={`text-[10px] font-bold ${tech===t.id?'text-cyan':'text-t1'}`}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Info + steps */}
      <div className="mx-5 bg-card border border-white/[0.07] rounded-2xl p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <p className="font-syne font-bold text-t1 text-sm mb-1">{current.label === 'Box' ? 'Box Breathing' : current.label === 'CO₂' ? 'Tabela CO₂' : current.label === 'O₂' ? 'Tabela O₂' : 'Apneia Estática'}</p>
            <p className="text-xs text-t2 leading-relaxed">{current.desc}</p>
          </div>
        </div>
        <VideoBtn query={current.yt} />

        <div className="mt-3 border-t border-white/[0.07] pt-3">
          <p className="text-[10px] font-bold text-t3 uppercase tracking-widest mb-2">Passo a passo</p>
          <ol className="flex flex-col gap-1.5">
            {current.steps.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-t2">
                <span className="font-mono text-cyan font-bold flex-shrink-0">{i+1}.</span>{s}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Timer */}
      <div className="mx-5 bg-card border border-white/[0.07] rounded-2xl overflow-hidden">
        {tech === 'apnea' && <StaticApnea records={records} onNew={r => setRecords([r,...records])} />}
        {tech === 'box' && <BoxBreathing />}
        {tech === 'co2' && <TableSession type="co2" />}
        {tech === 'o2' && <TableSession type="o2" />}
      </div>

      {/* Safety warning */}
      <div className="mx-5 bg-coral/8 border border-coral/20 rounded-2xl px-4 py-3">
        <p className="text-xs text-coral font-bold mb-1">⚠️ Segurança</p>
        <p className="text-xs text-t2">Nunca pratique apneia sozinho em água. Sempre tenha um parceiro presente. Em caso de tontura, respire normalmente e pare.</p>
      </div>
    </div>
  )
}

// ── MAIN ──────────────────────────────────────────────────────────────────

const SUB_TABS: { id: SurfTab; icon: string; label: string }[] = [
  { id: 'surf', icon: '🌊', label: 'Surf' },
  { id: 'skate', icon: '🛹', label: 'Skate' },
  { id: 'breathing', icon: '🫁', label: 'Respiração' },
]

export default function SurfPage() {
  const [tab, setTab] = useState<SurfTab>('surf')

  return (
    <div className="flex flex-col">
      <div className="px-5 pt-10 pb-4">
        <h1 className="font-syne font-extrabold text-2xl text-t1">Surf</h1>
        <p className="text-t2 text-sm mt-1">Surf · Skate · Respiração</p>
      </div>

      {/* Sub-tab selector */}
      <div className="px-5 mb-4">
        <div className="grid grid-cols-3 gap-2 bg-card border border-white/[0.07] rounded-2xl p-1.5">
          {SUB_TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all ${tab===t.id?'bg-cyan text-bg':'text-t2 hover:text-t1'}`}>
              <span>{t.icon}</span>
              <span className="text-xs">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {tab === 'surf' && <SurfSection />}
      {tab === 'skate' && <SkateSection />}
      {tab === 'breathing' && <BreathingSection />}
    </div>
  )
}
