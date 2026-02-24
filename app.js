// ====================== NAVIGATION ======================

const screens = [
  "screen-landing",
  "screen-teach-1",
  "screen-teach-2",
  "screen-teach-3",
  "screen-teach-4",
  "screen-teach-5",
  "screen-teach-6",
  "screen-teach-7",
  "screen-teach-8",
  "screen-teach-9",
  "screen-test-easy",
  "screen-test-hard",
  "screen-test-adv",
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
  if (idx !== -1) currentIndex = idx;

  if (id === "screen-parent-report") {
    updateParentReportView();
  }

  const map = {
    "screen-landing": "screen-landing",
    "screen-teach-1": "screen-teach-1",
    "screen-teach-2": "screen-teach-2",
    "screen-teach-3": "screen-teach-3",
    "screen-teach-4": "screen-teach-4",
    "screen-teach-5": "screen-teach-5",
    "screen-teach-6": "screen-teach-6",
    "screen-teach-7": "screen-teach-7",
    "screen-teach-8": "screen-teach-8",
    "screen-teach-9": "screen-teach-9",
    "screen-test-easy": "screen-test-easy",
    "screen-test-hard": "screen-test-hard",
    "screen-test-adv": "screen-test-adv",
    "screen-revision": "screen-revision",
    "screen-promo": "screen-promo"
  };
  if (map[id]) screenSelect.value = map[id];
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

// ====================== MODAL ======================

const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalCloseBtn = document.getElementById("modalCloseBtn");

function openModal(title, body) {
  modalTitle.textContent = title;
  modalBody.textContent = body;
  if (modalOverlay) modalOverlay.classList.add("show");
}

function closeModal() {
  if (modalOverlay) modalOverlay.classList.remove("show");
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", closeModal);
}
if (modalOverlay) {
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

// ====================== PAY BUTTON (NO REAL PAYMENT) ======================

const payBtn = document.getElementById("payBtn");
const openTermsLink = document.getElementById("openTerms");

if (payBtn) {
  payBtn.addEventListener("click", () => {
    openModal(
      "Payment flow (example)",
      "In the full app, this button will open a payment page or UPI link. " +
        "For now, this is only to show where payment fits in the journey."
    );
  });
}

if (openTermsLink) {
  openTermsLink.addEventListener("click", (e) => {
    e.preventDefault();
    openModal(
      "Terms & Conditions (summary)",
      "This is a practice and monitoring app. It does not guarantee results or marks. " +
        "App availability may be interrupted or stopped at any time."
    );
  });
}

// ====================== PREVIEW CHECK (FREE PART) ======================

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
        "Not quite. 5/2 is 2 and 1/2 (2 1/2). Start at 0, go to 2, then half more.";
      previewFeedback.style.color = "#b03b2b";
    }
  });
}

// ====================== PROGRESS MODEL ======================

const progress = {
  teachCompleted: {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false
  },
  testsCompleted: {
    easy: false,
    hard: false,
    adv: false
  },
  lastTestScore: null,
  strongAreas: [],
  weakAreas: [],
  nextSteps:
    "Once your child attempts the Teach steps and tests, we will suggest 1–2 simple next steps here."
};

function markTeachCompleted(step, strongLabel) {
  progress.teachCompleted[step] = true;
  if (strongLabel && !progress.strongAreas.includes(strongLabel)) {
    progress.strongAreas.push(strongLabel);
  }
  if (
    !progress.nextSteps ||
    progress.nextSteps.startsWith("Once your child attempts")
  ) {
    progress.nextSteps =
      "Ask your child to move ahead with the remaining Teach steps and then try the tests.";
  }
}

// ====================== TEACH STEP CHECKERS ======================

// Helper to push weak area
function addWeakArea(label) {
  if (!progress.weakAreas.includes(label)) {
    progress.weakAreas.push(label);
  }
}

