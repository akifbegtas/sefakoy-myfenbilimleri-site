const WHATSAPP_PHONE = "905464401780";
const INSTAGRAM_URL = "https://www.instagram.com/sefakoymyfenbilimleri/";
const SOCIAL_NOTICE_FIRST_DELAY = 5000;
const SOCIAL_NOTICE_NEXT_DELAY = 5000;
const ASSISTANT_ANIMATION_MS = 320;
const DEFAULT_MESSAGE =
  "Merhaba, Sefaköy My Fen Bilimleri hakkında bilgi almak istiyorum.";
const LEAD_STORAGE_KEY = "sefakoy-myfen-leads";
const LEAD_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzG7bg7eeeXg25X_qWX2_GTnDpg_zZMWHPK4Ars61vwUpsxdT49lBEYz3B2P1CfxyJR/exec";
const LEGACY_FORM_HASH = "#ka" + "yit";

if (window.location.hash === LEGACY_FORM_HASH) {
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
}

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("[data-nav-links]");
const infoForm = document.querySelector("#infoForm");
const infoStatus = document.querySelector("#infoStatus");
const infoResult = document.querySelector("#infoResult");
const infoCode = document.querySelector("#infoCode");
const infoSummary = document.querySelector("#infoSummary");
const exportLeads = document.querySelector("#exportLeads");
const assistantPanel = document.querySelector("#assistantPanel");
const assistantToggle = document.querySelector("#assistantToggle");
const assistantClose = document.querySelector("#assistantClose");
const assistantMessages = document.querySelector("#assistantMessages");
const assistantForm = document.querySelector("#assistantForm");
const assistantInput = document.querySelector("#assistantInput");
const socialNoticeCloseButtons = document.querySelectorAll("[data-social-notice-close]");
const successCarousel = document.querySelector("[data-success-carousel]");
const faqItems = document.querySelectorAll("[data-faq-item]");
let assistantTyping = false;
let whatsappNoticeTimer = null;

const SUCCESS_PAGE_SIZE = 10;
const SUCCESS_ROTATION_DELAY = 5000;
const SUCCESS_TRANSITION_MS = 240;

