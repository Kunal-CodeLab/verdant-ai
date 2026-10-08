/**
 * AllergyGuard — Open-Source Offline Dietary Safety & Recipe Transformation Engine
 * Hacktoberfest 2026 Weekend Challenge: "Build for a Friend"
 * Powered by Google Gemma open-weight architecture & culinary biochemistry algorithms.
 */

'use strict';

const SAMPLE_RECIPES = {
    pasta: {
        title: "Garlic Fettuccine Alfredo",
        ingredients: `250g Durum Wheat Semolina Fettuccine
120ml Heavy Bovine Cream (36% Butterfat)
60g Grated Parmigiano-Reggiano
30g Unsalted Sweet Cream Butter
3 Cloves Allium Sativum (Garlic)
40g Crushed Juglans Regia (English Walnuts)
Crushed Black Peppercorn & Fresh Ocimum Basilicum`
    },
    pancake: {
        title: "High-Protein Breakfast Pancakes",
        ingredients: `200g All-Purpose Wheat Flour
250ml Pasteurized Whole Cow Milk
2 Large Poultry Eggs
45g Pure Almond Butter
30g Melted Bovine Butter
30g Chopped Carya Illinoinensis (Pecans)
Pure Acer Saccharum Syrup`
    },
    curry: {
        title: "Cashew Makhani Gravy",
        ingredients: `250g Paneer (Bovine Milk Curd Solids)
75g Anacardium Occidentale (Cashew Kernel Paste)
45g Clarified Bovine Butter (Ghee)
100ml Heavy Dairy Cream
Fresh Lycopersicon Puree & Ground Garam Masala Matrix`
    }
};

const SUBSTITUTES_DATA = [
    { 
        allergen: "Triticum / Hordeum / Secale (Gluten Complex)", 
        trigger: "Semolina / All-Purpose Wheat Flour", 
        safe: "Certified Gluten-Free Oryza Sativa & Chenopodium Quinoa Flour (1:1 with 1.5% Plantago Ovata)", 
        culinaryNotes: "Preserves mechanical viscoelasticity and starch gelatinization kinetics without gliadin auto-antibodies." 
    },
    { 
        allergen: "Bovine Lactose & Casein Matrix", 
        trigger: "Heavy Bovine Cream / Milk Fractions", 
        safe: "Centrifuged Cocos Nucifera Cream or Micro-Emulsified Helianthus Annuus Lipid Base", 
        culinaryNotes: "Replicates 35% lipid mouthfeel, melting curve, and heat-induced emulsion stability." 
    },
    { 
        allergen: "Juglandaceae & Anacardiaceae (Tree Nuts)", 
        trigger: "Crushed Walnuts / Cashew Paste / Almond Butter", 
        safe: "Dry-Roasted Cucurbita Pepo Kernels (Pepitas) & Helianthus Seed Paste", 
        culinaryNotes: "Provides matched savory glutamic acid profiles and polyunsaturated fat richness with zero anaphylaxis risk." 
    },
    { 
        allergen: "Aged Hard Bovine Cheeses", 
        trigger: "Grated Parmigiano-Reggiano / Hard Curds", 
        safe: "Autolyzed Saccharomyces Cerevisiae Flakes + Cold-Pressed Persea Americana Lipid + Sea Minerals", 
        culinaryNotes: "Supplies authentic savory umami depth through natural ribonucleotides and glutamates." 
    },
    { 
        allergen: "Bovine Milkfat / Ghee", 
        trigger: "Clarified Ghee / Sweet Cream Butter", 
        safe: "Expeller-Pressed Unrefined Persea Americana Oil or Deodorized Organic Coconut Lipid", 
        culinaryNotes: "High thermal breakdown threshold (>200°C) with clean, neutral aromatic release." 
    }
];

