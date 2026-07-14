import './style.css';

class PathwaysWidget {
  private container!: HTMLDivElement;
  private fab!: HTMLButtonElement;
  private window!: HTMLDivElement;
  private messagesContainer!: HTMLDivElement;
  private input!: HTMLInputElement;
  private sendBtn!: HTMLButtonElement;
  
  private isOpen: boolean = false;
  private tenantId: string = 'b30e384b-71d8-45eb-8454-96246ee4c451'; // We will allow overriding via attribute, fallback for now
  private apiUrl: string = 'http://localhost:3000/chat';
  private sessionId: string;

  constructor() {
    this.sessionId = Math.random().toString(36).substring(2, 15);
    this.init();
  }

  private async fetchSettings() {
    try {
      const res = await fetch(`http://localhost:3000/settings/${this.tenantId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.primary_color) {
          this.container.style.setProperty('--pw-primary', data.primary_color);
          this.container.style.setProperty('--pw-primary-gradient', `linear-gradient(135deg, ${data.primary_color} 0%, #8b5cf6 100%)`);
        }
        if (data.welcome_message) {
          const firstMsg = this.messagesContainer.querySelector('.pw-bot');
          if (firstMsg) {
            firstMsg.textContent = data.welcome_message;
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch widget settings", error);
    }
  }

  private init() {
    // 1. Create container
    this.container = document.createElement('div');
    this.container.id = 'pathways-widget-container';

    // 2. Build DOM
    this.container.innerHTML = `
      <div class="pw-window">
        <div class="pw-header">
          <h3 class="pw-header-title">Support Assistant</h3>
          <p class="pw-header-subtitle">Ask me anything about Pathways2Care</p>
        </div>
        <div class="pw-messages">
          <div class="pw-message pw-bot">
            Hi there! 👋 How can I help you today?
          </div>
        </div>
        <form class="pw-input-area">
          <input type="text" class="pw-input" placeholder="Type your message..." />
          <button type="submit" class="pw-send">
            <svg viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
            </svg>
          </button>
        </form>
      </div>
      <button class="pw-fab">
        <svg class="pw-icon-chat" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"></path>
        </svg>
        <svg class="pw-icon-close" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
        </svg>
      </button>
    `;

    document.body.appendChild(this.container);

    // 3. Bind elements
    this.fab = this.container.querySelector('.pw-fab') as HTMLButtonElement;
    this.window = this.container.querySelector('.pw-window') as HTMLDivElement;
    this.messagesContainer = this.container.querySelector('.pw-messages') as HTMLDivElement;
    
    const form = this.container.querySelector('.pw-input-area') as HTMLFormElement;
    this.input = this.container.querySelector('.pw-input') as HTMLInputElement;
    this.sendBtn = this.container.querySelector('.pw-send') as HTMLButtonElement;

    // Read attributes from the script tag if they exist
    const scriptTag = document.currentScript;
    if (scriptTag) {
        const tenant = scriptTag.getAttribute('data-tenant-id');
        const api = scriptTag.getAttribute('data-api-url');
        if (tenant) this.tenantId = tenant;
        if (api) this.apiUrl = api;
    }

    // 4. Attach event listeners
    this.fab.addEventListener('click', () => this.toggleWindow());
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.sendMessage();
    });

    // 5. Fetch custom settings
    this.fetchSettings();
  }

  private toggleWindow() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.fab.classList.add('pw-open');
      this.window.classList.add('pw-open');
      setTimeout(() => this.input.focus(), 300);
    } else {
      this.fab.classList.remove('pw-open');
      this.window.classList.remove('pw-open');
    }
  }

  private addMessage(text: string, sender: 'user' | 'bot') {
    const msgEl = document.createElement('div');
    msgEl.className = `pw-message pw-${sender}`;
    msgEl.textContent = text;
    this.messagesContainer.appendChild(msgEl);
    this.scrollToBottom();
  }

  private showTypingIndicator(): HTMLDivElement {
    const indicator = document.createElement('div');
    indicator.className = 'pw-typing';
    indicator.innerHTML = '<div class="pw-dot"></div><div class="pw-dot"></div><div class="pw-dot"></div>';
    this.messagesContainer.appendChild(indicator);
    this.scrollToBottom();
    return indicator;
  }

  private scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  private async sendMessage() {
    const text = this.input.value.trim();
    if (!text) return;

    // Add user message to UI
    this.addMessage(text, 'user');
    this.input.value = '';

    // Show typing indicator
    const typingIndicator = this.showTypingIndicator();

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          tenant_id: this.tenantId,
          session_id: this.sessionId
        })
      });

      const data = await response.json();
      
      // Remove typing indicator
      typingIndicator.remove();

      if (data.reply) {
        this.addMessage(data.reply, 'bot');
      } else {
        this.addMessage("I'm sorry, I encountered an error while processing your request.", 'bot');
      }
    } catch (error) {
      typingIndicator.remove();
      console.error('Chat error:', error);
      this.addMessage("Connection error. Please try again later.", 'bot');
    }
  }
}

// Auto-initialize when loaded
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new PathwaysWidget());
  } else {
    new PathwaysWidget();
  }
}
