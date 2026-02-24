// --- SCREEN NAVIGATION SETUP ---

const screens = [
  "screen-landing",
  "screen-teach",
  "screen-test",
  "screen-revision",
  "screen-parent-report",
  "screen-promo"
];

let currentIndex = 0;

const screenSelect = document.getElementById("screenSelect");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const parentReportBtn = document.getElementById("parentReportBtn");

function showScreen(id) {
  screens.forEach((sid) => {
    const el = document.getElementById(sid);
    if (!el) return;
    if (sid === id) {
      el.classList.remove("hidden");
    } else {
      el.classList.add("hidden");
    }
  });

  const idx = screens.indexOf(id);
  if (idx !== -1) {
    currentIndex = idx;
  }

  if (id === "screen-parent-report") {
    updateParentReportView();
  }

  const selectIndexMap = {
    "screen-landing": "screen-landing",
    "screen-teach": "screen-teach",
    "screen-test": "screen-test",
    "screen-revision": "screen-revision",
    "screen-promo": "screen-promo"
  };
  const selectVal = selectIndexMap[id];
  if (selectVal) {
    screenSelect.value = selectVal;
  }
}

screenSelect.addEventListener("change", (e) => {
  showScreen(e.target.value);
});

prevBtn.addEventListener("click", () => {
  const newIndex = Math.max(0, currentIndex - 1);
  showScreen(screens[newIndex]);
});

nextBtn.addEventListener("click", () => {
  const newIndex = Math.min(screens.length - 1, currentIndex + 1);
  showScreen(screens[newIndex]);
});

parentReportBtn.addEventListener("click", () => {
  showScreen("screen-parent-report");
});

// --- SIMPLE MODAL (FORCED HIDDEN BY DEFAULT) ---

const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalCloseBtn = document.getElementById("modalCloseBtn");

function openModal(title, body) {
  modalTitle.textContent = title;
  modalBody.textContent = body;
  if (modalOverlay) {
    modalOverlay.classList.add("show");
  }
}

function closeModal() {
  if (modalOverlay) {
    modalOverlay.classList.remove("show");
  }
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", closeModal);
}
if (modalOverlay) {
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
}

// --- PAYMENT BUTTON (NO REAL PAYMENT) ---

const payBtn = document.getElementById("payBtn");
const openTermsLink = document.getElementById("openTerms");

if (payBtn) {
  payBtn.addEventListener("click", () => {
    openModal(
      "Sample Pay Flow",
      "In the real app, this button will open a payment page or UPI link. " +
        "For this sample, imagine the parent has paid and you can now use the full chapter."
    );
  });
}

if (openTermsLink) {
  openTermsLink.addEventListener("click", (e) => {
    e.preventDefault();
    openModal(
      "Terms & Conditions (summary)",
      "This app is a practice and monitoring tool. It does not guarantee any " +
        "results or marks. App availability may be interrupted or stopped at any time."
    );
  });
}

// --- PREVIEW CHECK LOGIC ---

const previewCheckBtn = document.getElementById("previewCheckBtn");
const previewFeedback = document.getElementById("previewFeedback");

if (previewCheckBtn && previewFeedback) {
  previewCheckBtn.addEventListener("click", () => {
    const ans = (document.getElementById("preview_q3").value || "").trim();

    if (ans === "2 1/2" || ans === "2 1/2." || ans === "2½" || ans === "2 1 / 2") {
      previewFeedback.textContent = "Correct! 5/2 = 2 1/2 on the number line.";
      previewFeedback.style.color = "#1a6f37";
    } else {
      previewFeedback.textContent =
        "Not quite. 5/2 is 2 and 1/2 (2 1/2). Imagine starting at 0, moving to 2, then half more.";
      previewFeedback.style.color = "#b03b2b";
    }
  });
}

// --- SIMPLE PROGRESS DATA MODEL ---

const progress = {
  teachCompleted: false,
  testCompleted: false,
  lastTestScore: null,
  strongAreas: [],
  weakAreas: [],
  nextSteps:
    "Once your child attempts the Teach practice and sample test, we will suggest 1–2 simple next steps here."
};

// --- TEACH STEP CHECK LOGIC ---

const teachCheckBtn = document.getElementById("teachCheckBtn");
const teachFeedback = document.getElementById("teachFeedback");

function markTeachCompleted() {
  progress.teachCompleted = true;
  if (!progress.strongAreas.includes("Basic fractions as rational numbers")) {
    progress.strongAreas.push("Basic fractions as rational numbers");
  }
  if (!progress.nextSteps || progress.nextSteps.startsWith("Once your child")) {
    progress.nextSteps =
      "Ask your child to complete the sample test next. Then check this Parent Report again.";
  }
}

if (teachCheckBtn && teachFeedback) {
  teachCheckBtn.addEventListener("click", () => {
    const q1 = document.querySelector('input[name="teach_q1"]:checked');
    const q2 = document.querySelector('input[name="teach_q2"]:checked');
    const q3 = document.querySelector('input[name="teach_q3"]:checked');
    const q4 = (document.getElementById("teach_q4").value || "").trim();
    const q5 = (document.getElementById("teach_q5").value || "").trim();

    let score = 0;

    if (q1 && q1.value === "num") score++;
    if (q2 && q2.value === "num") score++;
    if (q3 && q3.value === "yes") score++;
    if (q4 === "4/7") score++;
    if (q5 === "-5/9" || q5 === "−5/9") score++;

    if (score === 5) {
      teachFeedback.textContent =
        "Great! All answers are correct in this Teach step.";
      teachFeedback.style.color = "#1a6f37";
      markTeachCompleted();
    } else {
      teachFeedback.textContent =
        "Some answers are not correct. Check the board and try again.";
      teachFeedback.style.color = "#b03b2b";

      if (!progress.weakAreas.includes("Understanding p/q form and signs")) {
        progress.weakAreas.push("Understanding p/q form and signs");
      }
    }

    updateParentReportView();
  });
}