// Teach 1
function checkTeach1() {
  const q1 = document.querySelector('input[name="t1_q1"]:checked');
  const q2 = document.querySelector('input[name="t1_q2"]:checked');
  const q3 = document.querySelector('input[name="t1_q3"]:checked');
  const q4 = (document.getElementById("t1_q4").value || "").trim();
  const q5 = (document.getElementById("t1_q5").value || "").trim();

  let score = 0;
  if (q1 && q1.value === "num") score++;
  if (q2 && q2.value === "num") score++;
  if (q3 && q3.value === "yes") score++;
  if (q4 === "4/7") score++;
  if (q5 === "-5/9" || q5 === "−5/9") score++;

  const fb = document.getElementById("teachFeedback1");
  if (!fb) return;

  if (score === 5) {
    fb.textContent = "Great! All answers are correct for this Teach step.";
    fb.style.color = "#1a6f37";
    markTeachCompleted(1, "Basic fractions as rational numbers");
  } else {
    fb.textContent =
      "Some answers are not correct. Please check the board notes and try again.";
    fb.style.color = "#b03b2b";
    addWeakArea("Understanding p/q form and signs");
  }
}

// Teach 2
function checkTeach2() {
  const q1 = document.querySelector('input[name="t2_q1"]:checked');
  const q2 = (document.getElementById("t2_q2").value || "").trim();
  const q3 = (document.getElementById("t2_q3").value || "").trim();
  const q4 = document.querySelector('input[name="t2_q4"]:checked');
  const q5 = (document.getElementById("t2_q5").value || "").trim();

  let score = 0;
  if (q1 && q1.value === "a") score++;
  if (q2 === "8") score++;
  if (q3 === "5/7") score++;
  if (q4 && q4.value === "eq") score++;
  if (q5 === "-6/8" || q5 === "-9/12") score++;

  const fb = document.getElementById("teachFeedback2");
  if (!fb) return;

  if (score >= 4) {
    fb.textContent = "Good work on equivalent rational numbers.";
    fb.style.color = "#1a6f37";
    markTeachCompleted(2, "Equivalent rational numbers");
  } else {
    fb.textContent =
      "Some answers are off. Recheck how we multiply/divide by the same number.";
    fb.style.color = "#b03b2b";
    addWeakArea("Equivalent rational numbers");
  }
}

// Teach 3
function checkTeach3() {
  const q1 = document.querySelector('input[name="t3_q1"]:checked');
  const q2 = document.querySelector('input[name="t3_q2"]:checked');
  const q3 = (document.getElementById("t3_q3").value || "").trim();
  const q4 = document.querySelector('input[name="t3_q4"]:checked');
  const q5 = document.querySelector('input[name="t3_q5"]:checked');

  let score = 0;
  if (q1 && q1.value === "a") score++;
  if (q2 && q2.value === "a") score++;
  if (q3 === "2 1/2" || q3 === "2 1 / 2" || q3 === "2½") score++;
  if (q4 && q4.value === "a") score++;
  if (q5 && q5.value === "a") score++;

  const fb = document.getElementById("teachFeedback3");
  if (!fb) return;

  if (score >= 4) {
    fb.textContent = "Nice! Number line understanding looks good.";
    fb.style.color = "#1a6f37";
    markTeachCompleted(3, "Rational numbers on the number line");
  } else {
    fb.textContent =
      "Number line answers are mixed. Revisit the board examples and try again.";
    fb.style.color = "#b03b2b";
    addWeakArea("Number line representation");
  }
}

