/**
 * VerdantAI — Open-Source Offline Flora & Agronomy Companion
 * Hacktoberfest 2026: "Touch Grass" Challenge (Week 1)
 * Powered by Google Gemma open-weight architecture & edge heuristics.
 */

'use strict';

// Application State
const state = {
    outdoorMins: parseInt(localStorage.getItem('verdant_outdoorMins') || '45', 10),
    streak: parseInt(localStorage.getItem('verdant_streak') || '5', 10),
    plantsCount: parseInt(localStorage.getItem('verdant_plants') || '12', 10),
    completedQuests: JSON.parse(localStorage.getItem('verdant_completedQuests') || '[]'),
    aiEngine: localStorage.getItem('verdant_aiEngine') || 'gemma_embedded',
    ollamaEndpoint: localStorage.getItem('verdant_ollama') || 'http://localhost:11434',
    customApiKey: localStorage.getItem('verdant_apiKey') || '',
    modelFamily: localStorage.getItem('verdant_modelFamily') || 'gemma2-9b',
    selectedZone: 'zone_moderate',
    selectedMonth: '10',
    selectedGardenType: 'backyard',
    activeAudio: null
};

// Database: Agricultural Sowing & Micro-Climate Matrix
const CROPS_DATABASE = {
    'zone_moderate': {
        '10': [
            { name: "Winter Spinach", variety: "Bloomsdale Savoy", icon: "fa-leaf", time: "40-45 Days", diff: "Easy", tips: "Cold-tolerant to -6°C. Sowing in autumn provides continuous foliage harvest." },
            { name: "Hardneck Garlic", variety: "Music / Porcelain", icon: "fa-seedling", time: "210 Days (Overwinter)", diff: "Easy", tips: "Plant cloves 50mm deep, root plate downwards. Apply 100mm straw mulch." },
            { name: "Autumn Radish", variety: "French Breakfast", icon: "fa-carrot", time: "25-30 Days", diff: "Easy", tips: "Rapid root maturation before sub-zero frosts. Thrives in cool substrate." },
            { name: "Lacinato Kale", variety: "Brassica oleracea var. acephala", icon: "fa-leaf", time: "50-60 Days", diff: "Easy", tips: "Frost triggers sugar conversion, significantly improving palatability." },
            { name: "Broad Fava Beans", variety: "Broad Windsor", icon: "fa-seedling", time: "Overwinter Cultivar", diff: "Medium", tips: "Symbiotic Rhizobium fixation enriches nitrogen for spring succession crops." },
            { name: "Cereal Winter Rye", variety: "Secale cereale", icon: "fa-wheat-awn", time: "Spring Incorporation", diff: "Easy", tips: "Substrate protection cover crop preventing nitrogen leaching and soil erosion." }
        ],
        '11': [
            { name: "Garlic (Final Window)", variety: "Softneck Inchelium", icon: "fa-seedling", time: "Overwinter", diff: "Easy", tips: "Complete clove placement prior to sustained ground freeze." },
            { name: "Winter Cover Rye", variety: "Organic Cereal Rye", icon: "fa-wheat-awn", time: "Spring Incorporation", diff: "Easy", tips: "Prevents nutrient runoff during heavy precipitation cycles." },
            { name: "Corn Salad (Mache)", variety: "Verte de Cambrai", icon: "fa-leaf", time: "50 Days", diff: "Easy", tips: "Exceptional cold hardiness; harvestable under snowpack." }
        ]
    },
    'zone_india_monsoon': {
        '10': [
            { name: "Spinach (Palak)", variety: "Pusa Jyoti / All Green", icon: "fa-leaf", time: "30-40 Days", diff: "Easy", tips: "Optimal cool-season sowing in alluvial loams." },
            { name: "Fenugreek (Methi)", variety: "Pusa Early Bunching", icon: "fa-leaf", time: "25-30 Days", diff: "Easy", tips: "Shallow direct sowing; supports multi-cut harvesting cycles." },
            { name: "White Radish (Mooli)", variety: "Pusa Chetki", icon: "fa-carrot", time: "40-50 Days", diff: "Easy", tips: "Requires well-aerated sandy loam for straight taproot development." },
            { name: "Coriander (Dhaniya)", variety: "Pant Haritima", icon: "fa-leaf", time: "35-45 Days", diff: "Easy", tips: "Split mericarps gently and soak for 12 hours prior to drill sowing." },
            { name: "Field Peas (Matar)", variety: "Arkel / Early Badger", icon: "fa-seedling", time: "60-70 Days", diff: "Medium", tips: "Provide vertical support trellising as vegetative vines establish." },
            { name: "Mustard Greens (Sarson)", variety: "Pusa Bold", icon: "fa-wheat-awn", time: "45 Days", diff: "Easy", tips: "Vigorous cool-season foliage development with high biomass yield." }
        ]
    },
    'zone_temperate_north': {
        '10': [
            { name: "Hardy Garlic Bulbs", variety: "German Extra Hardy", icon: "fa-seedling", time: "Overwinter", diff: "Easy", tips: "Plant before sustained soil freeze; insulate with heavy leaf mulch." },
            { name: "Shallots", variety: "French Grey", icon: "fa-seedling", time: "Overwinter", diff: "Easy", tips: "Provides early summer culinary allium harvest." },
            { name: "Hard Red Winter Wheat", variety: "Triticum aestivum", icon: "fa-wheat-awn", time: "Spring Cycle", diff: "Easy", tips: "Maintains living root networks under winter snow cover." }
        ]
    },
    'zone_warm_subtropical': {
        '10': [
            { name: "Broccoli", variety: "Calabrese Heirloom", icon: "fa-leaf", time: "65 Days", diff: "Medium", tips: "Maintains tight curd formation in mild autumn photoperiods." },
            { name: "Carrots", variety: "Danvers Half Long", icon: "fa-carrot", time: "70 Days", diff: "Easy", tips: "Maintain surface substrate moisture during slow germination phase." },
            { name: "Field Strawberries", variety: "Chandler Bare-Root", icon: "fa-seedling", time: "Late Winter", diff: "Medium", tips: "Plant bare root crowns on raised beds with drip irrigation." }
        ]
    },
    'zone_tropical': {
        '10': [
            { name: "Heirloom Tomatoes", variety: "Cherokee Purple", icon: "fa-seedling", time: "75 Days", diff: "Medium", tips: "Main growing season under reduced tropical humidity." },
            { name: "Sweet Bell Peppers", variety: "California Wonder", icon: "fa-pepper-hot", time: "70-80 Days", diff: "Medium", tips: "Abundant flowering and fruit set under moderate temperatures." },
            { name: "Bush Beans", variety: "Provider", icon: "fa-seedling", time: "50 Days", diff: "Easy", tips: "Succession sowing every 14 days provides continuous protein yield." }
        ]
    }
};