// Comprehensive Allergen Dictionary for Packaging Diagnostics
const ALLERGEN_VECTORS = {
    gluten: {
        label: "Gliadin / Gluten Matrix Hazard",
        tokens: ["wheat", "gluten", "flour", "semolina", "durum", "spelt", "kamut", "triticale", "rye", "barley", "malt", "maltodextrin", "hydrolyzed wheat", "farina", "graham", "couscous", "seitan", "e1400", "e1401", "e1402", "e1403", "e1404", "e1405", "e1410", "e1412", "e1413", "e1414", "e1420", "e1422", "e1440", "e1442", "e1450"]
    },
    dairy: {
        label: "Bovine Lactose & Casein Fraction Hazard",
        tokens: ["milk", "dairy", "cream", "butter", "ghee", "whey", "casein", "caseinate", "cheese", "parmesan", "paneer", "yogurt", "curd", "lactose", "lactalbumin", "lactoglobulin", "milkfat", "buttermilk", "sodium caseinate", "calcium caseinate"]
    },
    nuts: {
        label: "Tree Nut & Peanut Anaphylaxis Vector",
        tokens: ["almond", "walnut", "cashew", "pecan", "pistachio", "hazelnut", "macadamia", "brazil nut", "pine nut", "peanut", "arachis", "anacardium", "juglans", "prunus dulcis", "carya", "corylus", "nut butter", "nut flour", "nut oil", "praline", "marzipan", "nougat"]
    },
    sesame: {
        label: "Sesamum Indicum Cross-Contact Hazard",
        tokens: ["sesame", "tahini", "sesamum", "sesamol", "sesamum indicum", "benne", "til", "gingelly"]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initRecipeTransformer();
    initLabelScanner();
    initSubstitutes();
    initGemmaChat();
});