// Teach 4
function checkTeach4() {
  const q1 = document.querySelector('input[name="t4_q1"]:checked');
  const q2 = (document.getElementById("t4_q2").value || "").trim();
  const q3 = document.querySelector('input[name="t4_q3"]:checked');
  const q4 = (document.getElementById("t4_q4").value || "").trim();
  const q5 = document.querySelector('input[name="t4_q5"]:checked');

  let score = 0;
  if (q1 && q1.value === "b") score++;
  if (q2 === "3/4") score++;
  if (q3 && q3.value === "b") score++;
  if (q4.replace(/\s/g, "") === "1/3,1/2,2/3") score++;
  if (q5 && q5.value === "b") score++;

  const fb = document.getElementById("teachFeedback4");
  if (!fb) return;

  if (score >= 4) {
    fb.textContent = "Good comparison of rational numbers.";
    fb.style.color = "#1a6f37";
    markTeachCompleted(4, "Comparing rational numbers");
  } else {
    fb.textContent =
      "Comparison needs revision. Try using common denominators carefully.";
    fb.style.color = "#b03b2b";
    addWeakArea("Comparing rational numbers");
  }
}

// Teach 5
function checkTeach5() {
  const q1 = (document.getElementById("t5_q1").value || "").trim();
  const q2 = (document.getElementById("t5_q2").value || "").trim();
  const q3 = (document.getElementById("t5_q3").value || "").trim();
  const q4 = (document.getElementById("t5_q4").value || "").trim();
  const q5 = (document.getElementById("t5_q5").value || "").trim();

  let score = 0;
  if (q1 === "3/6" || q1 === "1/2") score++;
  if (q2 === "4/8" || q2 === "1/2") score++;
  if (q3 === "2/9") score++;
  if (q4 === "8/11") score++;
  if (q5 === "-3/4") score++;

  const fb = document.getElementById("teachFeedback5");
  if (!fb) return;

  if (score >= 4) {
    fb.textContent = "Addition with same denominators is strong.";
    fb.style.color = "#1a6f37";
    markTeachCompleted(5, "Addition with same denominators");
  } else {
    fb.textContent =
      "Recheck how we add numerators when denominators are same.";
    fb.style.color = "#b03b2b";
    addWeakArea("Addition with same denominators");
  }
}

// Teach 6
function checkTeach6() {
  const q1 = (document.getElementById("t6_q1").value || "").trim();
  const q2 = (document.getElementById("t6_q2").value || "").trim();
  const q3 = (document.getElementById("t6_q3").value || "").trim();
  const q4 = (document.getElementById("t6_q4").value || "").trim();
  const q5 = (document.getElementById("t6_q5").value || "").trim();

  let score = 0;
  if (q1 === "5/6") score++;
  if (q2 === "9/10") score++;
  if (q3 === "11/12") score++;
  if (q4 === "1/6") score++;
  if (q5 === "9/12" || q5 === "3/4") score++;

  const fb = document.getElementById("teachFeedback6");
  if (!fb) return;

  if (score >= 4) {
    fb.textContent = "Good with LCM and adding unlike denominators.";
    fb.style.color = "#1a6f37";
    markTeachCompleted(6, "Addition with different denominators");
  } else {
    fb.textContent =
      "LCM and unlike denominators need more practice. Use the board steps.";
    fb.style.color = "#b03b2b";
    addWeakArea("Addition with different denominators");
  }
}

// Teach 7
function checkTeach7() {
  const q1 = (document.getElementById("t7_q1").value || "").trim();
  const q2 = (document.getElementById("t7_q2").value || "").trim();
  const q3 = (document.getElementById("t7_q3").value || "").trim();
  const q4 = (document.getElementById("t7_q4").value || "").trim();
  const q5 = (document.getElementById("t7_q5").value || "").trim();

  let score = 0;
  if (q1 === "2/4" || q1 === "1/2") score++;
  if (q2 === "3/6" || q2 === "1/2") score++;
  if (q3 === "-1/12") score++;
  if (q4 === "-3/4") score++;
  if (q5 === "3/10") score++;

  const fb = document.getElementById("teachFeedback7");
  if (!fb) return;

  if (score >= 4) {
    fb.textContent = "Subtraction of rational numbers looks good.";
    fb.style.color = "#1a6f37";
    markTeachCompleted(7, "Subtraction of rational numbers");
  } else {
    fb.textContent =
      "Revisit how we subtract using additive inverse and common denominators.";
    fb.style.color = "#b03b2b";
    addWeakArea("Subtraction of rational numbers");
  }
}

