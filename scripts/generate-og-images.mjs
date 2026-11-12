import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const rootDir = "E:/Projects/Chameleon-MaakolatAlsham";
const pubDir = path.join(rootDir, "public");
const scriptsDir = path.join(rootDir, "scripts");
fs.mkdirSync(scriptsDir, { recursive: true });

function toDataURI(filePath, mime) {
  const buf = fs.readFileSync(filePath);
  return `data:${mime};base64,${buf.toString("base64")}`;
}

const sealLogoUri = toDataURI(path.join(pubDir, "logo-seal.webp"), "image/webp");
const horizLogoUri = toDataURI(path.join(pubDir, "logo-horizontal.webp"), "image/webp");
const backdropUri = toDataURI(path.join(pubDir, "images/hero/wide-saj-banner.webp"), "image/webp");

const sajDomeUri = toDataURI(path.join(pubDir, "images/hero/bento-saj-dome.webp"), "image/webp");
const arabiPlatterUri = toDataURI(path.join(pubDir, "images/hero/bento-arabi-platter.webp"), "image/webp");
const broastedHeroUri = toDataURI(path.join(pubDir, "images/hero/hero-broasted-platter.webp"), "image/webp");
const fattehHeroUri = toDataURI(path.join(pubDir, "images/hero/hero-fatteh-bowl.webp"), "image/webp");

const shawarmaWrapUri = toDataURI(path.join(pubDir, "images/products/shawarma-chicken-saj.webp"), "image/webp");
const arabiDoubleUri = toDataURI(path.join(pubDir, "images/products/arabi-double-meal.webp"), "image/webp");
const broastedWholeUri = toDataURI(path.join(pubDir, "images/products/broasted-whole.webp"), "image/webp");
const grilledWholeUri = toDataURI(path.join(pubDir, "images/products/grilled-whole.webp"), "image/webp");
const mariaUri = toDataURI(path.join(pubDir, "images/products/maria-mozzarella.webp"), "image/webp");
const pizzaShawarmaUri = toDataURI(path.join(pubDir, "images/products/pizza-shawarma.webp"), "image/webp");

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser = fs.existsSync(chromePath) ? chromePath : edgePath;