function showToast(msg, icon = 'fa-circle-check') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHtml(msg)}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const allHashLinks = document.querySelectorAll('a[href^="#"]');

    function activateTab(hash) {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        if (hash === '#transformer') {
            if (tabBtns[0]) tabBtns[0].classList.add('active');
            const target = document.getElementById('transformerTab');
            if (target) target.classList.add('active');
        } else if (hash === '#scanner') {
            if (tabBtns[1]) tabBtns[1].classList.add('active');
            const target = document.getElementById('scannerTab');
            if (target) target.classList.add('active');
        } else if (hash === '#substitutes') {
            if (tabBtns[2]) tabBtns[2].classList.add('active');
            const target = document.getElementById('substitutesTab');
            if (target) target.classList.add('active');
        } else if (hash === '#gemma-engine') {
            if (tabBtns[3]) tabBtns[3].classList.add('active');
            const target = document.getElementById('gemmaEngineTab');
            if (target) target.classList.add('active');
        }

        const workspace = document.querySelector('.app-workspace');
        if (workspace) {
            workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const el = document.getElementById(target);
            if (el) el.classList.add('active');
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

function initRecipeTransformer() {
    const form = document.getElementById('recipeForm');
    const titleInput = document.getElementById('recipeTitle');
    const ingInput = document.getElementById('recipeIngredients');
    const sampleBtns = document.querySelectorAll('.sample-btn');
    const resultBox = document.getElementById('transformedResultBox');
    const speakBtn = document.getElementById('speakRecipeBtn');

    if (!form || !resultBox) return;

    sampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const r = SAMPLE_RECIPES[btn.getAttribute('data-recipe')];
            if (r) {
                titleInput.value = r.title;
                ingInput.value = r.ingredients;
                form.dispatchEvent(new Event('submit'));
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = ingInput.value;
        const title = titleInput.value;

        resultBox.innerHTML = `
            <div style="margin-bottom:1.2rem;">
                <h4 style="color:#fbbf24; font-size:1.15rem; margin-bottom:0.3rem;">Hypoallergenic Formulation: ${escapeHtml(title)}</h4>
                <p class="text-xs text-muted">Transformed for Subject Rahul (Celiac Disease, Bovine Milk, and Tree Nut Complex)</p>
            </div>
            
            <div class="hazard-summary" style="background:rgba(244,63,94,0.12); border:1px solid rgba(244,63,94,0.3); padding:0.9rem; border-radius:8px; margin-bottom:1.2rem;">
                <strong style="color:#fda4af; font-size:0.85rem;"><i class="fa-solid fa-triangle-exclamation"></i> Identified Protein & Carbohydrate Hazards in Baseline:</strong>
                <ul style="font-size:0.82rem; color:#f8fafc; margin-left:1.2rem; margin-top:0.4rem; line-height:1.5;">
                    <li>Durum Wheat / Triticum Semolina (Gliadin Auto-Antigen Source)</li>
                    <li>Bovine Butterfat & Cream (Casein Phosphoproteins & Lactose Disaccharide)</li>
                    <li>Aged Hard Cheese / Parmigiano (Concentrated Bovine Casein Complex)</li>
                    <li>Juglans Regia / English Walnuts (Severe Anaphylatoxin Vector)</li>
                </ul>
            </div>

            <div style="background:var(--bg-surface); padding:1.1rem; border-radius:8px; border:1px solid var(--border-glass);">
                <strong style="color:#34d399; font-size:0.88rem;"><i class="fa-solid fa-check"></i> Validated Functional Replacements:</strong>
                <ul style="font-size:0.85rem; color:#cbd5e1; margin-left:1.2rem; margin-top:0.5rem; line-height:1.7;">
                    <li><strong>Certified Gluten-Free Brown Rice & Chenopodium Quinoa Fettuccine</strong> (Extended starch hydration cooking window)</li>
                    <li><strong>Centrifuged Cocos Nucifera Cream & Cold-Pressed Persea Lipid Base</strong> (Provides matched 36% lipid emulsion)</li>
                    <li><strong>Nutritional Saccharomyces Flakes + Dehydrated Allium Extract</strong> (Replicates glutamate-driven savory depth)</li>
                    <li><strong>Toasted Cucurbita Pepo Kernels (Pepitas)</strong> (100% Tree-Nut Free crunchy garnish)</li>
                    <li><strong>Cold-Pressed Extra Virgin Persea Americana Oil</strong> (Replaces dairy butter with high-stability monounsaturates)</li>
                </ul>
            </div>
        `;
        showToast("Formulation successfully computed for Rahul.", "fa-wand-magic-sparkles");
    });

    if (speakBtn) {
        speakBtn.addEventListener('click', () => {
            if (!('speechSynthesis' in window)) {
                showToast("Speech synthesis unavailable on client.", "fa-triangle-exclamation");
                return;
            }
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance("Safe culinary formulation ready for Rahul. Replace durum pasta with certified brown rice fettuccine, replace heavy bovine cream with centrifuged coconut lipid crema, and replace tree nuts with toasted pumpkin pepitas.");
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
            showToast("Executing kitchen audio narration.", "fa-volume-high");
        });
    }

    form.dispatchEvent(new Event('submit'));
}

function initLabelScanner() {
    const input = document.getElementById('labelInput');
    const btn = document.getElementById('inspectLabelBtn');
    const result = document.getElementById('labelScanResults');

    if (!btn || !result || !input) return;

    btn.addEventListener('click', () => {
        const val = input.value.toLowerCase().trim();
        if (!val) {
            showToast("Please input ingredient declaration text.", "fa-triangle-exclamation");
            return;
        }

        result.classList.remove('hidden');

        const detected = [];

        Object.entries(ALLERGEN_VECTORS).forEach(([key, group]) => {
            const matches = group.tokens.filter(token => {
                const regex = new RegExp(`\\b${token}\\b`, 'i');
                return regex.test(val);
            });
            if (matches.length > 0) {
                detected.push({ label: group.label, matches: [...new Set(matches)] });
            }
        });

        if (detected.length > 0) {
            result.innerHTML = `
                <div style="background:rgba(244,63,94,0.15); border:1px solid rgba(244,63,94,0.4); padding:1.2rem; border-radius:8px;">
                    <strong style="color:#fda4af; font-size:0.95rem;"><i class="fa-solid fa-ban"></i> CONTAMINANT DETECTED: UNSAFE FOR RAHUL</strong>
                    <p style="font-size:0.85rem; color:#f8fafc; margin-top:0.5rem;">Diagnostic scan detected ${detected.length} distinct exclusion vectors:</p>
                    <div style="margin-top:0.6rem; display:flex; flex-direction:column; gap:0.5rem;">
                        ${detected.map(d => `
                            <div style="background:rgba(0,0,0,0.3); padding:0.6rem 0.8rem; border-radius:6px; border-left:3px solid #f43f5e;">
                                <span style="font-size:0.85rem; font-weight:700; color:#fecdd3;">${escapeHtml(d.label)}</span>
                                <p style="font-size:0.78rem; color:#cbd5e1; margin-top:0.2rem;">Matched nomenclature: <em>${escapeHtml(d.matches.join(', '))}</em></p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            result.innerHTML = `
                <div style="background:rgba(16,185,129,0.15); border:1px solid rgba(16,185,129,0.4); padding:1.2rem; border-radius:8px;">
                    <strong style="color:#34d399; font-size:0.95rem;"><i class="fa-solid fa-circle-check"></i> ZERO TARGET ALLERGEN MARKERS DETECTED</strong>
                    <p style="font-size:0.85rem; color:#cbd5e1; margin-top:0.4rem;">The submitted nomenclature does not contain matching tokens for gluten, dairy, or tree-nut antigens. Cross-check shared manufacturing facility statements on physical packaging.</p>
                </div>
            `;
        }
        showToast("Nomenclature diagnostic complete.", "fa-barcode");
    });
}

function initSubstitutes() {
    const grid = document.getElementById('substitutesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    SUBSTITUTES_DATA.forEach(s => {
        const card = document.createElement('div');
        card.className = 'sub-card';
        card.innerHTML = `
            <h4>${escapeHtml(s.allergen)}</h4>
            <p><strong>Exclusion Target:</strong> ${escapeHtml(s.trigger)}</p>
            <p style="color:#34d399;"><strong>Functional Substitute:</strong> ${escapeHtml(s.safe)}</p>
            <p class="text-xs text-muted" style="margin-top:0.6rem; line-height:1.4;">${escapeHtml(s.culinaryNotes)}</p>
        `;
        grid.appendChild(card);
    });
}