const successStudents = [
  { name: "EFE CAN DEMİR", university: "AFYON KOCATEPE ÜNİ", department: "TIP" },
  { name: "ALEYNA BULUT", university: "DİCLE ÜNİ", department: "TIP" },
  { name: "MEHMET ALİ KARAKAYA", university: "MUĞLA ÜNİ", department: "TIP" },
  { name: "HAMZA AKDOĞAN", university: "İSTANBUL ÜNİ", department: "DİŞ HEKİMLİĞİ" },
  { name: "EMİN OSMAN ŞAHİN", university: "AYDIN ÜNİ", department: "DİŞ HEKİMLİĞİ" },
  { name: "SENA ARPATEPE", university: "KENT ÜNİ", department: "DİŞ HEKİMLİĞİ" },
  { name: "SEZİN SU UZUN", university: "İSTANBUL ÜNİ", department: "ECZACILIK" },
  { name: "MUSTAFA ODABAŞI", university: "MARMARA ÜNİ", department: "ECZACILIK" },
  { name: "ASMIN DEĞİRMENCİ", university: "TÜRK HAVA KURUMU", department: "PİLOTAJ" },
  { name: "MERT ÇAĞAN BEKTAŞ", university: "İSTANBUL SABAHATTİN ZAİM ÜNİ", department: "HUKUK" },
  { name: "GÖRKEM TAŞÇI", university: "BALIKESİR ÜNİ", department: "HUKUK" },
  { name: "AKİF BEĞTAŞ", university: "HALİÇ ÜNİ", department: "YAZILIM MÜHENDİSLİĞİ" },
  { name: "EMİR MUTLU", university: "İSTANBUL ÜNİ", department: "BİLGİSAYAR MÜHENDİSLİĞİ" },
  { name: "BARIŞ YILMAZ", university: "İSTANBUL TEKNİK ÜNİ", department: "MATEMATİK MÜHENDİSLİĞİ" },
  { name: "EREN ORUÇ", university: "İSTANBUL ÜNİ", department: "ELEKTRİK-ELEKTRONİK MÜHENDİSLİĞİ" },
  { name: "MELEK İLERİ ALKAN", university: "NİŞANTAŞI ÜNİ", department: "BİLGİSAYAR MÜHENDİSLİĞİ" },
  { name: "TAHA İLHAN", university: "NİŞANTAŞI ÜNİ", department: "YAZILIM MÜHENDİSLİĞİ" },
  { name: "FATMA NEHİR PINARGÖZÜ", university: "HALİÇ ÜNİ", department: "YAZILIM MÜHENDİSLİĞİ" },
  { name: "YUSUF ÖMER BAYAN", university: "ESKİŞEHİR TEKNİK ÜNİ", department: "ÇEVRE MÜHENDİSLİĞİ" },
  { name: "MERYEM GÜL YILDIRIM", university: "YILDIZ TEKNİK ÜNİ", department: "KİMYA MÜHENDİSLİĞİ" },
  { name: "SELEN KARADEMİR", university: "NİŞANTAŞI ÜNİ", department: "PSİKOLOJİ" },
  { name: "BEDİRHAN ELMAS", university: "NİŞANTAŞI ÜNİ", department: "PSİKOLOJİ" },
  { name: "İSRA CEMRE UNSUR", university: "YENİYÜZYIL ÜNİ", department: "PSİKOLOJİ" },
  { name: "BİLGE AĞUR", university: "AYDIN ÜNİ", department: "PSİKOLOJİ" },
  { name: "ABDULLAH DOĞAN", university: "GELİŞİM ÜNİ", department: "SİYASET BİLİMİ VE ULUSLARARASI İLİŞKİLER" },
  { name: "EMİRHAN DURMAZ", university: "MEDİPOL ÜNİ", department: "SOSYAL HİZMETLER" },
  { name: "BETÜL ÇEVİK", university: "İSTANBUL ÜNİ", department: "BİLGİ VE BELGE YÖNETİMİ" },
  { name: "BERAAT YOLCU", university: "AYDIN ÜNİ", department: "YÖNETİM BİLİŞİM SİSTEMLERİ" },
  { name: "GAMZE NUR IŞIK", university: "KARADENİZ TEKNİK ÜNİ", department: "TÜRK DİLİ VE EDEBİYATI" },
  { name: "MUHAMMED ODABAŞI", university: "MARMARA ÜNİ", department: "SOSYAL BİLGİLER ÖĞRETMENLİĞİ" },
  { name: "SUDE AKSÖYEK", university: "SÜLEYMAN DEMİREL ÜNİ", department: "KİMYA MÜHENDİSLİĞİ" },
  { name: "YAĞMUR OĞRAŞ", university: "AYDIN ÜNİ", department: "GASTRONOMİ" },
  { name: "HÜSNÜFER CANSEVER", university: "GELİŞİM ÜNİ", department: "BESLENME VE DİYETETİK" },
  { name: "MUHAMMET YİĞİT KOÇAK", university: "AYDIN ÜNİ", department: "SİYASET BİLİMİ VE ULUSLARARASI İLİŞKİLER" },
  { name: "RECEP ALTAY", university: "ULUDAĞ ÜNİ", department: "MALİYE" },
  { name: "AZRA BİROL", university: "KENT ÜNİ", department: "SİYASET BİLİMİ VE KAMU YÖNETİMİ" },
  { name: "ESİN SELVİ", university: "YILDIZ TEKNİK ÜNİ", department: "KİMYA MÜHENDİSLİĞİ" },
  { name: "ABDÜLKADİR BİTİGEN", university: "YILDIZ TEKNİK ÜNİ", department: "MATEMATİK" },
  { name: "ENES GÜN", university: "NAMIK KEMAL ÜNİ", department: "BİLGİSAYAR MÜHENDİSLİĞİ" },
  { name: "ÖMER MERT KÜLTE", university: "GEBZE TEKNİK ÜNİ", department: "MAKİNE MÜHENDİSLİĞİ" },
  { name: "EMİR AKIN", university: "CELAL BAYAR ÜNİ", department: "YAZILIM MÜHENDİSLİĞİ" },
  { name: "YAĞMUR ALVER", university: "BOĞAZİÇİ ÜNİ", department: "FEN BİLGİSİ ÖĞRETMENLİĞİ" },
  { name: "AHMET BEKTAŞ", university: "MARMARA ÜNİ", department: "İLKÖĞRETİM MATEMATİK ÖĞRETMENLİĞİ" },
  { name: "EREN PARLAK", university: "MARMARA ÜNİ", department: "SINIF ÖĞRETMENLİĞİ" },
  { name: "MELEK GÜRCAN", university: "DOKUZ EYLÜL ÜNİ", department: "İNGİLİZCE ÖĞRETMENLİĞİ" },
  { name: "ZEYNEP AYDIN", university: "DOKUZ EYLÜL ÜNİ", department: "OKUL ÖNCESİ ÖĞRETMENLİĞİ" },
  { name: "ESMA BAŞ", university: "BOLU ABANT ÜNİ", department: "OKUL ÖNCESİ ÖĞRETMENLİĞİ" },
  { name: "EMRE MUMCU", university: "AYDIN ÜNİ", department: "VETERİNERLİK" },
  { name: "HAMZA KAĞAN TAPTIK", university: "NAMIK KEMAL ÜNİ", department: "VETERİNERLİK" },
  { name: "SILA SELİN ÖZKAN", university: "MEDENİYET ÜNİ", department: "HEMŞİRELİK" },
  { name: "ONUR SAVAŞ", university: "AYDIN ÜNİ", department: "HEMŞİRELİK" },
  { name: "BERSU NEHİR", university: "BOĞAZİÇİ ÜNİ", department: "PSİKOLOJİ" },
  { name: "SELİN DEMİREL", university: "YILDIZ TEKNİK ÜNİ", department: "PDR" },
  { name: "İLKNUR PALABIYIK", university: "YILDIZ TEKNİK ÜNİ", department: "İKTİSAT" },
  { name: "KÜBRANUR DURSUN", university: "İSTANBUL SABAHATTİN ZAİM ÜNİ", department: "PDR" },
  { name: "BERRU HÜRREM BİTİGEN", university: "İSTANBUL ÜNİ", department: "SİYASET BİLİMİ VE ULUSLARARASI İLİŞKİLER" },
];

