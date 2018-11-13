// Copyright (c) 2019 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* global console */
/* eslint-disable no-console */
import XVIZPanelBuilder from './xviz-panel-builder';

import XVIZContainerBuilder from './xviz-container-builder';

import XVIZMetricBuilder from './xviz-metric-builder';
import XVIZPlotBuilder from './xviz-plot-builder';
import XVIZTableBuilder from './xviz-table-builder';
import XVIZTreeTableBuilder from './xviz-tree-table-builder';
import XVIZVideoBuilder from './xviz-video-builder';

import {snakeToCamel} from './utils';
import {UI_TYPES} from './constants';

const defaultValidateWarn = console.warn;
const defaultValidateError = console.error;

const UI_BUILDER_MAP = {
  [UI_TYPES.PANEL]: XVIZPanelBuilder,

  [UI_TYPES.CONTAINER]: XVIZContainerBuilder,

  [UI_TYPES.METRIC]: XVIZMetricBuilder,
  [UI_TYPES.PLOT]: XVIZPlotBuilder,
  [UI_TYPES.TABLE]: XVIZTableBuilder,
  [UI_TYPES.TREETABLE]: XVIZTreeTableBuilder,
  [UI_TYPES.VIDEO]: XVIZVideoBuilder
};

export default class XVIZUIBuilder {
  constructor(options = {}) {
    this._validateWarn = options.validateWarn || defaultValidateWarn;
    this._validateError = options.validateError || defaultValidateError;

    this._children = [];

    Object.values(UI_TYPES).map(type => {
      // add UI builders, e.g.
      // type `panel`
      //  - this.panel = (props) => this._setChild('panel', props);
      const camelType = snakeToCamel(type);
      this[camelType] = props => {
        return this._createUIBuilder(type, props);
      };
    });
  }

  getUI() {
    return this._children.reduce((ui, child) => {
      const childConfig = child.getUI();
      ui[childConfig.name] = childConfig;
      return ui;
    }, {});
  }

  child(child) {
    if (!(child instanceof XVIZPanelBuilder)) {
      this._validateError('Top level UI element should be `Panel`');
    }
    this._children.push(child);
    return child;
  }

  _createUIBuilder(type, props) {
    return new UI_BUILDER_MAP[type]({
      ...props,
      validateWarn: this._validateWarn,
      validateError: this._validateError,
      root: this
    });
  }
}