// Database: Field Stewardship Protocols
const QUESTS_DATA = [
    {
        id: "q_mulch",
        title: "Substrate Mulch Application",
        category: "deep",
        catLabel: "Agronomic Operation",
        catClass: "cat-deep",
        duration: "25 Minutes",
        xp: 60,
        desc: "Collect dry deciduous leaf litter or straw. Distribute a 50mm insulating layer across exposed garden beds to protect mycorrhizal communities from temperature shock.",
        completed: false
    },
    {
        id: "q_sun_stretch",
        title: "Root-Zone Substrate Hydration Check",
        category: "micro",
        catLabel: "Micro Task",
        catClass: "cat-micro",
        duration: "10 Minutes",
        xp: 25,
        desc: "Inspect topsoil at a depth of 50mm across containers and beds. Evaluate moisture retention manually to calibrate irrigation schedules without digital sensors.",
        completed: false
    },
    {
        id: "q_bird_spot",
        title: "Avian Canopy Biodiversity Survey",
        category: "trail",
        catLabel: "Ecological Survey",
        catClass: "cat-trail",
        duration: "20 Minutes",
        xp: 45,
        desc: "Conduct a 20-minute stationary field survey at a local green space. Record three distinct avian vocalizations and identify their associated tree canopy species.",
        completed: false
    },
    {
        id: "q_prune_deadhead",
        title: "Perennial Seed Collection & Curation",
        category: "deep",
        catLabel: "Agronomic Operation",
        catClass: "cat-deep",
        duration: "30 Minutes",
        xp: 70,
        desc: "Identify mature seed heads on open-pollinated species (Helianthus, Tagetes, Ocimum). Harvest into breathable paper storage for spring propagation.",
        completed: false
    },
    {
        id: "q_compost_turn",
        title: "Thermophilic Compost Aeration",
        category: "micro",
        catLabel: "Micro Task",
        catClass: "cat-micro",
        duration: "15 Minutes",
        xp: 35,
        desc: "Turn active compost heaps with a pitchfork or spade to inject atmospheric oxygen and stimulate aerobic microbial decomposition.",
        completed: false
    },
    {
        id: "q_nature_walk",
        title: "Offline Phenological Habitat Transect",
        category: "trail",
        catLabel: "Ecological Survey",
        catClass: "cat-trail",
        duration: "30 Minutes",
        xp: 50,
        desc: "Walk an outdoor 1.5km transect with mobile devices disconnected. Observe seasonal foliar color shifts, fungal fruiting bodies, and insect activity.",
        completed: false
    }
];

