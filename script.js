/* ============================================================
   INVENTORY DATA & SYSTEM REGISTER
============================================================ */
let CATEGORIES_DB = [];
let PRODUCTS_DB = [];

// Embedded inventory data (fallback for local file access)
const EMBEDDED_INVENTORY = {
  "categories": [
    { "id": "cat-cpu", "name": "Processors", "icon": "bi-cpu" },
    { "id": "cat-gpu", "name": "Graphics Cards", "icon": "bi-gpu-card" },
    { "id": "cat-ram", "name": "Memory (RAM)", "icon": "bi-memory" },
    { "id": "cat-mobo", "name": "Motherboards", "icon": "bi-motherboard" },
    { "id": "cat-storage", "name": "Storage", "icon": "bi-device-ssd" },
    { "id": "cat-psu", "name": "Power Supply", "icon": "bi-lightning-charge" },
    { "id": "cat-case", "name": "Cases", "icon": "bi-pc-horizontal" },
    { "id": "cat-cooler", "name": "Cooling", "icon": "bi-water" }
  ],
  "products": [
    { "id": "cpu-1", "cat": "cat-cpu", "name": "AMD Ryzen 9 9950X", "spec": "16 Cores / 32 Threads, 5.7GHz Boost, 80MB Cache", "price": 33600, "stock": 15, "label": "Top Tier", "emoji": "🔥", "platform": "AM5", "ramType": "DDR5", "image": "https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2613900-ryzen-9-9950x.jpg" },
    { "id": "cpu-2", "cat": "cat-cpu", "name": "AMD Ryzen 7 9800X3D", "spec": "8 Cores / 16 Threads, 5.2GHz Turbo, 3D V-Cache", "price": 26824, "stock": 22, "label": "Hot Allocation", "emoji": "⚙️", "platform": "AM5", "ramType": "DDR5", "image": "https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2900400-ryzen-7-9800x3d-product.jpg" },
    { "id": "cpu-3", "cat": "cat-cpu", "name": "Intel Core Ultra 9 285K", "spec": "24 Cores / 24 Threads, AI Engine Integrated", "price": 32984, "stock": 18, "label": "New Drop", "emoji": "🧠", "platform": "LGA1851", "ramType": "DDR5", "image": "https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/25666085/core_ultra_series2_k_hero_08.png?quality=90&strip=all&crop=21.875%2C0%2C56.25%2C100&w=750" },
    { "id": "cpu-4", "cat": "cat-cpu", "name": "Intel Core i9-14900K", "spec": "24 Cores / 32 Threads, 6.0GHz Turbo", "price": 30800, "stock": 20, "label": "Popular", "emoji": "⚡", "platform": "LGA1700", "ramType": "DDR5", "image": "data:image/jpeg;base64,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" },
    { "id": "cpu-5", "cat": "cat-cpu", "name": "AMD Ryzen 5 7600X", "spec": "6 Cores / 12 Threads, 5.3GHz Boost", "price": 11200, "stock": 35, "label": "Budget King", "emoji": "💰", "platform": "AM5", "ramType": "DDR5", "image": "https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-ryzen-5-7600x.jpg" },
    { "id": "cpu-6", "cat": "cat-cpu", "name": "AMD Ryzen 9 5950X", "spec": "16 Cores / 32 Threads, 4.9GHz Boost, Zen 3", "price": 24640, "stock": 18, "label": "AM4 Beast", "emoji": "💪", "platform": "AM4", "ramType": "DDR4", "image": "https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-ryzen-9-5900x.jpg" },
    { "id": "cpu-7", "cat": "cat-cpu", "name": "AMD Ryzen 7 5800X3D", "spec": "8 Cores / 16 Threads, 4.5GHz, 3D V-Cache", "price": 19600, "stock": 25, "label": "Gaming King", "emoji": "🎮", "platform": "AM4", "ramType": "DDR4", "image": "https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-ryzen-7-5800x3d.jpg" },
    { "id": "cpu-8", "cat": "cat-cpu", "name": "AMD Ryzen 5 5600X", "spec": "6 Cores / 12 Threads, 4.6GHz Boost", "price": 8960, "stock": 40, "label": "Value AM4", "emoji": "💵", "platform": "AM4", "ramType": "DDR4", "image": "https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-ryzen-7-5800x3d.jpg" },
    { "id": "gpu-1", "cat": "cat-gpu", "name": "NVIDIA RTX 5090 Founders", "spec": "32GB GDDR7, Next-Gen Ray Tracing", "price": 111944, "stock": 8, "label": "Ultimate", "emoji": "🌌", "image": "https://cdn.mos.cms.futurecdn.net/D2wF99DV4KRfYPYVeR3eWb-650-80.jpg.webp" },
    { "id": "gpu-2", "cat": "cat-gpu", "name": "ASUS ROG Strix RTX 5090 OC", "spec": "32GB GDDR7, Liquid Vapor Chamber Cooling", "price": 125440, "stock": 5, "label": "Heavy Duty", "emoji": "👑", "image": "https://cdn.thefpsreview.com/wp-content/uploads/2025/01/nvidia-geforce-rtx-5090-5080-pricing-revealed-by-u-s-retailers-including-asus-rog-astral-geforce-rtx-5090-32gb-gddr7-oc-edition-for-2-799-99-feature.jpg.webp" },
    { "id": "gpu-3", "cat": "cat-gpu", "name": "NVIDIA RTX 5070 Ti", "spec": "16GB GDDR7, DLSS 4.0 Support", "price": 47544, "stock": 25, "label": "New Drop", "emoji": "⚡", "image": "https://www.pcgamesn.com/wp-content/sites/pcgamesn/2024/11/nvidia-geforce-rtx-5070-ti-guide-550x309.jpg" },
    { "id": "gpu-4", "cat": "cat-gpu", "name": "AMD Radeon RX 7900 XTX", "spec": "24GB GDDR6, Chiplet Architecture", "price": 44800, "stock": 18, "label": "AMD Power", "emoji": "🔴", "image": "https://global.aorus.com/upload/Admin/images/AMD%20RX%207900%20XTX.png" },
    { "id": "gpu-5", "cat": "cat-gpu", "name": "NVIDIA RTX 4070 Super", "spec": "12GB GDDR6X, Ray Tracing Cores", "price": 33600, "stock": 30, "label": "Best Value", "emoji": "💎", "image": "https://d2vfia6k6wrouk.cloudfront.net/productimages/e7c5ce6d-d8fd-43e1-b3f1-b0f100cbb986/images/pny-rtx-4070-super-12gb-verto-dual-fan-oc-ra-logo.png" },
    { "id": "gpu-6", "cat": "cat-gpu", "name": "AMD Radeon RX 7800 XT", "spec": "16GB GDDR6, 1440p Gaming Beast", "price": 28000, "stock": 22, "label": "Popular", "emoji": "🎮", "image": "https://dlcdnwebimgs.asus.com/files/media/f27fb00d-ab9d-48b9-b91d-e172cedadbfc/v1/img/amd/amd-1.jpg" },
    { "id": "ram-1", "cat": "cat-ram", "name": "G.SKILL Trident Z5 RGB 64GB", "spec": "DDR5-7200, CL34, 2x32GB Kit", "price": 64050, "stock": 40, "label": "Premium", "emoji": "💾", "ramType": "DDR5", "image": "https://bermorzone.com.ph/wp-content/uploads/2024/05/gskill-trident-z5-rgb-600x375-1.webp" },
    { "id": "ram-2", "cat": "cat-ram", "name": "Corsair Dominator Platinum 32GB", "spec": "DDR5-6400, CL32, 2x16GB Kit", "price": 26995, "stock": 50, "label": "Popular", "emoji": "⚡", "ramType": "DDR5", "image": "https://ecommerce.datablitz.com.ph/cdn/shop/products/CMT32GX5M2B5600Z36-Gallery-DOMINATOR-RGB-PLATINUM-GREY-DDR5-AMD-13_500x.png?v=1676893972" },
    { "id": "ram-3", "cat": "cat-ram", "name": "Kingston Fury Beast 32GB", "spec": "DDR5-6000, CL36, 2x16GB Kit", "price": 24995, "stock": 60, "label": "Best Value", "emoji": "💰", "ramType": "DDR5", "image": "https://m.media-amazon.com/images/I/717cPftxQgL._AC_.jpg" },
    { "id": "ram-4", "cat": "cat-ram", "name": "Corsair Vengeance RGB 64GB", "spec": "DDR5-5600, CL40, 2x32GB Kit", "price": 57480, "stock": 35, "label": "RGB", "emoji": "🌈", "ramType": "DDR5", "image": "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Memory/vengeance-rgb-ddr5-config/white/2up/Vengeance-RGB-DDR5-2UP-64GB-WHITE_01.webp" },
    { "id": "ram-5", "cat": "cat-ram", "name": "G.SKILL Ripjaws V 32GB", "spec": "DDR4-3600, CL16, 2x16GB Kit", "price": 13720, "stock": 55, "label": "DDR4 Best", "emoji": "💪", "ramType": "DDR4", "image": "https://dynaquestpc.com/cdn/shop/products/1_0ea187da-227e-438b-af2d-17679c6f9cd9.png?v=1578625786&width=900" },
    { "id": "ram-6", "cat": "cat-ram", "name": "Corsair Vengeance LPX 32GB", "spec": "DDR4-3200, CL16, 2x16GB Kit", "price": 17600, "stock": 65, "label": "Value DDR4", "emoji": "💵", "ramType": "DDR4", "image": "https://m.media-amazon.com/images/I/31Hq8-Z9oWL._SS400_.jpg" },
    { "id": "ram-7", "cat": "cat-ram", "name": "Kingston Fury Beast 64GB", "spec": "DDR4-3600, CL18, 2x32GB Kit", "price": 33200, "stock": 40, "label": "DDR4 High Cap", "emoji": "📦", "ramType": "DDR4", "image": "https://www.disctech.com/SCASite/product_images/Kingston-DDR4-DUAL-STOCK_1000-1.jpg?resizeid=9&resizeh=650&resizew=650" },
    { "id": "mobo-1", "cat": "cat-mobo", "name": "ASUS ROG Maximus Z890 Hero", "spec": "Intel Z890, DDR5, PCIe 5.0, WiFi 7", "price": 33600, "stock": 12, "label": "Flagship", "emoji": "👑", "platform": "LGA1851", "ramType": "DDR5", "image": "https://ecommerce.datablitz.com.ph/cdn/shop/files/xcbxccvxvc_500x.jpg?v=1740398288" },
    { "id": "mobo-2", "cat": "cat-mobo", "name": "MSI MAG X870 Tomahawk", "spec": "AMD X870, DDR5, PCIe 5.0, WiFi 7", "price": 22400, "stock": 20, "label": "Popular", "emoji": "🎯", "platform": "AM5", "ramType": "DDR5", "image": "https://bermorzone.com.ph/wp-content/uploads/2024/06/MSI-MAG-X870-TOMAHAWK-WIFI-btz-ph-4.webp" },
    { "id": "mobo-3", "cat": "cat-mobo", "name": "Gigabyte B650 AORUS Elite", "spec": "AMD B650, DDR5, PCIe 4.0, WiFi 6E", "price": 11200, "stock": 30, "label": "Budget", "emoji": "💰", "platform": "AM5", "ramType": "DDR5", "image": "https://static.gigabyte.com/StaticFile/Image/Global/823738252050626b84ab756539a4c3d4/Product/32158" },
    { "id": "mobo-4", "cat": "cat-mobo", "name": "ASRock X870E Taichi", "spec": "AMD X870E, DDR5, PCIe 5.0, 10GbE LAN", "price": 28000, "stock": 15, "label": "Premium", "emoji": "⚡", "platform": "AM5", "ramType": "DDR5", "image": "https://tpucdn.com/review/asrock-x870e-taichi/images/title.jpg" },
    { "id": "mobo-5", "cat": "cat-mobo", "name": "ASUS TUF Gaming Z790-Plus", "spec": "Intel Z790, DDR5, PCIe 5.0, WiFi 6E", "price": 16800, "stock": 25, "label": "Intel DDR5", "emoji": "🔵", "platform": "LGA1700", "ramType": "DDR5", "image": "https://dlcdnwebimgs.asus.com/gain/f0d6e51a-6240-48e3-bd5b-00fd86032561/w692" },
    { "id": "mobo-6", "cat": "cat-mobo", "name": "MSI MAG B550 Tomahawk", "spec": "AMD B550, DDR4, PCIe 4.0, WiFi 6", "price": 9800, "stock": 28, "label": "AM4 Popular", "emoji": "🎯", "platform": "AM4", "ramType": "DDR4", "image": "https://storage-asset.msi.com/global/picture/image/feature/mb/B550/MAG/TOMAHAWK/B550-TOMAHAWK-kv-pd.png" },
    { "id": "mobo-7", "cat": "cat-mobo", "name": "ASUS ROG Strix X570-E", "spec": "AMD X570, DDR4, PCIe 4.0, WiFi 6E", "price": 19600, "stock": 18, "label": "AM4 Premium", "emoji": "👑", "platform": "AM4", "ramType": "DDR4", "image": "https://dlcdnwebimgs.asus.com/gain/249D2FDB-BD4E-4DB4-A000-15237DAC1406/w717/h525/fwebp" },
    { "id": "storage-1", "cat": "cat-storage", "name": "Samsung 990 PRO 2TB", "spec": "NVMe Gen4, 7450MB/s Read, 6900MB/s Write", "price": 8960, "stock": 45, "label": "Top Rated", "emoji": "💿", "image": "https://images.samsung.com/is/image/samsung/p6pim/sg/mz-v9p2t0bw/gallery/sg-990pro-nvme-m2-ssd-mz-v9p2t0bw-533720704?$1164_776_PNG$" },
    { "id": "storage-2", "cat": "cat-storage", "name": "WD Black SN850X 4TB", "spec": "NVMe Gen4, 7300MB/s Read, Gaming Optimized", "price": 16800, "stock": 25, "label": "Gaming", "emoji": "🎮", "image": "https://www.sandisk.com/content/dam/sandisk/en-us/assets/products/internal-storage/wd-black-sn850x-nvme-ssd/gallery/wd-black-sn850x-nvme-ssd-front.png.wdthumb.1280.1280.webp" },
    { "id": "storage-3", "cat": "cat-storage", "name": "Crucial P5 Plus 1TB", "spec": "NVMe Gen4, 6600MB/s Read, 5000MB/s Write", "price": 4480, "stock": 60, "label": "Budget", "emoji": "💰", "image": "https://cdn.mos.cms.futurecdn.net/73Fk8dL8V3eBNWD6MwNwSn-1920-80.jpg.webp" },
    { "id": "psu-1", "cat": "cat-psu", "name": "Corsair HX1500i 1500W", "spec": "80+ Platinum, Fully Modular, Digital Monitoring", "price": 22400, "stock": 10, "label": "Extreme", "emoji": "⚡", "image": "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Power-Supply-Units/base-hxi-2023-config/1500W/CP-9020261/Gallery/CP-9020261_17.webp" },
    { "id": "psu-2", "cat": "cat-psu", "name": "Seasonic PRIME TX-1000", "spec": "80+ Titanium, 1000W, Fully Modular", "price": 16800, "stock": 15, "label": "Premium", "emoji": "👑", "image": "https://cdn.mos.cms.futurecdn.net/qkoaEhhDsrYvg8zyTjMuoB-1920-80.jpg.webp" },
    { "id": "psu-3", "cat": "cat-psu", "name": "EVGA SuperNOVA 850 G7", "spec": "80+ Gold, 850W, Fully Modular", "price": 8960, "stock": 35, "label": "Popular", "emoji": "💎", "image": "https://cdn.mos.cms.futurecdn.net/c4j24LdtfV3qMRw4ta4dDc-1280-80.png.webp" },
    { "id": "psu-4", "cat": "cat-psu", "name": "Thermaltake Toughpower GF3 750W", "spec": "80+ Gold, 750W, Fully Modular", "price": 6720, "stock": 40, "label": "Value", "emoji": "💰", "image": "https://www.thermaltake.com/media/catalog/product/cache/cc8b24283b13da6bc2ff91682c03b54b/t/o/toughpower_gf3_750_01.jpg" },
    { "id": "case-1", "cat": "cat-case", "name": "Lian Li O11 Dynamic EVO", "spec": "Mid Tower, Tempered Glass, Dual Chamber", "price": 8960, "stock": 25, "label": "Popular", "emoji": "📦", "image": "https://lian-li.com/wp-content/uploads/2023/12/O11DERGB-000.jpg" },
    { "id": "case-2", "cat": "cat-case", "name": "Fractal Design Torrent", "spec": "Mid Tower, High Airflow, 2x 180mm Fans", "price": 11200, "stock": 20, "label": "Airflow King", "emoji": "🌪️", "image": "https://www.fractal-design.com/app/uploads/2021/07/Torrent_Black_RGB_TGL_1-Left-Front-540x540.jpg" },
    { "id": "case-3", "cat": "cat-case", "name": "NZXT H9 Elite", "spec": "Mid Tower, Dual Chamber, Cable Management", "price": 10080, "stock": 18, "label": "Premium", "emoji": "✨", "image": "https://ecommerce.datablitz.com.ph/cdn/shop/products/1672294506-h9-flow-hero-black_500x.jpg?v=1676921009" },
    { "id": "case-4", "cat": "cat-case", "name": "Corsair 4000D Airflow", "spec": "Mid Tower, High Airflow, Budget Friendly", "price": 5600, "stock": 45, "label": "Best Value", "emoji": "💰", "image": "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Cases/base-4000d-airflow-config/Gallery/4000D_AF_BLACK_19.webp" },
    { "id": "cooler-1", "cat": "cat-cooler", "name": "Arctic Liquid Freezer II 360 A-RGB", "spec": "360mm, Infinity Mirror LCD, Dynamic Pumps", "price": 9464, "stock": 25, "label": "Sale", "emoji": "💧", "image": "https://ecommerce.datablitz.com.ph/cdn/shop/files/Layer12_a298ee09-3d64-4a6c-87c8-e315a2f0d809_500x.jpg?v=1740735506" },
    { "id": "cooler-2", "cat": "cat-cooler", "name": "Arctic Liquid Freezer II 280", "spec": "280mm AIO, VRM Fan, Silent Operation", "price": 6720, "stock": 35, "label": "Best Value", "emoji": "🧊", "image": "https://ecommerce.datablitz.com.ph/cdn/shop/files/liquid-freezer-ii-280-argb-g06_500x.jpg?v=1740746399" },
    { "id": "cooler-3", "cat": "cat-cooler", "name": "Noctua NH-D15 chromax.black", "spec": "Dual Tower Air Cooler, Premium Fans", "price": 6160, "stock": 40, "label": "Air Cooling", "emoji": "🌬️", "image": "https://www.noctua.at/_next/image?url=https%3A%2F%2Fcdn.noctua.at%2Fmedia%2Fnh_d15_chromax_black_2.png&w=640&q=75" },
  ]
};

