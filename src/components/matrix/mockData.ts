export interface Entity {
  name: string;
  type: "Person" | "Location" | "Organization" | "Event" | "Date";
  confidence: number;
}

export interface VerificationMetadata {
  sourceName: string;
  sourceType: "Wire" | "Satellite" | "Government Archive" | "Verified Social" | "User Upload";
  reliabilityScore: number;
  captureDate: string;
  location: string;
  geoCoords: [number, number];
  deepfakeScore: number;
  exifAvailable: boolean;
  exifDetails?: {
    camera: string;
    lens: string;
    focalLength: string;
    iso: number;
    shutter: string;
    aperture: string;
    software: string;
  };
  reverseMatchCount: number;
  forensicHighlights: string[];
}

export interface EvidenceImage {
  id: string;
  title: string;
  url: string;
  highResUrl: string;
  metadata: VerificationMetadata;
  comparisonTargetId?: string;
  aiDiffNotes?: string[];
  heatMapUrl?: string;
}

export interface TimelineMilestone {
  id: string;
  timestamp: string;
  date: string;
  title: string;
  description: string;
  status: "VERIFIED" | "NEEDS ATTENTION" | "HOT NOW" | "DEEPFAKE DETECTED";
  imageUrl: string;
  source: string;
  entities: Entity[];
}

export interface VerificationClaim {
  id: string;
  title: string;
  headlineSerif: string;
  summary: string;
  category: "POLITICS" | "SCIENCE" | "TECH" | "WORLD" | "ECONOMY" | "CULTURE" | "TRAVEL";
  hotNow: boolean;
  publishedAt: string;
  readTime: string;
  entities: Entity[];
  truthScore: number;
  status: "VERIFIED" | "NEEDS ATTENTION" | "MANIPULATED";
  biasRating: "Center" | "Center-Left" | "Center-Right" | "Independent Fact Check";
  primaryHeroImage: string;
  comparedOriginalImage: string;
  comparedVerifiedImage: string;
  evidenceList: EvidenceImage[];
  timeline: TimelineMilestone[];
  aiAnalysisSummary: string;
  spectralConsistency: number;
  exifIntegrity: number;
  aiPromptMatches: string[];
}

