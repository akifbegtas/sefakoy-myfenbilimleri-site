const WHATSAPP_PHONE = "905493128520";
const INSTAGRAM_URL = "https://www.instagram.com/sefakoymyfenbilimleri/";
const SOCIAL_NOTICE_FIRST_DELAY = 5000;
const SOCIAL_NOTICE_NEXT_DELAY = 5000;
const ASSISTANT_ANIMATION_MS = 320;
const DEFAULT_MESSAGE =
  "Merhaba, Sefaköy My Fen Bilimleri hakkında bilgi almak istiyorum.";

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("[data-nav-links]");
const leadForm = document.querySelector("#leadForm");
const formStatus = document.querySelector("#formStatus");
const leadResult = document.querySelector("#leadResult");
const leadCode = document.querySelector("#leadCode");
const leadSummary = document.querySelector("#leadSummary");
const leadWhatsapp = document.querySelector("#leadWhatsapp");
const exportLeads = document.querySelector("#exportLeads");
const assistantPanel = document.querySelector("#assistantPanel");
const assistantToggle = document.querySelector("#assistantToggle");
const assistantClose = document.querySelector("#assistantClose");
const assistantMessages = document.querySelector("#assistantMessages");
const assistantForm = document.querySelector("#assistantForm");
const assistantInput = document.querySelector("#assistantInput");
const socialNoticeCloseButtons = document.querySelectorAll("[data-social-notice-close]");
let assistantTyping = false;

const buildWhatsappUrl = (message = DEFAULT_MESSAGE) =>
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