// Load inventory from JSON file or use embedded data
async function loadInventory() {
  // Initialize categories from embedded data
  CATEGORIES_DB = EMBEDDED_INVENTORY.categories;
  
  try {
    // Try to fetch from API first
    const response = await fetch('/api/products');
    const data = await response.json();
    
    if (data.success && data.products) {
      // Map database products to frontend format
      PRODUCTS_DB = data.products.map(p => ({
        id: p.id,
        cat: p.category,
        name: p.name,
        spec: p.spec,
        price: parseFloat(p.price),
        stock: p.stock,
        label: p.label,
        emoji: p.emoji,
        platform: p.platform,
        ramType: p.ram_type,
        image: p.image
      }));
      
      console.log('✅ Inventory loaded from database:', PRODUCTS_DB.length, 'products');
    } else {
      throw new Error('Invalid API response');
    }
  } catch (error) {
    console.warn('⚠️ Could not load from API, using embedded data:', error.message);
    // Fallback to embedded data
    PRODUCTS_DB = EMBEDDED_INVENTORY.products;
  }
  
  // Update category counts
  CATEGORIES_DB.forEach(cat => {
    const count = PRODUCTS_DB.filter(p => p.cat === cat.id).length;
    cat.count = `${count} Models`;
  });
  
  console.log('✅ Categories loaded:', CATEGORIES_DB.length, 'categories');
  
  return true;
}