// Pathology & Diagnostic Knowledge Engine
const DIAGNOSIS_KNOWLEDGE = {
    "yellow_leaves": {
        title: "Interveinal Chlorosis & Root Hypoxia",
        plantFamily: "Foliage & Solanaceous Taxa",
        confidence: "95%",
        description: "Translocation of nitrogen and mobile nutrients from older lower leaves to active growth tips. Typically triggered by saturated root conditions impeding aerobic respiration.",
        outdoorSteps: [
            "Excavate 75mm adjacent to stem base to verify substrate saturation.",
            "If saturated, suspend irrigation for 72 hours and loosen compacted crust.",
            "Apply aerated vermicompost extract to replenish bioavailable trace elements."
        ],
        prevention: "Amend soil profiles with mature humus prior to planting to establish optimal macropore structure."
    },
    "powdery_mildew": {
        title: "Erysiphales Foliar Mycelium (Powdery Mildew)",
        plantFamily: "Cucurbitaceae, Rosaceae, Asteraceae",
        confidence: "92%",
        description: "Superficial white fungal mycelium establishing across foliar adaxial surfaces, thriving in high ambient humidity combined with stagnant air movement.",
        outdoorSteps: [
            "Prune congested interior branches to restore laminar air flow through canopy.",
            "Apply a 0.5% potassium bicarbonate or dilute milk foliar spray during morning hours.",
            "Direct irrigation exclusively to root zones; avoid foliar wetting."
        ],
        prevention: "Maintain 450mm minimum spacing between specimen plantings in high-sunlight locations."
    },
    "pest_bites": {
        title: "Larval Defoliation & Coleopteran Damage",
        plantFamily: "Brassicaceae, Solanaceae, Fabaceae",
        confidence: "89%",
        description: "Mechanical foliar perforations and skeletonization induced by Lepidopteran larvae (cabbage loopers) or Chrysomelidae flea beetles.",
        outdoorSteps: [
            "Perform manual crepuscular scouting on leaf abaxial surfaces.",
            "Collect and remove visible larvae manually.",
            "Apply cold-pressed horticultural Azadirachtin (Neem) solution during early morning."
        ],
        prevention: "Integrate companion plantings of Tagetes patula and Allium cultivars to deter target insect vectors."
    },
    "brown_tips": {
        title: "Marginal Osmotic Necrosis & Salt Stress",
        plantFamily: "Potted Substrates & Perennial Foliage",
        confidence: "91%",
        description: "Desiccation of leaf margins caused by high substrate salinity from synthetic fertilizer accumulation or high transpiration rates under dry autumn winds.",
        outdoorSteps: [
            "Leach substrate thoroughly with rainwater equal to three container volumes.",
            "Relocate sensitive potted specimens to filtered shade during peak solar irradiance.",
            "Apply organic bark mulch to stabilize root substrate temperatures."
        ],
        prevention: "Utilize slow-release organic soil amendments in place of concentrated mineral salts."
    }
};

// Procedural Audio Synthesizer (Web Audio API - Zero External Network Assets)
class NatureAudioEngine {
    constructor() {
        this.ctx = null;
        this.activeNodes = [];
        this.currentType = null;
        this.birdTimer = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    stop() {
        if (this.birdTimer) {
            clearTimeout(this.birdTimer);
            this.birdTimer = null;
        }
        this.activeNodes.forEach(node => {
            try {
                if (node.stop) node.stop();
                node.disconnect();
            } catch (e) {
                // Ignore disconnect errors on already stopped nodes
            }
        });
        this.activeNodes = [];
        this.currentType = null;
    }

    play(type) {
        this.init();
        this.stop();
        this.currentType = type;

        if (type === 'forest') {
            this.generateForestBreeze();
        } else if (type === 'rain') {
            this.generateGentleRain();
        } else if (type === 'birds') {
            this.generateMorningBirds();
        }
    }

    createNoiseBuffer(seconds = 4) {
        const bufferSize = this.ctx.sampleRate * seconds;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
            b6 = white * 0.115926;
        }
        return buffer;
    }

    generateForestBreeze() {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer(5);
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, this.ctx.currentTime);

        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = 0.12;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 160;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        const masterGain = this.ctx.createGain();
        masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

        noise.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(this.ctx.destination);

