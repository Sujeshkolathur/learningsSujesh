// ═══════════════════════════════════════════════════════════════
//  Personalize everything here — one file for the whole story
// ═══════════════════════════════════════════════════════════════

import heroBackground from '../assets/IMG-20260604-WA0006.jpg';
import voiceRecording from '../assets/Voice 260826_232439.m4a';

export const NAME = 'Chaithu';
export const YOUR_NAME = 'Sujesh';

/** When you first spoke on her birthday (ISO date) */
export const FIRST_CALL_DATE = '2025-08-26';

/** Her birthday (same day she opens this — used for story context) */
export const BIRTHDAY = '2026-08-26';

/** Engagement date & time — change this one value only */
export const ENGAGEMENT_DATE = '2026-09-06T10:00:00';

/** Your personal voice recording — sung for Chaithu */
export const VOICE_MESSAGE = {
  src: voiceRecording,
  heading: 'A song for you',
  subtitle: 'I recorded this with my heart. Press play when you\'re ready.',
  playLabel: '▶ Play my song',
  pauseLabel: '❚❚ Pause',
};

/** Hero opening background (import from src/assets or set a public URL) */
export const HERO_BACKGROUND = heroBackground;

export const PHOTO_PATHS = [
  { src: '/assets/photo1.jpg', caption: 'Where it all began.' },
  { src: '/assets/photo2.jpg', caption: 'Getting to know you.' },
  { src: '/assets/photo3.jpg', caption: 'Us.' },
  { src: '/assets/photo4.jpg', caption: 'Little moments.' },
  { src: '/assets/photo5.jpg', caption: 'Forever loading...' },
] as const;

export const HERO = {
  title: `Happy Birthday, ${NAME} ❤️`,
  lines: [
    'One year ago, on this very day,',
    'I heard your voice for the first time.',
  ],
  reveal: ['Just one Hello...', 'I never knew it would change my entire life.'],
  cta: 'Our Story →',
};

export const FIRST_HELLO = {
  heading: 'The First Hello',
  paragraphs: [
    'Your birthday was not just the day you were born.\nFor me, it became the day my life quietly began changing.',
    'Last year, on this same day, we spoke for the very first time.',
    'I still remember your first hello.',
    "I didn't know then that the voice I was hearing would eventually become the voice I would want to hear every day for the rest of my life.",
  ],
  highlight: 'One Hello. One conversation. One beginning.',
  milestones: [
    'Birthday',
    'First Call',
    'Getting to Know Each Other',
    'Falling in Love',
    'Engagement',
    'Our Life Together',
  ],
};

export const DREAMS = {
  heading: 'You changed the way I dream.',
  lines: [
    'Before you came into my life, I had dreams of my own.',
    'But after meeting you, something changed.',
    'I started imagining new dreams.',
    'Dreams that had two people in them.',
    'Dreams about a home.',
    'Dreams about ordinary mornings together.',
    'Dreams about travelling together.',
    'Dreams about growing together.',
    'Dreams about a lifetime.',
  ],
  closing: "You didn't just become part of my life.\nYou became part of my dreams.",
};

export const JOURNEY = [
  {
    title: 'The First Call',
    text: 'Your birthday — the day everything began.',
  },
  {
    title: 'Getting to Know You',
    text: 'Every conversation made me want to know you a little more.',
  },
  {
    title: 'Growing Closer',
    text: 'Somewhere between all those conversations, you became someone incredibly special to me.',
  },
  {
    title: 'Falling in Love',
    text: 'Without even realizing it, you became a part of my everyday thoughts and happiness.',
  },
  {
    title: 'Today',
    text: "One year later, I can't imagine my life without you.",
  },
  {
    title: 'Next Week',
    text: 'Two people. One promise. A new beginning.',
  },
  {
    title: 'Our Future',
    text: 'Everything ahead of us.',
  },
];

/** Dates that mean the most to us — edit labels & messages anytime */
export const SPECIAL_DAYS = {
  heading: 'Our Special Days',
  intro: 'Some dates stay in your heart forever. These are ours.',
  days: [
    {
      date: '2026-09-06',
      display: 'September 6',
      title: 'Our Engagement',
      message: 'The day we choose each other — officially, openly, forever.',
    },
    {
      date: '2026-02-07',
      display: 'February 7',
      title: 'Our Day',
      message: 'A date only we understand — but one I will always remember.',
    },
  ],
};

export const HAPPINESS = {
  heading: 'Do you know what makes me happiest?',
  reveals: [
    'Knowing that I found you.',
    'Knowing that you love me.',
    'Knowing that you care for me.',
    'Knowing that I get to build a life with you.',
  ],
  closing: 'You are one of the most beautiful things that has ever happened to me.',
  gratitude:
    'Your love, your care, your kindness and the way you make me feel understood are things I will always be grateful for.',
};

export const FUTURE = {
  heading: 'Somewhere along the way...',
  lines: [
    'I stopped imagining my future alone.',
    'Because every future I imagine now has you in it.',
    "I can't imagine my life without you anymore.",
  ],
  closing:
    'You are not just someone I love.\nYou are the person I want beside me through everything.',
};

export const COUNTDOWN = {
  heading: 'And now...',
  lines: [
    'After everything that started with one simple Hello...',
    'One year later...',
    'We are only days away from saying...',
    "Let's begin our forever.",
  ],
};

export const LOVE_LETTER = {
  heading: `Happy Birthday, My ${NAME} ❤️`,
  body: `Today is your birthday.

But for me, this day will always mean something more.

Because one year ago, on this very day, I heard your voice for the first time.

I never imagined that one conversation would lead me here — standing at the beginning of a future with the person I love.

You came into my life and slowly changed it.

You changed my dreams.
You changed the way I look at my future.
You brought a happiness I didn't know I was missing.

We talked.
We understood each other.
We grew closer.
And somewhere along the way, you became a part of me.

Today, I cannot imagine a life without you.

I am so incredibly happy that I found you.

Your love and the way you care for me mean more than I can explain.

I may never be able to perfectly put into words how much I love you.

But I hope I can spend the rest of my life showing you.

And now, just a few days from our engagement, I feel like that first Hello is bringing us to the beginning of our biggest chapter yet.

Happy Birthday, ${NAME}.

Thank you for coming into my life.

Thank you for changing it.

And thank you for becoming my future.

I love you more than you know.

— ${YOUR_NAME} ❤️`,
};

export const PROMISES = {
  heading: 'My Promise to You',
  lines: [
    "I don't promise that every day will be perfect.",
    'But I promise that I will always choose you.',
    'I will listen to you.',
    'I will stand beside you.',
    'I will celebrate your happiness.',
    'I will hold your hand through the difficult days.',
    'And I will keep choosing you, again and again.',
  ],
  closing: 'Today, tomorrow, and all the ordinary days in between — I want them with you.',
};

export const SECRET = {
  button: 'One More Thing...',
  title: NAME,
  body: `There are so many things I want to tell you...

But I'll spend a lifetime showing you instead.

I love you. ❤️`,
};

export const FINAL = {
  sequence: [
    { prefix: 'One year ago...', main: 'One Hello.' },
    { prefix: 'Today...', main: 'One love.' },
    { prefix: 'Next week...', main: 'One promise.' },
    { prefix: 'And for all the years ahead...', main: 'One life. Together. ❤️' },
  ],
  closing: `Happy Birthday, ${NAME}.`,
  footer:
    "Our story started with your birthday.\nI can't wait to see where forever takes us.",
};