const setWhatsappLinks = () => {
  document.querySelectorAll(".js-whatsapp").forEach((link) => {
    link.setAttribute("href", buildWhatsappUrl());
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

const getSocialNotice = (name) =>
  document.querySelector(`[data-social-notice="${name}"]`);

const showSocialNotice = (name) => {
  const notice = getSocialNotice(name);
  if (!notice) return;
  notice.removeAttribute("hidden");
  window.requestAnimationFrame(() => notice.classList.add("is-visible"));
};

const hideSocialNotice = (notice) => {
  notice.classList.remove("is-visible");
  window.setTimeout(() => {
    notice.setAttribute("hidden", "");
  }, 220);
};

const scheduleSocialNotices = () => {
  window.setTimeout(() => {
    showSocialNotice("instagram");

    window.setTimeout(() => {
      const instagramNotice = getSocialNotice("instagram");
      if (instagramNotice && instagramNotice.classList.contains("is-visible")) {
        hideSocialNotice(instagramNotice);
      }
      showSocialNotice("whatsapp");
    }, SOCIAL_NOTICE_NEXT_DELAY);
  }, SOCIAL_NOTICE_FIRST_DELAY);
};

const showStatus = (message, isError = false) => {
  formStatus.textContent = message;
  formStatus.classList.toggle("is-error", isError);
};

const readLeads = () => {
  try {
    return JSON.parse(localStorage.getItem("sefakoy-myfen-leads")) || [];
  } catch {
    return [];
  }
};

const saveLead = (lead) => {
  const leads = readLeads();
  leads.unshift(lead);
  localStorage.setItem("sefakoy-myfen-leads", JSON.stringify(leads.slice(0, 200)));
};

const normalizePhone = (value) => value.replace(/[^\d+]/g, "");

const formatLeadMessage = (lead) => {
  const lines = [
    "Merhaba, ön kayıt talebi oluşturmak istiyorum.",
    `Talep No: ${lead.code}`,
    `Öğrenci: ${lead.studentName}`,
    `Veli: ${lead.parentName}`,
    `Telefon: ${lead.phone}`,
    `Sınıf: ${lead.grade}`,
    `Program: ${lead.program}`,
  ];

  if (lead.target) lines.push(`Hedef: ${lead.target}`);
  if (lead.note) lines.push(`Not: ${lead.note}`);

  return lines.join("\n");
};

const assistantRules = [
  {
    priority: 4,
    keywords: ["fiyat", "ucret", "ücret", "odeme", "ödeme", "taksit", "pesin", "peşin", "kampanya", "kontenjan"],
    answer:
      "Fiyat ve kontenjan bilgisi öğrencinin sınıfı, hedefi ve seçilecek programa göre netleşir. En sağlıklı yol kısa bir ön görüşme yapmak; danışman ekip sınıf seviyesini, ihtiyaç duyulan ders yoğunluğunu ve uygun ödeme seçeneklerini birlikte değerlendirir. Formu doldurursanız dönüş için talep numarası oluşur.",
  },
  {
    priority: 4,
    keywords: ["kayit", "kayıt", "on kayit", "ön kayıt", "basvuru", "başvuru", "gorusme", "görüşme", "randevu", "nasil baslar", "nasıl başlar"],
    answer:
      "Kayıt süreci önce öğrenci ve veliyle kısa bir hedef görüşmesiyle başlar. Öğrencinin sınıfı, okul durumu, deneme netleri varsa mevcut seviyesi ve hedefi konuşulur. Sonra uygun program, ders yoğunluğu, etüt ihtiyacı ve kontenjan durumu netleştirilir. Ön kayıt formu bu görüşme için hızlı talep oluşturur.",
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
      "Başarılı öğrenciler bölümü şimdilik örnek listeyle hazırlandı. Gerçek liste geldiğinde öğrencilerin isimleri ve kazandıkları okul veya bölümler bu alanda güncellenecek.",
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
      "Telefon numaraları 0549 312 85 20 ve 0212 592 91 98. Hızlı dönüş için WhatsApp üzerinden yazabilir ya da ön kayıt formunu doldurup talebinizi kuruma iletebilirsiniz.",
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
      "Bursluluk ve indirim bilgileri dönemsel olarak değişebilir. Öğrencinin sınıfı, sınav sonucu ve kontenjan durumuna göre değerlendirme yapılır. Ön kayıt formunda Bursluluk Sınavı seçilirse danışman ekip sınav günü, saat ve şartları paylaşır.",
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
    return "Merhaba, size yardımcı olayım. Öğrencinin sınıfı, hedefi, mevcut netleri ya da merak ettiğiniz konu varsa yazabilirsiniz. Kayıt süreci, fiyat-kontenjan, LGS/YKS programı, deneme analizi, rehberlik, veli takibi ve bursluluk hakkında bilgi verebilirim.";
  }

  return "Bu konuda net konuşabilmek için öğrencinin sınıfı, hedefi ve hangi konuda destek aradığınızı bilmek iyi olur. İsterseniz sorunuzu biraz daha detaylandırın; kayıt, fiyat-kontenjan, LGS/YKS, deneme analizi, etüt, rehberlik ve veli takibi konularında yardımcı olabilirim. Daha özel durumlarda ön kayıt formu veya WhatsApp üzerinden danışman ekibe ulaşmanız en doğru yol olur.";
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
scheduleSocialNotices();

socialNoticeCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const notice = button.closest("[data-social-notice]");
    if (notice) hideSocialNotice(notice);
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

document.querySelectorAll("[data-program]").forEach((button) => {
  button.addEventListener("click", () => {
    const program = button.getAttribute("data-program");
    const programSelect = document.querySelector("#program");
    if (programSelect) programSelect.value = program;
    document.querySelector("#kayit")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => document.querySelector("#studentName")?.focus(), 450);
  });
});

if (leadForm) {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(leadForm);
    const phone = normalizePhone(String(formData.get("phone") || ""));

    if (phone.length < 10) {
      showStatus("Telefon numarasını kontrol eder misiniz?", true);
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

    const message = formatLeadMessage(lead);
    leadCode.textContent = `Talep No: ${lead.code}`;
    leadSummary.textContent = `${lead.studentName} için ${lead.program} kaydı hazırlandı.`;
    leadWhatsapp.href = buildWhatsappUrl(message);
    leadResult.classList.remove("hidden");
    showStatus("Ön kayıt talebi hazır. WhatsApp ile kuruma gönderebilirsiniz.");
  });
}

if (exportLeads) {
  exportLeads.addEventListener("click", () => {
    const leads = readLeads();

    if (!leads.length) {
      showStatus("Henüz indirilecek kayıt yok.", true);
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
        .join(","),
    );

    const csv = [headers.map(escapeCsv).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sefakoy-myfen-on-kayitlar.csv";
    link.click();
    URL.revokeObjectURL(url);
    showStatus("Kayıt listesi indirildi.");
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