// Teach 8
function checkTeach8() {
  const q1 = (document.getElementById("t8_q1").value || "").trim();
  const q2 = (document.getElementById("t8_q2").value || "").trim();
  const q3 = (document.getElementById("t8_q3").value || "").trim();
  const q4 = (document.getElementById("t8_q4").value || "").trim();
  const q5 = (document.getElementById("t8_q5").value || "").trim();

  let score = 0;
  if (q1 === "3/8") score++;
  if (q2 === "1/3") score++;
  if (q3 === "-6/21" || q3 === "-2/7") score++;
  if (q4 === "2/12" || q4 === "1/6") score++;
  if (q5 === "0" || q5 === "0/1") score++;

  const fb = document.getElementById("teachFeedback8");
  if (!fb) return;

  if (score >= 4) {
    fb.textContent = "Multiplication of rational numbers is strong.";
    fb.style.color = "#1a6f37";
    markTeachCompleted(8, "Multiplication of rational numbers");
  } else {
    fb.textContent =
      "Multiplication needs revision. Follow the board examples carefully.";
    fb.style.color = "#b03b2b";
    addWeakArea("Multiplication of rational numbers");
  }
}

// Teach 9
function checkTeach9() {
  const q1 = (document.getElementById("t9_q1").value || "").trim();
  const q2 = (document.getElementById("t9_q2").value || "").trim();
  const q3 = (document.getElementById("t9_q3").value || "").trim();
  const q4 = (document.getElementById("t9_q4").value || "").trim();
  const q5 = document.querySelector('input[name="t9_q5"]:checked');

  let score = 0;
  if (q1 === "3/2") score++;
  if (q2 === "1/1" || q2 === "1") score++;
  if (q3 === "-4/5") score++;
  if (q4 === "3/2") score++;
  if (q5 && q5.value === "undef") score++;

  const fb = document.getElementById("teachFeedback9");
  if (!fb) return;

  if (score >= 4) {
    fb.textContent = "Division of rational numbers is clear.";
    fb.style.color = "#1a6f37";
    markTeachCompleted(9, "Division of rational numbers");
  } else {
    fb.textContent =
      "Division needs more attention, especially reciprocal and division by zero.";
    fb.style.color = "#b03b2b";
    addWeakArea("Division of rational numbers");
  }
}

// Attach Teach button listeners
document.querySelectorAll(".teach-check-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const step = btn.getAttribute("data-teach");
    switch (step) {
      case "1":
        checkTeach1();
        break;
      case "2":
        checkTeach2();
        break;
      case "3":
        checkTeach3();
        break;
      case "4":
        checkTeach4();
        break;
      case "5":
        checkTeach5();
        break;
      case "6":
        checkTeach6();
        break;
      case "7":
        checkTeach7();
        break;
      case "8":
        checkTeach8();
        break;
      case "9":
        checkTeach9();
        break;
    }
    updateParentReportView();
    updateRevisionView();
  });
});
// ====================== TEST LOGIC ======================

// Helper to mark test score
function markTestScore(kind, score, total) {
  progress.testsCompleted[kind] = true;
  progress.lastTestScore = `${score} / ${total}`;

  const strongLabelMap = {
    easy: "Basic rational number concepts",
    hard: "Operations with rational numbers",
    adv: "Mixed rational number skills"
  };

  const weakLabelMap = {
    easy: "Basic rational number concepts",
    hard: "Operations with rational numbers",
    adv: "Mixed rational number skills"
  };

  if (score >= Math.ceil(total * 0.7)) {
    const label = strongLabelMap[kind];
    if (label && !progress.strongAreas.includes(label)) {
      progress.strongAreas.push(label);
    }
  } else {
    const label = weakLabelMap[kind];
    if (label && !progress.weakAreas.includes(label)) {
      progress.weakAreas.push(label);
    }
  }

  if (score < Math.ceil(total * 0.5)) {
    progress.nextSteps =
      "Ask your child to revisit the weaker Teach steps and redo this test. " +
      "If mistakes continue, please discuss with the school teacher or tutor.";
  } else if (score < Math.ceil(total * 0.8)) {
    progress.nextSteps =
      "Ask your child to do one quick revision using the Revision suggestions, then repeat the test.";
  } else {
    progress.nextSteps =
      "Performance looks good. You can move to other chapters when available.";
  }
}

