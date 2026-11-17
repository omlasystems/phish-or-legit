const scenarios = [
  {
    type: 'transfer',
    title: 'Payroll transfer',
    amount: '$2,480.00',
    meta: ['From: SecurePay', 'To: Nia R.', 'Recurring: Weekly'],
    message: 'Weekly payroll deposited from the payroll office. The memo matches your usual schedule and the transfer amount is exactly the same as before.',
    correct: 'approve',
    flags: ['Routine recurring', 'Same vendor', 'Expected amount'],
    feedback: 'Correct. This is a normal recurring payroll transfer with a matching amount and source.'
  },
  {
    type: 'sms',
    title: 'Text message alert',
    amount: '',
    meta: ['SMS', 'From: +1 (555) 201-4789', 'Urgent'],
    message: 'Your account is locked. Tap now to verify your identity or your funds will be frozen. https://verify-bank-demo.xyz/urgent',
    correct: 'block',
    flags: ['Urgent scare tactic', 'Untrusted link', 'Spoofed sender'],
    feedback: 'Correct. The message creates panic, uses an unknown link, and asks you to act before checking the bank directly.'
  },
  {
    type: 'voice',
    title: 'Voice clone request',
    amount: '$850.00',
    meta: ['Voice memo', 'Caller: “Auntie Tunde”', 'Time: 02:12 AM'],
    message: '“Hi dear, I’m in a rush and can’t reach my phone. Please transfer $850 so I can pay a friend. I’ll send the money back tomorrow.”',
    correct: 'block',
    flags: ['Odd timing', 'Pressure for cash', 'Unusual request'],
    feedback: 'Correct. A sudden emotional request after midnight, combined with urgency and a strange payout reason, is a common scam pattern.'
  },
  {
    type: 'transfer',
    title: 'Market vendor payment',
    amount: '$64.20',
    meta: ['From: Aria Market', 'To: Kumasi Grocer', 'Invoice #318A'],
    message: 'Payment approved for an order from your local market vendor. The invoice number matches the receipt you already received and the merchant is in your saved contacts.',
    correct: 'approve',
    flags: ['Saved merchant', 'Matches invoice', 'Verified receipt'],
    feedback: 'Correct. It matches a prior purchase and comes from a known merchant in your address book.'
  },
  {
    type: 'sms',
    title: 'Bank verification text',
    amount: '',
    meta: ['SMS', 'From: Bank of Kora', 'Reference: #10412'],
    message: 'Your secure transfer has been received. Log in to your official app to review the details. If you did not request this, call the number on the back of your card.',
    correct: 'approve',
    flags: ['Official language', 'No suspicious link', 'Follow-up via trusted channel'],
    feedback: 'Correct. This is a routine, low-pressure message that encourages you to verify through the bank’s official contact method.'
  },
  {
    type: 'voice',
    title: 'Deepfake call',
    amount: '$1,400.00',
    meta: ['Voicemail', 'Caller: “Manager”', 'Repeated calls'],
    message: '“This is a security check. We need you to move funds to a safe account before the system audits your wallet. We can’t take no for an answer.”',
    correct: 'block',
    flags: ['Authority pressure', 'Insistent demands', 'Unexpected transfer'],
    feedback: 'Correct. Real bank staff will never demand that you move funds immediately to a “safe account.”'
  },
  {
    type: 'transfer',
    title: 'Rent payment',
    amount: '$1,200.00',
    meta: ['From: Riverstone Homes', 'To: Landlord', 'Scheduled: 1st of month'],
    message: 'Scheduled rent transfer to your landlord. Details match the lease agreement and the account name is exactly the same as your tenancy records.',
    correct: 'approve',
    flags: ['Lease match', 'Known recipient', 'Regular schedule'],
    feedback: 'Correct. The payment aligns perfectly with the lease agreement and recurring schedule.'
  },
  {
    type: 'sms',
    title: 'Prize message',
    amount: '',
    meta: ['SMS', 'From: “LuckyCash”', 'Bonus claim'],
    message: 'Congratulations! You have won a mobile wallet bonus. Claim your reward now by paying a small activation fee with your card and receiving an instant SMS code.',
    correct: 'block',
    flags: ['Prize scam', 'Upfront fee', 'Pressure to act quickly'],
    feedback: 'Correct. Prize scams often ask for a payment or personal data before the “reward” exists.'
  },
  {
    type: 'transfer',
    title: 'School fee payment',
    amount: '$320.00',
    meta: ['From: Parent transfer', 'To: Bright Future Academy', 'Reference: Student #204'],
    message: 'Transfer from your parent for school fees. The amount matches the tuition invoice and the recipient account label matches the school’s official name.',
    correct: 'approve',
    flags: ['Match to invoice', 'Known recipient', 'Expected family payment'],
    feedback: 'Correct. This is a confirmed, expected payment with the right reference and recipient.'
  },
  {
    type: 'voice',
    title: 'Caller ID spoof',
    amount: '$500.00',
    meta: ['Voice call', 'Caller ID: “Bank branch”', 'From: 0800-555-0101'],
    message: '“We noticed a suspicious login. Please send $500 to a test wallet so we can secure your account before the fraud team arrives.”',
    correct: 'block',
    flags: ['Test wallet', 'Suspicious request', 'Authority scam'],
    feedback: 'Correct. Legitimate banks never instruct you to send money to a “test wallet” to verify or secure an account.'
  }
];