const universityLogos = {
  "AFYON KOCATEPE ÜNİ": "AKÜ",
  "DİCLE ÜNİ": "DÜ",
  "MUĞLA ÜNİ": "MSKÜ",
  "İSTANBUL ÜNİ": "İÜ",
  "AYDIN ÜNİ": "İAÜ",
  "KENT ÜNİ": "KENT",
  "MARMARA ÜNİ": "MÜ",
  "TÜRK HAVA KURUMU": "THK",
  "İSTANBUL SABAHATTİN ZAİM ÜNİ": "İZÜ",
  "BALIKESİR ÜNİ": "BAÜN",
  "HALİÇ ÜNİ": "HÜ",
  "İSTANBUL TEKNİK ÜNİ": "İTÜ",
  "NİŞANTAŞI ÜNİ": "NÜ",
  "ESKİŞEHİR TEKNİK ÜNİ": "ESTÜ",
  "YILDIZ TEKNİK ÜNİ": "YTÜ",
  "YENİYÜZYIL ÜNİ": "YYÜ",
  "GELİŞİM ÜNİ": "İGÜ",
  "MEDİPOL ÜNİ": "MED",
  "KARADENİZ TEKNİK ÜNİ": "KTÜ",
  "SÜLEYMAN DEMİREL ÜNİ": "SDÜ",
  "ULUDAĞ ÜNİ": "UÜ",
  "NAMIK KEMAL ÜNİ": "NKÜ",
  "GEBZE TEKNİK ÜNİ": "GTÜ",
  "CELAL BAYAR ÜNİ": "CBÜ",
  "BOĞAZİÇİ ÜNİ": "BÜ",
  "DOKUZ EYLÜL ÜNİ": "DEÜ",
  "BOLU ABANT ÜNİ": "BAİBÜ",
  "MEDENİYET ÜNİ": "İMÜ",
};

const universityLogoImages = {
  "AFYON KOCATEPE ÜNİ": "assets/universities/afyon-kocatepe.png",
  "AYDIN ÜNİ": "assets/universities/aydin.jpg",
  "BALIKESİR ÜNİ": "assets/universities/balikesir.png",
  "BOĞAZİÇİ ÜNİ": "assets/universities/bogazici.png",
  "BOLU ABANT ÜNİ": "assets/universities/bolu-abant.png",
  "CELAL BAYAR ÜNİ": "assets/universities/celal-bayar.png",
  "DİCLE ÜNİ": "assets/universities/dicle.png",
  "DOKUZ EYLÜL ÜNİ": "assets/universities/dokuz-eylul.jpg",
  "ESKİŞEHİR TEKNİK ÜNİ": "assets/universities/eskisehir-teknik.png",
  "GEBZE TEKNİK ÜNİ": "assets/universities/gebze-teknik.png",
  "GELİŞİM ÜNİ": "assets/universities/gelisim.png",
  "HALİÇ ÜNİ": "assets/universities/halic.png",
  "İSTANBUL SABAHATTİN ZAİM ÜNİ": "assets/universities/sabahattin-zaim.png",
  "İSTANBUL TEKNİK ÜNİ": "assets/universities/istanbul-teknik.png",
  "İSTANBUL ÜNİ": "assets/universities/istanbul-universitesi.png",
  "KARADENİZ TEKNİK ÜNİ": "assets/universities/karadeniz-teknik.png",
  "KENT ÜNİ": "assets/universities/kent.png",
  "MARMARA ÜNİ": "assets/universities/marmara.png",
  "MEDENİYET ÜNİ": "assets/universities/medeniyet.png",
  "MEDİPOL ÜNİ": "assets/universities/medipol.jpg",
  "MUĞLA ÜNİ": "assets/universities/mugla.png",
  "NAMIK KEMAL ÜNİ": "assets/universities/namik-kemal.png",
  "NİŞANTAŞI ÜNİ": "assets/universities/nisantasi.png",
  "SÜLEYMAN DEMİREL ÜNİ": "assets/universities/suleyman-demirel.png",
  "TÜRK HAVA KURUMU": "assets/universities/turk-hava-kurumu.png",
  "ULUDAĞ ÜNİ": "assets/universities/uludag.png",
  "YENİYÜZYIL ÜNİ": "assets/universities/yeniyuzyil.png",
  "YILDIZ TEKNİK ÜNİ": "assets/universities/yildiz-teknik.png",
};

