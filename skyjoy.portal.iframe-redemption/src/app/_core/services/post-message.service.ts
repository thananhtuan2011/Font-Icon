import { Injectable, inject } from '@angular/core';
import { messagingSDK } from '../functions/messaging-sdk';
import { CHANNEL_SOURCE_ENUM, STORAGE_KEY } from '../constants/common';
import {
  IPayloadPostMessage,
  MESSAGE_CHANNEL_ENUM,
  POST_MESSAGE_ACTION,
  POST_MESSAGE_TOPIC_NAME
} from '../interfaces/post-message.interface';
import { StorageService } from '@app/_core/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class PostMessageService {
  private sdk: messagingSDK;
  private readonly FROM_CHANNEL = MESSAGE_CHANNEL_ENUM.GJ_WEBVIEW_PARTNER_APP;
  private readonly LISTEN_CHANNELS = [MESSAGE_CHANNEL_ENUM.PARTNER_APP, MESSAGE_CHANNEL_ENUM.GJ_APP_WEBVIEW];
  private storageService = inject(StorageService);

  constructor() {
    this.sdk = new messagingSDK(window, { fromChannel: this.FROM_CHANNEL, listenChannels: this.LISTEN_CHANNELS });
  }

  listenMessage(action: string, channel: string, callback: (message: any) => void) {
    this.sdk.on(action, channel, callback);
  }

  registerChannelHandlers(channel: string, handlers: { [action: string]: (message: any) => void }) {
    Object.keys(handlers).forEach((action) => {
      this.sdk.on(action, channel, handlers[action]);
    });
  }

  postMessageToPartner(message: any) {
    const channelSource: any = this.storageService.get({ key: STORAGE_KEY.SOURCE, keyExcludedISS: true });
    if (!message.action) return;
    const payload: IPayloadPostMessage = {
      channel: MESSAGE_CHANNEL_ENUM.GJ_WEBVIEW,
      message
    };
    let allowSendMsg = true;

    switch (channelSource) {
      // in case Skyjoy App
      case CHANNEL_SOURCE_ENUM.APP_SJ:
        payload.channel = MESSAGE_CHANNEL_ENUM.GJ_WEBVIEW_PARTNER_APP;
        switch (message.action) {
          case POST_MESSAGE_ACTION.BACK_TO_APP:
          case POST_MESSAGE_ACTION.EXIT:
            payload.message.action = POST_MESSAGE_ACTION.EXIT;
            payload.message.topic = POST_MESSAGE_TOPIC_NAME.EXIT;
            break;
          case POST_MESSAGE_ACTION.REQUEST_HEADER_ACTION:
            payload.message.topic = POST_MESSAGE_TOPIC_NAME.REQUEST_HEADER_ACTION;
            break;
          default:
            allowSendMsg = false;
            break;
        }
        break;

      // in case Vikki App
      default:
        switch (message.action) {
          case POST_MESSAGE_ACTION.BACK_TO_APP:
            payload.message.topic = POST_MESSAGE_TOPIC_NAME.BACK_TO_APP;
            break;
          case POST_MESSAGE_ACTION.NAVIGATE_TO_BROWSER:
            payload.message.topic = '';

            break;
          case POST_MESSAGE_ACTION.REQUEST_OTP:
            payload.message = {
              ...payload.message,
              topic: POST_MESSAGE_TOPIC_NAME.REQUEST_OTP,
              data: message.data
            };
            break;
          default:
            allowSendMsg = false;
            break;
        }
        break;
    }

    console.log(`allowSendMsg`, [allowSendMsg, channelSource, JSON.stringify(payload)]);
    if (!allowSendMsg) {
      return;
    }

    this.sendMessage(channelSource, payload);
  }

  private sendMessage(channelSource: CHANNEL_SOURCE_ENUM, payload: IPayloadPostMessage) {
    try {
      let targetWindow: any = null;
      if (channelSource && channelSource === CHANNEL_SOURCE_ENUM.APP_SJ) {
        targetWindow = MESSAGE_CHANNEL_ENUM.GJ_WEBVIEW_PARTNER_APP;
      }
      this.sdk.emit(payload, targetWindow);

      console.log(` sendMessageToPartner SUCCESS:`, targetWindow, JSON.stringify(payload));
    } catch (e) {
      console.log(` sendMessageToPartner ERROR:`, JSON.stringify(e));
    }
  }
}