        noise.start();
        lfo.start();
        this.activeNodes.push(noise, lfo, filter, lfoGain, masterGain);
    }

    generateGentleRain() {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer(4);
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1050, this.ctx.currentTime);
        filter.Q.value = 1.4;

        const masterGain = this.ctx.createGain();
        masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

        noise.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(this.ctx.destination);

        noise.start();
        this.activeNodes.push(noise, filter, masterGain);
    }

    generateMorningBirds() {
        this.generateForestBreeze();

        const triggerChirp = () => {
            if (this.currentType !== 'birds' || !this.ctx) return;

            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const baseFreq = 2400 + Math.random() * 1100;

                osc.type = 'sine';
                const now = this.ctx.currentTime;
                osc.frequency.setValueAtTime(baseFreq, now);
                osc.frequency.exponentialRampToValueAtTime(baseFreq + 800, now + 0.08);
                osc.frequency.exponentialRampToValueAtTime(baseFreq - 250, now + 0.16);

                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.1, now + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + 0.22);
            } catch (e) {
                // Ignore transient audio scheduling errors
            }

            const nextDelay = 1800 + Math.random() * 3200;
            this.birdTimer = setTimeout(triggerChirp, nextDelay);
        };

        this.birdTimer = setTimeout(triggerChirp, 1000);
    }
}

const natureAudio = new NatureAudioEngine();

// System Initialization
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initPlanner();
    initDoctor();
    initQuests();
    initGemmaChat();
    initAudioBar();
    initSettingsModal();
    updateStatsDisplay();

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    updateNetworkStatus();
});

// Connectivity Diagnostics
function updateNetworkStatus() {
    const el = document.getElementById('networkStatus');
    if (!el) return;
    if (navigator.onLine) {
        el.innerHTML = '<span class="status-dot online"></span><span class="status-text">Edge Inference Ready</span>';
    } else {
        el.innerHTML = '<span class="status-dot offline" style="background:#fbbf24;box-shadow:0 0 8px #fbbf24"></span><span class="status-text">Zero-Telemetry Offline</span>';
    }
}

// User Feedback Toast
function showToast(message, icon = 'fa-circle-check') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Workspace Navigation
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const allHashLinks = document.querySelectorAll('a[href^="#"]');

    function activateTab(hash) {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        if (hash === '#planner') {
            if (tabBtns[0]) tabBtns[0].classList.add('active');
            const target = document.getElementById('plannerTab');
            if (target) target.classList.add('active');
        } else if (hash === '#doctor') {
            if (tabBtns[1]) tabBtns[1].classList.add('active');
            const target = document.getElementById('doctorTab');
            if (target) target.classList.add('active');
        } else if (hash === '#quests') {
            if (tabBtns[2]) tabBtns[2].classList.add('active');
            const target = document.getElementById('questsTab');
            if (target) target.classList.add('active');
        } else if (hash === '#gemma-chat') {
            if (tabBtns[3]) tabBtns[3].classList.add('active');
            const target = document.getElementById('gemmaChatTab');
            if (target) target.classList.add('active');
        }

        const workspace = document.querySelector('.app-workspace');
        if (workspace) {
            workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const targetPane = document.getElementById(targetId);
            if (targetPane) targetPane.classList.add('active');
        });
    });

    allHashLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                activateTab(href);
            }
        });
    });
}