const logoThemes = [
  ["#1e40af", "#ef4444"],
  ["#10233f", "#2563eb"],
  ["#b91c1c", "#1d4ed8"],
  ["#0f766e", "#2563eb"],
  ["#7c2d12", "#dc2626"],
  ["#3730a3", "#e11d48"],
  ["#0f172a", "#475569"],
];

const buildWhatsappUrl = (message = DEFAULT_MESSAGE) =>
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

const setWhatsappLinks = () => {
  document.querySelectorAll(".js-whatsapp").forEach((link) => {
    const message = link.getAttribute("data-whatsapp-message") || DEFAULT_MESSAGE;
    link.setAttribute("href", buildWhatsappUrl(message));
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noreferrer");
  });
};

const setInstagramLinks = () => {
  document.querySelectorAll("[data-instagram-link]").forEach((link) => {
    link.setAttribute("href", INSTAGRAM_URL);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noreferrer");
  });
};

const showInfoStatus = (message, isError = false) => {
  if (!infoStatus) return;
  infoStatus.textContent = message;
  infoStatus.classList.toggle("is-error", isError);
};

const normalizePhone = (value) => value.replace(/[^\d+]/g, "");

const readLeads = () => {
  try {
    const leads = JSON.parse(localStorage.getItem(LEAD_STORAGE_KEY));
    return Array.isArray(leads) ? leads : [];
  } catch {
    return [];
  }
};

const saveLead = (lead) => {
  const leads = readLeads();
  leads.unshift(lead);
  localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(leads.slice(0, 300)));
};

const sendLeadWebhook = (lead) => {
  if (!LEAD_WEBHOOK_URL) return;

  fetch(LEAD_WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(lead),
  }).catch((err) => {
    console.warn("Lead webhook hatası:", err);
    showInfoStatus("Kayıt bu tarayıcıda saklandı; mail/Sheet bağlantısı kurulamadı.", true);
  });
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getLogoTheme = (university) => {
  const total = Array.from(university).reduce((sum, letter) => sum + letter.charCodeAt(0), 0);
  return logoThemes[total % logoThemes.length];
};

const getLogoSuccessStudents = () =>
  successStudents.filter((student) => universityLogoImages[student.university]);

const renderSuccessStudents = (page = 0) => {
  const logoStudents = getLogoSuccessStudents();
  if (!successCarousel || !logoStudents.length) return;

  const maxStartIndex = Math.max(logoStudents.length - SUCCESS_PAGE_SIZE, 0);
  const startIndex = Math.min(page * SUCCESS_PAGE_SIZE, maxStartIndex);
  const students = Array.from({ length: SUCCESS_PAGE_SIZE }, (_, index) =>
    logoStudents[(startIndex + index) % logoStudents.length],
  );

  const cards = students
    .map((student) => {
      const [logoA, logoB] = getLogoTheme(student.university);
      const logo = universityLogos[student.university] || student.university.slice(0, 3);
      const logoSrc = universityLogoImages[student.university];
      const logoImage = logoSrc
        ? `<img src="${escapeHtml(logoSrc)}" alt="" loading="lazy" onerror="this.remove()">`
        : "";

      return `
        <article class="success-card">
          <span class="success-logo" style="--logo-a: ${logoA}; --logo-b: ${logoB};" aria-label="${escapeHtml(student.university)} logosu">
            ${logoImage}
            <span>${escapeHtml(logo)}</span>
          </span>
          <strong>${escapeHtml(student.name)}</strong>
          <p class="success-school">${escapeHtml(student.university)}</p>
          <p class="success-department">${escapeHtml(student.department)}</p>
        </article>
      `;
    })
    .join("");

  successCarousel.innerHTML = `<div class="success-grid">${cards}</div>`;
};

const startSuccessCarousel = () => {
  if (!successCarousel) return;

  const logoStudents = getLogoSuccessStudents();
  let page = 0;
  const pageCount = Math.ceil(logoStudents.length / SUCCESS_PAGE_SIZE);

  renderSuccessStudents(page);

  if (pageCount <= 1) return;

  window.setInterval(() => {
    const currentGrid = successCarousel.querySelector(".success-grid");
    currentGrid?.classList.add("is-leaving");

    window.setTimeout(() => {
      page = (page + 1) % pageCount;
      renderSuccessStudents(page);

      const nextGrid = successCarousel.querySelector(".success-grid");
      if (nextGrid) {
        nextGrid.classList.add("is-entering");
        void nextGrid.offsetWidth;
        nextGrid.classList.remove("is-entering");
      }
    }, SUCCESS_TRANSITION_MS);
  }, SUCCESS_ROTATION_DELAY);
};

const getSocialNotice = (name) =>
  document.querySelector(`[data-social-notice="${name}"]`);

const showSocialNotice = (name) => {
  const notice = getSocialNotice(name);
  if (!notice) return;
  document.querySelectorAll("[data-social-notice]").forEach((item) => {
    if (item !== notice) {
      item.classList.remove("is-visible", "is-closing");
      item.setAttribute("hidden", "");
    }
  });
  notice.classList.remove("is-closing");
  notice.removeAttribute("hidden");
  window.requestAnimationFrame(() => notice.classList.add("is-visible"));
};

