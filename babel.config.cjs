/*
 * Copyright (c) 2022. Revo Digital
 * ---
 * Author: gabriele
 * File: babel.config.cjs
 * Project: complex-shapes-dev
 * Committed last: 2022/3/16 @ 1732
 * ---
 * Description:
 */

module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
  ],
};