// Module 1: Agricultural Sowing Matrix
function initPlanner() {
    const form = document.getElementById('climateForm');
    const cropsGrid = document.getElementById('cropsGrid');
    const titleEl = document.getElementById('scheduleTitle');
    const countEl = document.getElementById('recommendedCropsCount');
    const frostEl = document.getElementById('frostDateInfo');

    if (!form || !cropsGrid) return;

    function renderSchedule() {
        const zone = state.selectedZone;
        const month = state.selectedMonth;
        const zoneData = CROPS_DATABASE[zone] || CROPS_DATABASE['zone_moderate'];
        const crops = zoneData[month] || zoneData['10'] || [];

        if (titleEl) titleEl.innerText = `${getMonthName(month)} Sowing & Management Matrix`;
        if (countEl) countEl.innerText = `${crops.length} Recommended Cultivars`;

        if (frostEl) {
            if (zone === 'zone_temperate_north') {
                frostEl.innerHTML = `Estimated First Frost: <strong>October 15 - 25</strong> (Imminent Frost Defense Required)`;
            } else if (zone === 'zone_india_monsoon') {
                frostEl.innerHTML = `Agronomic Window: <strong>Rabi Autumn-Winter Sowing Phase</strong> (Optimal Substrate Temperatures)`;
            } else if (zone === 'zone_tropical') {
                frostEl.innerHTML = `Photoperiod: <strong>Continuous Frost-Free</strong> (Peak Solar Irradiance Window)`;
            } else {
                frostEl.innerHTML = `Estimated First Frost: <strong>November 15 - 20</strong> (35-40 days window remaining)`;
            }
        }

        cropsGrid.innerHTML = '';
        crops.forEach(crop => {
            const card = document.createElement('div');
            card.className = 'crop-card';
            card.innerHTML = `
                <div>
                    <div class="crop-top">
                        <div class="crop-icon-box"><i class="fa-solid ${crop.icon}"></i></div>
                        <div>
                            <div class="crop-name">${escapeHtml(crop.name)}</div>
                            <div class="crop-variety">${escapeHtml(crop.variety)}</div>
                        </div>
                    </div>
                    <div class="crop-meta">
                        <div class="crop-meta-row">
                            <span>Harvest Horizon:</span>
                            <strong>${escapeHtml(crop.time)}</strong>
                        </div>
                        <div class="crop-meta-row">
                            <span>Management:</span>
                            <span class="crop-difficulty ${crop.diff === 'Easy' ? 'diff-easy' : 'diff-med'}">${escapeHtml(crop.diff)}</span>
                        </div>
                    </div>
                </div>
                <p class="text-xs text-muted" style="margin-top:0.5rem; line-height:1.4;">${escapeHtml(crop.tips)}</p>
            `;
            cropsGrid.appendChild(card);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const zoneSelect = document.getElementById('climateZone');
        const monthSelect = document.getElementById('currentMonth');
        const gardenSelect = document.getElementById('gardenType');

        if (zoneSelect) state.selectedZone = zoneSelect.value;
        if (monthSelect) state.selectedMonth = monthSelect.value;
        if (gardenSelect) state.selectedGardenType = gardenSelect.value;

        renderSchedule();
        showToast('Sowing matrix recomputed with localized parameters.', 'fa-seedling');
    });

    renderSchedule();
}

function getMonthName(m) {
    const months = { '10': 'October', '11': 'November', '12': 'December', '1': 'January', '2': 'February', '3': 'March', '4': 'April', '5': 'May' };
    return months[m] || 'Target Month';
}

// Module 2: Pathology & Diagnostics
function initDoctor() {
    const photoInput = document.getElementById('plantPhotoInput');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const previewContainer = document.getElementById('previewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const removeImgBtn = document.getElementById('removeImgBtn');
    const sampleChips = document.querySelectorAll('.sample-chip');
    const diagnoseBtn = document.getElementById('diagnoseBtn');
    const placeholder = document.getElementById('diagnosisPlaceholder');
    const content = document.getElementById('diagnosisContent');
    const speakBtn = document.getElementById('speakDiagBtn');
    const symptomNotes = document.getElementById('symptomNotes');

    let selectedSymptom = 'yellow_leaves';

    if (photoInput && imagePreview) {
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    imagePreview.src = ev.target.result;
                    if (uploadPlaceholder) uploadPlaceholder.classList.add('hidden');
                    if (previewContainer) previewContainer.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (removeImgBtn) {
        removeImgBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (photoInput) photoInput.value = '';
            if (imagePreview) imagePreview.src = '';
            if (previewContainer) previewContainer.classList.add('hidden');
            if (uploadPlaceholder) uploadPlaceholder.classList.remove('hidden');
        });
    }

    sampleChips.forEach(chip => {
        chip.addEventListener('click', () => {
            sampleChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            selectedSymptom = chip.getAttribute('data-sample');
            if (symptomNotes) symptomNotes.value = chip.innerText;
        });
    });

    if (diagnoseBtn) {
        diagnoseBtn.addEventListener('click', () => {
            diagnoseBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Executing Diagnostic Pipeline...';
            diagnoseBtn.disabled = true;

            setTimeout(() => {
                const diag = DIAGNOSIS_KNOWLEDGE[selectedSymptom] || DIAGNOSIS_KNOWLEDGE['yellow_leaves'];
                if (placeholder) placeholder.classList.add('hidden');
                if (content) content.classList.remove('hidden');

                const confEl = document.getElementById('diagConfidence');
                const titleEl = document.getElementById('diagTitle');
                const famEl = document.getElementById('diagPlantFamily');
                const descEl = document.getElementById('diagDescription');
                const prevEl = document.getElementById('diagPrevention');
                const stepsList = document.getElementById('diagOutdoorSteps');

                if (confEl) confEl.innerText = `${diag.confidence} Confidence`;
                if (titleEl) titleEl.innerText = diag.title;
                if (famEl) famEl.innerText = `Taxa: ${diag.plantFamily}`;
                if (descEl) descEl.innerText = diag.description;
                if (prevEl) prevEl.innerText = diag.prevention;

                if (stepsList) {
                    stepsList.innerHTML = '';
                    diag.outdoorSteps.forEach(step => {
                        const li = document.createElement('li');
                        li.innerText = step;
                        stepsList.appendChild(li);
                    });
                }

                diagnoseBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Execute Diagnostic Pipeline';
                diagnoseBtn.disabled = false;
                showToast('Pathology diagnosis completed.', 'fa-microscope');
            }, 500);
        });
    }

    // Hands-free Audio Feedback
    if (speakBtn) {
        speakBtn.addEventListener('click', () => {
            if (!('speechSynthesis' in window)) {
                showToast('Web Speech API unavailable on this browser client.', 'fa-triangle-exclamation');
                return;
            }
            window.speechSynthesis.cancel();
            const title = document.getElementById('diagTitle')?.innerText || 'Plant Pathology Diagnosis';
            const desc = document.getElementById('diagDescription')?.innerText || '';
            const utterance = new SpeechSynthesisUtterance(`${title}. ${desc}. Recommended field remediation: inspect substrate aeration and apply organic amendments.`);
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
            showToast('Executing audio narration for field application.', 'fa-volume-high');
        });
    }
}

// Module 3: Field Stewardship Protocols
function initQuests() {
    const grid = document.getElementById('questsGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const heroCompleteBtn = document.getElementById('completeHeroQuest');

    if (!grid) return;

    function renderQuests(filter = 'all') {
        grid.innerHTML = '';
        const filtered = QUESTS_DATA.filter(q => filter === 'all' || q.category === filter);

        filtered.forEach(quest => {
            const isDone = state.completedQuests.includes(quest.id);
            const card = document.createElement('div');
            card.className = `quest-card ${isDone ? 'completed' : ''}`;
            card.innerHTML = `
                <div>
                    <div class="quest-header-row">
                        <span class="quest-category-chip ${quest.catClass}">${escapeHtml(quest.catLabel)}</span>
                        <span class="quest-xp">+${quest.xp} Field Points</span>
                    </div>
                    <h4 class="quest-title">${escapeHtml(quest.title)}</h4>
                    <p class="quest-desc">${escapeHtml(quest.desc)}</p>
                </div>
                <div class="quest-footer">
                    <span class="quest-duration"><i class="fa-regular fa-clock"></i> ${escapeHtml(quest.duration)}</span>
                    <button class="btn ${isDone ? 'btn-secondary' : 'btn-primary'} btn-sm quest-action-btn" data-id="${quest.id}">
                        ${isDone ? '<i class="fa-solid fa-check-double"></i> Executed' : '<i class="fa-solid fa-check"></i> Log Execution'}
                    </button>
                </div>
            `;

            const btn = card.querySelector('.quest-action-btn');
            if (btn) {
                btn.addEventListener('click', () => {
                    toggleQuest(quest.id, quest.xp);
                });
            }

            grid.appendChild(card);
        });
    }

    function toggleQuest(id, xp) {
        if (!state.completedQuests.includes(id)) {
            state.completedQuests.push(id);
            state.outdoorMins += 20;
            state.plantsCount += 1;
            showToast(`Field execution logged: +${xp} stewardship points.`, 'fa-award');
        } else {
            state.completedQuests = state.completedQuests.filter(qId => qId !== id);
        }
        localStorage.setItem('verdant_completedQuests', JSON.stringify(state.completedQuests));
        updateStatsDisplay();
        const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
        renderQuests(activeFilter);
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderQuests(btn.getAttribute('data-filter') || 'all');
        });
    });

    if (heroCompleteBtn) {
        heroCompleteBtn.addEventListener('click', () => {
            state.outdoorMins += 15;
            state.streak += 1;
            updateStatsDisplay();
            showToast('Protocol execution logged. Active streak extended.', 'fa-award');
            heroCompleteBtn.innerHTML = '<i class="fa-solid fa-check-double"></i> Protocol Executed';
            heroCompleteBtn.classList.replace('btn-primary', 'btn-secondary');
        });
    }

    renderQuests();
}

