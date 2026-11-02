const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");
const sendBtn = document.getElementById("sendBtn");
const subject = document.getElementById("subject");
let history = [];

function addMessage(text, role) {
  welcome.style.display = "none";
  const bubble = document.createElement("div");
  bubble.className = `message ${role}`;
  const label = document.createElement("span");
  label.className = "label";
  label.textContent = role === "user" ? "YOU" : "AI STUDY BUDDY";
  const content = document.createElement("div");
  content.textContent = text;
  bubble.append(label, content);
  messages.appendChild(bubble);
  bubble.scrollIntoView({ behavior: "smooth", block: "end" });
  return bubble;
}

async function askQuestion(question) {
  const clean = question.trim();
  if (!clean || sendBtn.disabled) return;

  addMessage(clean, "user");
  input.value = "";
  input.style.height = "auto";
  sendBtn.disabled = true;

  const loading = document.createElement("div");
  loading.className = "typing";
  loading.textContent = "✦ Thinking...";
  messages.appendChild(loading);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: clean, subject: subject.value, history })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Something went wrong.");
    loading.remove();
    addMessage(data.answer, "ai");
    history.push({ role: "user", text: clean }, { role: "model", text: data.answer });
    history = history.slice(-10);
  } catch (error) {
    loading.remove();
    addMessage(`Sorry! ${error.message}`, "ai");
  } finally {
    sendBtn.disabled = false;
    input.focus();
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  askQuestion(input.value);
});
input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
});
input.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});
document.querySelectorAll(".suggestion").forEach(button => {
  button.addEventListener("click", () => askQuestion(button.dataset.prompt));
});
function clearChat() {
  history = [];
  messages.innerHTML = "";
  welcome.style.display = "block";
}
document.getElementById("newChat").addEventListener("click", clearChat);
document.getElementById("clearChat").addEventListener("click", clearChat);