const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const timerEl = document.getElementById('timer');
const cardEl = document.getElementById('card');
const feedbackEl = document.getElementById('feedback');
const blockBtn = document.getElementById('block-btn');
const approveBtn = document.getElementById('approve-btn');
const resetBtn = document.getElementById('reset-btn');

let state = {
  score: 0,
  streak: 0,
  timeLeft: 60,
  round: 0,
  deck: [],
  timerId: null,
  isRunning: false,
  current: null
};

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatTime(value) {
  return `${Math.max(0, value).toFixed(1)}s`;
}

function renderCard() {
  const item = state.current;

  if (!item) {
    cardEl.innerHTML = `
      <div class="card-content placeholder-content">
        <p class="label">Ready for the first alert</p>
        <h2>Start your shift</h2>
        <p>Approve real transfers. Block scams before the clock hits zero.</p>
      </div>
    `;
    return;
  }

  const badgeClass = item.correct === 'approve' ? 'badge-approve' : 'badge-block';
  const badgeText = item.correct === 'approve' ? 'Legit' : 'Scam';

  cardEl.innerHTML = `
    <div class="card-content">
      <div class="card-badge ${badgeClass}">${badgeText}</div>

      <div class="card-header">
        <h2>${item.title}</h2>
        ${item.amount ? `<div class="amount">${item.amount}</div>` : ''}
      </div>

      <div class="case-meta">
        ${item.meta.map(tag => `<span class="case-chip">${tag}</span>`).join('')}
      </div>

      <div class="message-box">${item.message}</div>

      <div class="flags">
        ${item.flags.map(flag => `<span class="flag">${flag}</span>`).join('')}
      </div>
    </div>
  `;
}

function updateHud() {
  scoreEl.textContent = state.score;
  streakEl.textContent = state.streak;
  timerEl.textContent = formatTime(state.timeLeft);
}

function endGame() {
  state.isRunning = false;
  clearInterval(state.timerId);
  const total = Math.max(1, state.round);
  const accuracy = Math.round((state.score / (total * 10)) * 100);

  feedbackEl.className = 'feedback';
  feedbackEl.textContent = `Shift complete. Final score: ${state.score}. Accuracy estimate: ${accuracy}% . Press “New Shift” to do another run.`;

  cardEl.innerHTML = `
    <div class="card-content placeholder-content">
      <p class="label">Shift complete</p>
      <h2>Firewall offline</h2>
      <p>Final score: <strong>${state.score}</strong></p>
      <p>Keep an eye out for urgency, spoofed identities, and requests for quick transfers.</p>
    </div>
  `;
}

function nextRound() {
  if (state.round >= state.deck.length) {
    endGame();
    return;
  }

  state.current = state.deck[state.round];
  state.round += 1;
  renderCard();
}

function judgeDecision(choice) {
  if (!state.isRunning || !state.current) return;

  const isCorrect = choice === state.current.correct;

  if (isCorrect) {
    const points = 10 + Math.ceil(state.timeLeft * 0.5);
    state.score += points;
    state.streak += 1;
    feedbackEl.className = 'feedback correct';
    feedbackEl.textContent = `${state.current.feedback} +${points} points`;
  } else {
    state.score = Math.max(0, state.score - 8);
    state.streak = 0;
    feedbackEl.className = 'feedback wrong';
    feedbackEl.textContent = `Wrong call. ${state.current.feedback} -8 points`;
  }

  updateHud();

  setTimeout(() => {
    if (!state.isRunning) return;
    nextRound();
  }, 550);
}

function tick() {
  state.timeLeft = Math.max(0, state.timeLeft - 0.1);
  updateHud();

  if (state.timeLeft <= 0) {
    endGame();
  }
}

function startGame() {
  state.score = 0;
  state.streak = 0;
  state.timeLeft = 60;
  state.round = 0;
  state.deck = shuffle(scenarios);
  state.isRunning = true;
  clearInterval(state.timerId);
  state.timerId = setInterval(tick, 100);
  feedbackEl.className = 'feedback';
  feedbackEl.textContent = 'Watch for urgency, spoofed identities, and suspicious links.';
  updateHud();
  nextRound();
}

blockBtn.addEventListener('click', () => judgeDecision('block'));
approveBtn.addEventListener('click', () => judgeDecision('approve'));
resetBtn.addEventListener('click', startGame);

startGame();