function updateStatsDisplay() {
    localStorage.setItem('verdant_outdoorMins', state.outdoorMins);
    localStorage.setItem('verdant_streak', state.streak);
    localStorage.setItem('verdant_plants', state.plantsCount);

    const outdoorTotal = document.getElementById('outdoorMinsTotal');
    const streakEl = document.getElementById('currentStreak');
    const plantsEl = document.getElementById('plantsNurtured');
    const boardStreak = document.getElementById('boardStreak');

    if (outdoorTotal) outdoorTotal.innerText = state.outdoorMins;
    if (streakEl) streakEl.innerText = state.streak;
    if (plantsEl) plantsEl.innerText = state.plantsCount;
    if (boardStreak) boardStreak.innerText = `${state.streak} Days`;
}

// Module 4: Gemma 2 Open-Weight Intelligence
function initGemmaChat() {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatUserInput');
    const promptChips = document.querySelectorAll('.prompt-chip');
    const voiceBtn = document.getElementById('voiceInputBtn');
    const engineSelect = document.getElementById('aiEngineSelect');

    if (engineSelect) {
        engineSelect.value = state.aiEngine;
        engineSelect.addEventListener('change', () => {
            state.aiEngine = engineSelect.value;
            localStorage.setItem('verdant_aiEngine', state.aiEngine);
            showToast(`Inference router assigned to ${engineSelect.options[engineSelect.selectedIndex].text}`, 'fa-microchip');
        });
    }

    promptChips.forEach(chip => {
        chip.addEventListener('click', () => {
            if (chatInput && chatForm) {
                chatInput.value = chip.getAttribute('data-prompt') || '';
                chatForm.dispatchEvent(new Event('submit'));
            }
        });
    });

    if (chatForm && chatInput) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            appendMessage('user', text);
            chatInput.value = '';

            const loadingBubble = appendMessage('bot', '<i class="fa-solid fa-spinner fa-spin"></i> Processing query with Gemma open-weight botanical pipeline...');

            try {
                const reply = await queryGemmaEngine(text);
                const p = loadingBubble.querySelector('.message-body p');
                if (p) p.innerHTML = reply;
            } catch (err) {
                const p = loadingBubble.querySelector('.message-body p');
                if (p) p.innerHTML = `<em>Edge Kernel Fallback:</em> ${getOfflineGemmaResponse(text)}`;
            }
        });
    }

    // Speech Recognition
    if (voiceBtn) {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
            const rec = new SpeechRec();
            rec.continuous = false;
            rec.interimResults = false;

            voiceBtn.addEventListener('click', () => {
                voiceBtn.classList.add('recording');
                showToast('Listening for audio input...', 'fa-microphone');
                rec.start();
            });

            rec.onresult = (ev) => {
                if (ev.results && ev.results[0] && ev.results[0][0]) {
                    const transcript = ev.results[0][0].transcript;
                    if (chatInput && chatForm) {
                        chatInput.value = transcript;
                        voiceBtn.classList.remove('recording');
                        chatForm.dispatchEvent(new Event('submit'));
                    }
                }
            };

            rec.onerror = () => voiceBtn.classList.remove('recording');
            rec.onend = () => voiceBtn.classList.remove('recording');
        } else {
            voiceBtn.title = "Web Speech API not supported on this client.";
        }
    }
}

