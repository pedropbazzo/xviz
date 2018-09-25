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

/* eslint-disable */
import test from 'tape-catch';
import {XvizUIBuilder} from '@xviz/builder';

console.log(XvizUIBuilder);

test('XvizBaseUIBuilder', t => {
  const builder = new XvizUIBuilder({});

  builder
    .panelLeft({
      name: 'Metrics Panel'
    })
    .children()

    .containerLeft({
      name: 'Metrics Container 1'
    })
    .children()

    .metricLeft({
      streams: ['/vehicle/velocity']
    })
    .title('Velocity')
    .metricRight()

    .metricLeft({
      streams: ['/vehicle/acceleration']
    })
    .title('Acceleration')
    .metricRight()

    .containerRight()
    .panelRight();

  const expected = [
    {
      type: 'panel',
      children: [
        {
          type: 'container',
          children: [
            {
              type: 'metric',
              streams: ['/vehicle/velocity'],
              title: 'Velocity'
            },
            {
              type: 'metric',
              streams: ['/vehicle/acceleration'],
              title: 'Acceleration'
            }
          ],
          name: 'Metrics Container 1'
        }
      ],
      name: 'Metrics Panel'
    }
  ];

  const actual = builder.getUI();
  t.deepEqual(actual, expected, 'XvizUIBuilder should match expectation');

  t.end();
});