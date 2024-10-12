type ChannelName = string; // Generalize for flexibility
type EventCallback = (message: any) => void;

export interface IMessage {
  channel: string;
  message: IMessageContent;
}

interface IMessageContent {
  action: string;

  [key: string]: any;
}

function parseObject(input: any) {
  if (typeof input === 'object') return input;
  if (typeof input === 'string') {
    try {
      return JSON.parse(input);
    } catch (e) {
      throw new Error('Invalid JSON');
    }
  }
}

interface SDKConfig {
  fromChannel: string;
  listenChannels: ChannelName[];
}

export class messagingSDK {
  private readonly targetWindow: Window;
  private readonly callbacks: Record<string, Record<ChannelName, EventCallback[]>>;
  private fromChannel: string;
  private listenChannels: ChannelName[];

  constructor(targetWindow: Window, config: SDKConfig) {
    this.targetWindow = targetWindow;
    this.fromChannel = config.fromChannel;
    this.listenChannels = config.listenChannels;
    this.callbacks = {};

    this.listenChannels.forEach((channelName) => {
      // Add event listener method
      this.targetWindow.addEventListener(
        'message',
        (event: any) => {
          if (event.data && event.data.channel === channelName) {
            this.handleEvent(event.data, channelName);
          }
        },
        false
      );

      // Direct assignment method
      if (!(this.targetWindow as any)[channelName]) {
        (this.targetWindow as any)[channelName] = (evt: any) => {
          this.handleEvent(evt, channelName);
        };
      }
    });
  }

  emit(message: IMessage, targetChannel?: string) {
    const json = JSON.stringify(message);

    if (targetChannel && (this.targetWindow as any)[targetChannel]) {
      const targetWindowFunction = (this.targetWindow as any)[targetChannel];
      if (typeof targetWindowFunction.postMessage === 'function') {
        targetWindowFunction.postMessage(json);
        return;
      }
    }

    if (typeof this.targetWindow.postMessage === 'function') {
      this.targetWindow.postMessage(message);
    } else {
      console.error('window.postMessage is not a function or targetChannel is invalid', targetChannel, json);
    }
  }

  on(action: string, channel: ChannelName, cb: EventCallback) {
    if (!this.callbacks[action]) {
      this.callbacks[action] = {};
    }
    if (!this.callbacks[action][channel]) {
      this.callbacks[action][channel] = [];
    }
    this.callbacks[action][channel].push(cb);
  }

  private handleEvent(input: any, channel: ChannelName) {
    try {
      const { message } = parseObject(input);
      const { action } = message;
      if (this.callbacks[action] && this.callbacks[action][channel]) {
        this.callbacks[action][channel].forEach((fn) => fn(message));
      }
    } catch (e) {
      console.error('Error in handleEvent:', e);
    }
  }
}