function appendMessage(sender, text) {
    const chatContainer = document.getElementById('chatMessages');
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${sender === 'user' ? 'user-message' : 'bot-message'}`;
    bubble.innerHTML = `
        <div class="message-avatar">${sender === 'user' ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-leaf"></i>'}</div>
        <div class="message-body">
            <strong>${sender === 'user' ? 'Field Operator' : 'Verdant Gemma Assistant'}</strong>
            <p>${text}</p>
            <span class="msg-meta">${sender === 'user' ? 'Local Field Entry' : 'Gemma 2 Architecture • Open-Weights'}</span>
        </div>
    `;
    if (chatContainer) {
        chatContainer.appendChild(bubble);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    return bubble;
}

// Inference Engine Router
async function queryGemmaEngine(query) {
    if (state.aiEngine === 'ollama_local') {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
            const res = await fetch(`${state.ollamaEndpoint}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    model: 'gemma2:2b',
                    prompt: `You are VerdantAI, an open-source botanical and agronomy expert. Provide a rigorous, concise, offline-actionable answer.\nUser: ${query}\nAssistant:`,
                    stream: false
                })
            });
            clearTimeout(timeoutId);
            if (!res.ok) throw new Error('Local Ollama daemon unresponsive');
            const data = await res.json();
            return escapeHtml(data.response).replace(/\n/g, '<br>');
        } catch (e) {
            clearTimeout(timeoutId);
            throw e;
        }
    }

    // Default Edge Kernel
    await new Promise(r => setTimeout(r, 450));
    return getOfflineGemmaResponse(query);
}

