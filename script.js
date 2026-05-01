const WHATSAPP_PHONE = "905493128520";
const INSTAGRAM_URL = "https://www.instagram.com/sefakoymyfenbilimleri/";
const SOCIAL_NOTICE_FIRST_DELAY = 5000;
const SOCIAL_NOTICE_NEXT_DELAY = 5000;
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
    keywords: ["fiyat", "ucret", "ücret", "kontenjan", "kampanya", "taksit"],
    answer:
      "Fiyat ve kontenjan bilgisi programa, sınıfa ve dönem kontenjanına göre netleşir. En hızlı yol ön kayıt formunu doldurmak ya da WhatsApp üzerinden yazmak; danışman ekip uygun programı söyleyip güncel fiyat bilgisini paylaşır.",
  },
  {
    keywords: ["kayit", "kayıt", "on kayit", "ön kayıt", "basvuru", "başvuru"],
    answer:
      "Ön kayıt için öğrencinin adı, sınıfı, veli telefonu ve ilgilendiği program yeterli. Formu doldurduktan sonra talep numarası oluşur ve bilgileri WhatsApp ile kuruma gönderebilirsiniz.",
  },
  {
    keywords: ["lgs", "8", "sekizinci", "ortaokul", "7", "yedinci"],
    answer:
      "LGS programında 7. ve 8. sınıflar için yeni nesil soru çözümü, haftalık ödev takibi, deneme analizi, etüt ve okul derslerine destek birlikte ilerler.",
  },
  {
    keywords: ["yks", "tyt", "ayt", "mezun", "12", "on ikinci", "11", "universite", "üniversite"],
    answer:
      "YKS tarafında 11. sınıf, 12. sınıf ve mezun öğrenciler için TYT temel güçlendirme, AYT branş takibi, deneme analizi ve rehberlik görüşmeleri planlanır.",
  },
  {
    keywords: ["deneme", "sinav", "sınav", "analiz", "net", "sonuc", "sonuç"],
    answer:
      "Deneme kulübünde öğrenciler gerçek sınav atmosferinde denemeye girer. Sonrasında netler, konu eksikleri ve sıralama raporu incelenir; çalışma planı bu analize göre güncellenir.",
  },
  {
    keywords: ["ozel ders", "özel ders", "vip", "birebir", "etut", "etüt"],
    answer:
      "Özel ders ve VIP sınıf seçeneği, özellikle eksik branşlarda hızlı telafi için kullanılır. Matematik, geometri ve ihtiyaç duyulan derslerde birebir ya da küçük grup planı yapılabilir.",
  },
  {
    keywords: ["adres", "konum", "nerede", "harita", "yol"],
    answer:
      "Konum: SEFAKÖY MY FEN BİLİMLERİ ÖZEL ÖĞRETİM KURSU. Adres: Tevfik Bey Mah. Vahit Efendi Sk. No:13, Küçükçekmece / İstanbul. İletişim bölümündeki yol tarifi butonuyla Google Maps konumunu açabilirsiniz.",
  },
  {
    keywords: ["saat", "acik", "açık", "calisma", "çalışma", "gun", "gün"],
    answer:
      "Kurum görüşmeleri için sayfada belirtilen saat aralığı her gün 09.00 - 19.00. Gitmeden önce telefon ya da WhatsApp ile uygun görüşme saatini teyit etmek iyi olur.",
  },
  {
    keywords: ["telefon", "whatsapp", "ara", "iletisim", "iletişim"],
    answer:
      "Telefon numaraları: 0549 312 85 20 ve 0212 592 91 98. Sağdaki asistanı kapatmadan sol orta kenardaki WhatsApp alanından da hızlıca yazabilirsiniz.",
  },
  {
    keywords: ["burs", "bursluluk", "indirim"],
    answer:
      "Bursluluk ve indirim bilgileri dönemsel olarak değişebilir. Ön kayıt formunda programı Bursluluk Sınavı seçerseniz danışman ekip sınav günü, saat ve şartları paylaşır.",
  },
  {
    keywords: ["veli", "takip", "devamsizlik", "devamsızlık", "odev", "ödev"],
    answer:
      "Veli bilgilendirmesinde devamsızlık, ödev takibi, deneme sonuçları ve rehberlik notları düzenli paylaşılır. Böylece öğrenci süreci sadece kurumda değil evde de takip edilebilir.",
  },
];

const normalizeAssistantText = (value) =>
  value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getAssistantAnswer = (question) => {
  const normalized = normalizeAssistantText(question);
  const rule = assistantRules.find((item) =>
    item.keywords.some((keyword) => normalized.includes(normalizeAssistantText(keyword))),
  );

  if (rule) return rule.answer;

  if (["merhaba", "selam", "slm", "iyi gunler", "iyi günler"].some((word) => normalized.includes(normalizeAssistantText(word)))) {
    return "Merhaba, size yardımcı olayım. Kayıt, fiyat, LGS, YKS, deneme kulübü, adres veya çalışma saatleri hakkında soru sorabilirsiniz.";
  }

  return "Bu konuda en doğru yanıt için danışman ekibin sizi araması iyi olur. Ön kayıt formunu doldurabilir ya da WhatsApp üzerinden sorunuzu gönderebilirsiniz. Ben kayıt, fiyat, program, konum ve deneme kulübü sorularında hızlı yardımcı olabilirim.";
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
  assistantToggle.addEventListener("click", () => {
    const isOpen = !assistantPanel.hasAttribute("hidden");
    assistantPanel.toggleAttribute("hidden", isOpen);
    assistantToggle.setAttribute("aria-expanded", String(!isOpen));
    assistantToggle.setAttribute("aria-label", isOpen ? "Site asistanını aç" : "Site asistanını kapat");
    if (!isOpen) window.setTimeout(() => assistantInput?.focus(), 120);
  });
}

if (assistantClose && assistantPanel && assistantToggle) {
  assistantClose.addEventListener("click", () => {
    assistantPanel.setAttribute("hidden", "");
    assistantToggle.setAttribute("aria-expanded", "false");
    assistantToggle.setAttribute("aria-label", "Site asistanını aç");
    assistantToggle.focus();
  });
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