const hideSocialNotice = (notice, onHidden) => {
  notice.classList.remove("is-visible");
  notice.classList.add("is-closing");
  window.setTimeout(() => {
    notice.classList.remove("is-closing");
    notice.setAttribute("hidden", "");
    if (onHidden) onHidden();
  }, 360);
};

const scheduleWhatsappNotice = () => {
  if (whatsappNoticeTimer) window.clearTimeout(whatsappNoticeTimer);
  whatsappNoticeTimer = window.setTimeout(() => {
    showSocialNotice("whatsapp");
    whatsappNoticeTimer = null;
  }, SOCIAL_NOTICE_NEXT_DELAY);
};

const scheduleSocialNotices = () => {
  window.setTimeout(() => {
    showSocialNotice("instagram");

    window.setTimeout(() => {
      const instagramNotice = getSocialNotice("instagram");
      if (instagramNotice && instagramNotice.classList.contains("is-visible")) {
        hideSocialNotice(instagramNotice, scheduleWhatsappNotice);
        return;
      }
      scheduleWhatsappNotice();
    }, SOCIAL_NOTICE_NEXT_DELAY);
  }, SOCIAL_NOTICE_FIRST_DELAY);
};

const setupFaqAnimations = () => {
  faqItems.forEach((item) => {
    const button = item.querySelector("[data-faq-question]");
    const answer = item.querySelector("[data-faq-answer]");
    if (!button || !answer) return;

    const setAnswerHeight = () => {
      answer.style.maxHeight = item.classList.contains("is-open") ? `${answer.scrollHeight}px` : "0px";
    };

    setAnswerHeight();

    button.addEventListener("click", () => {
      const isOpen = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
      answer.setAttribute("aria-hidden", String(!isOpen));
      setAnswerHeight();
    });
  });

  window.addEventListener("resize", () => {
    faqItems.forEach((item) => {
      const answer = item.querySelector("[data-faq-answer]");
      if (answer && item.classList.contains("is-open")) {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });
};

const assistantRules = [
  {
    priority: 4,
    keywords: ["fiyat", "ucret", "ücret", "odeme", "ödeme", "taksit", "pesin", "peşin", "kampanya", "kontenjan"],
    answer:
      "Fiyat ve kontenjan bilgisi öğrencinin sınıfı, hedefi ve seçilecek programa göre netleşir. En sağlıklı yol kısa bir görüşme yapmak; danışman ekip sınıf seviyesini, ihtiyaç duyulan ders yoğunluğunu ve uygun ödeme seçeneklerini birlikte değerlendirir.",
  },
  {
    priority: 4,
    keywords: ["basvuru", "başvuru", "gorusme", "görüşme", "randevu", "nasil baslar", "nasıl başlar"],
    answer:
      "Süreç öğrenci ve veliyle kısa bir hedef görüşmesiyle başlar. Öğrencinin sınıfı, okul durumu, deneme netleri varsa mevcut seviyesi ve hedefi konuşulur. Sonra uygun program, ders yoğunluğu, etüt ihtiyacı ve kontenjan durumu netleştirilir.",
  },
  {
    priority: 5,
    keywords: ["lgs", "8. sınıf", "8 sinif", "sekizinci", "ortaokul", "7. sınıf", "7 sinif", "yedinci"],
    answer:
      "LGS tarafında hedef sadece konu bitirmek değil, öğrencinin yeni nesil soru okuma ve süre yönetimini geliştirmek. Programda konu anlatımı, soru çözümü, düzenli deneme, deneme sonrası eksik analizi, ödev kontrolü ve ihtiyaç oldukça etüt desteği birlikte ilerler. Veliye de öğrencinin devam, ödev ve deneme süreciyle ilgili düzenli bilgi verilir.",
  },
  {
    priority: 5,
    keywords: ["yks", "tyt", "ayt", "mezun", "12. sınıf", "12 sinif", "on ikinci", "11. sınıf", "11 sinif", "universite", "üniversite"],
    answer:
      "YKS programında TYT temeli ve AYT branş takibi ayrı ayrı izlenir. Öğrenciye göre konu planı, deneme takvimi, net analizi ve rehberlik görüşmeleri düzenlenir. 11. sınıf, 12. sınıf ve mezun öğrencilerde tempo farklı olduğu için önce mevcut seviye ve hedef bölüm konuşulup ona göre program önerilir.",
  },
  {
    priority: 5,
    keywords: ["deneme", "sinav", "sınav", "analiz", "net", "sonuc", "sonuç", "rapor", "optik", "eksik"],
    answer:
      "Denemeler sadece puan görmek için değil, öğrencinin nerede kaybettiğini anlamak için kullanılır. Sonuçlarda netler, boş-yanlış dağılımı, konu eksikleri ve süre kullanımı incelenir. Bu analizden sonra etüt, ödev ve tekrar planı güncellenir; veliye de öğrencinin gidişatı hakkında anlaşılır bilgi verilir.",
  },
  {
    priority: 3,
    keywords: ["basari", "başarı", "kazanan", "yerlesen", "yerleşen", "derece", "sonuclar", "sonuçlar"],
    answer:
      "Başarılı öğrenciler bölümünde yalnızca logosu eklenen üniversitelerdeki öğrenciler büyük logolu kartlarla gösteriliyor. Kartlar 10'lu gruplar halinde sağdan sola doğru değişiyor.",
  },
  {
    priority: 5,
    keywords: ["sinif mevcudu", "sınıf mevcudu", "kac kisi", "kaç kişi", "kalabalik", "kalabalık", "siniflar", "sınıflar"],
    answer:
      "Sınıf yapısı öğrencinin takip edilebilir olması için odaklı tutulur. Kesin kontenjan program ve döneme göre değişebilir; bu yüzden görüşmede öğrencinin sınıfı ve istediği program öğrenildikten sonra uygun grup söylenir. Ama amaç kalabalık sınıfta kaybolan öğrenci değil, öğretmenin gelişimini izleyebildiği öğrenci profili oluşturmaktır.",
  },
  {
    priority: 4,
    keywords: ["ozel ders", "özel ders", "vip", "birebir", "etut", "etüt", "telafi", "eksik ders", "matematik", "geometri"],
    answer:
      "Özel ders, VIP sınıf ve etüt desteği özellikle eksik konu kapatmak için kullanılır. Öğrencinin zorlandığı branş tespit edilir, sonra birebir ya da küçük grup çalışmasıyla hızlı telafi planlanır. Matematik ve geometri gibi birikimli derslerde bu destek çok faydalı olur.",
  },
  {
    priority: 4,
    keywords: ["rehberlik", "kocluk", "koçluk", "motivasyon", "program", "plan", "takip", "tercih"],
    answer:
      "Rehberlik tarafında öğrencinin haftalık çalışma düzeni, deneme sonuçları ve motivasyonu takip edilir. Amaç sadece ders anlatmak değil; öğrencinin ne çalışacağını, ne kadar soru çözeceğini ve hangi eksikleri önce kapatacağını bilmesi. Sınav döneminde tercih ve hedef planlaması da bu sürecin parçası olur.",
  },
  {
    priority: 4,
    keywords: ["veli", "devamsizlik", "devamsızlık", "odev", "ödev", "bilgilendirme", "raporlama", "veli takibi"],
    answer:
      "Veli bilgilendirmesinde öğrencinin devamsızlığı, ödev disiplini, deneme sonuçları ve rehberlik notları takip edilir. Böylece veli sadece dönem sonunda değil, süreç içinde öğrencinin nerede iyi gittiğini ve nerede desteğe ihtiyaç duyduğunu görebilir.",
  },
  {
    priority: 4,
    keywords: ["ogretmen", "öğretmen", "hoca", "kadro", "brans", "branş", "egitim kadrosu", "eğitim kadrosu"],
    answer:
      "Öğretmen kadrosunda önemli olan sadece ders anlatımı değil, öğrencinin eksiklerini fark edip doğru yönlendirme yapabilmesidir. Branş öğretmenleri ders, soru çözümü, ödev ve deneme sonuçlarını birlikte değerlendirerek öğrencinin ilerleyişini takip eder.",
  },
  {
    priority: 3,
    keywords: ["adres", "konum", "nerede", "harita", "yol"],
    answer:
      "Konum: SEFAKÖY MY FEN BİLİMLERİ ÖZEL ÖĞRETİM KURSU. Adres: Tevfik Bey Mah. Vahit Efendi Sk. No:13, Küçükçekmece / İstanbul. İletişim bölümündeki yol tarifi butonuyla Google Maps konumunu açabilirsiniz.",
  },
  {
    priority: 3,
    keywords: ["saat", "acik", "açık", "calisma", "çalışma", "gun", "gün"],
    answer:
      "Kurum görüşmeleri için sayfada belirtilen saat aralığı her gün 09.00 - 19.00. Gitmeden önce telefon ya da WhatsApp ile uygun görüşme saatini teyit etmek iyi olur.",
  },
  {
    priority: 3,
    keywords: ["telefon", "whatsapp", "ara", "iletisim", "iletişim"],
    answer:
      "Telefon ve WhatsApp hattı +90 546 440 17 80. Hızlı bilgi almak için WhatsApp üzerinden yazabilir ya da kurumu arayabilirsiniz.",
  },
  {
    priority: 3,
    keywords: ["sahip", "kurucu", "nesim", "akdeniz", "mudur", "müdür"],
    answer:
      "Sefaköy My Fen Bilimleri kurum sahibi Nesim AKDENİZ olarak belirtilmiştir.",
  },
  {
    priority: 4,
    keywords: ["burs", "bursluluk", "indirim", "bursluluk sinavi", "bursluluk sınavı"],
    answer:
      "Bursluluk ve indirim bilgileri dönemsel olarak değişebilir. Öğrencinin sınıfı, sınav sonucu ve kontenjan durumuna göre değerlendirme yapılır. Danışman ekip sınav günü, saat ve şartları telefon ya da WhatsApp üzerinden paylaşır.",
  },
  {
    priority: 3,
    keywords: ["servis", "ulasim", "ulaşım", "metrobus", "metrobüs", "otobus", "otobüs"],
    answer:
      "Kurum Sefaköy merkezde, Tevfik Bey Mahallesi Vahit Efendi Sokak No:13 adresindedir. Ulaşım ve servis gibi detaylar dönemsel olarak değişebileceği için en doğru bilgi için telefon ya da WhatsApp üzerinden teyit almak iyi olur.",
  },
];

const normalizeAssistantText = (value) =>
  value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getAssistantAnswer = (question) => {
  const normalized = normalizeAssistantText(question);
  const scoredRules = assistantRules
    .map((rule) => {
      const matchedKeywords = rule.keywords.filter((keyword) =>
        normalized.includes(normalizeAssistantText(keyword)),
      );
      const score = matchedKeywords.reduce((total, keyword) => total + keyword.length, 0) + (rule.priority || 0) * 8;
      return { rule, score, matchedCount: matchedKeywords.length };
    })
    .filter((item) => item.matchedCount > 0)
    .sort((a, b) => b.score - a.score || b.matchedCount - a.matchedCount);

  if (scoredRules.length) return scoredRules[0].rule.answer;

  if (["merhaba", "selam", "slm", "iyi gunler", "iyi günler"].some((word) => normalized.includes(normalizeAssistantText(word)))) {
    return "Merhaba, size yardımcı olayım. Öğrencinin sınıfı, hedefi, mevcut netleri ya da merak ettiğiniz konu varsa yazabilirsiniz. Fiyat-kontenjan, LGS/YKS programı, deneme analizi, rehberlik, veli takibi ve bursluluk hakkında bilgi verebilirim.";
  }

  return "Bu konuda net konuşabilmek için öğrencinin sınıfı, hedefi ve hangi konuda destek aradığınızı bilmek iyi olur. İsterseniz sorunuzu biraz daha detaylandırın; fiyat-kontenjan, LGS/YKS, deneme analizi, etüt, rehberlik ve veli takibi konularında yardımcı olabilirim. Daha özel durumlarda WhatsApp üzerinden danışman ekibe ulaşmanız en doğru yol olur.";
};

const addAssistantMessage = (message, type) => {
  const bubble = document.createElement("div");
  bubble.className = `assistant-message assistant-message--${type}`;
  bubble.textContent = message;
  assistantMessages.appendChild(bubble);
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
  return bubble;
};

const typeAssistantMessage = (message) => {
  assistantTyping = true;
  const bubble = addAssistantMessage("", "bot");
  let index = 0;

  const tick = () => {
    bubble.textContent = message.slice(0, index);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;

    if (index < message.length) {
      index += 1;
      window.setTimeout(tick, 18);
      return;
    }

    assistantTyping = false;
    assistantInput?.focus();
  };

  tick();
};

const askAssistant = (question) => {
  const trimmed = question.trim();
  if (!trimmed || assistantTyping) return;

  addAssistantMessage(trimmed, "user");
  assistantInput.value = "";

  window.setTimeout(() => {
    typeAssistantMessage(getAssistantAnswer(trimmed));
  }, 240);
};

setWhatsappLinks();
setInstagramLinks();
startSuccessCarousel();
setupFaqAnimations();

socialNoticeCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const notice = button.closest("[data-social-notice]");
    if (!notice) return;
    const isInstagramNotice = notice.getAttribute("data-social-notice") === "instagram";
    hideSocialNotice(notice, isInstagramNotice ? scheduleWhatsappNotice : undefined);
  });
});

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (infoForm) {
  infoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(infoForm);
    const phone = normalizePhone(String(formData.get("phone") || ""));

    if (phone.length < 10) {
      showInfoStatus("Telefon numarasını kontrol eder misiniz?", true);
      return;
    }

    const lead = {
      code: `MYFEN-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      studentName: String(formData.get("studentName") || "").trim(),
      parentName: String(formData.get("parentName") || "").trim(),
      phone,
      grade: String(formData.get("grade") || "").trim(),
      program: String(formData.get("program") || "").trim(),
      target: String(formData.get("target") || "").trim(),
      note: String(formData.get("note") || "").trim(),
    };

    saveLead(lead);
    sendLeadWebhook(lead);

    if (infoCode) {
      infoCode.textContent = `Talep No: ${lead.code}`;
    }

    if (infoSummary) {
      infoSummary.textContent = `${lead.studentName} için ${lead.program} kayıt talebi alınmıştır. Ekibimiz en kısa sürede sizinle iletişime geçecektir.`;
    }

    infoResult?.classList.remove("hidden");
    showInfoStatus("Kayıt talebi kaydedildi; mail/Sheet gönderimi başlatıldı.");
  });
}

if (exportLeads) {
  exportLeads.addEventListener("click", () => {
    const leads = readLeads();

    if (!leads.length) {
      showInfoStatus("Henüz indirilecek kayıt yok.", true);
      return;
    }

    const headers = [
      "Talep No",
      "Tarih",
      "Öğrenci",
      "Veli",
      "Telefon",
      "Sınıf",
      "Program",
      "Hedef",
      "Not",
    ];

    const escapeCsv = (value) => `"${String(value || "").replaceAll('"', '""')}"`;
    const rows = leads.map((lead) =>
      [
        lead.code,
        lead.createdAt,
        lead.studentName,
        lead.parentName,
        lead.phone,
        lead.grade,
        lead.program,
        lead.target,
        lead.note,
      ]
        .map(escapeCsv)
        .join(";"),
    );

    const csv = `\uFEFF${[headers.map(escapeCsv).join(";"), ...rows].join("\n")}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sefakoy-myfen-on-kayitlar.csv";
    link.click();
    URL.revokeObjectURL(url);
    showInfoStatus("Kayıt listesi CSV olarak indirildi.");
  });
}

if (assistantToggle && assistantPanel) {
  const openAssistantPanel = () => {
    assistantToggle.setAttribute("hidden", "");
    assistantToggle.setAttribute("aria-expanded", "true");
    assistantToggle.setAttribute("aria-label", "Site asistanı açık");
    assistantPanel.classList.remove("is-closing");
    assistantPanel.removeAttribute("hidden");

    window.requestAnimationFrame(() => {
      assistantPanel.classList.add("is-open");
      window.setTimeout(() => assistantInput?.focus(), ASSISTANT_ANIMATION_MS);
    });
  };

  const closeAssistantPanel = () => {
    assistantPanel.classList.remove("is-open");
    assistantPanel.classList.add("is-closing");

    window.setTimeout(() => {
      assistantPanel.classList.remove("is-closing");
      assistantPanel.setAttribute("hidden", "");
      assistantToggle.removeAttribute("hidden");
      assistantToggle.setAttribute("aria-expanded", "false");
      assistantToggle.setAttribute("aria-label", "Site asistanını aç");
      assistantToggle.focus();
    }, ASSISTANT_ANIMATION_MS);
  };

  assistantToggle.addEventListener("click", openAssistantPanel);

  if (assistantClose) {
    assistantClose.addEventListener("click", closeAssistantPanel);
  }
}

if (assistantForm) {
  assistantForm.addEventListener("submit", (event) => {
    event.preventDefault();
    askAssistant(assistantInput.value);
  });
}

document.querySelectorAll("[data-assistant-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    askAssistant(button.getAttribute("data-assistant-prompt") || "");
  });
});

// ── Scroll Reveal (IntersectionObserver) ──
(function () {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
})();

// ── Nav compact on scroll ──
(function () {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle("is-compact", window.scrollY > 60);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// ── Counter animation for quick-panel stats ──
(function () {
  const counters = [
    { selector: ".quick-panel__grid div:nth-child(1) strong", target: 18, suffix: " yıl", duration: 1400 },
    { selector: ".quick-panel__grid div:nth-child(2) strong", target: 12, suffix: " kişilik", duration: 1200 },
    { selector: ".quick-panel__grid div:nth-child(3) strong", target: 35, prefix: "", suffix: "+ deneme", duration: 1600 },
  ];

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el, target, suffix, prefix, duration) => {
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOut(progress) * target);
      el.textContent = (prefix || "") + value + suffix;
      if (progress < 1) window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  };

  const panel = document.querySelector(".quick-panel__grid");
  if (!panel) return;

  let triggered = false;
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !triggered) {
        triggered = true;
        counters.forEach(({ selector, target, suffix, prefix, duration }) => {
          const el = document.querySelector(selector);
          if (el) animateCounter(el, target, suffix, prefix, duration);
        });
        observer.disconnect();
      }
    },
    { threshold: 0.4 }
  );
  observer.observe(panel);
})();

// ── Progress bar animation ──
(function () {
  const rows = document.querySelectorAll(".progress-row");
  if (!rows.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-animated");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  rows.forEach((row) => observer.observe(row));
})();

// ── PHASE 5: Hero carousel + Neden MyFen reason carousel ──
function startHeroCarousel() {
  const root = document.querySelector("[data-hero-carousel]");
  if (!root) return;
  const slides = Array.from(root.querySelectorAll(".hero-slide"));
  if (slides.length < 2) return;
  let idx = 0;
  window.setInterval(() => {
    slides[idx].classList.remove("is-active");
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add("is-active");
  }, 4500);
}

function startReasonCarousel() {
  const root = document.querySelector("[data-reason-carousel]");
  if (!root) return;
  const slides = Array.from(root.querySelectorAll(".reason-slide"));
  if (slides.length < 2) return;
  let idx = 0;
  slides[0].classList.add("is-active");
  window.setInterval(() => {
    slides[idx].classList.remove("is-active");
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add("is-active");
  }, 4000);
}

startHeroCarousel();
startReasonCarousel();
