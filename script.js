(() => {
  // READING PROGRESS
  const progress = document.getElementById("reading-progress");

  const updateProgress = () => {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage = scrollable > 0
      ? (window.scrollY / scrollable) * 100
      : 0;

    progress.style.width = `${percentage}%`;
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();


  // MOBILE MENU
  const menu = document.getElementById("main-nav");
  const toggle = document.getElementById("menu-toggle");

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");

    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.querySelector("span").textContent = isOpen ? "−" : "＋";
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.querySelector("span").textContent = "＋";
    });
  });


  // ACTIVE NAVIGATION
  const chapters = [...document.querySelectorAll("main section[id]")];

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          menu.querySelectorAll("a").forEach(link => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });

    chapters.forEach(chapter => observer.observe(chapter));
  }


  // QUIZ 1: WHICH VILLAIN ARE YOU?
  const villainResults = {
    joker: {
      title: "THE OUTSIDER — ARTHUR FLECK",
      description:
        "You may value authenticity and emotional expression. You want to be understood and dislike feeling invisible. Like Arthur Fleck, your answers suggest a strong interest in identity and recognition. This is a fictional character comparison, not a judgement of your personality."
    },

    hannibal: {
      title: "THE STRATEGIST — HANNIBAL LECTER",
      description:
        "You are drawn to intelligence, observation, and understanding how people think. You prefer to analyse a situation before acting. Like Hannibal Lecter, your fictional match is associated with calculation and intellectual curiosity."
    },

    walter: {
      title: "THE MASTERMIND — WALTER WHITE",
      description:
        "Ambition and achievement appear important to you. You want your abilities to be recognised and prefer having a clear plan. Like Walter White, your match reflects determination and a desire to prove yourself."
    },

    vader: {
      title: "THE FALLEN HERO — DARTH VADER",
      description:
        "Loyalty and emotional bonds seem important in your answers. You may take your commitments seriously and feel strongly about protecting people close to you. Like Darth Vader, your match reflects the tension between attachment, choices, and consequences."
    },

    thanos: {
      title: "THE IDEALIST — THANOS",
      description:
        "You tend to focus on long-term goals and the bigger picture. You value determination and having a clear vision. Like Thanos, your match reflects strong convictions. Remember: a strong belief does not automatically make every decision right."
    },

    loki: {
      title: "THE TRICKSTER — LOKI",
      description:
        "Independence, adaptability, and unconventional thinking stand out in your answers. You may enjoy finding unexpected solutions and resisting other people's expectations. Like Loki, your match reflects curiosity and a desire for freedom."
    }
  };


  // QUIZ 2: WHAT MAKES YOU RELATE TO VILLAINS?
  const connectionResults = {
    empath: {
      title: "THE EMPATH",
      description:
        "You are interested in the emotional experiences behind a character's actions. Their past, relationships, and personal struggles matter to you. You may find it easier to understand a character when you know what shaped them. Understanding, however, does not mean approving of their behaviour."
    },

    strategist: {
      title: "THE STRATEGIST",
      description:
        "You are fascinated by intelligence, planning, and complex decisions. You pay attention to how characters think and solve problems. You can find a fictional character interesting because of their abilities without supporting their actions."
    },

    rebel: {
      title: "THE REBEL",
      description:
        "You are drawn to characters who challenge authority and question established rules. Conflicts with society and power structures catch your attention. You may enjoy stories that make viewers reconsider what they take for granted."
    },

    observer: {
      title: "THE OBSERVER",
      description:
        "Curiosity is your main connection to morally complex characters. You want to know what motivates them and how their decisions develop. For you, understanding a character's behaviour is more important than simply liking or disliking them."
    },

    idealist: {
      title: "THE IDEALIST",
      description:
        "You are interested in the possibility of change. Redemption, personal growth, and difficult second chances are important themes for you. You may be drawn to characters who struggle with their past and attempt to choose a different future."
    }
  };


  // GENERAL QUIZ FUNCTION
  function activateQuiz(formId, resultId, titleId, descriptionId, results) {
    const form = document.getElementById(formId);
    const resultBox = document.getElementById(resultId);
    const resultTitle = document.getElementById(titleId);
    const resultDescription = document.getElementById(descriptionId);

    if (!form || !resultBox) return;

    form.addEventListener("submit", event => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const answers = new FormData(form);
      const scores = {};

      for (const [, value] of answers.entries()) {
        scores[value] = (scores[value] || 0) + 1;
      }

      const winner = Object.keys(scores).reduce((best, current) => {
        return scores[current] > scores[best] ? current : best;
      });

      const result = results[winner];

      if (!result) return;

      resultTitle.textContent = result.title;
      resultDescription.textContent = result.description;

      form.hidden = true;
      resultBox.hidden = false;

      resultBox.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    });

    const resetButton = document.querySelector(
      `[data-reset="${formId}"]`
    );

    resetButton.addEventListener("click", () => {
      form.reset();
      resultBox.hidden = true;
      form.hidden = false;

      form.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }


  // INITIALISE BOTH QUIZZES
  activateQuiz(
    "villain-quiz",
    "villain-result",
    "villain-result-title",
    "villain-result-description",
    villainResults
  );

  activateQuiz(
    "connection-quiz",
    "connection-result",
    "connection-result-title",
    "connection-result-description",
    connectionResults
  );

})();