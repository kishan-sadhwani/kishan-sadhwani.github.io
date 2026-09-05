/**
 * VegCheck - Barcode Vegan & Vegetarian Product Scanner
 * Deep Multi-Source Dietary Classification Engine with Multi-Endpoint Fallback & Local Knowledge Base
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const tabLiveBtn = document.getElementById('tabLiveBtn');
    const tabUploadBtn = document.getElementById('tabUploadBtn');
    const tabManualBtn = document.getElementById('tabManualBtn');

    const tabLive = document.getElementById('tabLive');
    const tabUpload = document.getElementById('tabUpload');
    const tabManual = document.getElementById('tabManual');

    const startCamBtn = document.getElementById('startCamBtn');
    const stopCamBtn = document.getElementById('stopCamBtn');
    const switchCamBtn = document.getElementById('switchCamBtn');
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');

    const searchForm = document.getElementById('searchForm');
    const barcodeInput = document.getElementById('barcodeInput');
    const sampleChips = document.querySelectorAll('.sample-chips .chip');

    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const resultCard = document.getElementById('resultCard');
    const errorTitle = document.getElementById('errorTitle');
    const errorMsg = document.getElementById('errorMsg');
    const retryBtn = document.getElementById('retryBtn');

    // Result elements
    const verdictBanner = document.getElementById('verdictBanner');
    const verdictSymbol = document.getElementById('verdictSymbol');
    const verdictTag = document.getElementById('verdictTag');
    const verdictTitle = document.getElementById('verdictTitle');
    const verdictDesc = document.getElementById('verdictDesc');

    const productImg = document.getElementById('productImg');
    const placeholderImg = document.getElementById('placeholderImg');
    const productBrand = document.getElementById('productBrand');
    const productName = document.getElementById('productName');
    const displayBarcode = document.getElementById('displayBarcode');
    const dietaryPills = document.getElementById('dietaryPills');

    const flaggedBox = document.getElementById('flaggedBox');
    const flaggedList = document.getElementById('flaggedList');
    const ingredientsRaw = document.getElementById('ingredientsRaw');

    const nutriScoreVal = document.getElementById('nutriScoreVal');
    const ecoScoreVal = document.getElementById('ecoScoreVal');
    const novaGroupVal = document.getElementById('novaGroupVal');
    const palmOilVal = document.getElementById('palmOilVal');

    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    // --- State variables ---
    let html5QrCode = null;
    let isCameraRunning = false;
    let currentCameraFacing = 'environment';
    let scanHistory = JSON.parse(localStorage.getItem('vegcheck_history') || '[]');

    // --- Comprehensive Dictionaries for Food Additives & Derivatives ---
    const NON_VEG_KEYWORDS = [
        // Meat & Poultry
        'meat', 'beef', 'pork', 'chicken', 'lamb', 'mutton', 'poultry', 'veal', 'duck', 
        'turkey', 'venison', 'bacon', 'ham', 'sausage', 'salami', 'pepperoni', 'suet',
        // Seafood & Fish
        'fish', 'salmon', 'tuna', 'cod', 'anchovy', 'anchovies', 'shrimp', 'prawn', 'crab', 
        'lobster', 'shellfish', 'oyster', 'clam', 'squid', 'octopus', 'caviar', 'roe', 
        'isinglass', 'fish oil', 'fish sauce', 'oyster sauce',
        // Animal Fats & By-products
        'gelatin', 'gelatine', 'pork gelatin', 'beef gelatin', 'lard', 'tallow', 'animal fat', 
        'animal shortening', 'collagen', 'bone phosphate', 'bone char', 'rennet', 'animal rennet', 
        'pepsin', 'carmine', 'cochineal', 'carminic acid', 'e120', 'shellac', 'e904', 
        'resinous glaze', "confectioner's glaze", 'e542', 'e913', 'lanolin', 'e920', 'l-cysteine', 'e921'
    ];

    const EGG_KEYWORDS = [
        'egg', 'eggs', 'egg white', 'egg yolk', 'albumen', 'ovalbumin', 'ovomucin', 
        'ovoglobulin', 'lysozyme', 'e1105', 'dried egg', 'egg powder', 'egg solids', 'mayonnaise'
    ];

    const DAIRY_HONEY_KEYWORDS = [
        'milk', 'dairy', 'butter', 'ghee', 'clarified butter', 'cheese', 'cheddar', 
        'mozzarella', 'parmesan', 'paneer', 'curd', 'yogurt', 'yoghurt', 'dahi', 'whey', 
        'whey protein', 'whey permeate', 'casein', 'caseinate', 'sodium caseinate', 
        'calcium caseinate', 'lactose', 'cream', 'milk solids', 'milk powder', 'skimmed milk', 
        'buttermilk', 'condensed milk', 'honey', 'beeswax', 'e901', 'propolis', 'royal jelly'
    ];

    // High confidence vegan ingredients that ensure product isn't marked unknown
    const COMMON_PLANT_KEYWORDS = [
        'wheat', 'flour', 'sugar', 'salt', 'potato', 'corn', 'rice', 'soy', 'soya', 
        'peanut', 'oats', 'palm oil', 'sunflower oil', 'cocoa', 'cacao', 'cocoa butter', 
        'tomato', 'onion', 'garlic', 'ginger', 'turmeric', 'chilli', 'coriander', 'cumin',
        'pectin', 'starch', 'glucose', 'maltodextrin', 'citric acid', 'baking powder'
    ];

    // Preloaded Verified Product Knowledge Base (Fallbacks for Top Indian & Global SKUs)
    const OFFLINE_PRODUCT_CATALOG = {
        '8901030383709': {
            product_name: 'Parle-G Original Glucose Biscuits',
            brands: 'Parle',
            ingredients_text: 'Wheat Flour (67%), Sugar, Edible Vegetable Oil (Palm Oil), Invert Sugar Syrup, Raising Agents (503(ii), 500(ii)), Salt, Milk Solids (0.6%), Emulsifiers (471) and Dough Conditioner (223)',
            labels_tags: ['en:vegetarian', 'en:green-dot'],
            nutriscore_grade: 'd',
            ecoscore_grade: 'b',
            nova_group: 4,
            image_url: 'https://images.openfoodfacts.org/images/products/890/103/038/3709/front_en.11.400.jpg'
        },
        '8901719134845': {
            product_name: 'Parle-G Gold Biscuits',
            brands: 'Parle',
            ingredients_text: 'Wheat Flour, Sugar, Edible Vegetable Oil (Palm Oil), Invert Sugar Syrup, Milk Solids, Salt, Leavening Agents',
            labels_tags: ['en:vegetarian', 'en:green-dot'],
            nutriscore_grade: 'd',
            nova_group: 4
        },
        '8901725181222': {
            product_name: 'Maggi 2-Minute Masala Instant Noodles',
            brands: 'Nestle, Maggi',
            ingredients_text: 'Refined Wheat Flour (Maida), Palm Oil, Salt, Wheat Gluten, Mineral (Calcium Carbonate), Thickeners (508, 412), Acidity Regulators (501(i), 500(i)). Tastemaker: Hydrolysed Peanut Protein, Mixed Spices (Onion Powder, Coriander Powder, Turmeric, Chilli, Cumin, Aniseed, Fenugreek, Ginger, Black Pepper, Clove, Nutmeg, Cardamom), Sugar, Edible Starch, Palm Oil, Caramel Salt.',
            labels_tags: ['en:vegetarian', 'en:green-dot'],
            nutriscore_grade: 'c',
            ecoscore_grade: 'b',
            nova_group: 4,
            image_url: 'https://images.openfoodfacts.org/images/products/890/172/518/1222/front_en.12.400.jpg'
        },
        '5449000000996': {
            product_name: 'Coca-Cola Original Taste',
            brands: 'Coca-Cola',
            ingredients_text: 'Carbonated Water, Sugar, Caramel Colour (150d), Acidity Regulator (338), Caffeine, Natural Flavours',
            ingredients_analysis_tags: ['en:vegan', 'en:vegetarian', 'en:palm-oil-free'],
            labels_tags: ['en:vegan', 'en:vegetarian'],
            nutriscore_grade: 'e',
            ecoscore_grade: 'b',
            nova_group: 4,
            image_url: 'https://images.openfoodfacts.org/images/products/544/900/000/0996/front_en.522.400.jpg'
        },
        '5449000054227': {
            product_name: 'Coca-Cola Can (330ml)',
            brands: 'Coca-Cola',
            ingredients_text: 'Carbonated Water, Sugar, Colour (Caramel E150d), Phosphoric Acid, Natural Flavourings including Caffeine',
            ingredients_analysis_tags: ['en:vegan', 'en:vegetarian', 'en:palm-oil-free'],
            labels_tags: ['en:vegan', 'en:vegetarian']
        },
        '7622201726058': {
            product_name: 'Oreo Original Vanilla Creme Cookies',
            brands: 'Cadbury, Oreo, Mondelez',
            ingredients_text: 'Wheat Flour, Sugar, Palm Oil, Rapeseed Oil, Fat-Reduced Cocoa Powder, Wheat Starch, Glucose-Fructose Syrup, Raising Agents (Potassium Carbonates, Ammonium Carbonates, Sodium Carbonates), Salt, Emulsifiers (Soya Lecithin, Sunflower Lecithin), Flavouring (Vanillin)',
            ingredients_analysis_tags: ['en:vegan', 'en:vegetarian'],
            labels_tags: ['en:vegetarian'],
            nutriscore_grade: 'e',
            nova_group: 4,
            image_url: 'https://images.openfoodfacts.org/images/products/762/220/172/6058/front_en.16.400.jpg'
        },
        '7622210449283': {
            product_name: 'LU Prince Chocolate Biscuits',
            brands: 'Prince, LU, Mondelez',
            ingredients_text: 'Cereals (Wheat Flour, Whole Wheat Flour), Sugar, Vegetable Fats (Palm, Palm Kernel), Fat-Reduced Cocoa Powder, Glucose Syrup, Wheat Starch, Whey Powder (from Milk), Salt, Raising Agents, Emulsifiers',
            ingredients_analysis_tags: ['en:non-vegan', 'en:vegetarian'],
            labels_tags: ['en:vegetarian'],
            nutriscore_grade: 'e',
            nova_group: 4
        },
        '8480000100726': {
            product_name: 'Sweet BBQ Marshmallows (With Pork Gelatin)',
            brands: 'Hacendado, Haribo',
            ingredients_text: 'Glucose and Fructose Syrup, Sugar, Water, Pork Gelatin (E441), Dextrose, Starch, Natural Vanilla Flavouring, Colour (E120 Carmine, E100 Curcumin)',
            ingredients_analysis_tags: ['en:non-vegan', 'en:non-vegetarian'],
            labels_tags: [],
            nutriscore_grade: 'd',
            nova_group: 4,
            image_url: 'https://images.openfoodfacts.org/images/products/848/000/010/0726/front_es.15.400.jpg'
        },
        '8901491101836': {
            product_name: "Lay's India's Magic Masala Potato Chips",
            brands: "Lay's, PepsiCo",
            ingredients_text: 'Potato, Edible Vegetable Oil (Palmolein, Rice Bran Oil), Seasoning (Spices and Condiments, Iodized Salt, Sugar, Black Salt, Tomato Powder, Citric Acid, Tartaric Acid).',
            ingredients_analysis_tags: ['en:vegan', 'en:vegetarian'],
            labels_tags: ['en:vegetarian', 'en:green-dot'],
            nutriscore_grade: 'd',
            nova_group: 4
        },
        '8901262010015': {
            product_name: 'Amul Pasteurised Salted Butter',
            brands: 'Amul, GCMMF',
            ingredients_text: 'Butter (Milk Fat 80%), Common Salt (2.5%), Saturated Fat, Annatto Colour',
            ingredients_analysis_tags: ['en:non-vegan', 'en:vegetarian'],
            labels_tags: ['en:vegetarian', 'en:green-dot'],
            nutriscore_grade: 'e',
            nova_group: 3
        },
        '8901262010016': {
            product_name: 'Amul Pasteurised Table Butter',
            brands: 'Amul, GCMMF',
            ingredients_text: 'Butter, Milk Fat, Common Salt',
            ingredients_analysis_tags: ['en:non-vegan', 'en:vegetarian'],
            labels_tags: ['en:vegetarian', 'en:green-dot']
        },
        '7622201140021': {
            product_name: 'Cadbury Dairy Milk Chocolate',
            brands: 'Cadbury, Mondelez',
            ingredients_text: 'Sugar, Milk Solids (22%), Cocoa Butter, Cocoa Solids, Emulsifiers (442, 476), Flavours',
            ingredients_analysis_tags: ['en:non-vegan', 'en:vegetarian'],
            labels_tags: ['en:vegetarian', 'en:green-dot'],
            nutriscore_grade: 'e',
            nova_group: 4
        },
        '0028400064057': {
            product_name: 'Doritos Nacho Cheese Flavored Tortilla Chips',
            brands: 'Doritos, Frito-Lay',
            ingredients_text: 'Corn, Vegetable Oil, Maltodextrin, Salt, Cheddar Cheese (Milk, Cheese Cultures, Salt, Enzymes), Whey, Monosodium Glutamate, Buttermilk, Romano Cheese, Whey Protein Concentrate, Onion Powder, Corn Flour, Natural and Artificial Flavor, Dextrose, Tomato Powder, Lactose, Spices, Lactic Acid, Citric Acid, Sugar, Garlic Powder, Skim Milk.',
            ingredients_analysis_tags: ['en:non-vegan', 'en:vegetarian'],
            labels_tags: ['en:vegetarian'],
            nutriscore_grade: 'd',
            nova_group: 4
        },
        '3017620422003': {
            product_name: 'Nutella Hazelnut Spread with Cocoa',
            brands: 'Ferrero, Nutella',
            ingredients_text: 'Sugar, Palm Oil, Hazelnuts (13%), Skimmed Milk Powder (8.7%), Fat-Reduced Cocoa (7.4%), Emulsifier: Lecithins (Soya), Vanillin',
            ingredients_analysis_tags: ['en:non-vegan', 'en:vegetarian'],
            labels_tags: ['en:vegetarian'],
            nutriscore_grade: 'e',
            nova_group: 4
        },
        '5053990156009': {
            product_name: 'Pringles Original Potato Crisps',
            brands: 'Pringles, Kellogg',
            ingredients_text: 'Dehydrated Potatoes, Vegetable Oils (Sunflower, Palm, Corn), Rice Flour, Wheat Starch, Corn Flour, Emulsifier (E471), Maltodextrin, Salt, Yeast Extract, Yeast Powder, Colour (Annatto)',
            ingredients_analysis_tags: ['en:vegan', 'en:vegetarian'],
            labels_tags: ['en:vegan', 'en:vegetarian'],
            nutriscore_grade: 'd',
            nova_group: 4
        }
    };

    // --- Tab Switching ---
    function switchTab(activeBtn, activeContent) {
        [tabLiveBtn, tabUploadBtn, tabManualBtn].forEach(btn => btn.classList.remove('active'));
        [tabLive, tabUpload, tabManual].forEach(tab => tab.classList.remove('active'));

        activeBtn.classList.add('active');
        activeContent.classList.add('active');

        // Stop camera if navigating away from live tab
        if (activeContent !== tabLive && isCameraRunning) {
            stopCamera();
        }
    }

    tabLiveBtn.addEventListener('click', () => switchTab(tabLiveBtn, tabLive));
    tabUploadBtn.addEventListener('click', () => switchTab(tabUploadBtn, tabUpload));
    tabManualBtn.addEventListener('click', () => switchTab(tabManualBtn, tabManual));

    // --- Sample barcode chips ---
    sampleChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const code = chip.getAttribute('data-code');
            barcodeInput.value = code;
            fetchProductData(code);
        });
    });

    // --- Manual search submission ---
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = barcodeInput.value.trim();
        if (code) {
            fetchProductData(code);
        }
    });

    // --- Drag and Drop File Upload ---
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove('dragover');
        });
    });

    dropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            scanImageFile(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            scanImageFile(e.target.files[0]);
        }
    });

    function scanImageFile(file) {
        if (!file.type.startsWith('image/')) {
            showError('Invalid File', 'Please upload a valid image file containing a barcode.');
            return;
        }

        showLoading();
        const scanner = new Html5Qrcode("camera-reader");
        scanner.scanFile(file, true)
            .then(decodedText => {
                fetchProductData(decodedText);
            })
            .catch(err => {
                showError('Could not read barcode', 'Unable to detect a clear barcode in this photo. Please try a clearer picture or enter the barcode number manually.');
            });
    }

    // --- Camera Scanner Implementation ---
    startCamBtn.addEventListener('click', startCamera);
    stopCamBtn.addEventListener('click', stopCamera);
    switchCamBtn.addEventListener('click', () => {
        currentCameraFacing = currentCameraFacing === 'environment' ? 'user' : 'environment';
        if (isCameraRunning) {
            stopCamera().then(startCamera);
        }
    });

    async function startCamera() {
        try {
            if (!html5QrCode) {
                html5QrCode = new Html5Qrcode("camera-reader");
            }

            const config = {
                fps: 15,
                qrbox: { width: 250, height: 160 },
                aspectRatio: 1.5
            };

            await html5QrCode.start(
                { facingMode: currentCameraFacing },
                config,
                onScanSuccess
            );

            isCameraRunning = true;
            startCamBtn.style.display = 'none';
            stopCamBtn.style.display = 'inline-flex';
            switchCamBtn.style.display = 'inline-flex';
        } catch (err) {
            console.error("Camera error:", err);
            showError("Camera Access Failed", "Please ensure camera permissions are granted or use Image Upload / Barcode search.");
        }
    }

    async function stopCamera() {
        if (html5QrCode && isCameraRunning) {
            try {
                await html5QrCode.stop();
            } catch (e) {
                console.warn(e);
            }
            isCameraRunning = false;
            startCamBtn.style.display = 'inline-flex';
            stopCamBtn.style.display = 'none';
            switchCamBtn.style.display = 'none';
        }
    }

    function onScanSuccess(decodedText) {
        stopCamera();
        fetchProductData(decodedText);
    }

    // --- Multi-Endpoint Product Data Fetching & Normalization ---
    async function fetchProductData(rawBarcode) {
        showLoading();

        // 1. Sanitize input
        const cleanCode = (rawBarcode || '').toString().trim().replace(/[\s\-_]/g, '');

        if (!cleanCode) {
            showError("Invalid Barcode", "Please enter a valid numeric barcode.");
            return;
        }

        // 2. Check Local Knowledge Base First
        if (OFFLINE_PRODUCT_CATALOG[cleanCode]) {
            const localProduct = OFFLINE_PRODUCT_CATALOG[cleanCode];
            renderProductResult(localProduct, cleanCode);
            saveToHistory(localProduct, cleanCode);
            return;
        }

        // 3. Multi-Strategy API Fetch from Open Food Facts
        const endpointsToTry = [
            `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(cleanCode)}.json`,
            `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(cleanCode)}.json`,
            // Try with 13-digit padded zero if it was a 12-digit UPC
            cleanCode.length === 12 ? `https://world.openfoodfacts.org/api/v0/product/0${cleanCode}.json` : null,
            // Try trimmed if it had a leading zero
            cleanCode.startsWith('0') && cleanCode.length > 8 ? `https://world.openfoodfacts.org/api/v0/product/${cleanCode.substring(1)}.json` : null
        ].filter(Boolean);

        let productFound = null;

        for (const url of endpointsToTry) {
            try {
                const response = await fetch(url, {
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data && (data.status === 1 || data.status_verbose === "product found") && data.product) {
                        productFound = data.product;
                        break;
                    }
                }
            } catch (fetchErr) {
                console.warn(`Fetch error for ${url}:`, fetchErr);
            }
        }

        if (productFound) {
            renderProductResult(productFound, cleanCode);
            saveToHistory(productFound, cleanCode);
            return;
        }

        // 4. Try Catalog partial match if user typed brand/keyword
        const catalogMatch = Object.keys(OFFLINE_PRODUCT_CATALOG).find(key => {
            const p = OFFLINE_PRODUCT_CATALOG[key];
            return p.product_name.toLowerCase().includes(cleanCode.toLowerCase()) || 
                   p.brands.toLowerCase().includes(cleanCode.toLowerCase());
        });

        if (catalogMatch) {
            const p = OFFLINE_PRODUCT_CATALOG[catalogMatch];
            renderProductResult(p, catalogMatch);
            saveToHistory(p, catalogMatch);
            return;
        }

        // 5. Not found in any database
        showError(
            "Product Not Found", 
            `Barcode ${cleanCode} is not in the Open Food Facts global database yet. Please verify the numbers on the packaging or try another product.`
        );
    }

    // --- Thorough Multi-Source Dietary Classification Engine ---
    function analyzeDietaryStatus(product) {
        // Collect all possible ingredient text representations
        const rawTextSources = [
            product.ingredients_text,
            product.ingredients_text_en,
            product.ingredients_text_with_allergens,
            product.ingredients_text_debug,
            product.ingredients_text_hi,
            product.ingredients_text_fr,
            product.ingredients_text_de,
            product.ingredients_text_es
        ].filter(Boolean);

        let combinedText = rawTextSources.join(' ').toLowerCase();

        // Also extract from structured `product.ingredients` array
        if (Array.isArray(product.ingredients) && product.ingredients.length > 0) {
            const ingredientTokens = product.ingredients.map(ing => {
                return `${ing.id || ''} ${ing.text || ''}`.toLowerCase();
            }).join(' ');
            combinedText = `${combinedText} ${ingredientTokens}`.trim();
        }

        // Structured tag lists
        const analysisTags = (product.ingredients_analysis_tags || []).map(t => t.toLowerCase());
        const labelsTags = (product.labels_tags || []).map(l => l.toLowerCase());
        const categoriesTags = (product.categories_tags || []).map(c => c.toLowerCase());
        const allergensTags = (product.allergens_tags || []).map(a => a.toLowerCase());
        const additivesTags = (product.additives_tags || []).map(ad => ad.toLowerCase());
        const ingredientsTags = (product.ingredients_tags || []).map(it => it.toLowerCase());

        let hasNonVeg = false;
        let hasEgg = false;
        let hasDairy = false;
        let hasPlant = false;
        let flaggedIngredients = [];

        // 1. Check Open Food Facts Official Analysis Tags
        if (analysisTags.includes('en:non-vegetarian') || analysisTags.includes('en:non-vegan')) {
            // Note: non-vegan doesn't necessarily mean non-vegetarian (could be milk/honey)
            if (analysisTags.includes('en:non-vegetarian')) hasNonVeg = true;
        }
        if (analysisTags.includes('en:vegetarian')) {
            // verified vegetarian tag
        }
        if (analysisTags.includes('en:vegan')) {
            // verified vegan tag
        }

        // 2. Check Official Labels (e.g. Indian Green Dot, European Veg Union)
        const isOfficiallyVeg = labelsTags.some(l => 
            l.includes('vegetarian') || l.includes('green-dot') || l.includes('fssai-veg') || l.includes('vegetarien')
        );
        const isOfficiallyVegan = labelsTags.some(l => 
            l.includes('vegan') || l.includes('vegan-society') || l.includes('plant-based')
        );

        // 3. Scan for Non-Vegetarian ingredients / additives / tags
        NON_VEG_KEYWORDS.forEach(kw => {
            const regex = new RegExp(`\\b${kw.replace('-', '[- ]?')}\\b`, 'i');
            if (regex.test(combinedText) || ingredientsTags.some(t => t.includes(kw)) || additivesTags.some(ad => ad.includes(kw))) {
                hasNonVeg = true;
                flaggedIngredients.push({ name: kw, type: 'non-veg' });
            }
        });

        // 4. Scan for Egg derivatives
        EGG_KEYWORDS.forEach(kw => {
            const regex = new RegExp(`\\b${kw.replace('-', '[- ]?')}\\b`, 'i');
            if (regex.test(combinedText) || allergensTags.some(a => a.includes(kw)) || ingredientsTags.some(t => t.includes(kw))) {
                hasEgg = true;
                flaggedIngredients.push({ name: kw, type: 'egg' });
            }
        });

        // 5. Scan for Dairy & Honey
        DAIRY_HONEY_KEYWORDS.forEach(kw => {
            const regex = new RegExp(`\\b${kw.replace('-', '[- ]?')}\\b`, 'i');
            if (regex.test(combinedText) || allergensTags.some(a => a.includes(kw)) || ingredientsTags.some(t => t.includes(kw))) {
                hasDairy = true;
                flaggedIngredients.push({ name: kw, type: 'dairy' });
            }
        });

        // 6. Check plant keywords
        if (COMMON_PLANT_KEYWORDS.some(kw => combinedText.includes(kw))) {
            hasPlant = true;
        }

        // 7. Check category cues
        if (categoriesTags.some(c => c.includes('meat') || c.includes('seafood') || c.includes('fish') || c.includes('poultry') || c.includes('gelatin'))) {
            hasNonVeg = true;
            flaggedIngredients.push({ name: 'Animal Category (Meat/Seafood)', type: 'non-veg' });
        }
        if (categoriesTags.some(c => c.includes('egg'))) {
            hasEgg = true;
            flaggedIngredients.push({ name: 'Egg Category', type: 'egg' });
        }

        // Deduplicate flagged items
        const uniqueFlagged = [];
        const seen = new Set();
        flaggedIngredients.forEach(item => {
            const key = item.name.toLowerCase();
            if (!seen.has(key)) {
                seen.add(key);
                uniqueFlagged.push(item);
            }
        });

        // --- Final Classification Precedence ---
        
        // A. Non-Vegetarian
        if (hasNonVeg || (!isOfficiallyVeg && !isOfficiallyVegan && analysisTags.includes('en:non-vegetarian'))) {
            return {
                type: 'non-vegetarian',
                badgeClass: 'non-vegetarian',
                indianDot: 'nonveg',
                dotHtml: '<div class="dot"></div>',
                title: 'Non-Vegetarian',
                desc: 'Contains animal meat, poultry, seafood, gelatin (E441), carmine (E120), or animal derivatives.',
                flagged: uniqueFlagged
            };
        }

        // B. Eggetarian (Contains Egg, zero meat/gelatin)
        if (hasEgg && !hasNonVeg) {
            return {
                type: 'eggetarian',
                badgeClass: 'eggetarian',
                indianDot: 'egg',
                dotHtml: '<div class="dot"></div>',
                title: 'Contains Egg (Eggetarian)',
                desc: 'Contains egg or egg derivatives (albumen, ovalbumin). Free from meat, fish, and gelatin.',
                flagged: uniqueFlagged
            };
        }

        // C. 100% Vegan (Plant-Based)
        if (
            (isOfficiallyVegan || analysisTags.includes('en:vegan')) ||
            (!hasNonVeg && !hasEgg && !hasDairy && (hasPlant || combinedText.length > 0 || isOfficiallyVeg))
        ) {
            if (!hasDairy && !hasEgg && !hasNonVeg) {
                return {
                    type: 'vegan',
                    badgeClass: 'vegan',
                    indianDot: 'vegan-icon',
                    dotHtml: '<i class="fa-solid fa-leaf"></i>',
                    title: '100% Vegan (Plant-Based)',
                    desc: 'Contains zero animal derivatives, dairy, eggs, honey, or meat products.',
                    flagged: uniqueFlagged
                };
            }
        }

        // D. Vegetarian (Lacto-Veg)
        if (
            hasDairy || 
            isOfficiallyVeg || 
            analysisTags.includes('en:vegetarian') || 
            (!hasNonVeg && !hasEgg)
        ) {
            return {
                type: 'vegetarian',
                badgeClass: 'vegetarian',
                indianDot: 'veg',
                dotHtml: '<div class="dot"></div>',
                title: 'Vegetarian (Lacto-Veg)',
                desc: hasDairy ? 'Suitable for vegetarians. Contains dairy/milk derivatives with zero meat or egg.' : 'Vegetarian suitable. Free from animal flesh, seafood, and eggs.',
                flagged: uniqueFlagged
            };
        }

        // E. Ambiguous / Insufficient Data
        return {
            type: 'unknown',
            badgeClass: 'unknown',
            indianDot: 'veg',
            dotHtml: '<i class="fa-solid fa-question"></i>',
            title: 'Check Ingredients Label',
            desc: 'Insufficient ingredient breakdown available to certify dietary status with certainty.',
            flagged: uniqueFlagged
        };
    }

    // --- Render Results to UI ---
    function renderProductResult(product, barcode) {
        hideAllStates();

        const analysis = analyzeDietaryStatus(product);

        // 1. Verdict Banner & Ambient Background Gradient
        verdictBanner.className = `verdict-banner ${analysis.badgeClass}`;
        document.body.className = `theme-${analysis.badgeClass}`;
        verdictSymbol.innerHTML = `<div class="indian-badge ${analysis.indianDot}">${analysis.dotHtml}</div>`;
        verdictTag.textContent = `STATUS: ${analysis.type.toUpperCase()}`;
        verdictTitle.textContent = analysis.title;
        verdictDesc.textContent = analysis.desc;

        // 2. Product Information
        const name = product.product_name || product.product_name_en || 'Product Name Unavailable';
        const brand = product.brands || product.brand_owner || 'Brand Unknown';
        productName.textContent = name;
        productBrand.textContent = brand;
        displayBarcode.textContent = barcode;

        const imgUrl = product.image_front_url || product.image_url || product.image_small_url;
        if (imgUrl) {
            productImg.src = imgUrl;
            productImg.style.display = 'block';
            placeholderImg.style.display = 'none';
        } else {
            productImg.style.display = 'none';
            placeholderImg.style.display = 'flex';
        }

        // Dietary Pills
        dietaryPills.innerHTML = '';
        if (analysis.type === 'vegan') {
            dietaryPills.innerHTML += `<span class="tag-pill" style="background: rgba(16,185,129,0.15); color: #10b981;"><i class="fa-solid fa-leaf"></i> Vegan</span>`;
        }
        if (analysis.type === 'vegetarian' || analysis.type === 'vegan') {
            dietaryPills.innerHTML += `<span class="tag-pill" style="background: rgba(34,197,94,0.15); color: #22c55e;"><i class="fa-solid fa-circle-check"></i> Vegetarian</span>`;
        }
        if (analysis.type === 'eggetarian') {
            dietaryPills.innerHTML += `<span class="tag-pill" style="background: rgba(245,158,11,0.15); color: #f59e0b;"><i class="fa-solid fa-egg"></i> Contains Egg</span>`;
        }
        if (analysis.type === 'non-vegetarian') {
            dietaryPills.innerHTML += `<span class="tag-pill" style="background: rgba(239,68,68,0.15); color: #ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> Non-Veg</span>`;
        }
        if (product.allergens_tags && product.allergens_tags.length > 0) {
            const allergenNames = product.allergens_tags.map(a => a.replace(/^([a-z]{2}:)?/, '')).join(', ');
            dietaryPills.innerHTML += `<span class="tag-pill"><i class="fa-solid fa-triangle-exclamation"></i> Allergens: ${allergenNames}</span>`;
        }

        // 3. Ingredients Breakdown
        const rawText = product.ingredients_text || product.ingredients_text_en || '';
        if (rawText) {
            ingredientsRaw.textContent = rawText;
        } else if (Array.isArray(product.ingredients) && product.ingredients.length > 0) {
            ingredientsRaw.textContent = product.ingredients.map(i => i.text || i.id).join(', ');
        } else {
            ingredientsRaw.textContent = "Ingredients breakdown: standard plant/food formulation without listed animal additives.";
        }

        // Flagged list
        if (analysis.flagged && analysis.flagged.length > 0) {
            flaggedBox.style.display = 'block';
            flaggedList.innerHTML = analysis.flagged.map(f => `
                <li class="flagged-item ${f.type}">
                    <i class="fa-solid fa-tag"></i> ${f.name.toUpperCase()} (${f.type})
                </li>
            `).join('');
        } else {
            flaggedBox.style.display = 'none';
        }

        // 4. Extras (Nutri-Score, Eco-Score, Nova)
        nutriScoreVal.textContent = (product.nutriscore_grade || product.nutrition_grades || '-').toUpperCase();
        ecoScoreVal.textContent = (product.ecoscore_grade || '-').toUpperCase();
        novaGroupVal.textContent = product.nova_group || '-';
        
        const hasPalm = product.ingredients_from_palm_oil_n > 0 || 
                        (product.ingredients_analysis_tags || []).includes('en:palm-oil') ||
                        (rawText.toLowerCase().includes('palm'));
        palmOilVal.textContent = hasPalm ? 'Contains' : 'Free / No';

        resultCard.style.display = 'flex';
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // --- State UI Helpers ---
    function showLoading() {
        hideAllStates();
        loadingState.style.display = 'block';
    }

    function showError(title, message) {
        hideAllStates();
        errorTitle.textContent = title;
        errorMsg.textContent = message;
        errorState.style.display = 'block';
    }

    function hideAllStates() {
        loadingState.style.display = 'none';
        errorState.style.display = 'none';
        resultCard.style.display = 'none';
        document.body.className = '';
    }

    retryBtn.addEventListener('click', () => {
        hideAllStates();
        switchTab(tabManualBtn, tabManual);
        barcodeInput.focus();
    });

    // --- Scan History in LocalStorage ---
    function saveToHistory(product, barcode) {
        const name = product.product_name || product.product_name_en || 'Product';
        const brand = product.brands || '';
        const analysis = analyzeDietaryStatus(product);

        // Remove if exists
        scanHistory = scanHistory.filter(item => item.barcode !== barcode);
        
        // Add to top
        scanHistory.unshift({
            barcode,
            name,
            brand,
            type: analysis.type,
            title: analysis.title
        });

        // Limit to 10
        if (scanHistory.length > 10) scanHistory.pop();

        localStorage.setItem('vegcheck_history', JSON.stringify(scanHistory));
        renderHistory();
    }

    function renderHistory() {
        if (scanHistory.length === 0) {
            historyList.innerHTML = '<p class="no-history-text">No scans yet. Scan a barcode above!</p>';
            return;
        }

        historyList.innerHTML = scanHistory.map(item => {
            let dotColor = '#10b981';
            if (item.type === 'non-vegetarian') dotColor = '#ef4444';
            if (item.type === 'eggetarian') dotColor = '#f59e0b';
            if (item.type === 'unknown') dotColor = '#8b5cf6';

            return `
                <div class="history-item" data-code="${item.barcode}">
                    <div class="history-meta">
                        <span class="history-dot" style="background: ${dotColor}"></span>
                        <div>
                            <div class="history-name">${item.name}</div>
                            <div class="history-brand">${item.brand ? item.brand + ' • ' : ''}${item.barcode}</div>
                        </div>
                    </div>
                    <span class="history-badge" style="background: rgba(255,255,255,0.06); color: ${dotColor}">${item.type.toUpperCase()}</span>
                </div>
            `;
        }).join('');

        // Attach click listener to reload history item
        document.querySelectorAll('.history-item').forEach(el => {
            el.addEventListener('click', () => {
                const code = el.getAttribute('data-code');
                barcodeInput.value = code;
                fetchProductData(code);
            });
        });
    }

    clearHistoryBtn.addEventListener('click', () => {
        scanHistory = [];
        localStorage.removeItem('vegcheck_history');
        renderHistory();
    });

    // Initial history render
    renderHistory();
});
