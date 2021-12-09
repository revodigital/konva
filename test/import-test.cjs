/*
 * Copyright (c) 2021. Revo Digital
 * ---
 * Author: gabriele
 * File: import-test.cjs
 * Project: pamela
 * Committed last: 2021/12/5 @ 141
 * ---
 * Description:
 */

// try to import only core
const Konva = require('../cmj').default;

// just do a simple action
const stage = new Konva.Stage();
stage.toDataURL();
