import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable()
export class ConfigService {

  private config: any = environment.config;

  constructor() {
  }

  get(key: any) {
    return this.config[key];
  }
}