// --- TEST SUBMIT LOGIC ---

const testSubmitBtn = document.getElementById("testSubmitBtn");
const testFeedback = document.getElementById("testFeedback");

function markTestScore(score, total) {
  progress.testCompleted = true;
  progress.lastTestScore = `${score} / ${total}`;

  if (score >= 4) {
    if (!progress.strongAreas.includes("Basic rational number properties")) {
      progress.strongAreas.push("Basic rational number properties");
    }
  } else {
    if (!progress.weakAreas.includes("Basic rational number properties")) {
      progress.weakAreas.push("Basic rational number properties");
    }
  }

  if (score < 3) {
    progress.nextSteps =
      "Ask your child to revisit the Teach step and redo this sample test. " +
      "If mistakes continue, please discuss with the school teacher or tutor.";
  } else if (score >= 3 && score < 5) {
    progress.nextSteps =
      "Ask your child to revise the Teach step once, then try more practice questions.";
  } else {
    progress.nextSteps =
      "Good start. You can move to the full chapter app when ready.";
  }
}

if (testSubmitBtn && testFeedback) {
  testSubmitBtn.addEventListener("click", () => {
    const q1 = document.querySelector('input[name="test_q1"]:checked');
    const q2 = document.querySelector('input[name="test_q2"]:checked');
    const q3 = document.querySelector('input[name="test_q3"]:checked');
    const q4 = (document.getElementById("test_q4").value || "").trim();
    const q5 = (document.getElementById("test_q5").value || "").trim();

    let score = 0;
    const total = 5;

    if (q1 && q1.value === "rat") score++;
    if (q2 && q2.value === "neg") score++;
    if (q3 && q3.value === "true") score++;
    if (q4 === "1/2") score++;
    if (q5 === "-3" || q5 === "−3") score++;

    markTestScore(score, total);

    testFeedback.textContent = `You scored ${score} / ${total} in this sample test. Check Parent Report for more.`;
    testFeedback.style.color = "#1a6f37";

    updateRevisionView();
    updateParentReportView();
  });
}

// --- REVISION VIEW ---

const revisionContent = document.getElementById("revisionContent");

function updateRevisionView() {
  if (!revisionContent) return;

  if (!progress.testCompleted && !progress.teachCompleted) {
    revisionContent.innerHTML =
      "<p>Ask your child to try the Teach step and then the sample test. Revision tips will appear here.</p>";
    return;
  }

  let html = "<h3>Suggested revision</h3><ul>";

  if (!progress.teachCompleted) {
    html += "<li>First, ask your child to complete the Teach step.</li>";
  }

  if (progress.weakAreas.length > 0) {
    html += "<li>Focus on these weak areas:</li>";
    progress.weakAreas.forEach((area) => {
      html += `<li>– ${area}</li>`;
    });
  }

  if (progress.testCompleted) {
    html += "<li>After revising, repeat the sample test.</li>";
  }

  html += "</ul>";

  revisionContent.innerHTML = html;
}

// --- PARENT REPORT VIEW ---

const reportTeachStatus = document.getElementById("reportTeachStatus");
const reportTestStatus = document.getElementById("reportTestStatus");
const reportLastTestScore = document.getElementById("reportLastTestScore");
const reportStrongList = document.getElementById("reportStrongList");
const reportWeakList = document.getElementById("reportWeakList");
const reportNextSteps = document.getElementById("reportNextSteps");

function updateParentReportView() {
  if (!reportTeachStatus) return;

  reportTeachStatus.textContent = `Teach steps completed: ${
    progress.teachCompleted ? "1" : "0"
  } / 1 (sample)`;

  reportTestStatus.textContent = `Tests completed: ${
    progress.testCompleted ? "1" : "0"
  } / 1 (sample)`;

  reportLastTestScore.textContent = progress.lastTestScore
    ? `Latest sample test score: ${progress.lastTestScore}`
    : "Latest sample test score: –";

  if (reportStrongList) {
    if (progress.strongAreas.length === 0) {
      reportStrongList.innerHTML =
        "<li>No strong areas detected yet. Ask your child to complete the Teach step and test.</li>";
    } else {
      reportStrongList.innerHTML = "";
      progress.strongAreas.forEach((area) => {
        const li = document.createElement("li");
        li.textContent = area;
        reportStrongList.appendChild(li);
      });
    }
  }

  if (reportWeakList) {
    if (progress.weakAreas.length === 0) {
      reportWeakList.innerHTML =
        "<li>No clear weak areas yet. Let your child attempt the Teach step and test.</li>";
    } else {
      reportWeakList.innerHTML = "";
      progress.weakAreas.forEach((area) => {
        const li = document.createElement("li");
        li.textContent = area;
        reportWeakList.appendChild(li);
      });
    }
  }

  if (reportNextSteps) {
    reportNextSteps.textContent = progress.nextSteps;
  }
}

// --- INITIAL STATE ---

document.addEventListener("DOMContentLoaded", () => {
  showScreen("screen-landing");
  updateRevisionView();
  updateParentReportView();
});