// ----- Easy test -----

const testEasyBtn = document.getElementById("testEasyBtn");
const testEasyFeedback = document.getElementById("testEasyFeedback");

if (testEasyBtn && testEasyFeedback) {
  testEasyBtn.addEventListener("click", () => {
    const q1 = document.querySelector('input[name="e_q1"]:checked');
    const q2 = document.querySelector('input[name="e_q2"]:checked');
    const q3 = document.querySelector('input[name="e_q3"]:checked');
    const q4 = (document.getElementById("e_q4").value || "").trim();
    const q5 = (document.getElementById("e_q5").value || "").trim();

    let score = 0;
    const total = 5;

    if (q1 && q1.value === "rat") score++;
    if (q2 && q2.value === "neg") score++;
    if (q3 && q3.value === "true") score++;
    if (q4 === "1/2") score++;
    if (q5 === "-3" || q5 === "−3") score++;

    markTestScore("easy", score, total);

    testEasyFeedback.textContent = `You scored ${score} / ${total}. See Parent Report for details.`;
    testEasyFeedback.style.color = "#1a6f37";

    updateRevisionView();
    updateParentReportView();
  });
}

// ----- Hard test -----

const testHardBtn = document.getElementById("testHardBtn");
const testHardFeedback = document.getElementById("testHardFeedback");

if (testHardBtn && testHardFeedback) {
  testHardBtn.addEventListener("click", () => {
    const q1 = (document.getElementById("h_q1").value || "").trim();
    const q2 = (document.getElementById("h_q2").value || "").trim();
    const q3 = (document.getElementById("h_q3").value || "").trim();
    const q4 = (document.getElementById("h_q4").value || "").trim();
    const q5 = (document.getElementById("h_q5").value || "").trim();

    let score = 0;
    const total = 5;

    if (q1 === "5/6") score++;
    if (q2 === "7/6") score++;
    if (q3 === "1/12") score++;
    if (q4 === "-6/20" || q4 === "-3/10") score++;
    if (q5 === "-6/7") score++;

    markTestScore("hard", score, total);

    testHardFeedback.textContent = `You scored ${score} / ${total}. See Parent Report for details.`;
    testHardFeedback.style.color = "#1a6f37";

    updateRevisionView();
    updateParentReportView();
  });
}

// ----- Advanced test -----

const testAdvBtn = document.getElementById("testAdvBtn");
const testAdvFeedback = document.getElementById("testAdvFeedback");

if (testAdvBtn && testAdvFeedback) {
  testAdvBtn.addEventListener("click", () => {
    const q1 = (document.getElementById("a_q1").value || "").trim();
    const q2 = (document.getElementById("a_q2").value || "").trim();
    const q3 = (document.getElementById("a_q3").value || "").trim();
    const q4 = (document.getElementById("a_q4").value || "").trim();
    const q5 = document.querySelector('input[name="a_q5"]:checked');

    let score = 0;
    const total = 5;

    if (q1.replace(/\s/g, "") === "-1/3,1/2,2/3") score++;
    if (q2 === "1/6") score++;
    if (q3 === "-30/45" || q3 === "-2/3") score++;
    if (q4 === "-10/8" || q4 === "-5/4") score++;
    if (q5 && q5.value === "no") score++;

    markTestScore("adv", score, total);

    testAdvFeedback.textContent = `You scored ${score} / ${total}. See Parent Report for details.`;
    testAdvFeedback.style.color = "#1a6f37";

    updateRevisionView();
    updateParentReportView();
  });
}