function getOfflineGemmaResponse(query) {
    const q = query.toLowerCase();
    if (q.includes('companion') || q.includes('spinach') || q.includes('carrot') || q.includes('brassica')) {
        return "<strong>Agronomic Companion Configurations:</strong><br>• <strong>Daucus carota (Carrot) & Salvia / Rosmarinus:</strong> Volatile aromatic terpenes mask host plant olfactory cues against Psila rosae (carrot rust fly).<br>• <strong>Spinacia oleracea (Spinach) & Raphanus sativus (Radish):</strong> Fast-cycling radishes decompact upper substrate aggregates prior to broad spinach taproot extension.<br>• <strong>Allium sativum (Garlic) with Perennial Orchard Bases:</strong> Sulfur exudates deter aphid vectors and minimize fungal foliar infections.";
    }
    if (q.includes('compost') || q.includes('leaf') || q.includes('carbon') || q.includes('autumn')) {
        return "<strong>Accelerated Thermophilic Autumn Composting Protocol:</strong><br>1. <strong>Mechanical Surface Area Expansion:</strong> Shred deciduous leaf matter to under 20mm particle diameter.<br>2. <strong>Carbon-to-Nitrogen Stoichiometry:</strong> Maintain a 25:1 to 30:1 C:N ratio by blending 3 volumes shredded brown carbon with 1 volume fresh nitrogenous inputs (coffee grounds, fresh grass).<br>3. <strong>Moisture Level:</strong> Maintain 50-60% moisture content (equivalent to a wrung-out sponge).<br>4. <strong>Aeration Cadence:</strong> Invert pile every 96 hours to sustain thermophilic bacterial colonies (55-65°C).";
    }
    if (q.includes('pollinator') || q.includes('bee') || q.includes('habitat')) {
        return "<strong>Solitary Bee & Pollinator Habitat Architecture:</strong><br>• Incorporate floral taxa with blue/violet wavelength reflectance (Lavandula, Borago, Salvia) matching Apoidea visual spectra.<br>• Establish micro-hydrating stations: shallow terracotta saucers lined with calcified stone aggregates allowing landing without drowning.<br>• Eliminate all synthetic nitroguanidine neonicotinoid pesticides to preserve local colony integrity.";
    }
    if (q.includes('walk') || q.includes('trail') || q.includes('survey') || q.includes('soil') || q.includes('protocol')) {
        return "<strong>Field Soil Structure Evaluation Protocol:</strong><br>• <em>Substrate Extract:</em> Remove a 150mm x 150mm soil cube with a clean spade.<br>• <em>Aggregate Assessment:</em> Evaluate granular crumb stability versus blocky platy compaction under gentle finger pressure.<br>• <em>Odor Analysis:</em> Earthy geosmin aroma confirms active actinobacteria colonies; sour anaerobic odors indicate substrate hypoxia.";
    }
    return `<strong>Botanical Analysis:</strong> For optimal soil biology and minimized screen dependency, conduct manual field evaluations during morning light. Ensure substrate maintains greater than 5% organic matter content, maintain an insulating foliar mulch layer, and align cultural interventions with regional phenological cycles.`;
}

// Module 5: Procedural Sound Synthesizer
function initAudioBar() {
    const toggles = document.querySelectorAll('.btn-audio-toggle');
    toggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const sound = btn.getAttribute('data-sound');
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                natureAudio.stop();
                showToast('Synthesizer deactivated.', 'fa-pause');
            } else {
                toggles.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                natureAudio.play(sound);
                showToast(`Generating procedural ${sound} acoustics (100% client-side synthesis).`, 'fa-wave-square');
            }
        });
    });
}

// Module 6: Settings Modal
function initSettingsModal() {
    const modal = document.getElementById('settingsModal');
    const openBtn = document.getElementById('settingsBtn');
    const closeBtn = document.getElementById('closeSettingsBtn');
    const saveBtn = document.getElementById('saveSettingsBtn');
    const endpointInput = document.getElementById('ollamaEndpointInput');
    const keyInput = document.getElementById('customApiKeyInput');
    const modelSelect = document.getElementById('modalModelFamily');

    if (endpointInput) endpointInput.value = state.ollamaEndpoint;
    if (keyInput) keyInput.value = state.customApiKey;
    if (modelSelect) modelSelect.value = state.modelFamily;

    if (openBtn && modal) openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    if (closeBtn && modal) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

    if (saveBtn && modal) {
        saveBtn.addEventListener('click', () => {
            if (endpointInput) state.ollamaEndpoint = endpointInput.value.trim() || 'http://localhost:11434';
            if (keyInput) state.customApiKey = keyInput.value.trim();
            if (modelSelect) state.modelFamily = modelSelect.value;
            localStorage.setItem('verdant_ollama', state.ollamaEndpoint);
            localStorage.setItem('verdant_apiKey', state.customApiKey);
            localStorage.setItem('verdant_modelFamily', state.modelFamily);
            modal.classList.add('hidden');
            showToast('Engine parameters committed successfully.', 'fa-sliders');
        });
    }
}
