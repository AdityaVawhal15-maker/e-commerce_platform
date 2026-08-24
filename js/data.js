const ZEN_DATA = {
  cats: ["All","Audio","Wearables","Tech","Footwear","Accessories","Home","Apparel"],
  products: [
    {
      id:1, name:"Nova Pods Pro", cat:"Audio", price:129.99, old:179.99,
      rating:4.9, reviews:2314, badge:"sale",
      colors:["#101014","#ff4d24","#e8e3d8"],
      desc:"Flagship true-wireless earbuds with adaptive ANC, spatial audio and a jaw-dropping 36-hour battery. Tuned by people who are unreasonably picky about sound.",
      features:["Adaptive noise cancellation with transparency mode","36h total battery · 10 min charge = 5h playback","IPX5 sweat & splash resistant","Bluetooth 5.4 multipoint — two devices at once"],
      img:"https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80",
      imgAlt:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
    },
    {
      id:2, name:"Aura Studio Headphones", cat:"Audio", price:299, old:null,
      rating:4.8, reviews:1187, badge:"new",
      colors:["#101014","#7c5cff","#b98a5e"],
      desc:"Studio-grade over-ears with planar magnetic drivers, machined aluminium arms and memory-foam lambskin cups. Reference sound, all-day comfort.",
      features:["Planar magnetic drivers, 5Hz–40kHz","Hybrid ANC with 6-mic array","50-hour battery, USB-C lossless audio","Aerospace aluminium build, 289g"],
      img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
      imgAlt:"https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80"
    },
    {
      id:3, name:"Pulse Smartwatch X", cat:"Wearables", price:199.99, old:249.99,
      rating:4.7, reviews:3421, badge:"sale",
      colors:["#101014","#ff4d24","#1fb57a"],
      desc:"The health lab on your wrist. Dual-band GPS, ECG, blood-oxygen and a sapphire display that laughs at scratches. 14-day battery.",
      features:["1.43\" always-on AMOLED, sapphire glass","ECG + SpO₂ + skin temp sensors","Dual-band GPS with offline maps","14-day typical battery life"],
      img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
      imgAlt:"https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80"
    },
    {
      id:4, name:"Vertex Running Sneakers", cat:"Footwear", price:149, old:null,
      rating:4.8, reviews:1980, badge:"hot",
      colors:["#ff4d24","#101014","#f5f2ec"],
      desc:"Carbon-plated racers with a nitrogen-infused midsole. Broken-in from box one, fast enough for race day.",
      features:["Nitrogen-infused supercritical foam","Full-length carbon fiber plate","Engineered mesh upper, 218g","Grippy rubber outsole, wet & dry"],
      img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
      imgAlt:"https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80"
    },
    {
      id:5, name:"Lumen Desk Lamp", cat:"Home", price:79.99, old:99.99,
      rating:4.6, reviews:764, badge:"sale",
      colors:["#101014","#f5f2ec"],
      desc:"Sculptural LED lamp with 2700–6500K tunable white, wireless charging base and a tap-to-dim top that feels illegal to press.",
      features:["Tunable white 2700K–6500K, CRI 95+","Qi wireless charging pad in base","Tap & slide touch controls","Anodised aluminium arm"],
      img:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
      imgAlt:"https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80"
    },
    {
      id:6, name:"Orbit Drone 4K", cat:"Tech", price:599, old:null,
      rating:4.9, reviews:512, badge:"new",
      colors:["#3c3c42","#f5f2ec"],
      desc:"Cinematic flight in your pocket. 4K/60 HDR, 3-axis gimbal, obstacle sensing on all sides and 38 minutes of air time.",
      features:["4K/60fps HDR, 12MP stills","38-min flight time, 10km range","Omnidirectional obstacle sensing","249g — no registration in most regions"],
      img:"https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=900&q=80",
      imgAlt:"https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=900&q=80"
    },
    {
      id:7, name:"Echo Mini Speaker", cat:"Audio", price:89.99, old:119,
      rating:4.5, reviews:1432, badge:"sale",
      colors:["#ff4d24","#101014","#7c5cff"],
      desc:"Punchy 360° sound in a palm-sized, fully waterproof body. Pair two for instant stereo that fills the whole room.",
      features:["360° driver with passive bass radiator","IP67 waterproof & dustproof","18h battery, USB-C fast charge","Stereo pairing + PartyChain up to 100"],
      img:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
      imgAlt:"https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=900&q=80"
    },
    {
      id:8, name:"Halo Sunglasses", cat:"Accessories", price:139, old:null,
      rating:4.7, reviews:892, badge:null,
      colors:["#101014","#b98a5e"],
      desc:"Hand-polished acetate frames with polarized, category-3 lenses. UV400 as standard, spring hinges as a flex.",
      features:["Polarized CR-39 lenses, UV400","Italian Mazzucchelli acetate","Spring-flex steel core hinges","Includes hard case + microfiber"],
      img:"https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80",
      imgAlt:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80"
    },
    {
      id:9, name:"Titan Mechanical Keyboard", cat:"Tech", price:179.99, old:null,
      rating:4.8, reviews:1655, badge:null,
      colors:["#101014","#f5f2ec"],
      desc:"Gasket-mounted 75% board with hot-swap sockets, south-facing RGB and a typing sound so good you'll invent excuses to type.",
      features:["Gasket mount, FR4 plate, PC foam stack","Hot-swappable 5-pin sockets","Pre-lubed linear switches, 50g actuation","Tri-mode: BT / 2.4GHz / USB-C"],
      img:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
      imgAlt:"https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80"
    },
    {
      id:10, name:"Drift Leather Backpack", cat:"Accessories", price:189, old:229,
      rating:4.7, reviews:1032, badge:"sale",
      colors:["#6b4a2f","#101014"],
      desc:"Full-grain leather daypack with a padded 16\" laptop bay, magnetic quick-clasp and a suspension system that hides how much you packed.",
      features:["Full-grain vegetable-tanned leather","Fits 16\" laptop, tablet & notebook","Magnetic Fidlock quick clasp","YKK Excella zips throughout"],
      img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
      imgAlt:"https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&q=80"
    },
    {
      id:11, name:"Noir Eau de Parfum", cat:"Accessories", price:119, old:null,
      rating:4.6, reviews:2101, badge:null,
      colors:["#101014"],
      desc:"Smoked amber, black pepper and Madagascan vanilla in a hand-finished glass flacon. 12-hour projection, zero apology.",
      features:["Top: bergamot, black pepper","Heart: smoked amber, iris","Base: vanilla, oud, vetiver","100ml · 22% parfum concentration"],
      img:"https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
      imgAlt:"https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80"
    },
    {
      id:12, name:"Cloud Lounge Chair", cat:"Home", price:449, old:549,
      rating:4.9, reviews:445, badge:"sale",
      colors:["#b98a5e","#3c3c42","#f5f2ec"],
      desc:"Deep-seat lounge chair wrapped in bouclé over high-resilience foam and a solid oak frame. The nap headquarters.",
      features:["Solid white-oak frame, 10-yr warranty","High-resilience HR45 foam core","Stain-resistant bouclé upholstery","Assembles in under 10 minutes"],
      img:"https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=900&q=80",
      imgAlt:"https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80"
    },
    {
      id:13, name:"Photon Mirrorless Camera", cat:"Tech", price:899, old:null,
      rating:5.0, reviews:378, badge:"new",
      colors:["#101014","#3c3c42"],
      desc:"26MP APS-C mirrorless with in-body stabilisation, film simulation dials and dual native ISO. Street photography, solved.",
      features:["26MP X-Trans APS-C sensor","5-axis IBIS, 6.5 stops","4K/60 10-bit internal video","Film simulation dial, 17 recipes"],
      img:"https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80",
      imgAlt:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80"
    },
    {
      id:14, name:"Flux Wireless Mouse", cat:"Tech", price:69.99, old:null,
      rating:4.5, reviews:2860, badge:null,
      colors:["#101014","#f5f2ec","#ff4d24"],
      desc:"Featherweight 59g esports mouse with a 26K optical sensor and optical switches rated to 100M clicks. Flick responsibly.",
      features:["59g magnesium-alloy shell","26,000 DPI optical sensor","Optical switches, 100M clicks","8000Hz wireless polling"],
      img:"https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80",
      imgAlt:"https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80"
    },
    {
      id:15, name:"Terra Puffer Jacket", cat:"Apparel", price:229, old:279,
      rating:4.7, reviews:655, badge:"sale",
      colors:["#101014","#6b4a2f","#f5f2ec"],
      desc:"Recycled ripstop puffer with 700-fill responsible down, taped seams and a hood that actually stays up in wind.",
      features:["700-fill RDS certified down","Recycled 20D ripstop shell","Water-repellent, taped seams","Packs into its own pocket"],
      img:"https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80",
      imgAlt:"https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80"
    },
    {
      id:16, name:"Zenith Chrono Watch", cat:"Wearables", price:349, old:null,
      rating:4.8, reviews:720, badge:null,
      colors:["#b98a5e","#101014"],
      desc:"Automatic chronograph with a sapphire exhibition caseback, 42-hour reserve and a bracelet you'll adjust exactly once.",
      features:["Swiss automatic movement, 42h reserve","Sapphire crystal front & back","100m water resistance","Quick-release Horween leather strap"],
      img:"https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80",
      imgAlt:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"
    }
  ],
  testimonials:[
    {n:"Maya Chen", r:"Product designer", t:"Ordered Tuesday, wearing the Pulse X by Thursday. The unboxing alone was worth it — this is how commerce should feel in 2026.", img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=70", s:5},
    {n:"Jordan Reyes", r:"Music producer", t:"The Aura Studios replaced cans that cost twice as much. Flat enough to mix on, comfy enough to forget they're on.", img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=70", s:5},
    {n:"Amara Okafor", r:"Marathon runner", t:"Ran a PB in the Vertex sneakers straight out of the box. Zero break-in. The carbon plate is not marketing.", img:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=70", s:5},
    {n:"Leo Martins", r:"Developer", t:"Titan keyboard sounds like rain on a tin roof, in the best way. Checkout took 20 seconds. I'm suspicious of how smooth this site is.", img:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=70", s:5},
    {n:"Sofia Laurent", r:"Photographer", t:"Photon camera arrived in perfect shape, gift-wrapped, two days early. Support answered my lens question at 1am.", img:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=70", s:5},
    {n:"Dev Patel", r:"Founder", t:"Bought the Cloud chair for the office. Three teammates ordered their own within a week. That's the review.", img:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=70", s:4}
  ]
};
const fmt = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(n);
const zenProduct = id => ZEN_DATA.products.find(p=>p.id===Number(id));