const SERVICES_DB = [
  { id: 'srv1', name: 'High-Fidelity Custom Build Assembly', desc: 'Complete multi-component mounting, structural alignment, structural layout testing, and optimized BIOS parameters.', price: 4200, duration: '2 - 3 Hours' },
  { id: 'srv2', name: 'Thermal Repasting & Micro-De-dusting', desc: 'Deep hardware disinfection, removal of dry interfaces, and precision application of premium phase-change pads.', price: 2520, duration: '1 - 1.5 Hours' },
  { id: 'srv3', name: 'Critical OS & Driver Diagnostics Suite', desc: 'Secure operating system fresh payload deployment, absolute latency isolation tracking, and driver configuration mapping.', price: 2240, duration: '1 Hour' }
];

// Load services from API
async function loadServicesFromAPI() {
  try {
    const response = await fetch('/api/services');
    const data = await response.json();
    
    if (data.success && data.services.length > 0) {
      // Map API services to match the expected format
      return data.services.map(s => ({
        id: s.id,
        name: s.service_name,
        desc: s.description,
        price: parseFloat(s.price),
        duration: s.duration,
        icon: s.icon
      }));
    }
  } catch (error) {
    console.warn('Could not load services from API, using fallback data:', error);
  }
  
  // Return fallback data if API fails
  return SERVICES_DB;
}

const TRUST_DB = [
  { icon: 'bi-shield-check', title: 'Secured Component Warranties', desc: '100% Verified product distribution manifests.' },
  { icon: 'bi-truck', title: 'Priority Drop Logistics', desc: 'Insured anti-shock freight networks nationwide.' },
  { icon: 'bi-person-gear', title: 'Certified Technical Nodes', desc: 'Live workbench support access on standby.' }
];

const TESTIMONIALS_DB = [
  { text: "PC HAVEN field technicians updated my thermal throttling workstations within hours. Incredible client response.", author: "Del Coro D.", role: "Lead Dev Operations" },
  { text: "Secured my RTX 5090 drop allocation completely hassle-free. The separated front-end system tracking is blazing fast.", author: "Talotalo K.", role: "Digital Render Engineer" }
];

/* ============================================================
   CLIENT CONTAINER STATS & ACTIVE APP STATES
============================================================ */
let activeCategoryFilter = 'all';
let activeBuilderCategory = null;
let activeCategoryNavFilter = 'all'; // For category navbar filtering