// ====================== REVISION VIEW ======================

const revisionContent = document.getElementById("revisionContent");

function updateRevisionView() {
  if (!revisionContent) return;

  const teachDoneCount = Object.values(progress.teachCompleted).filter(Boolean).length;
  const testsDoneCount = Object.values(progress.testsCompleted).filter(Boolean).length;

  if (teachDoneCount === 0 && testsDoneCount === 0) {
    revisionContent.innerHTML =
      "<p>Ask your child to start with Teach 1 and then attempt the Easy test. Revision tips will appear here.</p>";
    return;
  }

  let html = "<h3>Suggested revision</h3><ul>";

  if (teachDoneCount < 9) {
    html += "<li>Complete all Teach steps 1 to 9 in order.</li>";
  }

  if (progress.weakAreas.length > 0) {
    html += "<li>Focus on these weaker areas:</li>";
    progress.weakAreas.forEach((area) => {
      html += `<li>– ${area}</li>`;
    });
  }

  if (testsDoneCount === 0) {
    html += "<li>Once Teach steps are done, take the Easy test.</li>";
  } else if (testsDoneCount === 1) {
    html += "<li>After one test, revise and then try the next test (Hard).</li>";
  } else if (testsDoneCount >= 2 && testsDoneCount < 3) {
    html += "<li>Revise once more and then attempt the Advanced test.</li>";
  } else {
    html += "<li>All three tests done. You can repeat any test after revising if needed.</li>";
  }

  html += "</ul>";
  revisionContent.innerHTML = html;
}

// ====================== PARENT REPORT VIEW ======================

const reportTeachStatus = document.getElementById("reportTeachStatus");
const reportTestStatus = document.getElementById("reportTestStatus");
const reportLastTestScore = document.getElementById("reportLastTestScore");
const reportStrongList = document.getElementById("reportStrongList");
const reportWeakList = document.getElementById("reportWeakList");
const reportNextSteps = document.getElementById("reportNextSteps");

function updateParentReportView() {
  if (!reportTeachStatus) return;

  const teachDoneCount = Object.values(progress.teachCompleted).filter(Boolean).length;
  const testsDoneCount = Object.values(progress.testsCompleted).filter(Boolean).length;

  reportTeachStatus.textContent = `Teach steps completed: ${teachDoneCount} / 9`;
  reportTestStatus.textContent = `Tests completed: ${testsDoneCount} / 3`;

  reportLastTestScore.textContent = progress.lastTestScore
    ? `Latest test score: ${progress.lastTestScore}`
    : "Latest test score: –";

  // Strong areas
  if (reportStrongList) {
    if (progress.strongAreas.length === 0) {
      reportStrongList.innerHTML =
        "<li>No strong areas detected yet. Ask your child to complete Teach steps and tests.</li>";
    } else {
      reportStrongList.innerHTML = "";
      progress.strongAreas.forEach((area) => {
        const li = document.createElement("li");
        li.textContent = area;
        reportStrongList.appendChild(li);
      });
    }
  }

  // Weak areas
  if (reportWeakList) {
    if (progress.weakAreas.length === 0) {
      reportWeakList.innerHTML =
        "<li>No clear weak areas yet. Let your child attempt the Teach steps and tests.</li>";
    } else {
      reportWeakList.innerHTML = "";
      progress.weakAreas.forEach((area) => {
        const li = document.createElement("li");
        li.textContent = area;
        reportWeakList.appendChild(li);
      });
    }
  }

  // Next steps
  if (reportNextSteps) {
    reportNextSteps.textContent = progress.nextSteps;
  }
}

// ====================== INITIAL STATE ======================

document.addEventListener("DOMContentLoaded", () => {
  showScreen("screen-landing");
  updateRevisionView();
  updateParentReportView();
});