function buildOgHtml({
  kicker,
  brandSub,
  titlePrefix,
  titleGold,
  desc,
  features,
  ctaText,
  urlText,
  cards,
  bannerTitle,
  bannerPills,
  theme = "sham",
}) {
  const bgGradient =
    theme === "dark"
      ? "linear-gradient(135deg, #160405 0%, #780508 50%, #B90D12 100%)"
      : "linear-gradient(135deg, #780508 0%, #B90D12 55%, #9B0A0E 100%)";

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
      background: #780508;
      color: #ffffff;
    }
    .canvas {
      position: relative;
      width: 1200px;
      height: 630px;
      background: ${bgGradient};
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      padding: 36px 44px;
      overflow: hidden;
    }
    .bg-photo {
      position: absolute;
      inset: 0;
      background-image: url('${backdropUri}');
      background-size: cover;
      background-position: center;
      opacity: 0.12;
      mix-blend-mode: luminosity;
    }
    .glow-1 {
      position: absolute;
      width: 520px;
      height: 520px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,210,26,0.28) 0%, transparent 70%);
      top: -170px;
      left: -100px;
    }
    .glow-2 {
      position: absolute;
      width: 560px;
      height: 560px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(242,169,0,0.20) 0%, transparent 70%);
      bottom: -220px;
      right: 220px;
    }
    .content-col {
      position: relative;
      z-index: 2;
      width: 650px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .top-brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .brand-logo {
      width: 96px;
      height: 96px;
      object-fit: contain;
      flex-shrink: 0;
      filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.45));
    }
    .badge-wrap {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .kicker-pill {
      display: inline-flex;
      align-items: center;
      background: #FFD21A;
      color: #111111;
      font-size: 14.5px;
      font-weight: 900;
      padding: 4px 15px;
      border-radius: 999px;
      width: fit-content;
    }
    .brand-sub {
      font-size: 16.5px;
      font-weight: 800;
      color: #FFF8E8;
    }
    .headline-block { margin-top: 4px; }
    .main-title {
      font-size: 35px;
      font-weight: 900;
      line-height: 1.22;
      color: #FFF8E8;
      text-shadow: 0 6px 20px rgba(0, 0, 0, 0.38);
    }
    .main-title span { color: #FFD21A; white-space: nowrap; }
    .desc {
      margin-top: 8px;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.48;
      color: rgba(255, 248, 232, 0.92);
    }
    .features-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 11px;
      margin-top: 10px;
    }
    .feat-card {
      background: rgba(17, 17, 17, 0.32);
      border: 1px solid rgba(255, 248, 232, 0.24);
      border-radius: 18px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 11px;
    }
    .feat-num {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: #FFD21A;
      color: #111111;
      font-size: 14px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      direction: ltr;
    }
    .feat-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .feat-title {
      font-size: 15.5px;
      font-weight: 900;
      color: #ffffff;
      line-height: 1.25;
      white-space: nowrap;
    }
    .feat-sub {
      font-size: 11.5px;
      font-weight: 700;
      color: rgba(255, 248, 232, 0.84);
      line-height: 1.3;
      white-space: nowrap;
    }
    .bottom-cta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
      background: rgba(17, 17, 17, 0.78);
      border: 1.5px solid rgba(255, 210, 26, 0.55);
      border-radius: 999px;
      padding: 8px 20px 8px 10px;
    }
    .url-text {
      direction: ltr;
      font-size: 16.5px;
      font-weight: 800;
      color: #FFD21A;
      letter-spacing: 0.3px;
    }
    .cta-btn {
      background: #FFD21A;
      color: #111111;
      font-size: 15.5px;
      font-weight: 900;
      padding: 7px 22px;
      border-radius: 999px;
    }
    .visual-col {
      position: relative;
      z-index: 2;
      width: 430px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 13px;
    }
    .showcase-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 13px;
    }
    .prod-card {
      position: relative;
      height: 168px;
      border-radius: 24px;
      overflow: hidden;
      border: 2.5px solid #FFF8E8;
      box-shadow: 0 14px 30px rgba(0, 0, 0, 0.38);
      background: #FFF8E8;
    }
    .prod-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .prod-label {
      position: absolute;
      bottom: 7px;
      right: 7px;
      left: 7px;
      background: rgba(17, 17, 17, 0.92);
      color: #ffffff;
      font-size: 11.5px;
      font-weight: 800;
      padding: 5px 8px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      white-space: nowrap;
      gap: 6px;
    }
    .prod-label span.lbl {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .prod-label span.tag {
      background: #FFD21A;
      color: #111111;
      font-size: 10px;
      font-weight: 900;
      padding: 2px 7px;
      border-radius: 99px;
      flex-shrink: 0;
    }
    .cats-banner {
      background: #FFF8E8;
      color: #111111;
      border-radius: 22px;
      padding: 11px 14px;
      box-shadow: 0 14px 30px rgba(0, 0, 0, 0.38);
      border: 2px solid #FFD21A;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      overflow: hidden;
    }
    .cats-banner-right {
      display: flex;
      flex-direction: column;
      gap: 5px;
      flex: 1;
      min-width: 0;
    }
    .cats-banner-title {
      font-size: 13px;
      font-weight: 900;
      color: #B90D12;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .cats-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .cat-pill {
      background: #ffffff;
      color: #111111;
      border: 1px solid rgba(185, 13, 18, 0.22);
      font-size: 10.5px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 99px;
    }
    .horiz-logo {
      height: 44px;
      max-width: 132px;
      width: auto;
      object-fit: contain;
      flex-shrink: 0;
    }
  </style>
</head>
<body>
  <div class="canvas">
    <div class="bg-photo"></div>
    <div class="glow-1"></div>
    <div class="glow-2"></div>

    <div class="content-col">
      <div class="top-brand">
        <img src="${sealLogoUri}" class="brand-logo" alt="" />
        <div class="badge-wrap">
          <div class="kicker-pill">${kicker}</div>
          <div class="brand-sub">${brandSub}</div>
        </div>
      </div>

      <div class="headline-block">
        <div class="main-title">${titlePrefix} <span>${titleGold}</span></div>
        <div class="desc">${desc}</div>
      </div>

      <div class="features-grid">
        ${features
          .map(
            (f, idx) => `
          <div class="feat-card">
            <div class="feat-num">0${idx + 1}</div>
            <div class="feat-text">
              <div class="feat-title">${f.title}</div>
              <div class="feat-sub">${f.sub}</div>
            </div>
          </div>`
          )
          .join("")}
      </div>

      <div class="bottom-cta">
        <div class="cta-btn">${ctaText}</div>
        <div class="url-text">${urlText}</div>
      </div>
    </div>

    <div class="visual-col">
      <div class="showcase-grid">
        ${cards
          .map(
            (c) => `
          <div class="prod-card">
            <img src="${c.img}" alt="" />
            <div class="prod-label">
              <span class="lbl">${c.label}</span>
              <span class="tag">${c.tag}</span>
            </div>
          </div>`
          )
          .join("")}
      </div>

      <div class="cats-banner">
        <div class="cats-banner-right">
          <div class="cats-banner-title">${bannerTitle}</div>
          <div class="cats-pills">
            ${bannerPills.map((p) => `<span class="cat-pill">${p}</span>`).join("")}
          </div>
        </div>
        <img src="${horizLogoUri}" class="horiz-logo" alt="" />
      </div>
    </div>
  </div>
</body>
</html>`;
}

const ogPages = [
  {
    file: "og-image.jpg",
    theme: "sham",
    kicker: "ألذ طعم وأحلى مذاق • مدينة بدر",
    brandSub: "شاورما وبروستد مأكولات الشام — ميدان النسر • إيجل مول",
    titlePrefix: "شاورما عالصاج وبروستد",
    titleGold: "مأكولات الشام",
    desc: "أصل الشاورما السوري عالصاج، الفراخ البروستد الذهبية، الفراخ المشوية، والفتة الشامية مع توصيل سريع لكل مدينة بدر.",
    features: [
      { title: "شاورما سوري وعربي", sub: "عيش صاج طازة وثومية كريمي" },
      { title: "فراخ بروستد ومشوية", sub: "وجبات فردية وعائلية حتى ٢٠ قطعة" },
      { title: "فتة شامية وبيتزا", sub: "بالموتزاريلا والمشروم والأرز البسمتي" },
      { title: "توصيل سريع بمدينة بدر", sub: "01023182006 • إيجل مول بجوار البنك الأهلي" },
    ],
    ctaText: "اطلب أونلاين الآن",
    urlText: "maakolatalsham.chameleon.vision",
    cards: [
      { img: shawarmaWrapUri, label: "شاورما عالصاج", tag: "الأكثر طلباً" },
      { img: arabiPlatterUri, label: "وجبة شاورما عربي", tag: "عربي ودبل" },
      { img: broastedHeroUri, label: "فراخ بروستد مقرمشة", tag: "عادي وسبايسي" },
      { img: fattehHeroUri, label: "فتة شاورما شامية", tag: "موتزاريلا" },
    ],
    bannerTitle: "أقسام منيو مأكولات الشام:",
    bannerPills: ["شاورما", "وجبات عربي", "بروستد", "مشويات", "فتة", "بيتزا"],
  },
  {
    file: "og-menu.jpg",
    theme: "dark",
    kicker: "المنيو التفاعلي الكامل بالأسعار • ٩ أقسام",
    brandSub: "شاورما وبروستد مأكولات الشام — مدينة بدر • 01023182006",
    titlePrefix: "منيو شاورما وبروستد",
    titleGold: "مأكولات الشام",
    desc: "تصفح أكثر من ٦٠ صنفًا بالأسعار والأحجام المحدثة وأضف طلبك للسلة مباشرة مع الإضافات.",
    features: [
      { title: "سندوتشات ووجبات شاورما", sub: "فراخ ولحمة وميكس وماريا وبأوزان الكيلو" },
      { title: "البروستد والفراخ المشوية", sub: "ربع، نصف، وفرخة كاملة مع الأرز والثومية" },
      { title: "الفتة والوجبات الغربي", sub: "فتة شاورما، كريسبي، زنجر، شيش، وفاهيتا" },
      { title: "البيتزا والفلافل والصوصات", sub: "مارجريتا، شاورما، فلافل شامي، وثومية" },
    ],
    ctaText: "افتح المنيو واطلب الآن",
    urlText: "maakolatalsham.chameleon.vision/menu",
    cards: [
      { img: arabiDoubleUri, label: "عربي شاورما دبل", tag: "وجبات" },
      { img: broastedWholeUri, label: "بروستد عائلي", tag: "مقرمش" },
      { img: mariaUri, label: "وجبة ماريا موتزاريلا", tag: "مميز" },
      { img: pizzaShawarmaUri, label: "بيتزا شاورما", tag: "طازجة" },
    ],
    bannerTitle: "المنيو التفاعلي + المنيو الورقي PDF:",
    bannerPills: ["وسط M", "كبير L", "إكس لارج XL", "إضافات وصوصات"],
  },
  {
    file: "og-offers.jpg",
    theme: "sham",
    kicker: "عروض التوفير والولائم العائلية",
    brandSub: "شاورما وبروستد مأكولات الشام — إيجل مول مدينة بدر",
    titlePrefix: "عروض ووجبات التوفير",
    titleGold: "من مأكولات الشام",
    desc: "ولائم البروستد العائلية، كومبو الشاورما العربي الدبل، وبوكسات الشاورما بالكيلو بأفضل قيمة في مدينة بدر.",
    features: [
      { title: "وليمة الفرخة البروستد", sub: "٨ قطع مقرمشة مع البطاطس والكولسلو والثومية" },
      { title: "كومبو العربي الدبل", sub: "١٢ قطعة شاورما محمصة مع بطاطس وصوصات" },
      { title: "بوكس نصف كيلو شاورما", sub: "مع العيش السوري الطازج والمخلل والثومية" },
      { title: "توصيل ساخن وسريع", sub: "لكل أحياء ومجاورات مدينة بدر" },
    ],
    ctaText: "اكتشف العروض الآن",
    urlText: "maakolatalsham.chameleon.vision/offers",
    cards: [
      { img: broastedWholeUri, label: "فرخة بروستد كاملة", tag: "عرض عائلي" },
      { img: arabiDoubleUri, label: "كومبو عربي دبل", tag: "توفير" },
      { img: mariaUri, label: "ماريا بالموتزاريلا", tag: "الأكثر طلباً" },
      { img: grilledWholeUri, label: "فرخة مشوية كاملة", tag: "عالفحم" },
    ],
    bannerTitle: "اطلب عرضك أونلاين أو هاتفياً:",
    bannerPills: ["01023182006", "01122060877", "01554545824"],
  },
  {
    file: "og-branches.jpg",
    theme: "dark",
    kicker: "العنوان الرسمي ونطاق التوصيل • مدينة بدر",
    brandSub: "ميدان النسر — إيجل مول — بجوار البنك الأهلي",
    titlePrefix: "فرع مدينة بدر",
    titleGold: "شاورما وبروستد مأكولات الشام",
    desc: "استلم طلبك ساخناً من إيجل مول بميدان النسر أو اطلب التوصيل السريع لكافة أحياء ومجاورات مدينة بدر.",
    features: [
      { title: "ميدان النسر — إيجل مول", sub: "بجوار البنك الأهلي — قلب مدينة بدر" },
      { title: "تغطية شاملة للأحياء", sub: "الأول للسابع، الياسمين، الأندلس، ودار مصر" },
      { title: "٥ خطوط طلبات سريعة", sub: "01023182006 • 01122060877 • 01554545824" },
      { title: "موقع دقيق على الخريطة", sub: "روابط خرائط جوجل الرسمية المباشرة" },
    ],
    ctaText: "عرض الخريطة وأرقام الفرع",
    urlText: "maakolatalsham.chameleon.vision/branches",
    cards: [
      { img: sajDomeUri, label: "خبز صاج طازج يومياً", tag: "إيجل مول" },
      { img: arabiPlatterUri, label: "وجبات ساخنة للتوصيل", tag: "دليفري" },
      { img: broastedHeroUri, label: "بروستد ذهبي مقرمش", tag: "طازج" },
      { img: shawarmaWrapUri, label: "سندوتشات سوري", tag: "سريع" },
    ],
    bannerTitle: "نغطي جميع مناطق مدينة بدر:",
    bannerPills: ["ميدان النسر", "الأحياء ١–٧", "دار مصر", "سكن مصر", "زهرة العاصمة"],
  },
  {
    file: "og-occasions.jpg",
    theme: "sham",
    kicker: "ولائم العائلات وتوريد الشركات والجامعات",
    brandSub: "شاورما وبروستد مأكولات الشام — مدينة بدر",
    titlePrefix: "عزومات وولائم",
    titleGold: "مأكولات الشام",
    desc: "تجهيز العزومات العائلية، وجبات الشركات والمصانع، والتجمعات الكبيرة في مدينة بدر في الموعد المحدد.",
    features: [
      { title: "صواني شاورما عربي وماريا", sub: "تشكيلة غنية تكفي كل الضيوف" },
      { title: "ولائم بروستد ومشويات", sub: "فرخات كاملة مع صواني الأرز البسمتي" },
      { title: "وجبات شركات ومصانع", sub: "تغليف محكم وأسعار خاصة للكميات" },
      { title: "تنسيق فوري عبر واتساب", sub: "احجز عزومتك مسبقاً بكل سهولة" },
    ],
    ctaText: "احجز عزومتك الآن",
    urlText: "maakolatalsham.chameleon.vision/occasions",
    cards: [
      { img: arabiPlatterUri, label: "صواني شاورما عربي", tag: "ولائم" },
      { img: broastedWholeUri, label: "وليمة ٢٠ قطعة بروستد", tag: "عائلي" },
      { img: grilledWholeUri, label: "مشويات شامية", tag: "طازجة" },
      { img: fattehHeroUri, label: "صواني فتة شاورما", tag: "بسمتي" },
    ],
    bannerTitle: "جاهزون لتلبية كافة المناسبات:",
    bannerPills: ["عزومات عائلية", "شركات ومصانع", "جامعات", "تجمعات"],
  },
  {
    file: "og-about.jpg",
    theme: "dark",
    kicker: "قصتنا • أكثر من ١٥ ألف متابع في مدينة بدر",
    brandSub: "شاورما وبروستد مأكولات الشام — ألذ طعم وأحلى مذاق",
    titlePrefix: "نكهات شامية أصيلة",
    titleGold: "ومكونات طازجة يومياً",
    desc: "تعرف على سر تتبيلة الشاورما الشامية عالصاج، قرمشة البروستد الذهبية، وشغفنا بتقديم أفضل جودة في مدينة بدر.",
    features: [
      { title: "خبز صاج يُخبز طازجاً", sub: "تحميص مثالي مع كل سندوتش ووجبة" },
      { title: "تتبيلة شامية متوازنة", sub: "شاورما فراخ ولحم صافي يومياً" },
      { title: "بروستد ومشويات طازجة", sub: "قرمشة ذهبية وطعم لا يُقاوم" },
      { title: "+١٥,٠٠٠ متابع", sub: "ثقة أهالي مدينة بدر كل يوم" },
    ],
    ctaText: "اقرأ قصتنا وتصفح المنيو",
    urlText: "maakolatalsham.chameleon.vision/about",
    cards: [
      { img: sajDomeUri, label: "خبز صاج حار", tag: "أصالة" },
      { img: arabiPlatterUri, label: "تتبيلة شامية", tag: "جودة" },
      { img: broastedHeroUri, label: "قرمشة ذهبية", tag: "طازج" },
      { img: fattehHeroUri, label: "فتة وثومية كريمي", tag: "مذاق" },
    ],
    bannerTitle: "شاورما وبروستد مأكولات الشام:",
    bannerPills: ["أصالة الطعم", "مكونات طازجة", "توصيل سريع", "مدينة بدر"],
  },
  {
    file: "og-contact.jpg",
    theme: "sham",
    kicker: "أرقام الطلبات والروابط الرسمية • مدينة بدر",
    brandSub: "01023182006 • 01122060877 • 01554545824",
    titlePrefix: "تواصل واطلب الآن من",
    titleGold: "مأكولات الشام",
    desc: "٥ أرقام مخصصة للطلبات السريعة، واتساب مباشر لكاشير الفرع، وكافة حساباتنا الرسمية على السوشيال ميديا.",
    features: [
      { title: "الرقم الأساسي والواتساب", sub: "01023182006 — طلب وتأكيد فوري" },
      { title: "خطوط التوصيل الإضافية", sub: "01122060877 • 01554545824 • 01228722219" },
      { title: "منصاتنا الرسمية", sub: "فيسبوك (+١٥ ألف) • إنستجرام • تيك توك" },
      { title: "العنوان الرسمي", sub: "مدينة بدر — ميدان النسر — إيجل مول" },
    ],
    ctaText: "اتصل أو اطلب عبر واتساب",
    urlText: "maakolatalsham.chameleon.vision/contact",
    cards: [
      { img: shawarmaWrapUri, label: "طلب أونلاين سريع", tag: "واتساب" },
      { img: arabiPlatterUri, label: "توصيل لباب البيت", tag: "مدينة بدر" },
      { img: broastedHeroUri, label: "عروض يومية", tag: "تابعنا" },
      { img: pizzaShawarmaUri, label: "تشكيلة +٦٠ صنف", tag: "منيو كامل" },
    ],
    bannerTitle: "أرقام طلبات مأكولات الشام:",
    bannerPills: ["01023182006", "01122060877", "01554545824", "01228722219", "01114101253"],
  },
];

for (const page of ogPages) {
  const html = buildOgHtml(page);
  const tmpHtml = path.join(scriptsDir, `.tmp-${page.file}.html`);
  const tmpPng = path.join(scriptsDir, `.tmp-${page.file}.png`);
  const outJpg = path.join(pubDir, page.file);

  fs.writeFileSync(tmpHtml, html, "utf8");
  const fileUrl = "file:///" + tmpHtml.replace(/\\/g, "/");

  execFileSync(browser, [
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=1200,630",
    `--screenshot=${tmpPng}`,
    fileUrl,
  ]);

  await sharp(tmpPng)
    .resize(1200, 630, { fit: "cover" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outJpg);

  fs.unlinkSync(tmpHtml);
  fs.unlinkSync(tmpPng);

  const stat = fs.statSync(outJpg);
  console.log(`✓ Generated ${page.file} (${Math.round(stat.size / 1024)} KB)`);
}