// PC Builder State Management
const PCBuilder = {
  selectedComponents: {},
  
  init() {
    this.loadBuild();
    this.renderCategories();
  },
  
  selectCategory(catId) {
    activeBuilderCategory = catId;
    this.renderCategories();
    this.renderComponents(catId);
  },
  
  renderCategories() {
    const container = document.getElementById('builderCategories');
    if (!container) return;
    
    container.innerHTML = CATEGORIES_DB.map(cat => {
      const isSelected = this.selectedComponents[cat.id];
      const isActive = activeBuilderCategory === cat.id;
      return `
        <div class="builder-cat-item ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}" 
             onclick="PCBuilder.selectCategory('${cat.id}')">
          <i class="bi ${cat.icon}"></i>
          <span>${cat.name}</span>
          ${isSelected ? '<i class="bi bi-check-circle-fill check-icon"></i>' : ''}
        </div>
      `;
    }).join('');
  },
  
  renderComponents(catId) {
    const container = document.getElementById('builderComponents');
    if (!container) return;
    
    const products = PRODUCTS_DB.filter(p => p.cat === catId);
    const category = CATEGORIES_DB.find(c => c.id === catId);
    
    if (products.length === 0) {
      container.innerHTML = '<div class="text-center text-muted py-4">No components available</div>';
      return;
    }
    
    container.innerHTML = `
      <div class="builder-components-header">
        <h5><i class="bi ${category.icon}"></i> Select ${category.name}</h5>
      </div>
      <div class="builder-components-grid">
        ${products.map(p => {
          const isSelected = this.selectedComponents[catId]?.id === p.id;
          const compatibility = this.checkComponentCompatibility(catId, p);
          const hasWarning = compatibility.warnings.length > 0;
          
          return `
            <div class="builder-component-card ${isSelected ? 'selected' : ''} ${p.stock === 0 ? 'out-of-stock' : ''} ${hasWarning ? 'has-warning' : ''}" 
                 onclick="PCBuilder.selectComponent('${catId}', '${p.id}')">
              <div class="d-flex justify-content-between align-items-start mb-2">
                ${p.image ? `<img src="${p.image}" alt="${p.name}" class="component-image" />` : `<div class="component-emoji">${p.emoji}</div>`}
                <div class="d-flex gap-1">
                  ${hasWarning ? '<i class="bi bi-exclamation-triangle-fill text-warning" title="Compatibility warning"></i>' : ''}
                  ${isSelected ? '<i class="bi bi-check-circle-fill text-success"></i>' : ''}
                </div>
              </div>
              <h6 class="component-name">${p.name}</h6>
              <p class="component-spec">${p.spec}</p>
              ${hasWarning ? `<div class="component-warning"><i class="bi bi-info-circle"></i> ${compatibility.warnings[0]}</div>` : ''}
              <div class="d-flex justify-content-between align-items-center">
                <span class="component-price">₱${parseFloat(p.price).toLocaleString('en-US')}</span>
                <span class="component-stock ${p.stock < 10 ? 'low' : ''}">${p.stock} in stock</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },
  
  checkComponentCompatibility(catId, product) {
    const warnings = [];
    const cpu = this.selectedComponents['cat-cpu'];
    const mobo = this.selectedComponents['cat-mobo'];
    const gpu = this.selectedComponents['cat-gpu'];
    const psu = this.selectedComponents['cat-psu'];
    const ram = this.selectedComponents['cat-ram'];
    const cooler = this.selectedComponents['cat-cooler'];
    const caseItem = this.selectedComponents['cat-case'];
    
    // Check motherboard compatibility with CPU (Platform matching)
    if (catId === 'cat-mobo' && cpu) {
      const cpuPlatform = cpu.platform || '';
      const moboPlatform = product.platform || '';
      
      if (cpuPlatform && moboPlatform && cpuPlatform !== moboPlatform) {
        warnings.push(`Incompatible: ${cpuPlatform} CPU needs ${cpuPlatform} motherboard`);
      }
    }
    
    // Check CPU compatibility with motherboard (Platform matching)
    if (catId === 'cat-cpu' && mobo) {
      const cpuPlatform = product.platform || '';
      const moboPlatform = mobo.platform || '';
      
      if (cpuPlatform && moboPlatform && cpuPlatform !== moboPlatform) {
        warnings.push(`Incompatible: ${cpuPlatform} CPU needs ${cpuPlatform} motherboard`);
      }
    }
    
    // Check RAM compatibility with CPU/Motherboard
    if (catId === 'cat-ram' && (cpu || mobo)) {
      const ramType = product.ramType || '';
      const cpuRamType = cpu?.ramType || '';
      const moboRamType = mobo?.ramType || '';
      
      if (cpuRamType && ramType && cpuRamType !== ramType) {
        warnings.push(`Incompatible: CPU requires ${cpuRamType}, this is ${ramType}`);
      }
      if (moboRamType && ramType && moboRamType !== ramType) {
        warnings.push(`Incompatible: Motherboard requires ${moboRamType}, this is ${ramType}`);
      }
    }
    
    // Check CPU/Motherboard compatibility with RAM
    if ((catId === 'cat-cpu' || catId === 'cat-mobo') && ram) {
      const ramType = ram.ramType || '';
      const componentRamType = product.ramType || '';
      
      if (ramType && componentRamType && ramType !== componentRamType) {
        warnings.push(`Incompatible: Selected RAM is ${ramType}, this requires ${componentRamType}`);
      }
    }
    
    // Check PSU wattage for high-end GPUs
    if (catId === 'cat-psu' && gpu) {
      const wattageMatch = product.name.match(/(\d+)W/);
      const wattage = wattageMatch ? parseInt(wattageMatch[1]) : 0;
      
      if (gpu.name.includes('5090') && wattage < 1000) {
        warnings.push('Warning: RTX 5090 recommended 1000W+ PSU');
      } else if ((gpu.name.includes('5080') || gpu.name.includes('7900')) && wattage < 850) {
        warnings.push('Warning: High-end GPU recommended 850W+ PSU');
      }
    }
    
    // Check GPU power requirements
    if (catId === 'cat-gpu' && psu) {
      const wattageMatch = psu.name.match(/(\d+)W/);
      const wattage = wattageMatch ? parseInt(wattageMatch[1]) : 0;
      
      if (product.name.includes('5090') && wattage < 1000) {
        warnings.push('Warning: This GPU needs 1000W+ PSU');
      } else if ((product.name.includes('5080') || product.name.includes('7900')) && wattage < 850) {
        warnings.push('Warning: This GPU needs 850W+ PSU');
      }
    }
    
    // Check cooler compatibility with case
    if (catId === 'cat-cooler' && caseItem) {
      const is360AIO = product.name.includes('360');
      const is280AIO = product.name.includes('280');
      const isSmallCase = caseItem.name.includes('Compact') || caseItem.name.includes('Mini');
      
      if ((is360AIO || is280AIO) && isSmallCase) {
        warnings.push('Warning: Large AIO may not fit in compact case');
      }
    }
    
    // Check case size for cooler
    if (catId === 'cat-case' && cooler) {
      const is360AIO = cooler.name.includes('360');
      const is280AIO = cooler.name.includes('280');
      const isSmallCase = product.name.includes('Compact') || product.name.includes('Mini');
      
      if ((is360AIO || is280AIO) && isSmallCase) {
        warnings.push('Warning: May not fit large AIO coolers');
      }
    }
    
    return { compatible: warnings.length === 0, warnings };
  },
  
  selectComponent(catId, productId) {
    const product = PRODUCTS_DB.find(p => p.id === productId);
    if (!product || product.stock === 0) return;
    
    this.selectedComponents[catId] = product;
    this.saveBuild();
    this.renderCategories();
    this.renderComponents(catId);
    this.updateSummary();
    this.checkBuildCompatibility();
    ToastSystem.trigger(`${product.name} added to build`, product.emoji);
  },
  
  checkBuildCompatibility() {
    const warningsContainer = document.getElementById('compatibilityWarnings');
    if (!warningsContainer) return;
    
    const allWarnings = [];
    const cpu = this.selectedComponents['cat-cpu'];
    const mobo = this.selectedComponents['cat-mobo'];
    const gpu = this.selectedComponents['cat-gpu'];
    const psu = this.selectedComponents['cat-psu'];
    const ram = this.selectedComponents['cat-ram'];
    const cooler = this.selectedComponents['cat-cooler'];
    const caseItem = this.selectedComponents['cat-case'];
    
    // CPU and Motherboard compatibility
    if (cpu && mobo) {
      const isAMDCPU = cpu.name.includes('AMD') || cpu.name.includes('Ryzen');
      const isIntelCPU = cpu.name.includes('Intel') || cpu.name.includes('Core');
      const isAMDMobo = mobo.name.includes('X870') || mobo.name.includes('B650') || mobo.name.includes('X870E');
      const isIntelMobo = mobo.name.includes('Z890') || mobo.name.includes('Z790');
      
      if ((isAMDCPU && isIntelMobo) || (isIntelCPU && isAMDMobo)) {
        allWarnings.push({
          type: 'error',
          icon: 'bi-x-circle-fill',
          message: 'CPU and Motherboard are incompatible! AMD CPUs need AMD motherboards, Intel CPUs need Intel motherboards.'
        });
      }
    }
    
    // GPU and PSU compatibility
    if (gpu && psu) {
      const wattageMatch = psu.name.match(/(\d+)W/);
      const wattage = wattageMatch ? parseInt(wattageMatch[1]) : 0;
      
      if (gpu.name.includes('5090') && wattage < 1000) {
        allWarnings.push({
          type: 'warning',
          icon: 'bi-exclamation-triangle-fill',
          message: 'RTX 5090 requires at least 1000W PSU. Current PSU may be insufficient.'
        });
      } else if ((gpu.name.includes('5080') || gpu.name.includes('5070') || gpu.name.includes('7900')) && wattage < 850) {
        allWarnings.push({
          type: 'warning',
          icon: 'bi-exclamation-triangle-fill',
          message: 'High-end GPU recommended 850W+ PSU for optimal performance.'
        });
      }
    }
    
    // Cooler and Case compatibility
    if (cooler && caseItem) {
      const is360AIO = cooler.name.includes('360');
      const is280AIO = cooler.name.includes('280');
      const isSmallCase = caseItem.name.includes('Compact') || caseItem.name.includes('Mini');
      
      if ((is360AIO || is280AIO) && isSmallCase) {
        allWarnings.push({
          type: 'warning',
          icon: 'bi-exclamation-triangle-fill',
          message: 'Large AIO cooler may not fit in compact case. Verify case specifications.'
        });
      }
    }
    
    // Missing essential components
    const essentialComponents = [
      { id: 'cat-cpu', name: 'Processor' },
      { id: 'cat-mobo', name: 'Motherboard' },
      { id: 'cat-ram', name: 'RAM' },
      { id: 'cat-storage', name: 'Storage' },
      { id: 'cat-psu', name: 'Power Supply' }
    ];
    
    const missingComponents = essentialComponents.filter(comp => !this.selectedComponents[comp.id]);
    
    if (missingComponents.length > 0 && Object.keys(this.selectedComponents).length > 0) {
      allWarnings.push({
        type: 'info',
        icon: 'bi-info-circle-fill',
        message: `Missing essential components: ${missingComponents.map(c => c.name).join(', ')}`
      });
    }
    
    // Display warnings
    if (allWarnings.length > 0) {
      warningsContainer.style.display = 'block';
      warningsContainer.innerHTML = allWarnings.map(w => `
        <div class="compatibility-alert compatibility-${w.type}">
          <i class="bi ${w.icon}"></i>
          <span>${w.message}</span>
        </div>
      `).join('');
    } else if (Object.keys(this.selectedComponents).length > 0) {
      warningsContainer.style.display = 'block';
      warningsContainer.innerHTML = `
        <div class="compatibility-alert compatibility-success">
          <i class="bi bi-check-circle-fill"></i>
          <span>All components are compatible! ✓</span>
        </div>
      `;
    } else {
      warningsContainer.style.display = 'none';
    }
  },
  
  updateSummary() {
    const summaryBody = document.getElementById('buildSummary');
    const totalPriceEl = document.getElementById('buildTotalPrice');
    const addBtn = document.getElementById('addBuildToCartBtn');
    
    if (!summaryBody || !totalPriceEl) return;
    
    const components = Object.values(this.selectedComponents);
    
    if (components.length === 0) {
      summaryBody.innerHTML = `
        <div class="text-center text-muted py-4">
          <i class="bi bi-cpu fs-3 d-block mb-2"></i>
          <small>Start selecting components</small>
        </div>
      `;
      totalPriceEl.textContent = '₱0';
      if (addBtn) addBtn.disabled = true;
      return;
    }
    
    const total = components.reduce((sum, comp) => sum + comp.price, 0);
    
    summaryBody.innerHTML = components.map(comp => {
      const category = CATEGORIES_DB.find(c => c.id === comp.cat);
      return `
        <div class="build-summary-item">
          <div class="build-summary-item-header">
            <span class="build-summary-cat">${category.name}</span>
            <button class="build-summary-remove" onclick="PCBuilder.removeComponent('${comp.cat}')" title="Remove">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="build-summary-item-name">${comp.emoji} ${comp.name}</div>
          <div class="build-summary-item-price">₱${parseFloat(comp.price).toLocaleString('en-US')}</div>
        </div>
      `;
    }).join('');
    
    totalPriceEl.textContent = `₱${parseFloat(total).toLocaleString('en-US')}`;
    if (addBtn) addBtn.disabled = false;
  },
  
  removeComponent(catId) {
    delete this.selectedComponents[catId];
    this.saveBuild();
    this.renderCategories();
    if (activeBuilderCategory === catId) {
      this.renderComponents(catId);
    }
    this.updateSummary();
    this.checkBuildCompatibility();
    ToastSystem.trigger('Component removed from build', '🗑️');
  },
  
  clearBuild() {
    if (Object.keys(this.selectedComponents).length === 0) {
      ToastSystem.trigger('Build is already empty', 'ℹ️');
      return;
    }
    
    // Create custom modal instead of browser confirm
    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';
    modal.innerHTML = `
      <div class="custom-modal">
        <div class="custom-modal-header">
          <i class="bi bi-exclamation-triangle-fill text-warning"></i>
          <h5>Clear Build?</h5>
        </div>
        <div class="custom-modal-body">
          <p>Are you sure you want to clear your entire build? This will remove all selected components.</p>
        </div>
        <div class="custom-modal-footer">
          <button class="btn-modal-cancel" onclick="this.closest('.custom-modal-overlay').remove()">Cancel</button>
          <button class="btn-modal-confirm" onclick="PCBuilder.confirmClearBuild(); this.closest('.custom-modal-overlay').remove();">Clear Build</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  },
  
  confirmClearBuild() {
    this.selectedComponents = {};
    this.saveBuild();
    this.renderCategories();
    if (activeBuilderCategory) {
      this.renderComponents(activeBuilderCategory);
    }
    this.updateSummary();
    this.checkBuildCompatibility();
    ToastSystem.trigger('Build cleared successfully', '🔄');
  },
  
  addToCart() {
    const components = Object.values(this.selectedComponents);
    if (components.length === 0) return;
    
    components.forEach(comp => {
      CartManager.addItem(comp.id, comp.name, comp.price, comp.emoji);
    });
    
    ToastSystem.trigger(`${components.length} components added to cart!`, '🎉');
  },
  
  saveBuild() {
    localStorage.setItem('pchaven_build', JSON.stringify(this.selectedComponents));
  },
  
  loadBuild() {
    const saved = localStorage.getItem('pchaven_build');
    if (saved) {
      this.selectedComponents = JSON.parse(saved);
    }
  }
};

// Theme Control System Engine
const ThemeEngine = {
  init() {
    const cached = localStorage.getItem('pchaven_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', cached);
    this.updateIcon(cached);
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const target = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem('pchaven_theme', target);
    this.updateIcon(target);
    ToastSystem.trigger(`Theme adapted to ${target} interface protocol`, '🌓');
  },
  updateIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    if (!icon) return;
    if (theme === 'light') {
      icon.className = 'bi bi-sun-fill';
    } else {
      icon.className = 'bi bi-moon-stars-fill';
    }
  }
};

// Client Storage Local Cart Manager API
const CartManager = {
  getItems() {
    return JSON.parse(localStorage.getItem('pchaven_cart') || '[]');
  },
  saveItems(cart) {
    localStorage.setItem('pchaven_cart', JSON.stringify(cart));
    this.syncBadge();
    this.renderDrawer();
  },
  addItem(id, name, price, emoji) {
    let cart = this.getItems();
    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, name, price, emoji, qty: 1 });
    }
    this.saveItems(cart);
    ToastSystem.trigger(`[${name}] allocated to cart node`, '📥');
  },
  removeItem(id) {
    let cart = this.getItems();
    cart = cart.filter(i => i.id !== id);
    this.saveItems(cart);
    ToastSystem.trigger('Component profile expunged from memory', '🗑️');
  },
  incrementItem(id) {
    let cart = this.getItems();
    const item = cart.find(i => i.id === id);
    if (item) {
      item.qty += 1;
      this.saveItems(cart);
    }
  },
  decrementItem(id) {
    let cart = this.getItems();
    const item = cart.find(i => i.id === id);
    if (item) {
      if (item.qty > 1) {
        item.qty -= 1;
        this.saveItems(cart);
      } else {
        // If quantity is 1, remove the item entirely
        this.removeItem(id);
      }
    }
  },
  syncBadge() {
    const cart = this.getItems();
    const totalQty = cart.reduce((acc, current) => acc + current.qty, 0);
    const badge = document.getElementById('cartCountBadge');
    if (!badge) return;
    badge.textContent = totalQty;
    if (totalQty > 0) {
      badge.classList.add('visible');
    } else {
      badge.classList.remove('visible');
    }
  },
  renderDrawer() {
    const container = document.getElementById('cartDrawerItems');
    const subtotalEl = document.getElementById('cartDrawerSubtotal');
    if (!container || !subtotalEl) return;

    const cart = this.getItems();
    if (cart.length === 0) {
      container.innerHTML = `<div class="text-center py-5 text-muted small"><i class="bi bi-cpu fs-3 d-block mb-2"></i>No hardware allocations registered.</div>`;
      subtotalEl.textContent = '₱0';
      return;
    }

    let html = '';
    let subtotal = 0;
    cart.forEach(item => {
      subtotal += item.price * item.qty;
      html += `
        <div class="cart-item">
          <div class="cart-item-info">
            <span class="cart-item-name">${item.emoji} ${item.name}</span>
            <span class="cart-item-price">₱${(parseFloat(item.price) * parseInt(item.qty)).toLocaleString('en-US')}</span>
          </div>
          <div class="cart-item-controls">
            <div class="qty-controls">
              <button class="qty-btn qty-minus" onclick="CartManager.decrementItem('${item.id}')" title="Decrease quantity">
                <i class="bi bi-dash"></i>
              </button>
              <span class="qty-display">${item.qty}</span>
              <button class="qty-btn qty-plus" onclick="CartManager.incrementItem('${item.id}')" title="Increase quantity">
                <i class="bi bi-plus"></i>
              </button>
            </div>
            <button class="cart-remove-btn" onclick="CartManager.removeItem('${item.id}')" title="Remove Item">
              <i class="bi bi-trash3-fill"></i>
            </button>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
    subtotalEl.textContent = `₱${parseFloat(subtotal).toLocaleString('en-US')}`;
  },
  checkout() {
    const cart = this.getItems();
    if (cart.length === 0) {
      ToastSystem.trigger('Cart is empty. Add components first.', '⚠️');
      return;
    }
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    // Get session token
    const session = localStorage.getItem('pchaven_session');
    if (!session) {
      ToastSystem.trigger('Please login to place an order', '⚠️');
      return;
    }
    
    const user = JSON.parse(session);
    
    // Show delivery address form
    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';
    modal.innerHTML = `
      <div class="custom-modal" style="max-width: 420px; max-height: 85vh; overflow-y: auto;">
        <div class="custom-modal-header" style="position: sticky; top: 0; background: var(--bg-card); z-index: 10; padding: 15px 18px;">
          <h3 style="font-size: 1.1rem; margin: 0;"><i class="bi bi-geo-alt"></i> Delivery Info</h3>
        </div>
        <div class="custom-modal-body" style="padding: 15px 18px;">
          <form id="deliveryForm">
            <div class="mb-2">
              <label class="form-label fw-semibold" style="font-size: 0.85rem; margin-bottom: 0.3rem;">Address <span class="text-danger">*</span></label>
              <textarea 
                class="form-control form-control-sm" 
                id="deliveryAddress" 
                rows="2" 
                placeholder="House/Unit No., Street, Barangay"
                required
                style="background: var(--bg-base); color: var(--text-primary); border-color: var(--border); resize: none; font-size: 0.85rem;"
              ></textarea>
            </div>
            
            <div class="row">
              <div class="col-6 mb-2">
                <label class="form-label fw-semibold" style="font-size: 0.85rem; margin-bottom: 0.3rem;">City <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control form-control-sm" 
                  id="deliveryCity" 
                  placeholder="Quezon City"
                  required
                  style="background: var(--bg-base); color: var(--text-primary); border-color: var(--border); font-size: 0.85rem;"
                />
              </div>
              
              <div class="col-6 mb-2">
                <label class="form-label fw-semibold" style="font-size: 0.85rem; margin-bottom: 0.3rem;">Postal <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control form-control-sm" 
                  id="deliveryPostalCode" 
                  placeholder="1100"
                  required
                  pattern="[0-9]{4}"
                  maxlength="4"
                  style="background: var(--bg-base); color: var(--text-primary); border-color: var(--border); font-size: 0.85rem;"
                />
              </div>
            </div>
            
            <div class="mb-2">
              <label class="form-label fw-semibold" style="font-size: 0.85rem; margin-bottom: 0.3rem;">Phone <span class="text-danger">*</span></label>
              <input 
                type="tel" 
                class="form-control form-control-sm" 
                id="deliveryPhone" 
                placeholder="09171234567"
                required
                pattern="[0-9]{11}"
                maxlength="11"
                style="background: var(--bg-base); color: var(--text-primary); border-color: var(--border); font-size: 0.85rem;"
              />
              <small class="text-muted" style="font-size: 0.7rem;">11-digit number</small>
            </div>
            
            <div class="mb-2">
              <label class="form-label fw-semibold" style="font-size: 0.85rem; margin-bottom: 0.3rem;">Notes (Optional)</label>
              <textarea 
                class="form-control form-control-sm" 
                id="deliveryNotes" 
                rows="2" 
                placeholder="Landmarks, instructions..."
                style="background: var(--bg-base); color: var(--text-primary); border-color: var(--border); resize: none; font-size: 0.85rem;"
              ></textarea>
            </div>
            
            <div class="alert" style="background: var(--bg-muted); border: 1px solid var(--border); color: var(--text-primary); border-radius: 6px; padding: 10px; margin-bottom: 0;">
              <div class="d-flex justify-content-between align-items-center">
                <strong style="font-size: 0.85rem;">Total:</strong>
                <strong class="text-primary" style="font-size: 1.1rem;">₱${parseFloat(total).toLocaleString('en-US')}</strong>
              </div>
              <small class="text-muted" style="font-size: 0.7rem;">+ delivery fee</small>
            </div>
          </form>
        </div>
        <div class="custom-modal-footer" style="position: sticky; bottom: 0; background: var(--bg-card); z-index: 10; padding: 12px 18px; gap: 8px;">
          <button class="btn-modal-cancel" onclick="this.closest('.custom-modal-overlay').remove()" style="padding: 7px 14px; font-size: 0.85rem;">
            <i class="bi bi-x-lg"></i> Cancel
          </button>
          <button class="btn-modal-confirm" onclick="CartManager.submitOrder()" style="padding: 7px 14px; font-size: 0.85rem;">
            <i class="bi bi-check-circle"></i> Place Order
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Close modal on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  },
  
  async submitOrder() {
    // Validate form
    const form = document.getElementById('deliveryForm');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    const deliveryAddress = document.getElementById('deliveryAddress').value.trim();
    const deliveryCity = document.getElementById('deliveryCity').value.trim();
    const deliveryPostalCode = document.getElementById('deliveryPostalCode').value.trim();
    const deliveryPhone = document.getElementById('deliveryPhone').value.trim();
    const deliveryNotes = document.getElementById('deliveryNotes').value.trim();
    
    const cart = this.getItems();
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    const session = localStorage.getItem('pchaven_session');
    const user = JSON.parse(session);
    const token = user.token;
    
    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000/api'
      : `${window.location.protocol}//${window.location.host}/api`;
    
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart,
          total: total,
          deliveryAddress,
          deliveryCity,
          deliveryPostalCode,
          deliveryPhone,
          deliveryNotes
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Close delivery form modal
        document.querySelector('.custom-modal-overlay').remove();
        
        // Show success modal
        const successModal = document.createElement('div');
        successModal.className = 'custom-modal-overlay';
        successModal.innerHTML = `
          <div class="custom-modal">
            <div class="custom-modal-header">
              <h3><i class="bi bi-check-circle-fill text-success"></i> Order Placed Successfully!</h3>
            </div>
            <div class="custom-modal-body">
              <p><strong>Order ID:</strong> ${data.order.id}</p>
              <p><strong>Total:</strong> ₱${parseFloat(total).toLocaleString('en-US')}</p>
              <div class="mt-3 p-3" style="background: var(--bg-muted); border-radius: 8px;">
                <p class="mb-1"><strong>Delivery Address:</strong></p>
                <p class="mb-1">${deliveryAddress}</p>
                <p class="mb-1">${deliveryCity}, ${deliveryPostalCode}</p>
                <p class="mb-0"><strong>Contact:</strong> ${deliveryPhone}</p>
              </div>
              <p class="mt-3">Your order has been placed and is being processed. You can view your order details in "My Orders".</p>
            </div>
            <div class="custom-modal-footer">
              <button class="btn-modal-confirm" onclick="this.closest('.custom-modal-overlay').remove();">
                <i class="bi bi-check-lg"></i> Got it!
              </button>
            </div>
          </div>
        `;
        document.body.appendChild(successModal);
        
        // Close modal on overlay click
        successModal.addEventListener('click', (e) => {
          if (e.target === successModal) {
            successModal.remove();
          }
        });
        
        // Clear cart
        this.saveItems([]);
        this.syncBadge();
        this.renderDrawer();
        document.getElementById('cartDrawer').classList.remove('open');
        document.getElementById('cartOverlay').classList.remove('open');
        
        ToastSystem.trigger('Order placed successfully!', '✅');
      } else {
        ToastSystem.trigger(data.message || 'Failed to place order', '❌');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      ToastSystem.trigger('Failed to place order. Please try again.', '❌');
    }
  }
};

