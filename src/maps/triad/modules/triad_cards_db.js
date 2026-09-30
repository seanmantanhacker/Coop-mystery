/* ==========================================================================
   THE TRIAD PARADOX: CASE 005 - "THE OUROBOROS CONVERGENCE"
   COMPLETE CARD DATABASE & NARRATIVE CLUES REPOSITORY
   Includes: 1979 Era Deck, 1999 Era Deck, 1999 Forensic Deck,
             2019 Era Deck, 2019 Revelation Deck.
   ========================================================================== */

window.TRIAD_CARDS_DB = {
  // ==========================================================================
  // 1979 ERA DECK (The Architect) - 30 Cards
  // ==========================================================================
  deck1979: [
    // Items
    {
      id: '79-item-01',
      title: 'Lead-Lined Cryo-Canister',
      type: 'ITEM',
      node: 1, // Laboratory
      text: 'Heavy lead-lined canister designed to preserve volatile isotopes and magnetic media across decades without chronal degradation.',
      keywords: ['CRYO-PRESERVATION', 'LEAD-SHIELDED'],
      canPlant: true
    },
    {
      id: '79-item-02',
      title: 'Vault Hydraulic Pressure Valve',
      type: 'ITEM',
      node: 1, // Laboratory
      text: 'Solid bronze wheel valve controlling the subterranean nitrogen coolant line to the main vault door.',
      keywords: ['COOLANT-SYSTEM', 'VALVE-OVERRIDE'],
      canPlant: false
    },
    {
      id: '79-item-03',
      title: 'Sub-Cistern Drainage Wrench',
      type: 'ITEM',
      node: 4, // Courtyard
      text: 'Heavy iron wrench fitting the subterranean drainage lock beneath the courtyard fountain basin.',
      keywords: ['CISTERN-DRAIN', 'COURTYARD-BASIN'],
      canPlant: true
    },
    {
      id: '79-item-04',
      title: 'Unfired Displacement Core Prototype',
      type: 'ITEM',
      node: 4, // Courtyard (Hidden in Cistern)
      text: 'A dense, humming crystalline cylinder stamped: "PROJECT OUROBOROS - CORE #01". Highly sensitive to electromagnetic shocks.',
      keywords: ['DISPLACEMENT-CORE', 'TACHYON-RESONANCE'],
      canPlant: true
    },
    {
      id: '79-item-05',
      title: "Director Vance's Master Keycard",
      type: 'ITEM',
      node: 2, // Director's Office
      text: 'Punch-card encoded with Dr. Julian Vance’s executive clearance. Bypasses standard facility security doors.',
      keywords: ['MASTER-CLEARANCE', 'DIRECTOR-VANCE'],
      canPlant: true
    },
    {
      id: '79-item-06',
      title: 'Faraday Magnetic Tape Shield',
      type: 'ITEM',
      node: 5, // Security Hub
      text: 'A brass-mesh shielding sleeve for reel-to-reel magnetic tapes to protect them from high-yield EMP discharge.',
      keywords: ['FARADAY-SHIELD', 'TAPE-PROTECTION'],
      canPlant: true
    },

    // Clues
    {
      id: '79-clue-01',
      title: 'Confidential Patent: Project Ouroboros',
      type: 'CLUE',
      node: 2, // Director's Office
      text: 'Vance’s theoretical schematic: A weapon firing inverted temporal resonance pulses that disintegrate cellular bonds by reversing biological time 20 years.',
      keywords: ['RESONANCE-432HZ', 'DISPLACEMENT-CORE', 'PATENT-THEFT']
    },
    {
      id: '79-clue-02',
      title: 'Audio Reel: Maya Lin & Julian Vance',
      type: 'CLUE',
      node: 1, // Laboratory
      text: 'Lin furiously confronts Vance: "You stole my biometric algorithm for the vault! If you lock me out, my DNA override will ensure neither of us leaves alive."',
      keywords: ['BIOMETRIC-ENCRYPTION', 'MAYA-LIN', 'VAULT-OVERRIDE']
    },
    {
      id: '79-clue-03',
      title: 'Audit Memo: Assistant Director Cross',
      type: 'CLUE',
      node: 2, // Director's Office
      text: 'Valerie Cross requests immediate transfer of all Project Ouroboros files to Vance-Cross Aerospace shell accounts in Switzerland.',
      keywords: ['VALERIE-CROSS', 'CORPORATE-ACQUISITION', 'FINANCIAL-AUDIT']
    },
    {
      id: '79-clue-04',
      title: 'Incident Report: Dr. Marcus Rowe',
      type: 'CLUE',
      node: 5, // Security Hub
      text: 'Physicist Marcus Rowe was hospitalized after a high-voltage tachyon feedback surge. Neurological motor pathways severely impaired.',
      keywords: ['MARCUS-ROWE', 'MOTOR-PARALYSIS', 'ACCIDENT-1979']
    },
    {
      id: '79-clue-05',
      title: 'Facility Blueprints: Subterranean Cistern',
      type: 'CLUE',
      node: 4, // Courtyard
      text: 'Architectural cross-section showing the courtyard cistern connects directly to the Vault emergency overflow duct when drained.',
      keywords: ['CISTERN-DRAIN', 'DRAINAGE-BYPASS']
    },
    {
      id: '79-clue-06',
      title: 'Vault Protocol: Biometric Calibration',
      type: 'CLUE',
      node: 3, // Temporal Vault
      text: 'The inner temporal vault requires two living biometric palm scans: Director Julian Vance and Chief Architect Dr. Maya Lin.',
      keywords: ['BIOMETRIC-ENCRYPTION', 'DUAL-KEY-PROTOCOL']
    },
    {
      id: '79-clue-07',
      title: 'Coolant Flow Specifications',
      type: 'CLUE',
      node: 1, // Laboratory
      text: 'If the primary coolant line is depressurized, the ventilation shaft clears of cryo-fog within 3 minutes, permitting physical crawling access.',
      keywords: ['COOLANT-SYSTEM', 'VENT-BYPASS']
    },
    {
      id: '79-clue-08',
      title: 'Diary Entry: Dr. Julian Vance (1979)',
      type: 'CLUE',
      node: 2, // Director's Office
      text: '"The jump coordinates are locked for December 31, 1999. If Cross suspects my disappearance, she will dismantle the facility before I return."',
      keywords: ['JUMP-COORDINATES', 'TEMPORAL-FLIGHT']
    },
    {
      id: '79-clue-09',
      title: 'Security Roster: Night Watch 1979',
      type: 'CLUE',
      node: 5, // Security Hub
      text: 'Guard logs indicate Valerie Cross checked out master vault schematics without clearance at 22:00 on October 14, 1979.',
      keywords: ['VALERIE-CROSS', 'UNAUTHORIZED-ACCESS']
    },
    {
      id: '79-clue-10',
      title: 'Spectrometer Calibration Sheet',
      type: 'CLUE',
      node: 1, // Laboratory
      text: 'Project Ouroboros emitter frequencies must be synchronized precisely to 432.0 Hz to pierce the Vault chronal shielding.',
      keywords: ['RESONANCE-432HZ', 'SPECTRAL-TUNING']
    },

    // Events
    {
      id: '79-event-01',
      title: 'Sub-Reactor Harmonic Surge',
      type: 'EVENT',
      node: 1, // Laboratory
      text: 'Electrical arcing along the power busbar. If Sub-Level Power Grid is [High Voltage], all personnel in the Lab lose 1 AP.',
      keywords: ['POWER-SURGE', 'CHRONAL-STRAIN']
    },
    {
      id: '79-event-02',
      title: 'Security Patrol Checkpoint',
      type: 'EVENT',
      node: 5, // Security Hub
      text: 'Guards inspect credentials. Discard 1 unanalyzed card from hand or lose 1 Chronal Stability.',
      keywords: ['SECURITY-PATROL']
    },
    {
      id: '79-event-03',
      title: 'Temporal Flashback Whisper',
      type: 'EVENT',
      node: 3, // Temporal Vault
      text: 'A phantom sound of gunshots and wailing sirens echoes from the future year 1999. Gain 1 free ANALYZE action.',
      keywords: ['TEMPORAL-ECHO']
    }
  ],

  // ==========================================================================
  // 1999 ERA DECK (The Detective) - 30 Cards
  // ==========================================================================
  deck1999: [
    // Items
    {
      id: '99-item-01',
      title: 'Shattered Tachyon Emitter Casing',
      type: 'ITEM',
      node: 4, // Courtyard
      text: 'A high-tech reinforced casing recovered from the mud. The internal displacement core has been forcefully removed.',
      keywords: ['DISPLACEMENT-CORE', 'EMITTER-CASING'],
      canPlant: false
    },
    {
      id: '99-item-02',
      title: 'Blood-Stained Lab Coat (Size L)',
      type: 'ITEM',
      node: 1, // Laboratory
      text: 'Heavy cotton coat stained with arterial blood and copper residue. Monogram reads "V.C." (Valerie Cross).',
      keywords: ['VALERIE-CROSS', 'BLOOD-STAINED'],
      canPlant: false
    },
    {
      id: '99-item-03',
      title: 'Emergency Breaching Crowbar',
      type: 'ITEM',
      node: 5, // Security Hub
      text: 'Titanium pry-bar used by responders attempting to pry open the sealed Vault bulkhead after the EMP.',
      keywords: ['BREACHING-TOOL', 'VAULT-DOOR'],
      canPlant: false
    },
    {
      id: '99-item-04',
      title: 'Burnt Micro-DAT Backup Tape',
      type: 'ITEM',
      node: 5, // Security Hub
      text: 'Digital audio tape salvaged from the security rack. Completely demagnetized by the 23:40 EMP blast unless shielded.',
      keywords: ['SECURITY-TAPE', 'MAGNETIC-MEDIA'],
      canPlant: false
    },

    // Clues
    {
      id: '99-clue-01',
      title: 'Security Log: The 23:40 Blackout',
      type: 'CLUE',
      node: 5, // Security Hub
      text: 'At 23:40, an EMP wave registered inside the Temporal Vault. Every camera in Sector 3 flatlined for exactly 5 minutes.',
      keywords: ['RESONANCE-432HZ', 'BLACKOUT-2340', 'EMP-BLAST']
    },
    {
      id: '99-clue-02',
      title: 'Medical Screener: Dr. Marcus Rowe',
      type: 'CLUE',
      node: 5, // Security Hub
      text: 'Bloodwork confirms Rowe was heavily dosed with sedative Haloperidol at 23:15. He was paralyzed in his wheelchair during the murder.',
      keywords: ['MARCUS-ROWE', 'MOTOR-PARALYSIS', 'VERIFIED-ALIBI']
    },
    {
      id: '99-clue-03',
      title: 'Witness Statement: Assistant Director Cross',
      type: 'CLUE',
      node: 2, // Director's Office
      text: 'Cross testified: "I was in the courtyard inspecting the storm drains when the blast went off. Dr. Maya Lin must have triggered it."',
      keywords: ['VALERIE-CROSS', 'CISTERN-DRAIN', 'CONTRADICTORY-ALIBI']
    },
    {
      id: '99-clue-04',
      title: 'Crime Scene Splatter Analysis',
      type: 'CLUE',
      node: 1, // Laboratory
      text: 'High-velocity blood spatter trails lead from the Lab emergency exit toward the courtyard cistern grate.',
      keywords: ['BLOOD-TRAIL', 'CISTERN-DRAIN']
    },
    {
      id: '99-clue-05',
      title: 'Sealed Vault Door Telemetry',
      type: 'CLUE',
      node: 3, // Temporal Vault
      text: 'The heavy vault door was deadbolted from the outside control console at 23:41, trapping anyone inside.',
      keywords: ['VAULT-DOOR', 'DEADBOLTED']
    },
    {
      id: '99-clue-06',
      title: 'Explosion Residue Report (Lab)',
      type: 'CLUE',
      node: 1, // Laboratory
      text: 'The chemical explosion in the Lab was caused by deliberate ignition of solvent tanks at 23:42—a diversionary cover-up.',
      keywords: ['STAGED-EXPLOSION', 'LAB-DIVERSION']
    },
    {
      id: '99-clue-07',
      title: 'Wiretap Audio: 23:50 Emergency Call',
      type: 'CLUE',
      node: 5, // Security Hub
      text: 'A telephone call from the Director\'s private line to a Zurich banking firm: "Vance is eliminated. Confirm the patent transfer."',
      keywords: ['CORPORATE-ACQUISITION', 'PATENT-THEFT', 'DIRECTOR-OFFICE']
    },
    {
      id: '99-clue-08',
      title: 'Muddy Footprint Plaster Cast',
      type: 'CLUE',
      node: 4, // Courtyard
      text: 'Designer Italian leather boots (Women\'s Size 7) pressed into the mud beside the drainage cistern.',
      keywords: ['VALERIE-CROSS', 'PHYSICAL-TRAIT', 'FOOTPRINT-CAST']
    },

    // Events
    {
      id: '99-event-01',
      title: 'Police Hazmat Lockdown',
      type: 'EVENT',
      node: 1, // Laboratory
      text: 'Local authorities cordon off the sector. Moving out of the Laboratory now costs 2 AP until the end of the round.',
      keywords: ['HAZMAT-LOCKDOWN']
    },
    {
      id: '99-event-02',
      title: 'Corridor Smoke Backdraft',
      type: 'EVENT',
      node: 3, // Temporal Vault
      text: 'Venting smoke reduces visibility. The Detective must discard 1 Clue card from hand.',
      keywords: ['SMOKE-HAZARD']
    }
  ],

  // ==========================================================================
  // 1999 FORENSIC DECK (5 Cards - Drawn via FORENSIC SWEEP in 1999 Vault)
  // ==========================================================================
  forensic1999: [
    {
      id: '99-for-01',
      title: 'The Corpse of Julian Vance',
      type: 'FORENSIC',
      node: 3, // Temporal Vault
      text: 'The victim collapsed against the tachyon conduit. Autopsy scans show severe cellular breakdown. Biometric bone density tests reveal the body is biologically 72 years old—20 years older than Julian Vance in 1999!',
      keywords: ['CELLULAR-DISINTEGRATION', 'AGE-ANOMALY', 'DIRECTOR-VANCE']
    },
    {
      id: '99-for-02',
      title: 'The Severed Biometric Palm',
      type: 'FORENSIC',
      node: 3, // Temporal Vault
      text: 'A severed human left hand lies scorched near the vault emergency console. DNA analysis proves it belongs to Dr. Maya Lin, deceased moments prior to the blast.',
      keywords: ['BIOMETRIC-ENCRYPTION', 'MAYA-LIN', 'SEVERED-HAND']
    },
    {
      id: '99-for-03',
      title: 'Scorched Pocket Chronometer',
      type: 'FORENSIC',
      node: 3, // Temporal Vault
      text: 'A Swiss chronometer stopped at 23:44:12. Inside the double-casing is an etched microfiche inscription: "Vance-Cross Aerospace Corp, Serial 2019-Alpha".',
      keywords: ['CHRONOMETER-TIMESTAMP', 'VANCE-CROSS-2019', 'PROVENANCE']
    },
    {
      id: '99-for-04',
      title: 'Tachyon Residue Spectrogram',
      type: 'FORENSIC',
      node: 3, // Temporal Vault
      text: 'Spectral reading reveals the murder weapon fired an acoustic harmonic pulse calibrated precisely to 432 Hz, dissolving cellular marrow.',
      keywords: ['RESONANCE-432HZ', 'CELLULAR-DISINTEGRATION', 'WEAPON-SIGNATURE']
    },
    {
      id: '99-for-05',
      title: 'Vault Inner Control Console Memory',
      type: 'FORENSIC',
      node: 3, // Temporal Vault
      text: 'The console was triggered using Maya Lin’s biometric keycard, followed immediately by an external override code entered from the Director\'s Office.',
      keywords: ['DUAL-KEY-PROTOCOL', 'DIRECTOR-OFFICE', 'CONSOLE-LOG']
    }
  ],

  // ==========================================================================
  // 2019 ERA DECK (The Archivist) - 30 Cards
  // ==========================================================================
  deck2019: [
    // Items
    {
      id: '19-item-01',
      title: 'Quantum Decryption Rig',
      type: 'ITEM',
      node: 5, // Security Hub
      text: 'Portable supercomputing terminal capable of cracking 40-year-old encrypted magnetic reels and bypassing digital locks.',
      keywords: ['DECRYPTION-RIG', 'QUANTUM-BYPASS'],
      canPlant: false
    },
    {
      id: '19-item-02',
      title: 'Ground-Penetrating Sub-Scanner',
      type: 'ITEM',
      node: 4, // Courtyard
      text: 'Subsurface scanner detecting metallic and crystalline density signatures buried deep beneath concrete slabs.',
      keywords: ['CISTERN-DRAIN', 'SUBSURFACE-RADAR'],
      canPlant: false
    },
    {
      id: '19-item-03',
      title: 'Declassified 40-Year Cold Case Dossier',
      type: 'ITEM',
      node: 2, // Director's Office
      text: 'The complete FBI and Vance-Cross corporate investigation files on the unsolved 1999 millennium murder.',
      keywords: ['COLD-CASE-DOSSIER', 'DEEP-ARCHIVE'],
      canPlant: false
    },

    // Clues
    {
      id: '19-clue-01',
      title: 'Corporate SEC Filings: Vance-Cross Aerospace',
      type: 'CLUE',
      node: 2, // Director's Office
      text: 'In January 2000, Valerie Cross registered exclusive ownership of Project Ouroboros patents, netting over $4.2 billion in defense contracts.',
      keywords: ['VALERIE-CROSS', 'CORPORATE-ACQUISITION', 'PATENT-THEFT']
    },
    {
      id: '19-clue-02',
      title: 'Demolition Survey of Prometheus Facility',
      type: 'CLUE',
      node: 4, // Courtyard
      text: 'In 2002, the courtyard drainage cistern was permanently encased in 50 tons of reinforced concrete by order of Chairwoman Cross.',
      keywords: ['CISTERN-DRAIN', 'CONCRETE-ENCASING']
    },
    {
      id: '19-clue-03',
      title: 'Psychiatric Records: Dr. Marcus Rowe (2008)',
      type: 'CLUE',
      node: 5, // Security Hub
      text: 'Rowe died in hospice care in 2008. His final words: "Valerie stole the core... she used Maya’s hand on the glass... Julian came back from the future and she killed him."',
      keywords: ['MARCUS-ROWE', 'VALERIE-CROSS', 'MAYA-LIN']
    },
    {
      id: '19-clue-04',
      title: 'Forensic Re-evaluation: Cold Case #99-0414',
      type: 'CLUE',
      node: 1, // Laboratory
      text: 'Modern mass spectrometry on Vance\'s remains reveals cellular aging identical to a 72-year-old man who traveled backwards through a tachyon rift.',
      keywords: ['CELLULAR-DISINTEGRATION', 'AGE-ANOMALY', 'TEMPORAL-FLIGHT']
    },
    {
      id: '19-clue-05',
      title: 'Patent Specification #US-2019-9941',
      type: 'CLUE',
      node: 2, // Director's Office
      text: 'Weapon Title: "Dual-Harmonic Directed Tachyon Emitter". Patent Holder: Valerie Cross. Notes that firing requires a 1979 resonant base frequency.',
      keywords: ['RESONANCE-432HZ', 'DISPLACEMENT-CORE', 'VALERIE-CROSS']
    },
    {
      id: '19-clue-06',
      title: 'Missing Person Investigation: Dr. Maya Lin',
      type: 'CLUE',
      node: 3, // Temporal Vault
      text: 'Maya Lin was officially declared dead in the 1979 explosion, but no death certificate was ever signed. Her personal bank account was accessed in 1999.',
      keywords: ['MAYA-LIN', 'STAGED-EXPLOSION', 'BIOMETRIC-ENCRYPTION']
    },

    // Events
    {
      id: '19-event-01',
      title: 'Timeline Quake Shockwave',
      type: 'EVENT',
      node: 3, // Temporal Vault
      text: 'Temporal feedback shakes the 2019 ruins. Reduce Chronal Stability by 1 immediately.',
      keywords: ['TIMELINE-QUAKE']
    },
    {
      id: '19-event-02',
      title: 'Corporate Firewall Lockout',
      type: 'EVENT',
      node: 5, // Security Hub
      text: 'Vance-Cross automated security detects archival intrusion. Next DECRYPT action costs +1 AP.',
      keywords: ['FIREWALL-INTRUSION']
    }
  ],

  // ==========================================================================
  // 2019 REVELATION DECK (5 Cards - Drawn via SYNTHESIZE using Keyword Pairs)
  // ==========================================================================
  revelations2019: [
    {
      id: 'REV-01',
      title: 'REVELATION: THE DUAL-HARMONIC TRIGGER',
      keywords: ['RESONANCE-432HZ'],
      requiredKeywords: ['RESONANCE-432HZ'],
      text: 'CRITICAL INTEL: The murder weapon was NOT fired from a handheld trigger! It was pre-configured inside the 1979 power conduit and armed via external terminal at 432 Hz. The killer utilized the facility itself as the weapon.',
      proves: 'WEAPON_MECHANISM'
    },
    {
      id: 'REV-02',
      title: 'REVELATION: THE AGE ANOMALY SOLVED',
      keywords: ['CELLULAR-DISINTEGRATION', 'AGE-ANOMALY'],
      requiredKeywords: ['CELLULAR-DISINTEGRATION', 'AGE-ANOMALY'],
      text: 'CRITICAL INTEL: The victim in 1999 was Julian Vance from the year 2019! Vance escaped into the future in 1979, lived 20 years in exile, and returned to 1999 to shut down the project. The killer executed his future self to prevent him from closing the loop!',
      proves: 'VICTIM_IDENTITY'
    },
    {
      id: 'REV-03',
      title: 'REVELATION: THE HARVESTED PALM',
      keywords: ['BIOMETRIC-ENCRYPTION'],
      requiredKeywords: ['BIOMETRIC-ENCRYPTION'],
      text: 'CRITICAL INTEL: Dr. Maya Lin did not die in 1979. She was murdered in cold blood by Valerie Cross on the night of the millennium to harvest her severed palm, the only key capable of deadbolting the inner Vault!',
      proves: 'ACCOMPLICE_ELIMINATION'
    },
    {
      id: 'REV-04',
      title: 'REVELATION: THE CISTERN DISPOSAL ROUTE',
      keywords: ['DISPLACEMENT-CORE'],
      requiredKeywords: ['DISPLACEMENT-CORE'],
      text: 'CRITICAL INTEL: Valerie Cross dumped the unfired Displacement Core into the courtyard cistern immediately after the murder. In 1999 it can be recovered if 1979 drained the basin, proving Cross held the weapon core!',
      proves: 'PHYSICAL_EVIDENCE'
    },
    {
      id: 'REV-05',
      title: 'REVELATION: THE BILLION-DOLLAR BETRAYAL',
      keywords: ['CORPORATE-ACQUISITION', 'PATENT-THEFT'],
      requiredKeywords: ['CORPORATE-ACQUISITION', 'PATENT-THEFT'],
      text: 'CRITICAL INTEL: Valerie Cross planned the assassination for over twenty years to monopolize Project Ouroboros. Her Swiss wiretaps, bloodstained coat, and size-7 footprints definitively establish her as the sole culprit!',
      proves: 'CULPRIT_AND_MOTIVE'
    }
  ]
};