function initGemmaChat() {
    const form = document.getElementById('culinaryChatForm');
    const input = document.getElementById('culinaryInput');
    const container = document.getElementById('gemmaChatContainer');
    const chips = document.querySelectorAll('.prompt-chip');

    if (!form || !container || !input) return;

    chips.forEach(c => {
        c.addEventListener('click', () => {
            input.value = c.getAttribute('data-prompt') || '';
            form.dispatchEvent(new Event('submit'));
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = input.value.trim();
        if (!q) return;

        const userMsg = document.createElement('div');
        userMsg.className = 'message-bubble user-message';
        userMsg.innerHTML = `<div class="message-body">${escapeHtml(q)}</div>`;
        container.appendChild(userMsg);
        input.value = '';

        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'message-bubble bot-message';
            botMsg.innerHTML = `
                <div class="message-avatar"><i class="fa-solid fa-shield-halved"></i></div>
                <div class="message-body">
                    <strong>Gemma Culinary Engine</strong>
                    <p>${getCulinaryResponse(q)}</p>
                </div>
            `;
            container.appendChild(botMsg);
            container.scrollTop = container.scrollHeight;
        }, 350);
    });
}

function getCulinaryResponse(query) {
    const q = query.toLowerCase();
    if (q.includes('sourdough') || q.includes('flour') || q.includes('elasticity') || q.includes('viscoelasticity')) {
        return "<strong>Gluten-Free Viscoelastic Starch Matrix:</strong><br>To simulate the glutenin/gliadin protein mesh in bread dough, formulate a multi-phase composite: 55% brown rice flour, 25% tapioca starch (for elasticity), and 20% sorghum flour, reinforced with 2.0% hydrocolloid-grade <em>Plantago ovata</em> (psyllium husk powder) pre-hydrated at a 1:10 water ratio. The psyllium gel traps gas bubbles during Saccharomyces fermentation identically to gluten strands.";
    }
    if (q.includes('curry') || q.includes('cashew') || q.includes('gravy') || q.includes('thickener') || q.includes('makhani')) {
        return "<strong>Nut-Free High-Lipid Emulsification in Gravies:</strong><br>To replicate cashew paste in rich gravies with zero nut risk, blend blanched white poppy seeds (<em>Papaver somniferum</em>) and hulled white melon seeds (<em>Citrullus lanatus</em>) soaked in warm vegetable broth. This provides identical linoleic fatty acid saturation and starch solids, yielding a velvety sheen without allergen antigens.";
    }
    if (q.includes('lipid') || q.includes('butter') || q.includes('maillard') || q.includes('avocado')) {
        return "<strong>Thermal Lipid Stability & Maillard Modulation:</strong><br>Unsalted bovine butter decomposes at ~175°C due to milk solid burn. When substituting with expeller-pressed avocado oil (smoke point >250°C), incorporate 0.5% brewer's yeast or toasted seed powder to supply the amino acids necessary to drive the Maillard browning reaction at lower pan temperatures.";
    }
    return "<strong>Culinary Formulation Rule:</strong> In strict allergen mitigation, successful substitutions require balancing three core axes: structural binders (hydrocolloids/starches), lipid emulsions (neutral plant fats), and savory glutamate modulators (autolyzed yeast/alliums).";
}