// Custom System Toast Engine
const ToastSystem = {
  trigger(msg, icon = '💻') {
    const stack = document.getElementById('toast-container');
    if (!stack) return;
    const item = document.createElement('div');
    item.className = 'toast-item';
    item.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-msg">${msg}</div>
    `;
    stack.appendChild(item);
    setTimeout(() => {
      item.style.animation = 'toast-out 0.3s forwards';
      setTimeout(() => item.remove(), 300);
    }, 3500);
  }
};

/* ============================================================
   TEMPLATE RENDERING DOM ENGINES
============================================================ */
async function renderAllComponents() {
  // Render Categories Row
  const catGrid = document.getElementById('categories-grid');
  if (catGrid) {
    catGrid.innerHTML = CATEGORIES_DB.map(c => `
      <div class="col-xl-3 col-sm-6" onclick="setProductFilter('${c.id}')">
        <div class="cat-card">
          <div class="cat-icon"><i class="bi ${c.icon}"></i></div>
          <div class="cat-name">${c.name}</div>
          <div class="cat-count">${c.count}</div>
        </div>
      </div>
    `).join('');
  }

  // Render Filter Navigation Tabs
  const tabsContainer = document.getElementById('filter-tabs');
  if (tabsContainer) {
    const filterOptions = [
      { id: 'all', label: 'All Components' },
      ...CATEGORIES_DB.map(cat => ({ id: cat.id, label: cat.name }))
    ];
    tabsContainer.innerHTML = filterOptions.map(t => `
      <button class="filter-tab-btn ${activeCategoryFilter === t.id ? 'active' : ''}" onclick="setProductFilter('${t.id}')">
        ${t.label}
      </button>
    `).join('');
  }

  // Render Products Grid System
  const prodGrid = document.getElementById('products-grid');
  if (prodGrid) {
    let targetSet = activeCategoryFilter === 'all' ? PRODUCTS_DB : PRODUCTS_DB.filter(p => p.cat === activeCategoryFilter);
    
    // Sort by category when showing all components
    if (activeCategoryFilter === 'all') {
      targetSet = targetSet.sort((a, b) => {
        // Get category order from CATEGORIES_DB
        const catOrderA = CATEGORIES_DB.findIndex(c => c.id === a.cat);
        const catOrderB = CATEGORIES_DB.findIndex(c => c.id === b.cat);
        return catOrderA - catOrderB;
      });
    }
    
    if (targetSet.length === 0) {
      prodGrid.innerHTML = `<div class="col-12 text-center text-muted">No components found matching parameters.</div>`;
    } else {
      // Group products by category for display when showing all
      let html = '';
      if (activeCategoryFilter === 'all') {
        // Group by category
        const groupedProducts = {};
        targetSet.forEach(p => {
          if (!groupedProducts[p.cat]) {
            groupedProducts[p.cat] = [];
          }
          groupedProducts[p.cat].push(p);
        });
        
        // Render each category group
        CATEGORIES_DB.forEach(cat => {
          const products = groupedProducts[cat.id];
          if (products && products.length > 0) {
            html += `
              <div class="col-12">
                <div class="category-section-header">
                  <div class="d-flex align-items-center gap-3 mb-3">
                    <div class="category-icon-large">
                      <i class="bi ${cat.icon}"></i>
                    </div>
                    <div>
                      <h3 class="category-section-title">${cat.name}</h3>
                      <p class="category-section-subtitle">${products.length} products available</p>
                    </div>
                  </div>
                </div>
              </div>
            `;
            
            html += products.map(p => `
              <div class="col-xl-4 col-md-6">
                <div class="product-card">
                  <div class="product-img-wrap">
                    <div class="badge-stack"><span class="badge-sale">${p.label}</span></div>
                    ${p.image ? `<img src="${p.image}" alt="${p.name}" class="product-image" />` : `<div class="item-emoji">${p.emoji}</div>`}
                  </div>
                  <div class="product-body">
                    <div class="product-category">${cat.name}</div>
                    <h4 class="product-name">${p.name}</h4>
                    <p class="product-spec text-truncate-2">${p.spec}</p>
                    <div class="product-footer">
                      <span class="product-price">₱${parseFloat(p.price).toLocaleString('en-US')}</span>
                      <button class="btn-add-cart" onclick="CartManager.addItem('${p.id}', '${p.name}', ${p.price}, '${p.emoji}')">
                        <i class="bi bi-plus-lg"></i> Allocate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            `).join('');
          }
        });
      } else {
        // Single category view
        html = targetSet.map(p => {
          const cat = CATEGORIES_DB.find(c => c.id === p.cat);
          return `
            <div class="col-xl-4 col-md-6">
              <div class="product-card">
                <div class="product-img-wrap">
                  <div class="badge-stack"><span class="badge-sale">${p.label}</span></div>
                  ${p.image ? `<img src="${p.image}" alt="${p.name}" class="product-image" />` : `<div class="item-emoji">${p.emoji}</div>`}
                </div>
                <div class="product-body">
                  <div class="product-category">${cat ? cat.name : 'Component'}</div>
                  <h4 class="product-name">${p.name}</h4>
                  <p class="product-spec text-truncate-2">${p.spec}</p>
                  <div class="product-footer">
                    <span class="product-price">₱${parseFloat(p.price).toLocaleString('en-US')}</span>
                    <button class="btn-add-cart" onclick="CartManager.addItem('${p.id}', '${p.name}', ${p.price}, '${p.emoji}')">
                      <i class="bi bi-plus-lg"></i> Allocate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
      
      prodGrid.innerHTML = html;
    }
  }

  // Render Repair Technician Service Cards
  const servGrid = document.getElementById('services-grid');
  if (servGrid) {
    // Load services from API
    const services = await loadServicesFromAPI();
    
    servGrid.innerHTML = services.map(s => `
      <div class="col-lg-4 col-md-6">
        <div class="service-card">
          <div class="service-icon-wrap"><i class="bi ${s.icon || 'bi-gear-fill'}"></i></div>
          <h4 class="service-name">${s.name}</h4>
          <p class="service-desc">${s.desc}</p>
          <div class="service-meta">
            <span class="service-price">₱${parseFloat(s.price).toLocaleString('en-US')} <span class="text-muted small">/ Base</span></span>
            <button class="btn-book-service" onclick="openBookingDialogue(${s.id}, '${s.name.replace(/'/g, "\\'")}', ${s.price})">Request Node</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render Cognitive Infrastructure Trust Strip Elements
  const trustGrid = document.getElementById('trust-grid');
  if (trustGrid) {
    trustGrid.innerHTML = TRUST_DB.map(t => `
      <div class="col-md-4">
        <div class="trust-item">
          <div class="trust-icon"><i class="bi ${t.icon}"></i></div>
          <div>
            <div class="trust-title">${t.title}</div>
            <div class="trust-desc">${t.desc}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render Client User Commendations
  const testGrid = document.getElementById('testimonials-grid');
  if (testGrid) {
    testGrid.innerHTML = TESTIMONIALS_DB.map(t => `
      <div class="col-md-6">
        <div class="testimonial-card">
          <p class="testimonial-text">"${t.text}"</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">${t.author[0]}</div>
            <div>
              <div class="testimonial-name">${t.author}</div>
              <div class="testimonial-role">${t.role}</div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }
}

/* ============================================================
   UTILITY FILTER CONTROLLERS & DIALOG SYSTEMS
============================================================ */
function setProductFilter(catId) {
  activeCategoryFilter = catId;
  renderAllComponents();
  
  // FIXED NAVIGATION BAR ORANGE HIGHLIGHT SWITCH LOGIC
  document.querySelectorAll('#filter-tabs .filter-tab-btn').forEach(btn => {
     btn.classList.remove('active');
  });
  const activeBtn = Array.from(document.querySelectorAll('#filter-tabs .filter-tab-btn')).find(btn => btn.getAttribute('onclick').includes(catId));
  if(activeBtn) activeBtn.classList.add('active');

  const targetElement = document.getElementById('featured');
  if(targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
}

function openBookingDialogue(serviceId, serviceName, servicePrice) {
  const modalEl = document.getElementById('bookingModal');
  const titleInput = document.getElementById('bookingServiceName');
  if (!modalEl || !titleInput) return;
  
  // Store service details in the modal for later use
  modalEl.setAttribute('data-service-id', serviceId);
  modalEl.setAttribute('data-service-name', serviceName);
  modalEl.setAttribute('data-service-price', servicePrice);
  
  titleInput.value = serviceName;
  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();
}

function handleBookingSubmit() {
  const form = document.getElementById('technicianBookingForm');
  const modalEl = document.getElementById('bookingModal');
  
  if (!form || !modalEl) return;
  
  // Get service details from modal
  const serviceId = modalEl.getAttribute('data-service-id');
  const serviceName = modalEl.getAttribute('data-service-name');
  const servicePrice = modalEl.getAttribute('data-service-price');
  
  // Get form data
  const formData = new FormData(form);
  const bookingData = {
    serviceId: parseInt(serviceId),
    customerName: formData.get('customerName'),
    customerEmail: formData.get('customerEmail'),
    customerPhone: formData.get('customerPhone'),
    preferredDate: formData.get('preferredDate'),
    preferredTime: formData.get('preferredTime'),
    address: formData.get('address'),
    notes: formData.get('notes') || ''
  };
  
  // Check if user is logged in
  const session = localStorage.getItem('userSession');
  if (!session) {
    ToastSystem.trigger('Please login to book a service', '⚠️');
    return;
  }
  
  const user = JSON.parse(session);
  const token = user.token;
  
  // Get API URL
  const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : `${window.location.protocol}//${window.location.host}/api`;
  
  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Booking...';
  
  // Send booking to API
  fetch(`${API_URL}/service-bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(bookingData)
  })
  .then(response => response.json())
  .then(data => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
    
    if (data.success) {
      // Close modal
      const closeBtn = document.getElementById('closeBookingModalBtn');
      if (closeBtn) closeBtn.click();
      
      // Show success message
      setTimeout(() => {
        ToastSystem.trigger(`Service booked successfully! Booking ID: ${data.booking.id}`, '✅');
        form.reset();
      }, 400);
    } else {
      ToastSystem.trigger(data.message || 'Failed to book service', '❌');
    }
  })
  .catch(error => {
    console.error('Booking error:', error);
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
    ToastSystem.trigger('Failed to book service. Please try again.', '❌');
  });
}

/* ============================================================
   COMPONENT REQUEST FUNCTIONS
============================================================ */

function openComponentRequestModal() {
  const modalEl = document.getElementById('componentRequestModal');
  if (!modalEl) return;
  
  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();
  
  // Load user's requests
  loadMyComponentRequests();
  
  // Setup character counter
  const textarea = document.getElementById('componentRequestMessage');
  const charCount = document.getElementById('charCount');
  if (textarea && charCount) {
    textarea.addEventListener('input', () => {
      charCount.textContent = textarea.value.length;
    });
  }
}

async function handleComponentRequest() {
  const textarea = document.getElementById('componentRequestMessage');
  const message = textarea.value.trim();
  
  if (!message) {
    ToastSystem.trigger('Please enter a component request', '⚠️');
    return;
  }
  
  // Get session token
  const session = localStorage.getItem('pchaven_session');
  if (!session) {
    ToastSystem.trigger('Please login to submit a request', '⚠️');
    return;
  }
  
  const user = JSON.parse(session);
  const token = user.token;
  
  // Get API URL
  const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : `${window.location.protocol}//${window.location.host}/api`;
  
  try {
    const response = await fetch(`${API_URL}/component-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });
    
    const data = await response.json();
    
    if (data.success) {
      ToastSystem.trigger('Component request submitted successfully! 🎯', '✅');
      textarea.value = '';
      document.getElementById('charCount').textContent = '0';
      
      // Reload requests list
      loadMyComponentRequests();
    } else {
      ToastSystem.trigger(data.message || 'Failed to submit request', '❌');
    }
  } catch (error) {
    console.error('Component request error:', error);
    ToastSystem.trigger('Failed to submit request. Please try again.', '❌');
  }
}

async function loadMyComponentRequests() {
  const container = document.getElementById('myRequestsList');
  if (!container) return;
  
  // Get session token
  const session = localStorage.getItem('pchaven_session');
  if (!session) {
    container.innerHTML = '<div class="text-center text-muted py-3"><small>Please login to view requests</small></div>';
    return;
  }
  
  const user = JSON.parse(session);
  const token = user.token;
  
  // Get API URL
  const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : `${window.location.protocol}//${window.location.host}/api`;
  
  try {
    const response = await fetch(`${API_URL}/component-requests`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success && data.requests.length > 0) {
      container.innerHTML = data.requests.map(req => {
        const statusColors = {
          'Pending': 'warning',
          'Reviewed': 'info',
          'Fulfilled': 'success',
          'Rejected': 'danger'
        };
        const statusColor = statusColors[req.status] || 'secondary';
        const date = new Date(req.created_at).toLocaleDateString();
        
        return `
          <div class="request-item mb-3 p-3" style="background: var(--bg-muted); border-radius: 8px; border-left: 3px solid var(--accent);">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge bg-${statusColor}" style="font-size: 0.7rem;">${req.status}</span>
              <small class="text-muted">${date}</small>
            </div>
            <p class="mb-2" style="font-size: 0.9rem; color: var(--text-primary);">${req.request_message}</p>
            ${req.admin_response ? `
              <div class="mt-2 pt-2" style="border-top: 1px solid var(--border);">
                <small class="text-secondary d-block mb-1"><i class="bi bi-reply"></i> Admin Response:</small>
                <small style="color: var(--text-primary);">${req.admin_response}</small>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    } else {
      container.innerHTML = `
        <div class="text-center text-muted py-3">
          <i class="bi bi-inbox fs-3 d-block mb-2"></i>
          <small>No requests yet</small>
        </div>
      `;
    }
  } catch (error) {
    console.error('Load requests error:', error);
    container.innerHTML = '<div class="text-center text-danger py-3"><small>Failed to load requests</small></div>';
  }
}

// Global Ticker Loop initializer 
function initTickerSystem() {
  const element = document.getElementById('ticker-content');
  if (!element) return;
  const messaging = [
    "⚡ PC HAVEN STOCK ALERT: AMD RYZEN 7 9800X3D ALLOCATIONS ALLOTTED IN QUANTITY POOLS",
    "🛡️ EXPERT ON-SITE DIAGNOSTIC DISPATCH WORKFORCE RUNNING ACTIVE OPS METRIC",
    "🔥 EXCLUSIVE INTEL ULTRA GENERATION CORE TRAFFIC RE-ROUTED CLIENT DISPATCHES OPEN"
  ];
  element.innerHTML = [...messaging, ...messaging].map(m => `<span>${m}</span>`).join('');
}

// Flash Sale Countdown clock setup simulation
function runPromoTimer() {
  const container = document.getElementById('countdown');
  if (!container) return;
  let hours = 14, minutes = 32, seconds = 45;

  setInterval(() => {
    seconds--;
    if (seconds < 0) { seconds = 59; minutes--; }
    if (minutes < 0) { minutes = 59; hours--; }
    if (hours < 0) { hours = 24; } 

    container.innerHTML = `
      <div class="countdown-unit"><span class="countdown-num">${String(hours).padStart(2, '0')}</span><span class="countdown-label">HR</span></div>
      <div class="countdown-unit"><span class="countdown-num">${String(minutes).padStart(2, '0')}</span><span class="countdown-label">MIN</span></div>
      <div class="countdown-unit"><span class="countdown-num">${String(seconds).padStart(2, '0')}</span><span class="countdown-label">SEC</span></div>
    `;
  }, 1000);
}

/* ============================================================
   MAIN DOM EXECUTION DOM CONTENT LOAD EVENT REGISTER
============================================================ */
document.addEventListener('DOMContentLoaded', async () => {
  // Check if user is logged in, redirect to login if not
  const session = localStorage.getItem('pchaven_session');
  if (!session) {
    window.location.href = 'index.html';
    return;
  }
  
  const user = JSON.parse(session);
  if (!user.loggedIn) {
    window.location.href = 'index.html';
    return;
  }
  
  // Load inventory first
  await loadInventory();
  
  ThemeEngine.init();
  CartManager.syncBadge();
  renderAllComponents();
  initTickerSystem();
  runPromoTimer();
  
  // Initialize PC Builder
  PCBuilder.init();
  
  // Check user session and update UI
  updateUserSection();

  window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Dynamic Navigation highlighters for the structural page anchors
  const navLinks = document.querySelectorAll('#mainNav .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  const cartToggle = document.getElementById('cartToggleBtn');
  const cartClose = document.getElementById('cartCloseBtn');
  const cartOverlay = document.getElementById('cartOverlay');
  const drawer = document.getElementById('cartDrawer');

  if (cartToggle && drawer && cartOverlay) {
    cartToggle.addEventListener('click', () => {
      drawer.classList.add('open');
      cartOverlay.classList.add('open');
      CartManager.renderDrawer();
    });
  }

  const closeCartAction = () => {
    if(drawer) drawer.classList.remove('open');
    if(cartOverlay) cartOverlay.classList.remove('open');
  };

  if (cartClose) cartClose.addEventListener('click', closeCartAction);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartAction);

  document.getElementById('themeToggle')?.addEventListener('click', () => ThemeEngine.toggle());
  document.getElementById('themeToggleMobile')?.addEventListener('click', () => ThemeEngine.toggle());
  
  // Mobile Menu Functionality
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  function openMobileMenu() {
    hamburgerBtn?.classList.add('active');
    mobileMenu?.classList.add('active');
    mobileMenuOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeMobileMenu() {
    hamburgerBtn?.classList.remove('active');
    mobileMenu?.classList.remove('active');
    mobileMenuOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  hamburgerBtn?.addEventListener('click', openMobileMenu);
  mobileMenuClose?.addEventListener('click', closeMobileMenu);
  mobileMenuOverlay?.addEventListener('click', closeMobileMenu);
  
  // Close menu when clicking nav links
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });
});

/* ============================================================
   USER SESSION MANAGEMENT
============================================================ */
function updateUserSection() {
  const userSection = document.getElementById('userSection');
  const mobileUserSection = document.getElementById('mobileUserSection');
  if (!userSection) return;
  
  const session = localStorage.getItem('pchaven_session');
  
  if (session) {
    const user = JSON.parse(session);
    if (user.loggedIn) {
      // Desktop User Dropdown
      userSection.innerHTML = `
        <div class="user-dropdown d-none d-lg-block">
          <button class="btn-user-nav" id="userMenuBtn" title="${user.name}">
            <i class="bi bi-person-circle"></i>
            <span class="d-none d-md-inline">${user.name.split(' ')[0]}</span>
          </button>
          <div class="user-dropdown-menu" id="userDropdownMenu">
            <div class="user-dropdown-header">
              <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
              <div>
                <div class="user-name">${user.name}</div>
                <div class="user-email">${user.email}</div>
              </div>
            </div>
            <div class="user-dropdown-divider"></div>
            <a href="#" class="user-dropdown-item" onclick="event.preventDefault(); showMyOrders()">
              <i class="bi bi-box-seam"></i> My Orders
            </a>
            <a href="#pc-builder" class="user-dropdown-item">
              <i class="bi bi-pc-display"></i> My Builds
            </a>
            <div class="user-dropdown-divider"></div>
            <a href="#" class="user-dropdown-item text-danger" onclick="event.preventDefault(); logoutUser()">
              <i class="bi bi-box-arrow-right"></i> Logout
            </a>
          </div>
        </div>
      `;
      
      // Mobile User Section
      if (mobileUserSection) {
        mobileUserSection.innerHTML = `
          <div class="mobile-user-info-section">
            <div class="mobile-user-info-item">
              <i class="bi bi-person-circle"></i>
              <span>${user.name}</span>
            </div>
            <div class="mobile-user-info-item">
              <i class="bi bi-envelope"></i>
              <span>${user.email}</span>
            </div>
          </div>
          <div class="mobile-menu-section">
            <h4>Account</h4>
            <a href="#" class="mobile-nav-link" onclick="event.preventDefault(); showMyOrders()">
              <i class="bi bi-box-seam"></i> My Orders
            </a>
            <a href="#pc-builder" class="mobile-nav-link">
              <i class="bi bi-pc-display"></i> My Builds
            </a>
            <a href="#" class="mobile-nav-link text-danger" onclick="event.preventDefault(); logoutUser()">
              <i class="bi bi-box-arrow-right"></i> Logout
            </a>
          </div>
        `;
      }
      
      // Toggle desktop dropdown
      const userMenuBtn = document.getElementById('userMenuBtn');
      const userDropdownMenu = document.getElementById('userDropdownMenu');
      
      userMenuBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdownMenu.classList.toggle('show');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        userDropdownMenu.classList.remove('show');
      });
      
      return;
    }
  }
  
  // User is not logged in
  userSection.innerHTML = `
    <a href="index.html" class="btn-login-nav" title="Login">
      <i class="bi bi-person-circle"></i>
    </a>
  `;
}

function logoutUser() {
  // Create custom modal for logout confirmation
  const modal = document.createElement('div');
  modal.className = 'custom-modal-overlay';
  modal.innerHTML = `
    <div class="custom-modal">
      <div class="custom-modal-header">
        <i class="bi bi-box-arrow-right text-danger"></i>
        <h5>Logout Confirmation</h5>
      </div>
      <div class="custom-modal-body">
        <p>Are you sure you want to logout? You'll need to sign in again to access your account.</p>
      </div>
      <div class="custom-modal-footer">
        <button class="btn-modal-cancel" onclick="this.closest('.custom-modal-overlay').remove()">
          <i class="bi bi-x-circle"></i> Cancel
        </button>
        <button class="btn-modal-confirm btn-danger" onclick="confirmLogout(); this.closest('.custom-modal-overlay').remove();">
          <i class="bi bi-box-arrow-right"></i> Logout
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

function confirmLogout() {
  localStorage.removeItem('pchaven_session');
  localStorage.removeItem('pchaven_remember');
  ToastSystem.trigger('Logged out successfully', '👋');
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}


/* ============================================================
   MY ORDERS FEATURE
============================================================ */
function showMyOrders() {
  const session = localStorage.getItem('pchaven_session');
  if (!session) {
    ToastSystem.trigger('Please login to view orders', '⚠️');
    return;
  }
  
  const user = JSON.parse(session);
  const token = user.token;
  
  // Get API URL
  const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : `${window.location.protocol}//${window.location.host}/api`;
  
  // Show loading modal
  const loadingModal = document.createElement('div');
  loadingModal.className = 'custom-modal-overlay';
  loadingModal.innerHTML = `
    <div class="custom-modal">
      <div class="custom-modal-body text-center">
        <i class="bi bi-hourglass-split" style="font-size: 2rem;"></i>
        <p>Loading orders...</p>
      </div>
    </div>
  `;
  document.body.appendChild(loadingModal);
  
  // Fetch orders from API
  fetch(`${API_URL}/orders`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    // Remove loading modal
    loadingModal.remove();
    
    if (!data.success) {
      ToastSystem.trigger(data.message || 'Failed to load orders', '❌');
      return;
    }
    
    const orders = data.orders || [];
    
    // Create orders modal
    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';
    modal.innerHTML = `
      <div class="custom-modal orders-modal">
        <div class="custom-modal-header">
          <h5><i class="bi bi-box-seam"></i> My Orders</h5>
        </div>
        <div class="custom-modal-body">
          ${orders.length === 0 ? `
            <div class="orders-empty">
              <i class="bi bi-inbox"></i>
              <p>No orders yet. Start shopping to see your orders here!</p>
            </div>
          ` : `
            <div class="orders-list">
              ${orders.map((order, index) => `
                <div class="order-card" data-order-index="${index}">
                  <div class="order-header">
                    <h6>${order.order_id}</h6>
                    <span class="order-status ${order.status === 'Cancelled' ? 'status-cancelled' : ''}">
                      <i class="bi ${order.status === 'Cancelled' ? 'bi-x-circle' : 'bi-clock-history'}"></i> ${order.status}
                    </span>
                  </div>
                  <div class="order-date">
                    <i class="bi bi-calendar3"></i>
                    ${new Date(order.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div class="order-items">
                    ${order.items.map(item => `
                      <div class="order-item">
                        <span class="order-item-name">${item.name}</span>
                        <span class="order-item-qty">x${item.qty}</span>
                        <span class="order-item-price">₱${(parseFloat(item.price) * parseInt(item.qty)).toLocaleString('en-US')}</span>
                      </div>
                    `).join('')}
                  </div>
                  <div class="order-total">
                    <span class="order-total-label">Total:</span>
                    <span class="order-total-amount">₱${parseFloat(order.total).toLocaleString('en-US')}</span>
                  </div>
                  ${order.status !== 'Cancelled' && order.status !== 'Delivered' ? `
                    <div class="order-actions">
                      <button class="btn-cancel-order" onclick="cancelOrder('${order.order_id}')">
                        <i class="bi bi-x-circle"></i> Cancel Order
                      </button>
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          `}
        </div>
        <div class="custom-modal-footer">
          <button class="btn-modal-confirm" onclick="this.closest('.custom-modal-overlay').remove()">
            <i class="bi bi-check-lg"></i> Close
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  })
  .catch(error => {
    loadingModal.remove();
    console.error('Fetch orders error:', error);
    ToastSystem.trigger('Failed to load orders. Please try again.', '❌');
  });
}

function cancelOrder(orderId) {
  // Show confirmation modal
  const confirmModal = document.createElement('div');
  confirmModal.className = 'custom-modal-overlay';
  confirmModal.innerHTML = `
    <div class="custom-modal">
      <div class="custom-modal-header">
        <i class="bi bi-exclamation-triangle-fill text-warning"></i>
        <h5>Cancel Order</h5>
      </div>
      <div class="custom-modal-body">
        <p>Are you sure you want to cancel order <strong>${orderId}</strong>?</p>
        <p class="text-muted small">This action cannot be undone.</p>
      </div>
      <div class="custom-modal-footer">
        <button class="btn-modal-cancel" onclick="this.closest('.custom-modal-overlay').remove()">
          <i class="bi bi-x-circle"></i> No, Keep Order
        </button>
        <button class="btn-modal-confirm btn-danger" onclick="confirmCancelOrder('${orderId}'); this.closest('.custom-modal-overlay').remove();">
          <i class="bi bi-trash3"></i> Yes, Cancel Order
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(confirmModal);
  
  // Close on overlay click
  confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) {
      confirmModal.remove();
    }
  });
}

function confirmCancelOrder(orderId) {
  const session = localStorage.getItem('pchaven_session');
  if (!session) {
    ToastSystem.trigger('Session expired. Please login again.', '⚠️');
    return;
  }
  
  const user = JSON.parse(session);
  const token = user.token;
  
  // Get API URL
  const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : `${window.location.protocol}//${window.location.host}/api`;
  
  // Call API to cancel order
  fetch(`${API_URL}/orders/${orderId}/cancel`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Show success message
      ToastSystem.trigger('Order cancelled successfully', '✅');
      
      // Close the orders modal and reopen it to show updated status
      const ordersModal = document.querySelector('.orders-modal');
      if (ordersModal) {
        ordersModal.closest('.custom-modal-overlay').remove();
      }
      
      // Reopen orders modal with updated data
      setTimeout(() => {
        showMyOrders();
      }, 300);
    } else {
      ToastSystem.trigger(data.message || 'Failed to cancel order', '❌');
    }
  })
  .catch(error => {
    console.error('Cancel order error:', error);
    ToastSystem.trigger('Failed to cancel order. Please try again.', '❌');
  });
}