export const MOCK_CLAIMS: VerificationClaim[] = [
  {
    id: "claim-1",
    title: "Port Container Surge Satellite Analysis",
    headlineSerif: "Global Supply Chain Disruptions: AI Uncovers Manipulated Port Satellite Imagery",
    summary: "Viral social media posts claimed a massive shipping container backlog was fabricated. Veritas AI matched satellite passes from Sentinel-2 with high-res Maxar imagery and ground-level Reuters photos to expose doctored digital manipulation in the viral photo.",
    category: "WORLD",
    hotNow: true,
    publishedAt: "12 mins ago",
    readTime: "4 min read",
    truthScore: 94,
    status: "VERIFIED",
    biasRating: "Independent Fact Check",
    primaryHeroImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    comparedOriginalImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    comparedVerifiedImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    spectralConsistency: 98.2,
    exifIntegrity: 99.4,
    aiAnalysisSummary: "Cross-matching Sentinel-2 spectral infrared bands against ground wire photos confirms 1,420 containers docked at Terminal 4 between 06:00 and 14:00 UTC. The viral photo altered shadows at [X: 54%, Y: 32%] using clone stamping.",
    entities: [
      { name: "Port of Rotterdam", type: "Location", confidence: 0.99 },
      { name: "Sentinel-2 Satellite", type: "Organization", confidence: 0.98 },
      { name: "Global Trade Logistics", type: "Event", confidence: 0.95 },
      { name: "August 8, 2026", type: "Date", confidence: 1.0 },
    ],
    aiPromptMatches: [
      "Is this container image real?",
      "Show satellite evidence for Rotterdam Port",
      "Compare ground wire photo vs satellite pass",
      "Analyze shadow consistency on container stack"
    ],
    evidenceList: [
      {
        id: "ev-1",
        title: "Maxar WorldView-3 High-Res Satellite Pass",
        url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80",
        highResUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=90",
        metadata: {
          sourceName: "Maxar Satellite Network",
          sourceType: "Satellite",
          reliabilityScore: 99.8,
          captureDate: "2026-08-08 09:14:22 UTC",
          location: "Rotterdam Terminal 4 (51.9515° N, 4.0519° E)",
          geoCoords: [51.9515, 4.0519],
          deepfakeScore: 0.01,
          exifAvailable: true,
          exifDetails: {
            camera: "WorldView-3 Optical Sensor",
            lens: "Multi-spectral 30cm Aperture",
            focalLength: "10000mm Orbital",
            iso: 100,
            shutter: "1/4000s",
            aperture: "f/4.0",
            software: "ESA Processing Pipeline v4.2"
          },
          reverseMatchCount: 142,
          forensicHighlights: [
            "Thermal infrared signature matches reported container density",
            "Zero compression tampering detected across grid bounds",
            "Shadow vectors align perfectly with solar angle (48.2°)"
          ]
        }
      },
      {
        id: "ev-2",
        title: "Reuters Ground Photo Wire #4920",
        url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80",
        highResUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2000&q=90",
        metadata: {
          sourceName: "Reuters Wire Service",
          sourceType: "Wire",
          reliabilityScore: 99.4,
          captureDate: "2026-08-08 09:22:05 UTC",
          location: "Rotterdam Dock 8",
          geoCoords: [51.9520, 4.0530],
          deepfakeScore: 0.03,
          exifAvailable: true,
          exifDetails: {
            camera: "Canon EOS R3",
            lens: "RF 24-70mm f/2.8L IS USM",
            focalLength: "35mm",
            iso: 200,
            shutter: "1/1000s",
            aperture: "f/5.6",
            software: "Canon RAW Firmware 1.5.0"
          },
          reverseMatchCount: 89,
          forensicHighlights: [
            "Authenticated C2PA cryptographic image signature attached",
            "Lens distortion parameters match optical physical model",
            "EXIF GPS telemetry verified against port tower logs"
          ]
        }
      },
      {
        id: "ev-3",
        title: "Viral Social Media Upload (Doctored)",
        url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80",
        highResUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=90",
        metadata: {
          sourceName: "User Upload (X / Twitter)",
          sourceType: "User Upload",
          reliabilityScore: 32.1,
          captureDate: "2026-08-08 10:45:00 UTC",
          location: "Claimed: Rotterdam",
          geoCoords: [51.9515, 4.0519],
          deepfakeScore: 0.78,
          exifAvailable: false,
          reverseMatchCount: 410,
          forensicHighlights: [
            "EXIF data stripped completely",
            "High frequency noise residual at [X: 62%, Y: 40%] indicates clone stamp tool",
            "Shadow vectors point toward 14:00 solar angle despite morning timestamps"
          ]
        }
      }
    ],
    timeline: [
      {
        id: "t-1",
        timestamp: "06:30 UTC",
        date: "Aug 8, 2026",
        title: "Claim Emerges on Social Media",
        description: "Viral post claims Rotterdam port is empty and shipping data is fabricated, attaching doctored photo.",
        status: "NEEDS ATTENTION",
        imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=500&q=80",
        source: "X / Telegram Wire",
        entities: [{ name: "Social Media Claim", type: "Event", confidence: 0.9 }]
      },
      {
        id: "t-2",
        timestamp: "09:14 UTC",
        date: "Aug 8, 2026",
        title: "Sentinel-2 Orbital Pass Ingested",
        description: "ESA Sentinel-2 satellite passes over Rotterdam, capturing multi-spectral infrared imagery showing 1,420 containers.",
        status: "VERIFIED",
        imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=500&q=80",
        source: "Maxar / ESA",
        entities: [{ name: "Sentinel-2", type: "Organization", confidence: 0.99 }]
      }
    ]
  },
  {
    id: "claim-2",
    title: "CERN Antihydrogen ALPHA-g Experiment",
    headlineSerif: "CERN ALPHA-g Experiment Confirms Antimatter Falls Downward Under Earth's Gravity",
    summary: "Theoretical physics masterclass and empirical verification proving antihydrogen atoms drop downward in Earth's gravitational field, disproving gravitational repulsion for antimatter.",
    category: "SCIENCE",
    hotNow: true,
    publishedAt: "NOV 17, 2023",
    readTime: "6 min read",
    truthScore: 99,
    status: "VERIFIED",
    biasRating: "Independent Fact Check",
    primaryHeroImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    comparedOriginalImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    comparedVerifiedImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    spectralConsistency: 99.9,
    exifIntegrity: 100.0,
    aiAnalysisSummary: "CERN Nature publication verified with 100% peer-reviewed physics data. Magnetic trap breakdown shows ~80% antihydrogen release toward bottom detector.",
    entities: [
      { name: "CERN ALPHA-g", type: "Organization", confidence: 1.0 },
      { name: "Geneva, Switzerland", type: "Location", confidence: 0.99 },
      { name: "Antihydrogen", type: "Event", confidence: 0.98 },
    ],
    aiPromptMatches: [
      "Does antimatter fall up or down?",
      "Show CERN ALPHA-g diagram",
      "Explain negative mass energy conditions"
    ],
    evidenceList: [
      {
        id: "ev-cern-1",
        title: "CERN ALPHA-g Chamber Diagram",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
        highResUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2000&q=90",
        metadata: {
          sourceName: "CERN Official Communications",
          sourceType: "Government Archive",
          reliabilityScore: 99.9,
          captureDate: "2023-09-27 15:00:00 UTC",
          location: "Geneva, Switzerland",
          geoCoords: [46.2330, 6.0557],
          deepfakeScore: 0.00,
          exifAvailable: true,
          reverseMatchCount: 520,
          forensicHighlights: ["Nature journal DOI verified", "Peer-reviewed experimental physics paper"]
        }
      }
    ],
    timeline: [
      {
        id: "tc-1",
        timestamp: "Sep 2023",
        date: "Nature Release",
        title: "ALPHA-g Results Published in Nature",
        description: "Landmark paper confirms antihydrogen experiences downward gravitational force g=(0.75±0.29)g.",
        status: "VERIFIED",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80",
        source: "Nature Journal / CERN",
        entities: [{ name: "Nature Journal", type: "Organization", confidence: 1.0 }]
      }
    ]
  },
  {
    id: "claim-3",
    title: "Global Microchip Fab Verification",
    headlineSerif: "Semiconductor Supply Chain Pivot: Munich & Taiwan Fab Cleanrooms Audit",
    summary: "Audit of next-generation EUV lithography cleanrooms in Munich and Hsinchu Science Park. Cryptographic supply chain hashes confirm delivery timelines of sub-2nm chip wafers.",
    category: "TECH",
    hotNow: false,
    publishedAt: "1 hour ago",
    readTime: "5 min read",
    truthScore: 96,
    status: "VERIFIED",
    biasRating: "Center",
    primaryHeroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    comparedOriginalImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    comparedVerifiedImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    spectralConsistency: 96.5,
    exifIntegrity: 98.0,
    aiAnalysisSummary: "Cleanroom EXIF telemetry and wafer production logs cross-verified against TSMC and ASML official wire releases.",
    entities: [
      { name: "Hsinchu Science Park", type: "Location", confidence: 0.99 },
      { name: "ASML EUV Lithography", type: "Organization", confidence: 0.98 }
    ],
    aiPromptMatches: [
      "Verify semiconductor fab photo",
      "Show TSMC wafer delivery logs"
    ],
    evidenceList: [
      {
        id: "ev-chip-1",
        title: "Cleanroom EUV Scanner Inspection",
        url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
        highResUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=90",
        metadata: {
          sourceName: "Associated Press Wire",
          sourceType: "Wire",
          reliabilityScore: 98.5,
          captureDate: "2026-08-08 12:00:00 UTC",
          location: "Hsinchu, Taiwan",
          geoCoords: [24.7800, 120.9950],
          deepfakeScore: 0.02,
          exifAvailable: true,
          reverseMatchCount: 230,
          forensicHighlights: ["Wafer ID serial numbers cryptographically verified"]
        }
      }
    ],
    timeline: []
  },
  {
    id: "claim-4",
    title: "Global Central Bank Digital Settlement",
    headlineSerif: "Interbank Liquidity Reserves: Real-Time Audit of Sovereign Reserve Ledger Feeds",
    summary: "Financial analysts evaluate cross-border liquidity settlement logs. Multi-node consensus confirms zero discrepancies across European Central Bank and Federal Reserve data streams.",
    category: "ECONOMY",
    hotNow: false,
    publishedAt: "2 hours ago",
    readTime: "3 min read",
    truthScore: 98,
    status: "VERIFIED",
    biasRating: "Center-Right",
    primaryHeroImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80",
    comparedOriginalImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80",
    comparedVerifiedImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80",
    spectralConsistency: 99.0,
    exifIntegrity: 99.5,
    aiAnalysisSummary: "Bloomberg and Wall Street Journal wire consensus verified against SWIFT ISO 20022 telemetry feeds.",
    entities: [
      { name: "European Central Bank", type: "Organization", confidence: 0.99 },
      { name: "Frankfurt, Germany", type: "Location", confidence: 0.98 }
    ],
    aiPromptMatches: [
      "Check central bank settlement logs",
      "Is liquidity statement authentic?"
    ],
    evidenceList: [
      {
        id: "ev-econ-1",
        title: "Bloomberg Financial Wire #8812",
        url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1000&q=80",
        highResUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=2000&q=90",
        metadata: {
          sourceName: "Bloomberg News Terminal",
          sourceType: "Wire",
          reliabilityScore: 99.1,
          captureDate: "2026-08-08 11:30:00 UTC",
          location: "Frankfurt ECB Command",
          geoCoords: [50.1109, 8.6821],
          deepfakeScore: 0.01,
          exifAvailable: true,
          reverseMatchCount: 310,
          forensicHighlights: ["Financial terminal API hash verified"]
        }
      }
    ],
    timeline: []
  },
  {
    id: "claim-5",
    title: "Pacific Ocean Deep-Sea Thermal Vents",
    headlineSerif: "Oceanographic Ecosystem Survey: Deep-Sea Submersible & Satellite Thermal Matching",
    summary: "Scientists evaluate new hydrothermal vent discoveries in the Mariana Trench. Deep-submergence vehicle imagery matches orbital infrared ocean surface temperature telemetry.",
    category: "SCIENCE",
    hotNow: false,
    publishedAt: "3 hours ago",
    readTime: "5 min read",
    truthScore: 97,
    status: "VERIFIED",
    biasRating: "Independent Fact Check",
    primaryHeroImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    comparedOriginalImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    comparedVerifiedImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    spectralConsistency: 97.5,
    exifIntegrity: 98.8,
    aiAnalysisSummary: "NOAA & IFREMER oceanographic logs confirmed with sub-sea acoustic sensor arrays.",
    entities: [
      { name: "Mariana Trench", type: "Location", confidence: 0.99 },
      { name: "NOAA Submersible", type: "Organization", confidence: 0.98 }
    ],
    aiPromptMatches: [
      "Show hydrothermal vent camera logs",
      "Verify ocean thermal data"
    ],
    evidenceList: [
      {
        id: "ev-sea-1",
        title: "NOAA Deep Ocean Vehicle Feed",
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80",
        highResUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=90",
        metadata: {
          sourceName: "NOAA Ocean Exploration",
          sourceType: "Government Archive",
          reliabilityScore: 99.2,
          captureDate: "2026-08-08 07:15:00 UTC",
          location: "Challenger Deep",
          geoCoords: [11.3733, 142.5917],
          deepfakeScore: 0.01,
          exifAvailable: true,
          reverseMatchCount: 75,
          forensicHighlights: ["Acoustic sonar telemetry verified"]
        }
      }
    ],
    timeline: []
  },
  {
    id: "claim-6",
    title: "Venice Cultural Heritage Preservation",
    headlineSerif: "Venice MOSE Barrier Activation: Satellite & Ground Water Level Inspection",
    summary: "Cultural heritage authorities deploy flood barriers to protect historic architecture. Sentinel-3 radar altimetry confirms high tide surge blocked successfully.",
    category: "CULTURE",
    hotNow: false,
    publishedAt: "4 hours ago",
    readTime: "4 min read",
    truthScore: 95,
    status: "VERIFIED",
    biasRating: "Center-Left",
    primaryHeroImage: "https://images.unsplash.com/photo-1514896856000-91cb6de818e0?auto=format&fit=crop&w=1200&q=80",
    comparedOriginalImage: "https://images.unsplash.com/photo-1514896856000-91cb6de818e0?auto=format&fit=crop&w=1200&q=80",
    comparedVerifiedImage: "https://images.unsplash.com/photo-1514896856000-91cb6de818e0?auto=format&fit=crop&w=1200&q=80",
    spectralConsistency: 95.8,
    exifIntegrity: 97.2,
    aiAnalysisSummary: "Agence France-Presse and Italian Ministry of Culture logs verified.",
    entities: [
      { name: "Venice, Italy", type: "Location", confidence: 0.99 },
      { name: "MOSE Barrier System", type: "Organization", confidence: 0.97 }
    ],
    aiPromptMatches: [
      "Is Venice flood photo authentic?",
      "Show MOSE barrier satellite view"
    ],
    evidenceList: [
      {
        id: "ev-[#0.65rem]cult-1",
        title: "AFP Photo Wire #3320",
        url: "https://images.unsplash.com/photo-1514896856000-91cb6de818e0?auto=format&fit=crop&w=1000&q=80",
        highResUrl: "https://images.unsplash.com/photo-1514896856000-91cb6de818e0?auto=format&fit=crop&w=2000&q=90",
        metadata: {
          sourceName: "AFP News Agency",
          sourceType: "Wire",
          reliabilityScore: 97.8,
          captureDate: "2026-08-08 06:40:00 UTC",
          location: "St. Mark's Square, Venice",
          geoCoords: [45.4343, 12.3388],
          deepfakeScore: 0.02,
          exifAvailable: true,
          reverseMatchCount: 160,
          forensicHighlights: ["Water gauge sensor readings match optical image"]
        }
      }
    ],
    timeline: []
  },
  {
    id: "claim-7",
    title: "Kyoto Sustainable Eco-Tourism Transit",
    headlineSerif: "Kyoto Green Electric Transit Network: High-Resolution Rail Sensor Audit",
    summary: "Evaluating city-wide zero-emission transport network expansion. Telemetry confirms 100% solar grid powering electric light rail lines.",
    category: "TRAVEL",
    hotNow: false,
    publishedAt: "5 hours ago",
    readTime: "3 min read",
    truthScore: 97,
    status: "VERIFIED",
    biasRating: "Center",
    primaryHeroImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    comparedOriginalImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    comparedVerifiedImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    spectralConsistency: 97.0,
    exifIntegrity: 98.5,
    aiAnalysisSummary: "Kyodo News & NHK World telemetry cross-checked against Kansai Electric Power Co. grid feeds.",
    entities: [
      { name: "Kyoto, Japan", type: "Location", confidence: 0.99 },
      { name: "Kyoto Municipal Transit", type: "Organization", confidence: 0.98 }
    ],
    aiPromptMatches: [
      "Check Kyoto solar transit logs",
      "Verify electric rail photos"
    ],
    evidenceList: [
      {
        id: "ev-trav-1",
        title: "Kyodo News Wire Dispatch",
        url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80",
        highResUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2000&q=90",
        metadata: {
          sourceName: "Kyodo News Wire",
          sourceType: "Wire",
          reliabilityScore: 98.1,
          captureDate: "2026-08-08 05:20:00 UTC",
          location: "Arashiyama Station",
          geoCoords: [35.0158, 135.6777],
          deepfakeScore: 0.01,
          exifAvailable: true,
          reverseMatchCount: 95,
          forensicHighlights: ["Solar cell telemetry integrated"]
        }
      }
    ],
    timeline: []
  }
];

