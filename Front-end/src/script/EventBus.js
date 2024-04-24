import { createApp } from 'vue';

export const eventBus = createApp({});

export default {
  install(app) {
    app.config.globalProperties.$bus = eventBus;
  }
};