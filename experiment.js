/**
 * Nine Dots Task Cognitive Experiment (Vanilla JS + jsPsych 8 + DataPipe)
 * Optimized & Multi-language Edition (RU / EN)
 *
 * Features:
 * - Language selection (Russian / English)
 * - Hardware warning screen (Keyboard + Mouse required)
 * - Group selection (Control, Inertia, Mirror)
 * - Attention check with realistic verification
 * - 3 training trials
 * - Main task instruction + Task comprehension check (5 options with selective bolding, return on forgotten)
 * - 15-minute main task with locked attempts
 * - Dedicated Screen for Save confirmation (no overlay/blur lag!)
 * - Post-experiment survey: Solved before, Insight, 6 rating scales, Gender (3 options), Age, Student Full Name for credits
 * - Final screen with save status, green indicator, fallback email and direct CSV download
 * - Automatic DataPipe upload & Manual Export (key E)
 */

const DATAPIPE_EXPERIMENT_ID = "44YekFZ9nNPl";
const PIPE_ENABLED = !new URLSearchParams(location.search).has("offline");

// --- Internationalization (i18n) Dictionary ---
const I18N = {
  ru: {
    bannerText: "Рекомендуется проходить эксперимент в полноэкранном режиме для корректной калибровки.",
    bannerBtn: "Включить Fullscreen",
    hwWarnTitle: "Внимание!",
    hwWarnP1: "Для прохождения эксперимента Вам потребуются клавиатура и мышь.",
    hwWarnP2: "Тачпад ноутбука не подойдет!",
    hwWarnP3: "Прохождение на телефоне невозможно!",
    hwWarnContinue: "Понятно, продолжить",
    groupSelectTitle: "Выберите группу для начала исследования",
    attentionTitle: "Проверка готовности и внимания",
    attentionInstruction: "Внимательно прочитайте условие ниже! Для подтверждения вашей концентрации и соблюдения условий эксперимента, пожалуйста, выберите вариант: <strong>«Я прохожу этот эксперимент в спокойной обстановке, в полноэкранном режиме, и буду использовать мышь и клавиатуру»</strong>.",
    attentionOptions: [
      "Я просто кликаю наугад, не читая текст",
      "Я прохожу эксперимент в спешке и отвлекаюсь на другие дела",
      "Я использую смартфон или планшет",
      "Я прохожу этот эксперимент в спокойной обстановке, в полноэкранном режиме, и буду использовать мышь и клавиатуру",
      "Я прохожу эксперимент на ноутбуке с тачпадом в шумном месте"
    ],
    attentionSuccess: "Проверено! Переходим к обучению...",
    attentionError: "Ответ неверный. Пожалуйста, будьте внимательны и следуйте инструкции.",
    trainingTitlePrefix: "Тренировочная задача",
    trainingOf: "из",
    trainingDesc: "Для прохождения тренировки, зажмите левую кнопку мыши и проведите прямую соединительную линию между двумя черными точками на экране. Ошибочный жест можно стереть клавишей <strong>R</strong>.",
    instructionTitle: "Инструкция к основной части",
    instructionP1: "Отлично! Теперь мы можем перейти к основной задаче. Вам будет необходимо соединить 9 точек 4 прямыми линиями, не отрывая руки. Постарайтесь рисовать каждое свое решение, а не просто мысленно решать задачу.",
    instructionP2: "В углу экрана будут находиться две кнопки. Если Вы нарисовали решение, но оно кажется Вам неправильным, нажмите «Продолжить». В этом случае нарисованные Вами линии будут стерты, а Вы сможете попробовать решить задачу снова. Если Вы уверены в правильности решения, нажмите «Сохранить». В этом случае нарисованные Вами линии будут считаться окончательным ответом.",
    instructionBtn: "Продолжить",
    taskCheckTitle: "Проверка понимания инструкции",
    taskCheckQuestion: "Что именно вам необходимо сделать в этой задаче?",
    taskCheckOptions: [
      "Соединить 9 точек <strong>прямыми линиями</strong>, не отрывая руки",
      "Соединить 9 точек <strong>3 линиями</strong>, не отрывая руки",
      "Соединить 9 точек <strong>4 прямыми</strong> линиями, не отрывая руки",
      "<strong>Обвести</strong> 9 точек прямыми линиями",
      "Я <strong>не понял</strong> инструкцию/забыл"
    ],
    taskCheckError: "Ответ неверный. Пожалуйста, внимательно ознакомьтесь с условием задачи.",
    taskCheckSuccess: "Верно! Переходим к выполнению задачи...",
    taskBtnContinue: "Продолжить",
    taskBtnSave: "Сохранить",
    saveConfirmTitle: "Вы уверены, что хотите прекратить решение? Вернуться к задаче станет невозможно",
    saveConfirmBtnReturn: "Вернуться к решению",
    saveConfirmBtnFinish: "Закончить эксперимент",
    hudGroup: "Группа",
    hudTrial: "Попытка",
    hudTime: "Время",
    timeoutTitle: "Время на решение истекло. Внизу представлено правильное решение задачи:",
    timeoutBtn: "Перейти к опросу",
    surveyIntro: "Пожалуйста, ответьте на вопросы о том, как проходил Ваш поиск решения. Если задача не была решена, отвечайте о чувствах, которые вы испытали, когда увидели правильный ответ.",
    surveySpacePrompt: "Если готовы, нажмите ПРОБЕЛ",
    surveySolvedBefore: "Решали ли Вы данную задачу ранее?",
    yes: "Да",
    no: "Нет",
    surveyInsight: "Испытали ли Вы инсайт во время решения данной задачи? Инсайт - это своего рода Ага-реакция, характеризующаяся внезапностью и очевидностью. Как озарение. Вы относительно уверены в правильности своего решения без проверки. И наоборот, Вы не испытываете Ага-реакции, если решение произошло для вас медленно и пошагово, если вам необходимо проверить решение ещё раз. В качестве примера представьте лампочку, которая включается сразу в отличие от медленно разгорающейся. Мы просим Вас дать личную оценку о наличии или отсутствии Ага, здесь нет правильных или неправильных ответов. Просто следуйте своей интуиции. Испытали ли Вы инсайт во время решения?",
    sliderSaveBtn: "сохранить ответ",
    surveyGenderTitle: "Укажите ваш пол",
    genderOptions: ["Мужской", "Женский", "Предпочитаю не говорить"],
    surveyAgeTitle: "Укажите ваш возраст",
    surveyAgeError: "Пожалуйста, введите корректный возраст.",
    btnNext: "далее",
    surveyExpPresenceTitle: "Вы проходили этот эксперимент в присутствии экспериментатора или без него?",
    expPresenceOptions: ["В присутствии экспериментатора", "Без экспериментатора"],
    surveyNameTitle: "Укажите ваши ФИО (для студентов)",
    surveyNameDesc: "Если за участие в эксперименте вам полагаются дополнительные баллы в вашем учебном заведении, пожалуйста, укажите свои полные ФИО, вуз и номер учебной группы. Если вы не являетесь студентом или баллы вам не требуются, оставьте поле пустым и нажмите кнопку ниже.",
    surveyNamePlaceholder: "Иванов Иван Иванович (МГУ, группа 101)",
    btnComplete: "Завершить эксперимент",
    finishedTitle: "Спасибо за участие в эксперименте!",
    finishedP1: "Если эксперимент проводится очно, то позовите экспериментатора. Если эксперимент проходит онлайн - дождитесь сохранения данных и завершите эксперимент. Надпись о сохранении данных должна стать зеленого цвета. В случае, если данные не сохранились, вы можете скачать csv файл с вашими результатами и отправить его на почту <strong>alexanderalkuritsyn@gmail.com</strong>, мы будем вам очень благодарны!",
    finishedP2: "Если вам понравилось решать эту задачу, то мы также просим вас распространить ссылку на неё среди своих друзей и знакомых! Спасибо!",
    finishedBtnDownloadCsv: "Скачать CSV с результатами",
    finishedExportHint: 'Нажмите клавишу <span class="bg-slate-100 px-1.5 py-0.5 rounded border text-slate-800 font-bold uppercase">E</span> для экспорта или перехода к сводной статистике.',
    saveStatusPending: "Идёт сохранение данных. Пожалуйста, не закрывайте страницу...",
    saveStatusOk: "Данные успешно сохранены. Эксперимент завершён!",
    saveStatusError: "Не удалось отправить данные на сервер. Пожалуйста, скачайте CSV файл ниже и отправьте его на почту alexanderalkuritsyn@gmail.com",
    exportTitle: "Results Export (Semicolon CSV)",
    exportBtnHome: "Главный экран",
    exportBtnJson: "Скачать JSON",
    exportBtnPng: "Скачать Схему (PNG)",
    exportBtnCsv: "Экспорт CSV",
    noticeCsvSuccess: "Сводная ведомость CSV успешно сохранена!",
    noticeJsonSuccess: "Сенсорные данные JSON успешно сохранены!",
    noticePngSuccess: "Трасса решения сохранена как PNG графическая схема!",
    noticePipeSuccess: "Данные эксперимента успешно сохранены в DataPipe!",
    noticePipeError: "Ошибка сохранения в DataPipe. Скачайте результаты вручную на странице экспорта.",
    sliders: [
      { field: 'Удовольствие', title: 'В момент, когда я нашел решение, я испытал', left: 'неприятные чувства', right: 'приятные чувства' },
      { field: 'Удивление', title: 'Момент, когда я нашел решение, был для меня', left: 'ожидаемым', right: 'удивительным' },
      { field: 'Внезапность', title: 'Это решение пришло ко мне', left: 'шаг за шагом', right: 'целиком' },
      { field: 'Облегчение', title: 'Когда я решил задачу, то почувствовал', left: 'напряжение', right: 'облегчение' },
      { field: 'Уверенность', title: 'В момент обнаружения решения я был уверен в правильности полученного решения', left: 'не уверен', right: 'уверен' },
      { field: 'Драйв', title: 'Я с нетерпением жду следующего задания', left: 'не согласен', right: 'согласен' }
    ]
  },
  en: {
    bannerText: "It is recommended to take the experiment in full-screen mode for correct calibration.",
    bannerBtn: "Enable Fullscreen",
    hwWarnTitle: "Attention!",
    hwWarnP1: "A keyboard and a mouse are required to complete this experiment.",
    hwWarnP2: "A laptop touchpad will not work!",
    hwWarnP3: "Taking the experiment on a mobile phone is impossible!",
    hwWarnContinue: "Understood, continue",
    groupSelectTitle: "Select a group to start the study",
    attentionTitle: "Readiness & Attention Check",
    attentionInstruction: "Carefully read the statement below! To confirm your concentration and adherence to the experiment conditions, please select the option: <strong>«I am taking this experiment in a quiet setting, in full-screen mode, and will use a mouse and keyboard»</strong>.",
    attentionOptions: [
      "I am just clicking at random without reading the text",
      "I am taking the experiment in a hurry and distracted by other things",
      "I am using a smartphone or tablet",
      "I am taking this experiment in a quiet setting, in full-screen mode, and will use a mouse and keyboard",
      "I am taking the experiment on a laptop with a touchpad in a noisy place"
    ],
    attentionSuccess: "Verified! Proceeding to training...",
    attentionError: "Incorrect answer. Please pay close attention and follow the instructions.",
    trainingTitlePrefix: "Training task",
    trainingOf: "of",
    trainingDesc: "To complete training, press and hold the left mouse button and draw a straight connecting line between the two black dots on the screen. An accidental stroke can be erased with the <strong>R</strong> key.",
    instructionTitle: "Main Task Instructions",
    instructionP1: "Great! Now we can move on to the main task. You will need to connect 9 dots with 4 straight lines without lifting your hand. Please try to draw each of your attempts rather than just solving the problem mentally.",
    instructionP2: "There will be two buttons in the corner of the screen. If you have drawn a solution but believe it is incorrect, click 'Continue'. Your drawn lines will be erased, and you will be able to try again. If you are confident in your solution, click 'Save'. In this case, your lines will be recorded as your final answer.",
    instructionBtn: "Continue",
    taskCheckTitle: "Task Comprehension Check",
    taskCheckQuestion: "What exactly do you need to do in this task?",
    taskCheckOptions: [
      "Connect 9 dots with <strong>straight lines</strong> without lifting your hand",
      "Connect 9 dots with <strong>3 lines</strong> without lifting your hand",
      "Connect 9 dots with <strong>4 straight</strong> lines without lifting your hand",
      "<strong>Outline</strong> 9 dots with straight lines",
      "I <strong>didn't understand</strong> the instructions / I forgot"
    ],
    taskCheckError: "Incorrect answer. Please carefully review the task instructions.",
    taskCheckSuccess: "Correct! Proceeding to the task...",
    taskBtnContinue: "Continue",
    taskBtnSave: "Save",
    saveConfirmTitle: "Are you sure you want to stop solving? It will be impossible to return to the task",
    saveConfirmBtnReturn: "Return to solving",
    saveConfirmBtnFinish: "Finish experiment",
    hudGroup: "Group",
    hudTrial: "Trial",
    hudTime: "Time",
    timeoutTitle: "Time to solve has expired. The correct solution to the task is shown below:",
    timeoutBtn: "Proceed to survey",
    surveyIntro: "Please answer the questions about how your search for a solution proceeded. If the task was not solved, describe the feelings you experienced when you saw the correct answer.",
    surveySpacePrompt: "When ready, press SPACE",
    surveySolvedBefore: "Have you solved this task before?",
    yes: "Yes",
    no: "No",
    surveyInsight: "Did you experience insight while solving this problem? Insight is a kind of Aha! experience characterized by suddenness and obviousness. Like an epiphany. You are relatively confident in the correctness of your solution without double-checking. Conversely, you do not experience an Aha! reaction if the solution emerged slowly and step-by-step, or if you feel the need to re-verify it. As an analogy, picture a light bulb switching on instantly versus slowly brightening. We ask you to give a personal assessment of the presence or absence of Aha!; there are no right or wrong answers. Simply follow your intuition. Did you experience insight during the solution?",
    sliderSaveBtn: "save answer",
    surveyGenderTitle: "Specify your gender",
    genderOptions: ["Male", "Female", "Prefer not to say"],
    surveyAgeTitle: "Specify your age",
    surveyAgeError: "Please enter a valid age.",
    btnNext: "next",
    surveyExpPresenceTitle: "Did you take this experiment in the presence of an experimenter or without them?",
    expPresenceOptions: ["In the presence of an experimenter", "Without an experimenter"],
    surveyNameTitle: "Enter your Full Name (for students)",
    surveyNameDesc: "If you are eligible for extra credit/bonus points for participating in this experiment, please provide your Full Name, university, and student group. If you are not a student or do not need credit, leave the field blank and click the button below.",
    surveyNamePlaceholder: "John Doe (University, Group 101)",
    btnComplete: "Complete Experiment",
    finishedTitle: "Thank you for participating in the experiment!",
    finishedP1: "If the experiment is conducted in person, please call the experimenter. If the experiment is conducted online, please wait until the data is saved and then finish the experiment. The data saving status label should turn green. If the data could not be saved, you can download the CSV file with your results and send it to <strong>alexanderalkuritsyn@gmail.com</strong> — we would be very grateful!",
    finishedP2: "If you enjoyed solving this task, we also kindly ask you to share the link with your friends and acquaintances! Thank you!",
    finishedBtnDownloadCsv: "Download CSV results file",
    finishedExportHint: 'Press the <span class="bg-slate-100 px-1.5 py-0.5 rounded border text-slate-800 font-bold uppercase">E</span> key for export or summary statistics.',
    saveStatusPending: "Saving data. Please do not close this page...",
    saveStatusOk: "Data successfully saved. Experiment completed!",
    saveStatusError: "Failed to send data to the server. Please download the CSV file below and email it to alexanderalkuritsyn@gmail.com",
    exportTitle: "Results Export (Semicolon CSV)",
    exportBtnHome: "Home Screen",
    exportBtnJson: "Download JSON",
    exportBtnPng: "Download Diagram (PNG)",
    exportBtnCsv: "Export CSV",
    noticeCsvSuccess: "CSV results successfully saved!",
    noticeJsonSuccess: "JSON sensory data successfully saved!",
    noticePngSuccess: "Solution path saved as PNG diagram!",
    noticePipeSuccess: "Experiment data successfully saved to DataPipe!",
    noticePipeError: "Error saving to DataPipe. Download results manually on export page.",
    sliders: [
      { field: 'Удовольствие', title: 'At the moment I found the solution, I experienced', left: 'unpleasant feelings', right: 'pleasant feelings' },
      { field: 'Удивление', title: 'The moment I found the solution was for me', left: 'expected', right: 'surprising' },
      { field: 'Внезапность', title: 'This solution came to me', left: 'step by step', right: 'all at once' },
      { field: 'Облегчение', title: 'When I solved the task, I felt', left: 'tension', right: 'relief' },
      { field: 'Уверенность', title: 'At the moment of discovering the solution, I was confident in its correctness', left: 'not confident', right: 'confident' },
      { field: 'Драйв', title: 'I look forward to the next task', left: 'disagree', right: 'agree' }
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const $ = (id) => document.getElementById(id);

  // --- Constants ---
  const NINE_DOTS_SPACING = 116;
  const NINE_DOTS_PADDING = 50;
  const NINE_DOTS_SIZE = NINE_DOTS_SPACING * 2 + NINE_DOTS_PADDING * 2; // 332px
  const DOT_RADIUS = 23.5;
  const BRUSH_COLOR = '#ff0000';
  const BRUSH_WIDTH = 4;
  const TASK_LIMIT_SEC = 900; // 15 min

  const GROUP_PARAMS = {
    INERTIA: ['inertiaStep', 'inertiaInc', 'inertiaSmoothing'],
    MIRROR: ['mirrorSize', 'mirrorThickness', 'mirrorDuration']
  };
  const ALL_PARAM_KEYS = [...GROUP_PARAMS.INERTIA, ...GROUP_PARAMS.MIRROR];

  const SETTINGS_SLIDERS = {
    INERTIA: {
      labelClass: 'text-red-600 bg-red-50',
      inputClass: 'accent-red-600 accent-red',
      items: [
        { key: 'inertiaStep', label: 'Шаг инерции / Step', min: 5, max: 1000, step: 5, parse: parseInt, fmt: v => `${v} px`, hint: 'Через сколько пикселей пути чувствительность вырастет' },
        { key: 'inertiaInc', label: 'Прирост / Inc', min: 0.01, max: 2.00, step: 0.01, parse: parseFloat, fmt: v => `${(v * 100).toFixed(0)}%`, hint: 'На сколько процентов растет чувствительность за каждый шаг' },
        { key: 'inertiaSmoothing', label: 'Сглаживание / Smoothing', min: 0, max: 0.95, step: 0.01, parse: parseFloat, fmt: v => `${(v * 100).toFixed(0)}%`, hint: 'Уменьшает эффект "лесенки" при высокой скорости движения' }
      ]
    },
    MIRROR: {
      labelClass: 'text-purple-600 bg-purple-50',
      inputClass: 'accent-purple-600 accent-purple',
      items: [
        { key: 'mirrorSize', label: 'Размер рамки / Frame size', min: 50, max: 1500, step: 10, parse: parseInt, fmt: v => `${v} px`, redraw: true },
        { key: 'mirrorThickness', label: 'Толщина границ / Border', min: 2, max: 250, step: 1, parse: parseInt, fmt: v => `${v} px`, hint: 'Активная зона инверсии работает только на границах рамки', redraw: true },
        { key: 'mirrorDuration', label: 'Длительность инверсии / Duration', min: 100, max: 3000, step: 50, parse: parseInt, fmt: v => `${v} ms` }
      ]
    }
  };

  const defaultSurveyAnswers = () => ({
    solvedBefore: null,
    insight: null,
    'Удовольствие': 50,
    'Удивление': 50,
    'Внезапность': 50,
    'Облегчение': 50,
    'Уверенность': 50,
    'Драйв': 50,
    gender: null,
    age: "",
    experimenterPresence: null,
    name: ""
  });

  // --- App state ---
  const state = {
    language: 'ru', // 'ru' | 'en'
    appState: 'LANGUAGE', // 'LANGUAGE' | 'HARDWARE_WARNING' | 'SELECT' | 'ATTENTION_CHECK' | 'TRAINING' | 'INSTRUCTION' | 'TASK_CHECK' | 'TASK' | 'SAVE_CONFIRM' | 'TIMEOUT_INFO' | 'SURVEY' | 'FINISHED' | 'EXPORT'
    finishReason: null, // 'TIMEOUT' | 'EARLY'
    taskStartTime: null,
    elapsedTime: 0, // seconds
    timerInterval: null,
    trainingStep: 1,
    surveyStep: 0,
    surveyAnswers: defaultSurveyAnswers(),
    selectedGroup: 'CONTROL', // 'CONTROL' | 'INERTIA' | 'MIRROR'
    allTrials: [],
    currentTrialNumber: 1,
    isLocked: false,
    showSettings: false,
    attentionPassed: false,
    attentionAttempts: 0,
    taskCheckPassed: false,
    taskCheckAttempts: 0,
    saveStatus: PIPE_ENABLED ? 'idle' : 'offline',

    // Inertia parameters
    inertiaStep: 5,
    inertiaInc: 0.20,
    inertiaSmoothing: 0.50,

    // Mirror parameters
    mirrorSize: 580,
    mirrorThickness: 100,
    mirrorDuration: 350,
    mirrorVisible: false,
    showGrid: false
  };

  const t = () => I18N[state.language] || I18N.ru;

  // --- jsPsych + DataPipe Initialization ---
  let endSessionTrial = () => {};
  const libsLoaded = typeof initJsPsych === 'function' && typeof jsPsychExtensionPipe === 'function';
  const pipeActive = PIPE_ENABLED && libsLoaded;

  function NineDotsSessionPlugin() {}
  NineDotsSessionPlugin.info = { name: 'nine-dots-session', version: '2.0.0', parameters: {}, data: {} };
  NineDotsSessionPlugin.prototype.trial = function () {
    return new Promise(resolve => { endSessionTrial = () => resolve({}); });
  };

  let jsPsych = null;
  if (libsLoaded) {
    try {
      jsPsych = initJsPsych({
        display_element: 'jspsych-target',
        extensions: [
          {
            type: jsPsychExtensionPipe,
            params: {
              experiment_id: DATAPIPE_EXPERIMENT_ID,
              filename: () => `${subject_id}.csv`,
              data_string: () => generateCSVData(),
              stream: false,
              enabled: PIPE_ENABLED,
              wait_message: '',
              done_message: '',
              on_save: (result) => {
                if (!result.ok) console.error(`DataPipe refused the CSV (HTTP ${result.status})`, result.body);
                setSaveStatus(result.ok && !imageUploadFailed ? 'ok' : 'error');
              }
            }
          }
        ]
      });
    } catch (err) {
      console.error('jsPsych could not be initialized', err);
    }
  }

  const subject_id = jsPsych
    ? jsPsych.randomization.randomID(10)
    : Array.from(crypto.getRandomValues(new Uint8Array(10)), n => 'abcdefghijklmnopqrstuvwxyz0123456789'[n % 36]).join('');
  const participantID = subject_id;

  if (jsPsych) jsPsych.run([{ type: NineDotsSessionPlugin }]);

  const rawMetadata = collectBrowserMetadata();
  const pendingUploads = [];
  let imageUploadFailed = false;

  // Timing
  let trialStartTimeMs = 0;
  let firstStrokeStartTimeMs = 0;

  // Canvas Drawing
  const canvas = document.getElementById('experiment-canvas');
  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let currentStrokePoints = [];
  let lastActualPos = null;
  let lastVirtualPos = null;
  let redrawQueued = false;

  // Inertia / mirror runtime
  let cumulativeDistance = 0;
  let currentSensitivity = 1.0;
  let lastDelta = { dx: 0, dy: 0 };
  let inversionEndTime = 0;

  const isCanvasState = () => state.appState === 'TASK' || state.appState === 'TRAINING';

  function collectBrowserMetadata() {
    return {
      id: participantID,
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      devicePixelRatio: window.devicePixelRatio || 1,
      platform: navigator.platform || 'unknown',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
      timestamp: new Date().toISOString()
    };
  }

  // --- Apply Language to Static Elements ---
  function applyLanguage() {
    const texts = t();
    if ($('fullscreen-banner-text')) $('fullscreen-banner-text').innerText = texts.bannerText;
    if ($('request-fullscreen-btn')) $('request-fullscreen-btn').innerText = texts.bannerBtn;

    // Hardware warning screen
    if ($('hw-warn-title')) $('hw-warn-title').innerText = texts.hwWarnTitle;
    if ($('hw-warn-p1')) $('hw-warn-p1').innerText = texts.hwWarnP1;
    if ($('hw-warn-p2')) $('hw-warn-p2').innerText = texts.hwWarnP2;
    if ($('hw-warn-p3')) $('hw-warn-p3').innerText = texts.hwWarnP3;
    if ($('hw-warn-continue-btn')) $('hw-warn-continue-btn').innerText = texts.hwWarnContinue;

    // Group select
    if ($('group-select-title')) $('group-select-title').innerText = texts.groupSelectTitle;

    // Instruction
    if ($('instruction-title')) $('instruction-title').innerText = texts.instructionTitle;
    if ($('instruction-p1')) $('instruction-p1').innerText = texts.instructionP1;
    if ($('instruction-p2')) $('instruction-p2').innerText = texts.instructionP2;
    if ($('start-task-btn')) $('start-task-btn').innerText = texts.instructionBtn;

    // Canvas actions
    if ($('task-action-continue')) $('task-action-continue').innerText = texts.taskBtnContinue;
    if ($('task-action-save')) $('task-action-save').innerText = texts.taskBtnSave;

    // Dedicated Save Confirmation Screen
    if ($('save-confirm-title')) $('save-confirm-title').innerText = texts.saveConfirmTitle;
    if ($('save-confirm-btn-return')) $('save-confirm-btn-return').innerText = texts.saveConfirmBtnReturn;
    if ($('save-confirm-btn-finish')) $('save-confirm-btn-finish').innerText = texts.saveConfirmBtnFinish;

    // HUD labels
    if ($('hud-lbl-group')) $('hud-lbl-group').innerText = texts.hudGroup;
    if ($('hud-lbl-trial')) $('hud-lbl-trial').innerText = texts.hudTrial;
    if ($('hud-lbl-time')) $('hud-lbl-time').innerText = texts.hudTime;

    // Training HUD
    if ($('training-hud-title-prefix')) $('training-hud-title-prefix').innerText = texts.trainingTitlePrefix;
    if ($('training-hud-of')) $('training-hud-of').innerText = texts.trainingOf;
    if ($('training-hud-desc')) $('training-hud-desc').innerHTML = texts.trainingDesc;

    // Timeout
    if ($('timeout-title')) $('timeout-title').innerText = texts.timeoutTitle;
    if ($('timeout-survey-btn')) $('timeout-survey-btn').innerText = texts.timeoutBtn;

    // Finished
    if ($('finished-title')) $('finished-title').innerText = texts.finishedTitle;
    if ($('finished-p1')) $('finished-p1').innerHTML = texts.finishedP1;
    if ($('finished-p2')) $('finished-p2').innerText = texts.finishedP2;
    if ($('finished-btn-download-csv')) $('finished-btn-download-csv').innerText = texts.finishedBtnDownloadCsv;
    if ($('finished-export-hint')) $('finished-export-hint').innerHTML = texts.finishedExportHint;

    // Export screen
    if ($('btn-reset-app')) $('btn-reset-app').innerText = texts.exportBtnHome;
    if ($('btn-download-json')) $('btn-download-json').innerText = texts.exportBtnJson;
    if ($('btn-download-img')) $('btn-download-img').innerText = texts.exportBtnPng;
    if ($('btn-download-csv')) $('btn-download-csv').innerText = texts.exportBtnCsv;
  }

  // --- Fullscreen ---
  const isFullscreen = () => !!(document.fullscreenElement || document.webkitFullscreenElement);

  function checkFullscreen() {
    $('fullscreen-prompt-banner').classList.toggle('hidden', isFullscreen());
  }

  function enterFullscreen() {
    const el = document.documentElement;
    const request = el.requestFullscreen || el.webkitRequestFullscreen;
    Promise.resolve(request && request.call(el)).catch(() => {
      showNotice(state.language === 'ru' ? "Не удалось войти в полноэкранный режим. Попробуйте нажать F11." : "Could not enter full screen. Please try pressing F11.", "error");
    });
  }

  function exitFullscreen() {
    (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  }

  document.addEventListener('fullscreenchange', checkFullscreen);
  document.addEventListener('webkitfullscreenchange', checkFullscreen);
  $('request-fullscreen-btn').addEventListener('click', enterFullscreen);

  // --- Keyboard Shortcuts ---
  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();

    if (key === 'f') {
      isFullscreen() ? exitFullscreen() : enterFullscreen();
      return;
    }

    if (key === 'y') {
      state.showSettings = !state.showSettings;
      renderSettingsHUDs();
      return;
    }

    if (state.appState === 'SURVEY' && state.surveyStep === 0 && e.code === 'Space') {
      e.preventDefault();
      setSurveyStep(1);
    } else if (state.appState === 'FINISHED' && key === 'e') {
      setAppState('EXPORT');
    } else if (state.appState === 'TRAINING' && key === 'r') {
      currentStrokePoints = [];
      redrawCanvas();
    } else if (state.appState === 'TASK') {
      if (key === 'r') startNextAttempt();
      else if (key === 't') finishTask('EARLY');
    }
  });

  // --- Screen Routing ---
  const SCREENS = [
    'screen-language', 'screen-hardware-warning', 'screen-select', 'screen-attention',
    'screen-training-hud', 'screen-instruction', 'screen-task-check', 'screen-save-confirm',
    'screen-timeout-info', 'screen-survey', 'screen-finished', 'screen-export', 'canvas-container'
  ];

  function setAppState(next) {
    state.appState = next;
    renderActiveScreen();
  }

  function renderActiveScreen() {
    hideTaskLockButtons();
    SCREENS.forEach(id => {
      const el = $(id);
      if (el) el.classList.add('hidden');
    });
    document.body.classList.toggle('cursor-none-custom', isCanvasState() && state.selectedGroup !== 'CONTROL');

    switch (state.appState) {
      case 'LANGUAGE':
        $('screen-language').classList.remove('hidden');
        break;
      case 'HARDWARE_WARNING':
        $('screen-hardware-warning').classList.remove('hidden');
        break;
      case 'SELECT':
        $('screen-select').classList.remove('hidden');
        break;
      case 'ATTENTION_CHECK':
        renderAttentionCheckUI();
        break;
      case 'TRAINING':
        $('canvas-container').classList.remove('hidden');
        $('screen-training-hud').classList.remove('hidden');
        $('training-step-number').innerText = state.trainingStep;
        startDrawingSystem();
        break;
      case 'INSTRUCTION':
        $('screen-instruction').classList.remove('hidden');
        break;
      case 'TASK_CHECK':
        renderTaskCheckUI();
        break;
      case 'TASK':
        $('canvas-container').classList.remove('hidden');
        startDrawingSystem();
        break;
      case 'SAVE_CONFIRM':
        $('screen-save-confirm').classList.remove('hidden');
        break;
      case 'TIMEOUT_INFO':
        $('screen-timeout-info').classList.remove('hidden');
        break;
      case 'SURVEY':
        renderSurveyUI();
        break;
      case 'FINISHED':
        $('screen-finished').classList.remove('hidden');
        renderSaveStatus();
        break;
      case 'EXPORT':
        $('screen-export').classList.remove('hidden');
        $('export-csv-preview').innerText = generateCSVData();
        break;
    }

    renderSettingsHUDs();
    checkFullscreen();
  }

  // --- Step 0: Language Select Handler ---
  $('btn-lang-ru').addEventListener('click', () => {
    state.language = 'ru';
    applyLanguage();
    setAppState('HARDWARE_WARNING');
  });

  $('btn-lang-en').addEventListener('click', () => {
    state.language = 'en';
    applyLanguage();
    setAppState('HARDWARE_WARNING');
  });

  // --- Step 0.5: Hardware Warning Continue Handler ---
  $('hw-warn-continue-btn').addEventListener('click', () => {
    setAppState('SELECT');
  });

  // --- Step 1: Group Selection ---
  document.querySelectorAll('.group-btn-selector').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.selectedGroup = e.currentTarget.dataset.group;
      setAppState('ATTENTION_CHECK');
    });
  });

  // --- Step 2: Attention Check ---
  const ATTENTION_CORRECT = 4; // 1-based index (option #4)

  function renderAttentionCheckUI() {
    const space = $('screen-attention');
    space.classList.remove('hidden');
    const texts = t();

    space.innerHTML = `
      <div class="experiment-card max-w-2xl sm:max-w-3xl bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl text-center fade-in">
        <div class="hero-icon-box w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
          <svg class="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <h2 class="fluid-h2 text-gray-900 mb-3 font-display">${texts.attentionTitle}</h2>
        <p class="fluid-body text-gray-600 mb-5 leading-relaxed max-w-xl mx-auto">
          ${texts.attentionInstruction}
        </p>
        <div class="space-y-6 text-left max-w-xl w-full mx-auto mb-6" id="attention-options">
          ${texts.attentionOptions.map((optText, i) => `
          <button data-index="${i + 1}" class="btn-list-option">
            ${i + 1}. ${optText}
          </button>`).join('')}
        </div>
        <div id="attention-feedback-msg" class="text-sm font-bold min-h-6"></div>
      </div>
    `;

    const buttons = space.querySelectorAll('#attention-options button');
    const msg = $('attention-feedback-msg');
    const FAIL_CLASSES = ['border-red-500', 'bg-red-50/50', 'text-red-700'];

    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        if (state.attentionPassed) return;
        state.attentionAttempts += 1;

        if (Number(e.currentTarget.dataset.index) === ATTENTION_CORRECT) {
          state.attentionPassed = true;
          msg.className = "text-sm font-bold text-emerald-600";
          msg.innerText = texts.attentionSuccess;
          setTimeout(() => {
            state.trainingStep = 1;
            setAppState('TRAINING');
          }, 1200);
          return;
        }

        msg.className = "text-sm font-bold text-red-500";
        msg.innerText = texts.attentionError;
        e.currentTarget.classList.add(...FAIL_CLASSES);
        buttons.forEach(b => { b.disabled = true; });
        setTimeout(() => {
          buttons.forEach(b => {
            b.disabled = false;
            b.classList.remove(...FAIL_CLASSES);
          });
          msg.innerText = "";
        }, 2000);
      });
    });
  }

  // --- Step 3: Main Task Instructions ---
  $('start-task-btn').addEventListener('click', () => {
    // Proceed to comprehension check before actual drawing begins
    setAppState('TASK_CHECK');
  });

  // --- Step 3.5: Task Comprehension Check ---
  const TASK_CHECK_CORRECT = 3; // 1-based index (option #3: 4 прямыми линиями)
  const TASK_CHECK_RETURN = 5;  // option #5: return to instructions

  function renderTaskCheckUI() {
    const space = $('screen-task-check');
    space.classList.remove('hidden');
    const texts = t();

    space.innerHTML = `
      <div class="experiment-card max-w-2xl sm:max-w-3xl bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl text-center fade-in">
        <div class="hero-icon-box w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
          <svg class="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="fluid-h2 text-gray-900 mb-2 font-display">${texts.taskCheckTitle}</h2>
        <p class="fluid-h3 text-gray-800 mb-5 font-semibold">${texts.taskCheckQuestion}</p>
        <div class="space-y-6 text-left max-w-xl w-full mx-auto mb-6" id="task-check-options">
          ${texts.taskCheckOptions.map((optHtml, i) => `
          <button data-index="${i + 1}" class="btn-list-option">
            ${i + 1}. ${optHtml}
          </button>`).join('')}
        </div>
        <div id="task-check-feedback-msg" class="text-sm font-bold min-h-6"></div>
      </div>
    `;

    const buttons = space.querySelectorAll('#task-check-options button');
    const msg = $('task-check-feedback-msg');
    const FAIL_CLASSES = ['border-red-500', 'bg-red-50/50', 'text-red-700'];

    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const choice = Number(e.currentTarget.dataset.index);

        // If participant chooses option 5 ("Я не понял инструкцию/забыл")
        if (choice === TASK_CHECK_RETURN) {
          setAppState('INSTRUCTION');
          return;
        }

        state.taskCheckAttempts += 1;

        if (choice === TASK_CHECK_CORRECT) {
          state.taskCheckPassed = true;
          msg.className = "text-sm font-bold text-emerald-600";
          msg.innerText = texts.taskCheckSuccess;

          setTimeout(() => {
            // Start the actual task and timer
            state.isLocked = false;
            state.taskStartTime = performance.now();
            state.elapsedTime = 0;

            state.timerInterval = setInterval(() => {
              state.elapsedTime = Math.floor((performance.now() - state.taskStartTime) / 1000);
              updateHUDStats();
              if (state.elapsedTime >= TASK_LIMIT_SEC) finishTask('TIMEOUT');
            }, 1000);

            setAppState('TASK');
          }, 1000);
          return;
        }

        // Wrong choice
        msg.className = "text-sm font-bold text-red-500";
        msg.innerText = texts.taskCheckError;
        e.currentTarget.classList.add(...FAIL_CLASSES);
        buttons.forEach(b => { b.disabled = true; });
        setTimeout(() => {
          buttons.forEach(b => {
            b.disabled = false;
            b.classList.remove(...FAIL_CLASSES);
          });
          msg.innerText = "";
        }, 2000);
      });
    });
  }

  // --- Task Completion / Finish Logic ---
  function finishTask(reason) {
    clearInterval(state.timerInterval);
    registerTrialRecord();
    state.finishReason = reason;
    hideTaskLockButtons();
    if (reason === 'TIMEOUT') {
      setAppState('TIMEOUT_INFO');
    } else {
      state.elapsedTime = Math.round((performance.now() - state.taskStartTime) / 1000);
      state.surveyStep = 0;
      setAppState('SURVEY');
    }
  }

  $('timeout-survey-btn').addEventListener('click', () => {
    state.surveyStep = 0;
    setAppState('SURVEY');
  });

  // 'Продолжить' (or key R): store the attempt and clear the board
  function startNextAttempt() {
    registerTrialRecord();
    state.currentTrialNumber += 1;
    state.isLocked = false;
    trialStartTimeMs = performance.now();
    currentStrokePoints = [];
    cumulativeDistance = 0;
    currentSensitivity = 1.0;
    inversionEndTime = 0;
    hideTaskLockButtons();
    redrawCanvas();
    updateHUDStats();
  }

  $('task-action-continue').addEventListener('click', startNextAttempt);

  // 'Сохранить': navigate to dedicated confirmation screen (replaces laggy modal!)
  $('task-action-save').addEventListener('click', () => {
    if (state.appState === 'TASK') {
      setAppState('SAVE_CONFIRM');
    }
  });

  // Save Confirmation Screen buttons
  $('save-confirm-btn-return').addEventListener('click', () => {
    // "Вернуться к решению": аналогично продолжить - всё стирается, новая попытка
    startNextAttempt();
    setAppState('TASK');
  });

  $('save-confirm-btn-finish').addEventListener('click', () => {
    // "Закончить эксперимент": переходит к опросу
    finishTask('EARLY');
  });

  const showTaskLockButtons = () => $('task-lock-hud').classList.remove('hidden');
  const hideTaskLockButtons = () => $('task-lock-hud').classList.add('hidden');

  // --- Canvas Drawing System ---
  function getMouseCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const src = (e.touches && e.touches.length > 0) ? e.touches[0] : e;
    return {
      x: Math.round(src.clientX - rect.left),
      y: Math.round(src.clientY - rect.top)
    };
  }

  function resetMotionState() {
    cumulativeDistance = 0;
    currentSensitivity = 1.0;
    lastDelta = { dx: 0, dy: 0 };
    inversionEndTime = 0;
  }

  function startDrawingSystem() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    isDrawing = false;
    currentStrokePoints = [];
    lastActualPos = null;
    lastVirtualPos = null;
    firstStrokeStartTimeMs = 0;
    trialStartTimeMs = performance.now();
    resetMotionState();
    hideTaskLockButtons();
    redrawCanvas();
    updateHUDStats();
  }

  canvas.addEventListener('mousedown', canvasMouseDown);
  canvas.addEventListener('touchstart', canvasMouseDown, { passive: true });
  window.addEventListener('mousemove', canvasMouseMove);
  window.addEventListener('touchmove', canvasMouseMove, { passive: false });
  window.addEventListener('mouseup', canvasMouseUp);
  window.addEventListener('touchend', canvasMouseUp);

  function canvasMouseDown(e) {
    if (state.isLocked || !isCanvasState()) return;

    const coords = getMouseCoords(e);
    isDrawing = true;
    lastActualPos = { ...coords };
    lastVirtualPos = { ...coords };
    if (currentStrokePoints.length === 0) firstStrokeStartTimeMs = performance.now();
    resetMotionState();

    currentStrokePoints = [{ x: coords.x, y: coords.y, t: Date.now(), isInverted: false }];
    redrawCanvas();
  }

  function canvasMouseMove(e) {
    if (!isCanvasState()) return;

    const coords = getMouseCoords(e);
    const absNow = Date.now();

    if (!isDrawing) {
      lastVirtualPos = { ...coords };
      if (state.selectedGroup !== 'CONTROL') requestRedraw();
      return;
    }

    if (state.isLocked) return;
    e.preventDefault();

    let dx = coords.x - lastActualPos.x;
    let dy = coords.y - lastActualPos.y;

    // A - Inertia
    if (state.selectedGroup === 'INERTIA') {
      const stepDist = Math.sqrt(dx * dx + dy * dy);
      if (stepDist === 0) {
        currentSensitivity = 1.0;
        cumulativeDistance = 0;
        lastDelta = { dx: 0, dy: 0 };
      } else {
        cumulativeDistance += stepDist;
        currentSensitivity = 1.0 + (Math.floor(cumulativeDistance / state.inertiaStep) * state.inertiaInc);
      }
      dx = dx * currentSensitivity * (1 - state.inertiaSmoothing) + lastDelta.dx * state.inertiaSmoothing;
      dy = dy * currentSensitivity * (1 - state.inertiaSmoothing) + lastDelta.dy * state.inertiaSmoothing;
      lastDelta = { dx, dy };
    }

    // B - Mirror
    let isCurrentlyInverted = absNow < inversionEndTime;
    if (state.selectedGroup === 'MIRROR') {
      const halfSize = state.mirrorSize / 2;
      const innerHalf = halfSize - state.mirrorThickness;
      const dxFromCenter = Math.abs(lastVirtualPos.x - window.innerWidth / 2);
      const dyFromCenter = Math.abs(lastVirtualPos.y - window.innerHeight / 2);

      const onBorder = (dxFromCenter <= halfSize && dyFromCenter <= halfSize) &&
                       !(dxFromCenter <= innerHalf && dyFromCenter <= innerHalf);

      if (onBorder && absNow >= inversionEndTime) {
        inversionEndTime = absNow + state.mirrorDuration;
        isCurrentlyInverted = true;
      }
      if (isCurrentlyInverted) {
        dx *= -1;
        dy *= -1;
      }
    }

    const safeX = Math.max(0, Math.min(window.innerWidth, lastVirtualPos.x + dx));
    const safeY = Math.max(0, Math.min(window.innerHeight, lastVirtualPos.y + dy));

    currentStrokePoints.push({
      x: Math.round(safeX),
      y: Math.round(safeY),
      t: absNow,
      isInverted: isCurrentlyInverted
    });

    lastVirtualPos = { x: safeX, y: safeY };
    lastActualPos = { ...coords };
    requestRedraw();
  }

  function canvasMouseUp() {
    if (!isDrawing) return;
    isDrawing = false;
    if (currentStrokePoints.length === 0) return;

    if (state.appState === 'TASK') {
      state.isLocked = true;
      redrawCanvas();
      showTaskLockButtons();
    } else if (state.appState === 'TRAINING') {
      currentStrokePoints = [];
      if (state.trainingStep < 3) {
        state.trainingStep += 1;
        $('training-step-number').innerText = state.trainingStep;
        redrawCanvas();
      } else {
        setAppState('INSTRUCTION');
      }
    }
  }

  window.addEventListener('resize', () => {
    if (!isCanvasState()) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redrawCanvas();
  });

  // --- Dots layout ---
  const TRAINING_PAIRS = {
    1: [[0, 0], [2, 2]],
    2: [[1, 0], [1, 2]],
    3: [[0, 1], [2, 1]]
  };
  const ALL_CELLS = [0, 1, 2].flatMap(r => [0, 1, 2].map(c => [r, c]));

  function getDots(width, height, cells) {
    const startX = width / 2 - NINE_DOTS_SIZE / 2 + NINE_DOTS_PADDING;
    const startY = height / 2 - NINE_DOTS_SIZE / 2 + NINE_DOTS_PADDING;
    return cells.map(([r, c]) => ({ cx: startX + c * NINE_DOTS_SPACING, cy: startY + r * NINE_DOTS_SPACING }));
  }

  function drawDots(c, dots) {
    c.fillStyle = '#000000';
    dots.forEach(d => {
      c.beginPath();
      c.arc(d.cx, d.cy, DOT_RADIUS, 0, Math.PI * 2);
      c.fill();
    });
  }

  function drawStroke(c, pts) {
    if (pts.length < 2) return;
    c.beginPath();
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.strokeStyle = BRUSH_COLOR;
    c.lineWidth = BRUSH_WIDTH;
    c.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) c.lineTo(pts[i].x, pts[i].y);
    c.stroke();
  }

  function requestRedraw() {
    if (redrawQueued) return;
    redrawQueued = true;
    requestAnimationFrame(() => {
      redrawQueued = false;
      redrawCanvas();
    });
  }

  function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (state.showGrid) drawCoordinateGridLines();
    if (state.selectedGroup === 'MIRROR' && state.mirrorVisible) drawActiveMirrorFrame();

    const cells = state.appState === 'TRAINING' ? TRAINING_PAIRS[state.trainingStep] : ALL_CELLS;
    drawDots(ctx, getDots(window.innerWidth, window.innerHeight, cells));
    drawStroke(ctx, currentStrokePoints);

    if (lastVirtualPos && (isDrawing || state.selectedGroup !== 'CONTROL')) {
      ctx.beginPath();
      ctx.arc(lastVirtualPos.x, lastVirtualPos.y, BRUSH_WIDTH + 1, 0, Math.PI * 2);
      ctx.fillStyle = Date.now() < inversionEndTime ? '#0000ff' : BRUSH_COLOR;
      ctx.fill();
    }
  }

  function drawGridLines(step, color, width) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); }
    for (let y = 0; y < canvas.height; y += step) { ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); }
    ctx.stroke();
  }

  function drawCoordinateGridLines() {
    ctx.save();
    drawGridLines(NINE_DOTS_SPACING / 2, 'rgba(156, 163, 175, 0.15)', 0.5);
    drawGridLines(NINE_DOTS_SPACING, 'rgba(75, 85, 99, 0.35)', 1.0);

    ctx.strokeStyle = 'rgba(220, 38, 38, 0.45)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawActiveMirrorFrame() {
    const size = state.mirrorSize;
    const thickness = state.mirrorThickness;
    ctx.save();
    ctx.strokeStyle = 'rgba(124, 58, 237, 0.15)';
    ctx.lineWidth = thickness;
    ctx.strokeRect(window.innerWidth / 2 - size / 2 + thickness / 2, window.innerHeight / 2 - size / 2 + thickness / 2, size - thickness, size - thickness);
    ctx.restore();
  }

  // --- Trial Records ---
  function registerTrialRecord() {
    const reactionTimeMs = firstStrokeStartTimeMs > 0 ? (firstStrokeStartTimeMs - trialStartTimeMs) : -1;
    const activeParams = GROUP_PARAMS[state.selectedGroup] || [];

    const trial = {
      trialNumber: state.currentTrialNumber,
      group: state.selectedGroup,
      points: [...currentStrokePoints],
      trialDuration: Math.round(performance.now() - trialStartTimeMs),
      reactionTime: Math.round(reactionTimeMs),
      ...Object.fromEntries(ALL_PARAM_KEYS.map(k => [k, activeParams.includes(k) ? state[k] : undefined]))
    };
    state.allTrials.push(trial);
    firstStrokeStartTimeMs = 0;
  }

  // --- Debug HUD (key Y) ---
  function updateHUDStats() {
    const names = { MIRROR: 'Mirror', INERTIA: 'Inertia', CONTROL: 'Control' };
    const minutes = Math.floor(state.elapsedTime / 60);
    const seconds = state.elapsedTime % 60;
    $('hud-group-badge').innerText = names[state.selectedGroup];
    $('hud-trial-badge').innerText = state.currentTrialNumber;
    $('hud-timer-badge').innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  function renderSettingsHUDs() {
    const visible = state.showSettings && isCanvasState();
    $('top-hud-stats').classList.toggle('hidden', !visible);
    $('hud-timer-container').classList.toggle('hidden', state.appState !== 'TASK');
    $('settings-control-panel').classList.toggle('hidden', !visible);
    if (!visible) return;

    const config = SETTINGS_SLIDERS[state.selectedGroup];
    let html;
    if (config) {
      html = config.items.map(s => `
        <div class="mb-4">
          <div class="flex justify-between text-xs sm:text-sm mb-1.5">
            <span class="text-gray-800 font-semibold">${s.label}</span>
            <span class="font-bold ${config.labelClass} px-1.5 py-0.5 rounded text-xs" id="label-${s.key}">${s.fmt(state[s.key])}</span>
          </div>
          <input type="range" min="${s.min}" max="${s.max}" step="${s.step}" value="${state[s.key]}" data-key="${s.key}" class="w-full h-2.5 bg-gray-200 rounded-lg appearance-none ${config.inputClass} cursor-pointer" />
          ${s.hint ? `<p class="text-[10px] text-gray-500 mt-0.5">${s.hint}</p>` : ''}
        </div>`).join('');

      if (state.selectedGroup === 'MIRROR') {
        html += `
        <div class="mt-3 flex items-center gap-2.5 p-2.5 bg-purple-50 rounded-xl border border-purple-100">
          <input type="checkbox" id="checkbox-mirror-visible" ${state.mirrorVisible ? 'checked' : ''} class="w-4 h-4 accent-purple-600 cursor-pointer" />
          <label for="checkbox-mirror-visible" class="text-xs font-semibold text-gray-800 cursor-pointer">Видимость рамки</label>
        </div>`;
      }
    } else {
      html = `
        <div class="text-gray-500 italic text-center py-4 text-xs">
          ${state.language === 'ru' ? 'Для контрольной группы дополнительные настройки отсутствуют' : 'No additional settings for control group'}
        </div>`;
    }

    html += `
      <div class="mt-4 pt-3 border-t border-gray-100">
        <label class="flex items-center gap-2.5 cursor-pointer group">
          <input type="checkbox" id="checkbox-grid-visible" ${state.showGrid ? 'checked' : ''} class="w-4 h-4 accent-blue-600 cursor-pointer" />
          <span class="text-xs font-bold text-gray-700 group-hover:text-blue-600 transition-colors uppercase tracking-wider">Режим сетки (Grid)</span>
        </label>
      </div>`;

    $('settings-panel-inputs').innerHTML = html;
  }

  $('settings-panel-inputs').addEventListener('input', (e) => {
    const t = e.target;
    if (t.id === 'checkbox-grid-visible') {
      state.showGrid = t.checked;
    } else if (t.id === 'checkbox-mirror-visible') {
      state.mirrorVisible = t.checked;
    } else if (t.dataset.key) {
      const s = SETTINGS_SLIDERS[state.selectedGroup].items.find(i => i.key === t.dataset.key);
      state[s.key] = s.parse(t.value);
      $(`label-${s.key}`).innerText = s.fmt(state[s.key]);
      if (!s.redraw) return;
    }
    redrawCanvas();
  });

  // --- Survey UI Rendering ---
  function setSurveyStep(step) {
    state.surveyStep = step;
    renderSurveyUI();
  }

  const choiceButtons = (prefix, options) => `
    <div class="flex flex-wrap gap-8 sm:gap-12 justify-center">
      ${options.map((label, i) => `<button data-choice="${i}" class="${prefix} btn-choice-pill">${label}</button>`).join('')}
    </div>`;

  const SURVEY_FIRST_SLIDER_STEP = 3;
  const SURVEY_SLIDERS_COUNT = 6;
  const SURVEY_GENDER_STEP = SURVEY_FIRST_SLIDER_STEP + SURVEY_SLIDERS_COUNT; // 9
  const SURVEY_AGE_STEP = SURVEY_GENDER_STEP + 1; // 10
  const SURVEY_EXP_PRESENCE_STEP = SURVEY_AGE_STEP + 1; // 11
  const SURVEY_NAME_STEP = SURVEY_EXP_PRESENCE_STEP + 1; // 12

  function renderSurveyUI() {
    const box = $('screen-survey');
    box.classList.remove('hidden');
    const texts = t();
    const step = state.surveyStep;
    const currentSliders = texts.sliders;
    const sliderQ = currentSliders[step - SURVEY_FIRST_SLIDER_STEP];

    if (step === 0) {
      box.innerHTML = `
        <div class="experiment-card max-w-3xl fade-in text-center">
          <p class="survey-intro-text mb-8 sm:mb-10 text-center max-w-2xl mx-auto">
            ${texts.surveyIntro}
          </p>
          <div>
            <span class="inline-block animate-pulse bg-blue-50 border border-blue-200 text-blue-700 font-medium px-7 py-3 rounded-full fluid-body">
              ${texts.surveySpacePrompt}
            </span>
          </div>
        </div>`;
    } else if (step === 1) {
      box.innerHTML = `
        <div class="experiment-card max-w-2xl fade-in text-center">
          <h2 class="fluid-h1 text-gray-900 mb-8 sm:mb-10 font-display">${texts.surveySolvedBefore}</h2>
          ${choiceButtons('survey-choice', [texts.yes, texts.no])}
        </div>`;
      bindChoice([texts.yes, texts.no], v => { state.surveyAnswers.solvedBefore = v; });
    } else if (step === 2) {
      box.innerHTML = `
        <div class="experiment-card max-w-3xl fade-in text-center">
          <div class="insight-desc text-gray-800 mb-8 sm:mb-10 text-justify">
            ${texts.surveyInsight}
          </div>
          ${choiceButtons('survey-choice', [texts.yes, texts.no])}
        </div>`;
      bindChoice([texts.yes, texts.no], v => { state.surveyAnswers.insight = v; });
    } else if (sliderQ) {
      const fieldKey = sliderQ.field;
      box.innerHTML = `
        <div class="experiment-card max-w-3xl fade-in text-center">
          <h2 class="fluid-h2 text-gray-900 leading-tight mb-8 sm:mb-10 font-display">${sliderQ.title}</h2>
          <div class="w-full mb-8 sm:mb-10">
            <input type="range" min="0" max="100" step="1" value="${state.surveyAnswers[fieldKey]}" id="survey-slider-input"
              class="w-full h-3.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            <div class="flex justify-between mt-4 fluid-body font-bold text-gray-700">
              <span class="max-w-[180px] text-left">${sliderQ.left}</span>
              <span class="max-w-[180px] text-right">${sliderQ.right}</span>
            </div>
          </div>
          <button id="survey-slider-save" class="btn-primary-cta">
            ${texts.sliderSaveBtn}
          </button>
        </div>`;
      $('survey-slider-input').addEventListener('input', (e) => {
        state.surveyAnswers[fieldKey] = parseInt(e.target.value);
      });
      $('survey-slider-save').addEventListener('click', () => setSurveyStep(step + 1));
    } else if (step === SURVEY_GENDER_STEP) {
      box.innerHTML = `
        <div class="experiment-card max-w-2xl fade-in text-center">
          <h2 class="fluid-h1 text-gray-800 mb-8 sm:mb-10 font-display">${texts.surveyGenderTitle}</h2>
          ${choiceButtons('survey-choice', texts.genderOptions)}
        </div>`;
      bindChoice(texts.genderOptions, v => { state.surveyAnswers.gender = v; });
    } else if (step === SURVEY_AGE_STEP) {
      box.innerHTML = `
        <div class="experiment-card max-w-xl fade-in text-center">
          <h2 class="fluid-h1 text-gray-800 mb-6 sm:mb-8 font-display">${texts.surveyAgeTitle}</h2>
          <div class="mb-8">
            <input type="number" id="survey-age-input" placeholder="--" min="5" max="115" required
              value="${state.surveyAnswers.age}"
              class="text-4xl sm:text-5xl text-center border-b-4 border-blue-500 outline-none w-36 sm:w-44 font-extrabold bg-transparent text-gray-900 pb-1" />
          </div>
          <button id="survey-btn-next-age" class="btn-primary-cta">
            ${texts.btnNext}
          </button>
          <div id="survey-age-error" class="text-red-500 font-semibold mt-3 text-sm h-5"></div>
        </div>`;
      const ageInput = $('survey-age-input');
      ageInput.focus();
      $('survey-btn-next-age').addEventListener('click', () => {
        const val = ageInput.value.trim();
        const age = parseInt(val);
        if (!val || isNaN(age) || age < 5 || age > 115) {
          $('survey-age-error').innerText = texts.surveyAgeError;
          return;
        }
        state.surveyAnswers.age = val;
        setSurveyStep(SURVEY_EXP_PRESENCE_STEP);
      });
    } else if (step === SURVEY_EXP_PRESENCE_STEP) {
      box.innerHTML = `
        <div class="experiment-card max-w-2xl fade-in text-center">
          <h2 class="fluid-h2 text-gray-800 mb-8 sm:mb-10 font-display leading-snug">${texts.surveyExpPresenceTitle}</h2>
          ${choiceButtons('survey-choice', texts.expPresenceOptions)}
        </div>`;
      bindChoice(texts.expPresenceOptions, v => {
        state.surveyAnswers.experimenterPresence = v;
      });
    } else if (step === SURVEY_NAME_STEP) {
      // Step 12: Student Full Name (for bonus points)
      box.innerHTML = `
        <div class="experiment-card max-w-2xl fade-in text-center">
          <h2 class="fluid-h2 text-gray-800 mb-4 font-display">${texts.surveyNameTitle}</h2>
          <p class="fluid-body text-gray-600 mb-6 sm:mb-8 leading-relaxed text-justify max-w-xl mx-auto">
            ${texts.surveyNameDesc}
          </p>
          <div class="mb-8 w-full max-w-md mx-auto">
            <input type="text" id="survey-name-input" placeholder="${texts.surveyNamePlaceholder}"
              value="${state.surveyAnswers.name || ''}"
              class="fluid-body font-bold text-center border-b-4 border-blue-500 outline-none w-full bg-transparent text-gray-900 py-2 px-3" />
          </div>
          <button id="survey-btn-complete" class="btn-primary-cta">
            ${texts.btnComplete}
          </button>
        </div>`;
      const nameInput = $('survey-name-input');
      nameInput.focus();
      $('survey-btn-complete').addEventListener('click', () => {
        state.surveyAnswers.name = nameInput.value.trim();
        completeExperiment();
      });
    }
  }

  function bindChoice(values, save) {
    $('screen-survey').querySelectorAll('.survey-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        save(values[Number(btn.dataset.choice)]);
        setSurveyStep(state.surveyStep + 1);
      });
    });
  }

  // --- Finishing & DataPipe Upload ---
  function uploadTrialImage(trial) {
    if (!pipeActive || trial.points.length === 0) return;
    const filename = `${subject_id}_trial${String(trial.trialNumber).padStart(2, '0')}.png`;
    const base64 = renderTrialImage(trial).toDataURL('image/png').split(',')[1];
    pendingUploads.push(
      jsPsychExtensionPipe.saveBase64Data(DATAPIPE_EXPERIMENT_ID, filename, base64).then(result => {
        if (!result.ok) {
          imageUploadFailed = true;
          console.error(`DataPipe refused ${filename} (HTTP ${result.status})`, result.body);
        }
      })
    );
  }

  async function completeExperiment() {
    setAppState('FINISHED');
    if (!PIPE_ENABLED) {
      setSaveStatus('offline');
      return;
    }
    if (!pipeActive || !jsPsych) {
      setSaveStatus('error');
      return;
    }
    setSaveStatus('pending');
    const lastDrawnTrial = [...state.allTrials].reverse().find(t => t.points.length > 0);
    if (lastDrawnTrial) uploadTrialImage(lastDrawnTrial);
    await Promise.all(pendingUploads);
    endSessionTrial();
  }

  function setSaveStatus(status) {
    state.saveStatus = status;
    renderSaveStatus();
    const texts = t();
    if (status === 'ok') showNotice(texts.noticePipeSuccess, "success");
    if (status === 'error') showNotice(texts.noticePipeError, "error");
  }

  function renderSaveStatus() {
    const el = $('save-status');
    if (!el) return;
    const texts = t();

    if (state.saveStatus === 'pending') {
      el.innerText = texts.saveStatusPending;
      el.className = 'text-base font-bold mb-5 min-h-6 text-amber-600 animate-pulse';
    } else if (state.saveStatus === 'ok') {
      el.innerText = texts.saveStatusOk;
      el.className = 'text-base font-extrabold mb-5 min-h-6 text-emerald-600';
    } else if (state.saveStatus === 'error') {
      el.innerText = texts.saveStatusError;
      el.className = 'text-sm sm:text-base font-bold mb-5 min-h-6 text-red-600';
    } else if (state.saveStatus === 'offline') {
      el.innerText = state.language === 'ru' ? 'Режим автономной работы (Offline). Пожалуйста, скачайте результаты.' : 'Offline mode. Please download your results.';
      el.className = 'text-base font-semibold mb-5 min-h-6 text-slate-600';
    } else {
      el.innerText = '';
      el.className = 'text-base font-semibold mb-5 min-h-6';
    }
  }

  // --- CSV Generation (Compatible with Matlab & Analyzer) ---
  const STANDARD_SLIDER_FIELDS = ['Удовольствие', 'Удивление', 'Внезапность', 'Облегчение', 'Уверенность', 'Драйв'];

  const CSV_HEADERS = [
    "isElement", "trialNumber", "lineLength", "x", "y", "time1", "time2", "group",
    "isInverted", ...ALL_PARAM_KEYS,
    "solvedBefore", "insight", ...STANDARD_SLIDER_FIELDS, "gender", "age", "experimenterPresence", "name",
    "trialDuration", "totalTaskTime", "pId", "attentionAttempts", "rtDrawStart", "trial_type",
    "language", "taskCheckAttempts"
  ];

  function getDynamicCSVMetaRows() {
    const w = canvas.width || window.innerWidth || 1920;
    const h = canvas.height || window.innerHeight || 1080;
    const dpi = Math.round(96 * (window.devicePixelRatio || 1));
    const dots = getDots(w, h, ALL_CELLS);
    const rows = [
      ["0", "900", "seconds", "10,1", "-1", String(Math.round(w)), String(Math.round(h)), String(dpi)]
    ];
    dots.forEach(d => {
      rows.push(["1", String(Math.round(d.cx)), String(Math.round(d.cy)), "40", "45", "0", "0"]);
    });
    const dot5 = dots[4];
    rows.push(["1", String(Math.round(dot5.cx - NINE_DOTS_SPACING * 2)), String(Math.round(dot5.cy + NINE_DOTS_SPACING)), "0", "0", "0", "0"]);
    return rows;
  }

  function generateCSVData() {
    const delimiter = ';';
    const a = state.surveyAnswers;
    const surveyCols = [
      a.solvedBefore,
      a.insight,
      ...STANDARD_SLIDER_FIELDS.map(f => a[f]),
      a.gender,
      a.age,
      a.experimenterPresence,
      a.name
    ].map(v => v ?? "");
    const totalTaskTime = state.elapsedTime.toString().replace('.', ',');

    const rows = [CSV_HEADERS.join(delimiter)];
    getDynamicCSVMetaRows().forEach(meta => {
      const padded = [...meta];
      while (padded.length < CSV_HEADERS.length) padded.push("");
      rows.push(padded.join(delimiter));
    });

    state.allTrials.forEach(trial => {
      const row = (pointCols, isInverted, rt) => [
        "0", trial.trialNumber, ...pointCols, trial.group, isInverted,
        ...ALL_PARAM_KEYS.map(k => trial[k] ?? ""),
        ...surveyCols,
        (trial.trialDuration / 1000).toFixed(3).replace('.', ','),
        totalTaskTime, participantID, state.attentionAttempts, rt, "nine-dots-trial",
        state.language, state.taskCheckAttempts
      ].join(delimiter);

      const pts = trial.points;
      if (pts.length === 0) {
        rows.push(row(["-1", "", "", "", ""], "", "-1"));
        return;
      }
      const t0 = pts[0].t;
      pts.forEach((pt, index) => {
        const timeOffset = pt.t - t0;
        rows.push(row([index, pt.x, pt.y, timeOffset, Math.floor(timeOffset / 16) * 16], pt.isInverted ? "1" : "0", trial.reactionTime));
      });
    });

    return rows.join('\n');
  }

  function generateJSONString() {
    return JSON.stringify({
      metadata: rawMetadata,
      language: state.language,
      attentionAttempts: state.attentionAttempts,
      taskCheckAttempts: state.taskCheckAttempts,
      totalTaskDurationSeconds: state.elapsedTime,
      finishReason: state.finishReason,
      group: state.selectedGroup,
      survey: state.surveyAnswers,
      trials: state.allTrials
    }, null, 2);
  }

  function renderTrialImage(trial) {
    const out = document.createElement('canvas');
    out.width = window.innerWidth;
    out.height = window.innerHeight;
    const c = out.getContext('2d');
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, out.width, out.height);
    drawDots(c, getDots(out.width, out.height, ALL_CELLS));
    if (trial) drawStroke(c, trial.points);
    return out;
  }

  // --- Export Utilities ---
  function downloadFile(href, filename) {
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function downloadText(content, type, filename) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    downloadFile(url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportCSV() {
    downloadText(generateCSVData(), 'text/csv;charset=utf-8;', `nine_dots_results_${participantID}_${Date.now()}.csv`);
    showNotice(t().noticeCsvSuccess, "success");
  }

  $('btn-download-csv').addEventListener('click', exportCSV);
  $('finished-btn-download-csv').addEventListener('click', exportCSV);

  $('btn-download-json').addEventListener('click', () => {
    downloadText(generateJSONString(), 'application/json;charset=utf-8;', `nine_dots_results_${participantID}_${Date.now()}.json`);
    showNotice(t().noticeJsonSuccess, "success");
  });

  $('btn-download-img').addEventListener('click', () => {
    const lastTrial = state.allTrials[state.allTrials.length - 1];
    downloadFile(renderTrialImage(lastTrial).toDataURL('image/png'), `nine_dots_solution_${participantID}_${Date.now()}.png`);
    showNotice(t().noticePngSuccess, "success");
  });

  $('btn-reset-app').addEventListener('click', () => {
    if (state.saveStatus === 'pending' && !confirm(state.language === 'ru' ? 'Данные ещё отправляются на сервер. Всё равно начать заново?' : 'Data is still being uploaded. Start over anyway?')) return;
    location.reload();
  });

  // --- Notifications ---
  let noticeTimer = null;
  function showNotice(text, type = 'info') {
    const box = $('notice-toast');
    box.innerText = text;
    box.className = `fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl font-bold text-white shadow-xl z-50 transition-all font-sans text-sm ${
      type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-emerald-600' : 'bg-gray-800'
    }`;
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => { box.className = 'hidden'; }, 4500);
  }

  // Initial render
  applyLanguage();
  renderActiveScreen();
});