export const BREAKING_TICKER_ITEMS = [
  { id: "b-1", status: "VERIFIED", code: "#1420", text: "Port Rotterdam Satellite Pass: 1,420 Containers confirmed docked", time: "2m ago" },
  { id: "b-2", status: "VERIFIED", code: "#1419", text: "Munich Microchip Cleanroom Audit: Sub-2nm wafer delivery authenticated", time: "5m ago" },
  { id: "b-3", status: "VERIFIED", code: "#1418", text: "CERN ALPHA-g Data Hashed on Chain: Antimatter falls downward", time: "12m ago" },
  { id: "b-4", status: "VERIFIED", code: "#1417", text: "Interbank Reserves Ledger: SWIFT ISO 20022 zero discrepancy confirmed", time: "18m ago" },
  { id: "b-5", status: "VERIFIED", code: "#1416", text: "Mariana Hydrothermal Vents: NOAA submersible audio & thermal match", time: "24m ago" },
  { id: "b-6", status: "VERIFIED", code: "#1415", text: "Venice MOSE Flood Barrier: Sentinel-3 radar altimetry verifies protection", time: "30m ago" },
  { id: "b-7", status: "VERIFIED", code: "#1414", text: "Kyoto Electric Transit: 100% Solar grid power telemetry verified", time: "35m ago" },
];
